import { useState } from "react";
import type { Person } from "../components/calendar/CalendarTypes";

/**
 * usePeople manages the list of people that can be assigned to events.
 */
export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);

  function handleAddPerson(person: Person) {
    //TODO: Backend - POST request to /api/people
    setPeople((prev) => [...prev, person]);
  }

  function handleUpdatePersonNotes(personId: string, notes: string) {
    //TODO: Backend - PUT request to update person notes
    setPeople((prev) =>
      prev.map((person) =>
        person.id === personId ? { ...person, notes } : person
      )
    );
  }

  return {
    people,
    handleAddPerson,
    handleUpdatePersonNotes,
  };
}
