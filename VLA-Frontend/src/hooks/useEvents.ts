import {useState, useMemo} from "react";
import type { EventFormData, Weekday } from "../components/calendar/EventForm/EventCreationForm.tsx";
import {addDays} from "../components/calendar/dateUtils";
import {type Appointment, type AppointmentSeries, SseMessageType} from "@/lib/databaseTypes";
import {
  checkPartOfSeries,
  getEventDateISO,
  moveEventSeries,
  verifyValidTimeRange
} from "@/components/calendar/eventUtils.ts";
import {Logger} from "@/components/logger/Logger.ts";
import {fetchBackend, getNotSynchronisedId, parseJsonFixDate} from "@/lib/utils.ts";
import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch.ts";
import {API_URL_APPOINTMENT_SERIES, API_URL_APPOINTMENTS} from "@/lib/api.ts";

function handleAppointmentCreated(event: MessageEvent, currentValue: Appointment[]) {
  const newEvent = JSON.parse(event.data, parseJsonFixDate) as Appointment;
  return [...currentValue, newEvent];
}

function handleAppointmentUpdated(event: MessageEvent, currentValue: Appointment[]) {
  const updatedEvent = JSON.parse(event.data, parseJsonFixDate) as Appointment;
  return currentValue.map((event) => (event.id === updatedEvent.id ? updatedEvent : event));
}

/**
 * useEvents manages:
 * - the list of calendar events (local state for now)
 * - the currently selected event (for EventDetails modal)
 * - creation logic, including recurrence materialization
 * - a derived "eventsByDate" map for efficient rendering in the grid
 */
