import {useState, useMemo} from "react";
import type { EventFormData, Weekday } from "../components/calendar/EventForm/EventCreationForm.tsx";
import {addDays, toJSONLocalTime} from "../components/calendar/dateUtils";
import {type Appointment, type AppointmentSeries, type DeletionRequest, SseMessageType} from "@/lib/databaseTypes";
import {
  checkPartOfSeries,
  fixupDates,
  getEventDateISO,
  moveEventSeries,
  verifyValidTimeRange
} from "@/components/calendar/eventUtils.ts";
import {Logger} from "@/components/logger/Logger.ts";
import {getNotSynchronisedId} from "@/lib/utils.ts";
import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch.ts";
import {API_URL_APPOINTMENT_SERIES, API_URL_APPOINTMENTS} from "@/lib/api.ts";
import { API_URL_DELETION_REQUESTS } from "@/lib/api.ts"; // TODO Backend: Endpunkt anlegen

function handleAppointmentCreated(event: MessageEvent, currentValue: Appointment[]) {
  const newEvent = JSON.parse(event.data) as Appointment;
  // circumvent JSON parse bugs (not recognized as timestamp)
  newEvent.startTime = new Date(newEvent.startTime);
  newEvent.endTime = new Date(newEvent.endTime);
  return [...currentValue, newEvent];
}

function handleAppointmentUpdated(event: MessageEvent, currentValue: Appointment[]) {
  console.log("DEBUG: handleAppointmentUpdated called. event:", event.data)
  const updatedEvent = JSON.parse(event.data) as Appointment;
  console.log("DEBUG: handleAppointmentUpdated called. initial start time:", updatedEvent.startTime)
  // circumvent JSON parse bugs (not recognized as timestamp)
  const rawStart = updatedEvent.startTime as unknown as number[];
  const newStartTime = new Date()
  newStartTime.setFullYear(rawStart[0], rawStart[1] - 1, rawStart[2])
  newStartTime.setHours(rawStart[3], rawStart[4]);
  updatedEvent.startTime = newStartTime;


  const rawEnd = updatedEvent.endTime as unknown as number[];
  const newEndTime = new Date()
  newEndTime.setFullYear(rawEnd[0], rawEnd[1] - 1, rawEnd[2])
  newEndTime.setHours(rawEnd[3], rawEnd[4]);
  updatedEvent.endTime = newEndTime;
  console.log("DEBUG: handleAppointmentUpdated called. updated start time:", updatedEvent.startTime)
  console.log("DEBUG: handleAppointmentUpdated called. Updated event:", updatedEvent)
  return currentValue.map((event) => (event.id === updatedEvent.id ? updatedEvent : event));
}

function handleAppointmentSeriesCreated(event: MessageEvent, currentValue: AppointmentSeries[]) {
  const newSeries = JSON.parse(event.data) as AppointmentSeries;
  return [...currentValue, newSeries];
}

function handleAppointmentSeriesDeleted(event: MessageEvent, currentValue: AppointmentSeries[]) {
  const deletedSeries = JSON.parse(event.data) as AppointmentSeries;
  return currentValue.filter((series) => series.id !== deletedSeries.id);
}

function handleAppointmentSeriesUpdated(event: MessageEvent, currentValue: AppointmentSeries[]) {
  const updatedSeries = JSON.parse(event.data) as AppointmentSeries;
  // TODO: update reference in all events belonging to this series?
  //  -> would sadly lead to a circular function definition order.
  return currentValue.map((series) => (series.id === updatedSeries.id ? updatedSeries : series));
}

/**
 * Generate JSON representation of an event for the backend.
 * Takes care of handling dates properly.
 */
function getJSONEvent(event: Appointment) {
  return JSON.stringify({
    ...event,
    startTime: toJSONLocalTime(event.startTime),
    endTime: toJSONLocalTime(event.endTime),
  });
}

