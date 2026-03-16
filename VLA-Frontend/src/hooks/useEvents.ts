import {useMemo} from "react";
import type { EventFormData, Weekday } from "../components/calendar/EventForm/AddEventForm.tsx";
import {addDays} from "../components/calendar/dateUtils";
import {type Acceptance, type Appointment, type AppointmentSeries, SseMessageType} from "@/lib/databaseTypes";
import {
  checkPartOfSeries,
  getEventDateISO,
  moveEventSeries,
  verifyValidTimeRange
} from "@/components/calendar/eventUtils.ts";
import {Logger} from "@/components/logger/Logger.ts";
import {fetchBackend, getNotSynchronisedId, parseJsonFixDate} from "@/lib/utils.ts";
import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch.ts";
import {API_URL_ACCEPTANCES, API_URL_APPOINTMENT_SERIES, API_URL_APPOINTMENTS} from "@/lib/api.ts";
import type {CalendarEvent} from "@/components/calendar/CalendarTypes.ts";



function handleAppointmentCreated(event: MessageEvent, currentValue: Appointment[]) {
  const newEvent = JSON.parse(event.data, parseJsonFixDate) as Appointment;
  return [...currentValue, newEvent];
}

function handleAppointmentUpdated(event: MessageEvent, currentValue: Appointment[]) {
  const updatedEvent = JSON.parse(event.data, parseJsonFixDate) as Appointment;
  return currentValue.map((event) => (event.id === updatedEvent.id ? updatedEvent : event));
}

function handleAppointmentDeleted(event: MessageEvent, currentValue: Appointment[]) {
  const deletedEvent = JSON.parse(event.data, parseJsonFixDate) as Appointment;
  return currentValue.filter((event) => event.id !== deletedEvent.id);
}


function handleAcceptanceCreated(event: MessageEvent, currentValue: Acceptance[]) {
  const newAcceptance = JSON.parse(event.data, parseJsonFixDate) as Acceptance;
  return [...currentValue, newAcceptance];
}

function handleAcceptanceUpdated(event: MessageEvent, currentValue: Acceptance[]) {
  const updatedAcceptance = JSON.parse(event.data, parseJsonFixDate) as Acceptance;
  return currentValue.map((acceptance) => (acceptance.id === updatedAcceptance.id ? updatedAcceptance : acceptance));
}

function handleAcceptanceDeleted(event: MessageEvent, currentValue: Acceptance[]) {
  const deletedAcceptance = JSON.parse(event.data, parseJsonFixDate) as Acceptance;
  return currentValue.filter((acceptance) => acceptance.id !== deletedAcceptance.id);
}

/**
 * useEvents manages:
 * - the list of calendar events, namely appointments and possible acceptance events for them
 * - the currently selected event (for EventDetails popup)
 * - creation logic, including logic for recurring events and moving them together in a series
 * - a derived "eventsByDate" map for efficient rendering in the grid
 */
