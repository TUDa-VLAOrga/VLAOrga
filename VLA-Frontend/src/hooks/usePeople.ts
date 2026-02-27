import {type Person, SseMessageType} from "@/lib/databaseTypes";
import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch.ts";
import {API_URL_PERSONS} from "@/lib/api.ts";


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

  async function handleAddPerson(person: Person) {
    return fetch(API_URL_PERSONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    }).then((response) => response.json()).then((newPerson) => newPerson as Person);
  }

  function handleUpdatePersonNotes(personId: number, notes: string) {
    const prevPerson = people.find((person) => person.id === personId);
    if (prevPerson) {
      prevPerson.notes = notes;
      fetch(`${API_URL_PERSONS}/${personId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prevPerson),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Error during person update: " + response.statusText + ".");
        }
      });
    }
  }

  return {
    people,
    handleAddPerson,
    handleUpdatePersonNotes,
  };
}