function handleDeletionRequestCreated(event: MessageEvent, currentValue: Appointment[]) {
  
  const request = JSON.parse(event.data) as DeletionRequest;
  return currentValue.map((appointment) =>
    appointment.id === request.appointment.id
      ? { ...appointment, pendingDeletionRequest: request }
      : appointment
  );
}
function handleDeletionRequestCancelled(event: MessageEvent, currentValue: Appointment[]) {
  const request = JSON.parse(event.data) as DeletionRequest;
  return currentValue.map((appointment) =>
    appointment.id === request.appointment.id
      ? { ...appointment, pendingDeletionRequest: undefined }
      : appointment
  );
}
function handleDeletionRequestConfirmed(event: MessageEvent, currentValue: Appointment[]) {
  const request = JSON.parse(event.data) as DeletionRequest;
  return currentValue.filter((appointment) => appointment.id !== request.appointment.id);
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

  // SSE handlers for appointment series
  const sseHandlersSeries = new Map<
    SseMessageType,
    (event: MessageEvent, currentValue: AppointmentSeries[]) => AppointmentSeries[]
  >();
  sseHandlersSeries.set(SseMessageType.APPOINTMENTSERIESCREATED, handleAppointmentSeriesCreated);
  sseHandlersSeries.set(SseMessageType.APPOINTMENTSERIESDELETED, handleAppointmentSeriesDeleted);
  sseHandlersSeries.set(SseMessageType.APPOINTMENTSERIESUPDATED, handleAppointmentSeriesUpdated);
  const [allSeries, _setSeries] = useSseConnectionWithInitialFetch<AppointmentSeries[]>(
    [], API_URL_APPOINTMENT_SERIES, sseHandlersSeries
  );

  /**
   * Replace appointment series with their corresponding events.
   * Also convert Dates to Date objects using {@link fixupDates}.
   *
   * @param events list of events to replace series in.
   */
  function appointmentsFetchedPostProcess(events: Appointment[]) {
    events = fixupDates(events);
    events.map(event => {
      if (event.series) {
        const series = allSeries.find(s => s.id === event.series.id);
        if (series) {
          event.series = series;
        }
      }
    });
    return events;
  }

  /**
   * This is here below unlike {@link handleAppointmentCreated} since we need to call {@Link setSelectedEventId}.
   */
  function handleAppointmentDeleted(event: MessageEvent, currentValue: Appointment[]) {
    const deletedEvent = JSON.parse(event.data) as Appointment;
    // circumvent JSON parse bugs (not recognized as timestamp)
    deletedEvent.startTime = new Date(deletedEvent.startTime);
    deletedEvent.endTime = new Date(deletedEvent.endTime);
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
  sseHandlersAppointments.set(SseMessageType.DELETIONREQUESTCREATED, handleDeletionRequestCreated);
  sseHandlersAppointments.set(SseMessageType.DELETIONREQUESTCANCELLED, handleDeletionRequestCancelled);
  sseHandlersAppointments.set(SseMessageType.DELETIONREQUESTCONFIRMED, handleDeletionRequestConfirmed);
    const [allEvents, _setEvents] = useSseConnectionWithInitialFetch<Appointment[]>(
    [], API_URL_APPOINTMENTS, sseHandlersAppointments, appointmentsFetchedPostProcess
  );

  function handleUpdateEventNotes(eventId: number, notes: string) {
    const event = allEvents.find(e => e.id === eventId);
    if (event) {
      event.notes = notes;
      fetch(`${API_URL_APPOINTMENTS}/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: getJSONEvent({...event, notes: notes}),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Error during appointment update: " + response.statusText + ".");
        }
      });
    }
  }

  /**
   * Updates an event, maybe also its series. If not, a new series for this single event is created.
   *
   * @param eventId ID of the event to update
   * @param updates updates to apply to the event.
   * @param editSeries Whether to update the whole series or just this event.
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
        newSeries = await fetch(API_URL_APPOINTMENT_SERIES, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSeries),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error during series creation: " + response.statusText + ".");
          }
          return response.json();
        }).then((series) => series as AppointmentSeries);
      }

      const newEvent = {
        ...oldEvent,
        ...updates,
        series: newSeries || oldEvent.series,
      };
      return fetch(`${API_URL_APPOINTMENTS}/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: getJSONEvent(newEvent),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Error during appointment update: " + response.statusText + ".");
        }
        return response.json();
      }).then((event) => {
        return fixupDates([event as Appointment])[0];
      });
    } else if (checkPartOfSeries(oldEvent, allEvents)) {  // case 2: the whole series should be updated as well
      let newSeries = {
        ...oldEvent.series,
        ...updates.series,
      };
      newSeries = await fetch(API_URL_APPOINTMENT_SERIES, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSeries),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Error during series update: " + response.statusText + ".");
        }
        return response.json();
      }).then((series) => series as AppointmentSeries);
      let movedEvents: Appointment[] = allEvents.filter(e => e.series.id === oldEvent.series.id).map(e => ({
        ...e,
        series: newSeries,
      }));
      if (updates.startTime && updates.endTime) {
        // calculate new start and end for every event, if changed
        movedEvents = moveEventSeries(allEvents, oldEvent, updates.startTime, updates.endTime);
      }
      // set events to moved ones with updated series
      movedEvents.forEach(event => {
        fetch(`${API_URL_APPOINTMENTS}/${event.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: getJSONEvent(event),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Error during appointment update: " + response.statusText + ".");
          }
        });
      });
      return movedEvents.find(e => e.id === eventId)!;
    } else {
      Logger.error("Impossible: Event neither part of series nor single event.");
      throw new Error("Impossible: Event neither part of series nor single event.");
    }
  }

  //Creates one or many CalendarEvent objects from the EventForm submission
  async function handleCreateEvent(formData: EventFormData) {
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
      newAppSeries = await fetch(API_URL_APPOINTMENT_SERIES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppSeries),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Error during series creation: " + response.statusText + ".");
        }
        return response.json();
      }).then((series) => series as AppointmentSeries);
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
      const savedSeries = await fetch(`${API_URL_APPOINTMENT_SERIES}/multi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...seriesByWeekday.values()]),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Error during series creation: " + response.statusText + ".");
        }
        return response.json();
      }).then((series) => series as AppointmentSeries[]);
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
    let savedEvents = await fetch(`${API_URL_APPOINTMENTS}/multi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "[" + newEvents.map(e => getJSONEvent(e)).join(",") + "]",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Error during appointment creation: " + response.statusText + ".");
      }
      return response.json();
    }).then((events) => events as Appointment[]);
    savedEvents = fixupDates(savedEvents);
    console.log("savedEvents", savedEvents);
    // return event with earliest start date
    return savedEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0];
  }

  function handleEventClick(eventId: number) {
    setSelectedEventId(eventId);
  }

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

  /**
 * Erster Schritt: User beantragt Löschung eines Termins.
 * TODO Backend: POST /api/deletion-requests { appointmentId }
 * TODO Backend: Gibt DeletionRequest zurück, sendet SSE DELETIONREQUESTCREATED an alle Clients
 */
async function handleRequestDeletion(eventId: number , currentUserId: number | null ): Promise<void> {
  //TODO backend: fetch einkommentieren + Mock bock löschen
  //Mock:
     const targetEvent = allEvents.find(e => e.id === eventId);
  if (!targetEvent) return;
  const fakeRequest: DeletionRequest = {
    id: 999,
    appointment: targetEvent,
    requestedBy: { id: currentUserId ?? 0, name: "Max Mustermann", email: "max@mustermann.de" },
    requestedAt: new Date(),
  };
  _setEvents(current =>
    current.map(a => a.id === eventId ? { ...a, pendingDeletionRequest: fakeRequest } : a)
  );
  return;
  // ---- MOCK END ----

  await fetch(`${API_URL_DELETION_REQUESTS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appointmentId: eventId }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Fehler beim Erstellen der Löschanfrage: " + response.statusText);
    }
  });
}
/**
 * Löschanfrage zurückziehen.
 * TODO Backend: DELETE /api/deletion-requests/{requestId}
 * TODO Backend: Sendet SSE DELETIONREQUESTCANCELLED an alle Clients
 */