export function useEvents() {
  const [selectedEventId, setSelectedEventId] = useState<number>();

  /**
   * This is here below unlike {@link handleAppointmentCreated} since we need to call {@Link setSelectedEventId}.
   */
  function handleAppointmentDeleted(event: MessageEvent, currentValue: Appointment[]) {
    const deletedEvent = JSON.parse(event.data, parseJsonFixDate) as Appointment;
    if (deletedEvent.id === selectedEventId) {
      setSelectedEventId(undefined);
    }
    return currentValue.filter((event) => event.id !== deletedEvent.id);
  }

  // SSE handlers for appointments
  const sseHandlersAppointments = new Map<
    SseMessageType,
    (event: MessageEvent, currentValue: Appointment[]) => Appointment[]
  >();
  sseHandlersAppointments.set(SseMessageType.APPOINTMENTCREATED, handleAppointmentCreated);
  sseHandlersAppointments.set(SseMessageType.APPOINTMENTDELETED, handleAppointmentDeleted);
  sseHandlersAppointments.set(SseMessageType.APPOINTMENTUPDATED, handleAppointmentUpdated);
  const [allEvents, _setEvents] = useSseConnectionWithInitialFetch<Appointment[]>(
    [], API_URL_APPOINTMENTS, sseHandlersAppointments
  );

  function handleUpdateEventNotes(eventId: number, notes: string) {
    const event = allEvents.find(e => e.id === eventId);
    if (event) {
      event.notes = notes;
      fetchBackend<Appointment>(
        `${API_URL_APPOINTMENTS}/${eventId}`,
        "PUT",
        {...event, notes: notes}
      )
        .catch((error) => {
          Logger.error("Error after updating event notes: " + error);
        });
    }
  }

  /**
   * Updates an event, maybe also its series. If not, a new series for this single event is created.
   *
   * @param eventId ID of the event to update
   * @param updates updates to apply to the event.
   * @param editSeries Whether to update the whole series or just this event.
   * @returns The updated event or the old one, in case an error occurred.
   */
  async function handleUpdateEvent(
    eventId: number, updates: Partial<Appointment>, editSeries: boolean
  ): Promise<Appointment> {
    if (updates.startTime && updates.endTime && !verifyValidTimeRange(updates.startTime, updates.endTime)) {
      Logger.error("Invalid time range for event");
      throw new Error("Invalid time range for event");
    }
    const oldEvent = allEvents.find(e => e.id === eventId);
    if (!oldEvent) {
      Logger.error("Event not found");
      throw new Error("Event not found");
    }
    // case 1: only this event should be updated
    if (!editSeries || !checkPartOfSeries(oldEvent, allEvents)) {
      let newSeries: AppointmentSeries | undefined;
      // create new series for event, if not already alone in a series
      if (checkPartOfSeries(oldEvent, allEvents)) {
        newSeries = {
          ...oldEvent.series,
          ...updates.series,
          id: getNotSynchronisedId(),
        };
        try {
          newSeries = await fetchBackend(API_URL_APPOINTMENT_SERIES, "POST", newSeries);
        } catch (error) {
          Logger.error("Error during series creation in handleUpdateEvent: " + error);
          return oldEvent;
        }
      }

      const newEvent = {
        ...oldEvent,
        ...updates,
        series: newSeries || oldEvent.series,
      };
      try {
        return fetchBackend(
          `${API_URL_APPOINTMENTS}/${eventId}`, "PUT", newEvent
        );
      } catch (error) {
        Logger.error("Error during appointment update in handleUpdateEvent: " + error);
        return oldEvent;
      }
    } else if (checkPartOfSeries(oldEvent, allEvents)) {  // case 2: the whole series should be updated as well
      let newSeries = {
        ...oldEvent.series,
        ...updates.series,
      };
      try {
        newSeries = await fetchBackend(API_URL_APPOINTMENT_SERIES, "PUT", newSeries);
      } catch (error) {
        Logger.error("Error during series update in handleUpdateEvent: " + error);
        return oldEvent;
      }
      let movedEvents: Appointment[] = allEvents.filter(e => e.series.id === oldEvent.series.id).map(e => ({
        ...e,
        series: newSeries,
      }));
      if (updates.startTime && updates.endTime) {
        // calculate new start and end for every event, if changed
        movedEvents = moveEventSeries(allEvents, oldEvent, updates.startTime, updates.endTime);
      }
      // set events to moved ones with updated series
      try {
        movedEvents.forEach(event => fetchBackend(
          `${API_URL_APPOINTMENTS}/${event.id}`, "PUT", event));
      } catch (error) {
        Logger.error("Error during appointment update in handleUpdateEvent: " + error);
        return oldEvent;
      }
      return movedEvents.find(e => e.id === eventId)!;
    } else {
      Logger.error("Impossible: Event neither part of series nor single event.");
      return oldEvent;
    }
  }

  //Creates one or many CalendarEvent objects from the EventForm submission
  /**
   * Creates new appointments and appointments series from the form data.
   * @returns The created event or void if an error occurred.
   */
  async function handleCreateEvent(formData: EventFormData): Promise<Appointment | void> {
    // basic validation
    if (!(
      (formData.title || formData.lecture) && formData.category
      && formData.startDateTime && formData.endDateTime
      && verifyValidTimeRange(formData.startDateTime, formData.endDateTime)
    )) {
      // TODO: notify user about invalid input?
      return;
    }

    const newEvents: Appointment[] = [];

    // even w/o recurrence we need one series to conform with our data model.
    // Also, create a single series if initial event date is not on one recurring day.
    if (!formData.recurrence || !formData.recurrence.weekdays.includes(formData.startDateTime.getDay() as Weekday)) {
      let newAppSeries: AppointmentSeries = {
        id: getNotSynchronisedId(),
        lecture: formData.lecture,
        name: formData.title.trim(),
        category: formData.category,
      };
      try {
        newAppSeries = await fetchBackend(API_URL_APPOINTMENT_SERIES, "POST", newAppSeries);
      } catch (error) {
        Logger.error("Error during series creation in handleCreateEvent: " + error);
        return;
      }
      newEvents.push({
        id: getNotSynchronisedId(),
        series: newAppSeries,
        startTime: formData.startDateTime,
        endTime: formData.endDateTime,
        notes: formData.notes || "",
      });
    }

    // create series of recurring events by looping day by day
    if (formData.recurrence && formData.recurrence.weekdays.length > 0 && formData.recurrence.endDay) {
      // create appointment series, one for each recurrence weekday
      const seriesByWeekday = new Map<Weekday, AppointmentSeries>;
      formData.recurrence.weekdays.forEach(
        (day) => {
          seriesByWeekday.set(day, {
            id: getNotSynchronisedId(),
            lecture: formData.lecture,
            name: formData.title.trim(),
            category: formData.category!,
          });
        }
      );
      let savedSeries: AppointmentSeries[];
      try {
        savedSeries = await fetchBackend(`${API_URL_APPOINTMENT_SERIES}/multi`,"POST",[...seriesByWeekday.values()]);
      } catch (error) {
        Logger.error("Error during series creation in handleCreateEvent: " + error);
        return;
      }
      // put saved series as reference in the weekday map
      const savedSeriesIterator = savedSeries.values();
      formData.recurrence.weekdays.forEach(
        (day) => seriesByWeekday.set(day, savedSeriesIterator.next().value as AppointmentSeries)
      );

      const duration = formData.endDateTime.getTime() - formData.startDateTime.getTime();
      const endDate = new Date(formData.recurrence.endDay.date);
      endDate.setHours(23, 59, 59, 999);
      let currentDate = new Date(formData.startDateTime);

      while (currentDate <= endDate) {
        const weekday = currentDate.getDay() as Weekday;
        if (formData.recurrence.weekdays.includes(weekday)) {
          newEvents.push({
            id: getNotSynchronisedId(),
            series: seriesByWeekday.get(weekday)!,
            startTime: currentDate,
            endTime: new Date(currentDate.getTime() + duration),
            notes: formData.notes || "",
          });
        }
        currentDate = addDays(currentDate, 1);
      }
    }
    try {
      const savedEvents = await fetchBackend(
        `${API_URL_APPOINTMENTS}/multi`, "POST", newEvents
      );
      // return event with earliest start date
      return savedEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
    } catch (error) {
      Logger.error("Error during appointment creation in handleCreateEvent: " + error);
      return;
    }
  }

  /**
   * Update the {@link selectedEventId} state on clicking an event.
   */
  function handleEventClick(eventId: number) {
    setSelectedEventId(eventId);
  }

  /**
   * Update the {@link selectedEventId} state on closing the event details.
   */
  function closeEventDetails() {
    setSelectedEventId(undefined);
  }

  /**
   * Derived map for rendering:
   * dateISO -> list of events on that date.
   */
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};
    allEvents.forEach((event) => {
      const eventDateISO = getEventDateISO(event);
      if (!grouped[eventDateISO]) {
        grouped[eventDateISO] = [];
      }
      grouped[eventDateISO].push(event);
    });
    return grouped;
  }, [allEvents]);

  return {
    allEvents,
    selectedEventId,
    eventsByDate,
    handleCreateEvent,
    handleEventClick,
    closeEventDetails,
    handleUpdateEventNotes,
    handleUpdateEvent,
  };
}