export function useEvents() {

  // SSE handlers for appointments
  const sseHandlersAppointments = new Map<
    SseMessageType,
    (event: MessageEvent, currentValue: Appointment[]) => Appointment[]
  >();
  sseHandlersAppointments.set(SseMessageType.APPOINTMENTCREATED, handleAppointmentCreated);
  sseHandlersAppointments.set(SseMessageType.APPOINTMENTDELETED, handleAppointmentDeleted);
  sseHandlersAppointments.set(SseMessageType.APPOINTMENTUPDATED, handleAppointmentUpdated);
  const [allAppointments, _setAppointments] = useSseConnectionWithInitialFetch<Appointment[]>(
    [], API_URL_APPOINTMENTS, sseHandlersAppointments
  );
  const sseHandlersAcceptances = new Map<
    SseMessageType, (event: MessageEvent, currentValue: Acceptance[]) => Acceptance[]
  >();
  sseHandlersAcceptances.set(SseMessageType.ACCEPTANCECREATED, handleAcceptanceCreated);
  sseHandlersAcceptances.set(SseMessageType.ACCEPTANCEUPDATED, handleAcceptanceUpdated);
  sseHandlersAcceptances.set(SseMessageType.ACCEPTANCEDELETED, handleAcceptanceDeleted);
  const [allAcceptances, _setAcceptances] = useSseConnectionWithInitialFetch<Acceptance[]>(
    [], API_URL_ACCEPTANCES, sseHandlersAcceptances
  );
  const allEvents: CalendarEvent[] = useMemo(
    () => [...allAppointments, ...allAcceptances],
    [allAcceptances, allAppointments]
  );

  function handleUpdateEventNotes(eventId: number, notes: string) {
    const event = allAppointments.find(e => e.id === eventId);
    if (event) {
      event.notes = notes;
      fetchBackend<Appointment>(
        `${API_URL_APPOINTMENTS}/${eventId}`,
        "PUT",
        {...event, notes: notes}
      )
        .catch((error) => {
          Logger.error("Error after updating event notes: ", error);
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
    const oldEvent = allAppointments.find(e => e.id === eventId);
    if (!oldEvent) {
      Logger.error("Event not found");
      throw new Error("Event not found");
    }
    // case 1: only this event should be updated
    if (!editSeries || !checkPartOfSeries(oldEvent, allAppointments)) {
      let newSeries: AppointmentSeries | undefined;
      // create new series for event, if not already alone in a series
      if (checkPartOfSeries(oldEvent, allAppointments)) {
        newSeries = {
          ...oldEvent.series,
          ...updates.series,
          id: getNotSynchronisedId(),
        };
        try {
          newSeries = await fetchBackend(API_URL_APPOINTMENT_SERIES, "POST", newSeries);
        } catch (error) {
          Logger.error("Error during series creation in handleUpdateEvent: ", error);
          return oldEvent;
        }
      } else {
        // maybe series got updated, save it to the server
        if (updates.series) {
          try {
            newSeries = await fetchBackend(
              `${API_URL_APPOINTMENT_SERIES}/${oldEvent.series.id}`, "PUT", updates.series
            );
          } catch (error) {
            Logger.error("Error during series update in handleUpdateEvent: ", error);
          }
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
        Logger.error("Error during appointment update in handleUpdateEvent: ", error);
        return oldEvent;
      }
    } else if (checkPartOfSeries(oldEvent, allAppointments)) {  // case 2: the whole series should be updated as well
      let newSeries = {
        ...oldEvent.series,
        ...updates.series,
      };
      try {
        newSeries = await fetchBackend(`${API_URL_APPOINTMENT_SERIES}/${newSeries.id}`, "PUT", newSeries);
      } catch (error) {
        Logger.error("Error during series update in handleUpdateEvent: ", error);
        return oldEvent;
      }
      let movedEvents: Appointment[] = allAppointments.filter(e => e.series.id === oldEvent.series.id).map(e => ({
        ...e,
        series: newSeries,
      }));
      if (updates.startTime && updates.endTime) {
        // calculate new start and end for every event, if changed
        movedEvents = moveEventSeries(allAppointments, oldEvent, updates.startTime, updates.endTime);
      }
      // set events to moved ones with updated series
      try {
        movedEvents.forEach(event => fetchBackend(
          `${API_URL_APPOINTMENTS}/${event.id}`, "PUT", event));
      } catch (error) {
        Logger.error("Error during appointment update in handleUpdateEvent: ", error);
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
   * If the appointments have an associated lecture, create one separate series for every recurring weekday.
   * Otherwise, create a single series for the all recurrences of this event.
   *
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
        Logger.error("Error during series creation in handleCreateEvent: ", error);
        return;
      }
      newEvents.push({
        id: getNotSynchronisedId(),
        series: newAppSeries,
        startTime: formData.startDateTime,
        endTime: formData.endDateTime,
        notes: formData.notes || "",
        bookings: [],
      });
    }

    // create series of recurring events by looping day by day
    if (formData.recurrence && formData.recurrence.weekdays.length > 0 && formData.recurrence.endDay) {
      // create appointment series, one for each recurrence weekday
      const seriesByWeekday = new Map<Weekday, AppointmentSeries>;
      if (formData.lecture) {
        // separate series only if lecture set
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
          savedSeries = await fetchBackend(
            `${API_URL_APPOINTMENT_SERIES}/multi`, "POST", [...seriesByWeekday.values()]
          );
        } catch (error) {
          Logger.error("Error during series creation in handleCreateEvent: ", error);
          return;
        }
        // put saved series as reference in the weekday map
        const savedSeriesIterator = savedSeries.values();
        formData.recurrence.weekdays.forEach(
          (day) => seriesByWeekday.set(day, savedSeriesIterator.next().value as AppointmentSeries)
        );
      } else {
        // w/o lecture: same series for all weekdays (to keep weekday-iterating logic below the same)
        let newSeries: AppointmentSeries = {
          id: getNotSynchronisedId(),
          lecture: undefined,
          name: formData.title.trim(),
          category: formData.category!,
        };
        try {
          newSeries = await fetchBackend(API_URL_APPOINTMENT_SERIES, "POST", newSeries);
        } catch (error) {
          Logger.error("Error during series creation in handleCreateEvent: ", error);
          return;
        }
        formData.recurrence.weekdays.forEach(
          (day) => seriesByWeekday.set(day, newSeries)
        );
      }

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
            bookings: [],
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
      Logger.error("Error during appointment creation in handleCreateEvent: ", error);
      return;
    }
  }

  /**
   * Create a new acceptance event for the whole series of appointment with the given ID.
   */
  async function handleAcceptanceSeriesCreate(
    referenceAppointmentId: number, startTime: Date, endTime: Date
  ): Promise<Acceptance | void> {
    const referenceAppointment = allAppointments.find(e => e.id === referenceAppointmentId);
    if (!referenceAppointment) {
      Logger.error("Reference appointment not found for creating acceptance.");
      return;
    }
    const acceptanceDuration = endTime.getTime() - startTime.getTime();
    const deltaToAppointmentStart = referenceAppointment.startTime.getTime() - startTime.getTime();

    let ret: Acceptance | undefined;
    // TODO: add /multi endpoint in backend and avoid looping with many requests
    // iterate over all appointments in the same series and add an acceptance event
    for (const appointment of allAppointments.filter(e => e.series.id === referenceAppointment.series.id)) {
      const acceptanceEvent: Acceptance = {
        id: getNotSynchronisedId(),
        startTime: new Date(appointment.startTime.getTime() - deltaToAppointmentStart),
        endTime: new Date(appointment.startTime.getTime() - deltaToAppointmentStart + acceptanceDuration),
        appointment: appointment,
      };
      try {
        const createdAcceptance = await fetchBackend(API_URL_ACCEPTANCES, "POST", acceptanceEvent);
        if (appointment.id === referenceAppointment.id) {
          ret = createdAcceptance;
        }
      } catch (error) {
        Logger.error("Error during acceptance creation in handleAcceptanceSeriesCreate: ", error);
      }
    }
    if (!ret) {
      Logger.error("Reference appointment not in its own series, this should not happen.");
    }
    return ret;
  }

  /**
   * Update the time of an acceptance event.
   */
  async function handleAcceptanceUpdate(
    acceptanceId: number, startTime: Date, endTime: Date
  ): Promise<Acceptance | void> {
    const acceptance = allAcceptances.find(e => e.id === acceptanceId);
    if (!acceptance) {
      Logger.error("Acceptance not found for update.");
      return;
    }
    return fetchBackend(`${API_URL_ACCEPTANCES}/${acceptanceId}`, "PUT", {
      ...acceptance,
      startTime: startTime,
      endTime: endTime,
    });
  }

  /**
   * Delete an acceptance.
   */
  async function handleAcceptanceDeletion(acceptanceId: number): Promise<void> {
    await fetchBackend<Appointment>(`${API_URL_ACCEPTANCES}/${acceptanceId}`, "DELETE")
      .catch((error) => {
        Logger.error("Error on appointment deletion: ", error);
      });
  }

  /**
   * Derived map for rendering:
   * dateISO -> list of events on that date.
   */
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    allEvents.forEach((event) => {
      const eventDateISO = getEventDateISO(event);
      if (!grouped[eventDateISO]) {
        grouped[eventDateISO] = [];
      }
      grouped[eventDateISO].push(event);
    });
    return grouped;
  }, [allEvents]);

  /**
   * User beantragt oder bestätigt Löschung eines Termins.
   * @return nothing if successful, error string otherwise.
   */
  async function handleDeletion(appointmentId: number): Promise<Appointment | string> {
    return fetchBackend<Appointment>(
      `${API_URL_APPOINTMENTS}/${appointmentId}`, "DELETE")
      .catch((error: Error) => {
        if (error.message.includes("Conflict.")) {
          console.log("Returning error message");
          return "Löschen nicht möglich, da Experimente gebucht sind," +
            " aber kein Folgetermin für Verschiebung vorhanden ist.";
        }
        Logger.error("Error on appointment deletion: ", error);
        return "";
      });
  }
  /**
   * Löschanfrage zurückziehen.
   */
  async function handleCancelDeletionRequest(appointmentId: number): Promise<void> {
    const event = allEvents.find(e => e.id === appointmentId);
    if (!event) return;
    await fetchBackend(`${API_URL_APPOINTMENTS}/${appointmentId}`, "PUT",{
      ...event,
      deletingIntentionUser: null,
    })
      .catch((error) => {
        Logger.error("Error on cancellation of appointment deletion: ", error);
      });
  }

  return {
    allEvents,
    eventsByDate,
    handleCreateEvent,
    handleUpdateEventNotes,
    handleUpdateEvent,
    handleDeletion,
    handleCancelDeletionRequest,
    handleAcceptanceSeriesCreate,
    handleAcceptanceUpdate,
    handleAcceptanceDeletion,
  };
}
