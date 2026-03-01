import {type Person, SseMessageType} from "@/lib/databaseTypes";
import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch.ts";
import {API_URL_PERSONS} from "@/lib/api.ts";
import {Logger} from "@/components/logger/Logger.ts";
import {fetchBackend} from "@/lib/utils.ts";


function handlePersonCreated(event: MessageEvent, currentValue: Person[]) {
  const newPerson = JSON.parse(event.data) as Person;
  return [...currentValue, newPerson];
}

function handlePersonDeleted(event: MessageEvent, currentValue: Person[]) {
  const deletedPerson = JSON.parse(event.data) as Person;
  return currentValue.filter((person) => person.id !== deletedPerson.id);
}

function handlePersonUpdated(event: MessageEvent, currentValue: Person[]) {
  const updatedPerson = JSON.parse(event.data) as Person;
  return currentValue.map((person) => (person.id === updatedPerson.id ? updatedPerson : person));
}

/**
 * usePeople manages the list of people that can be assigned to events.
 */
export function usePeople() {
  const sseHandlers = new Map<SseMessageType, (event: MessageEvent, currentValue: Person[]) => Person[]>();
  sseHandlers.set(SseMessageType.PERSONCREATED, handlePersonCreated);
  sseHandlers.set(SseMessageType.PERSONDELETED, handlePersonDeleted);
  sseHandlers.set(SseMessageType.PERSONUPDATED, handlePersonUpdated);
  const [people, _setPeople] = useSseConnectionWithInitialFetch<Person[]>(
    [], API_URL_PERSONS, sseHandlers
  );

  /**
   * Create new person entity in the backend.
   * @returns The new person or void if an error occurred.
   */
  async function handleAddPerson(person: Person): Promise<Person | void> {
    return fetchBackend(API_URL_PERSONS, "POST", person)
      .catch((error) => {
        Logger.error("Error during person creation: " + error);
        return;
      });
  }

  /**
   * Update the notes of a person.
   */
  function handleUpdatePersonNotes(personId: number, notes: string): void {
    const prevPerson = people.find((person) => person.id === personId);
    if (prevPerson) {
      prevPerson.notes = notes;
      fetchBackend(`${API_URL_PERSONS}/${personId}`, "PUT", prevPerson)
        .catch((error) => {
          Logger.error("Error after updating person notes: " + error);
        });
    }
  }

  return {
    people,
    handleAddPerson,
    handleUpdatePersonNotes,
  };
}