async function handleCancelDeletionRequest(requestId: number): Promise<void> {
  // ---- MOCK START ----
  _setEvents(current =>
    current.map(a => a.pendingDeletionRequest?.id === requestId
      ? { ...a, pendingDeletionRequest: undefined }
      : a
    )
  );
  return;
  
  await fetch(`${API_URL_DELETION_REQUESTS}/${requestId}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Fehler beim Abbrechen der Löschanfrage: " + response.statusText);
    }
  });
}
/**
 * Zweiter Schritt: Zweiter User bestätigt die Löschung.
 * TODO Backend: POST /api/deletion-requests/{requestId}/confirm
 * TODO Backend: Löscht den Termin, sendet SSE DELETIONREQUESTCONFIRMED + APPOINTMENTDELETED
 * TODO Backend: Validieren, dass der confirmierende User != der requestende User ist
 */
async function handleConfirmDeletion(requestId: number): Promise<void> {
  // TODO Backend: Mock-Block löschen + fetch einkommentieren wenn Backend bereit
  // ---- MOCK START ----
  _setEvents(current =>
    current.filter(a => a.pendingDeletionRequest?.id !== requestId)
  );
  return;
  // ---- MOCK END ----

  await fetch(`${API_URL_DELETION_REQUESTS}/${requestId}/confirm`, {
    method: "POST",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Fehler beim Bestätigen der Löschung: " + response.statusText);
    }
  });
}

  return {
    allEvents,
    selectedEventId,
    eventsByDate,
    handleCreateEvent,
    handleEventClick,
    closeEventDetails,
    handleUpdateEventNotes,
    handleUpdateEvent,
    handleRequestDeletion,
    handleCancelDeletionRequest,
    handleConfirmDeletion,
  };
}
