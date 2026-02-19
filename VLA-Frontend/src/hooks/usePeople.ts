import { useState } from "react";
import type {Person} from "@/lib/databaseTypes";

/**
 * usePeople manages the list of people that can be assigned to events.
 */
export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);

  function handleAddPerson(person: Person) {
    //TODO: Backend - POST request to /api/people
    setPeople((prev) => [...prev, person]);
  }

  function handleUpdatePersonNotes(personId: number, notes: string) {
    //TODO: Backend - PUT request to update person notes
    setPeople((prev) =>
      prev.map((prevPerson) =>
        prevPerson.id === personId ? { ...prevPerson, notes } : prevPerson
      )
    );
  }

  return {
    people,
    handleAddPerson,
    handleUpdatePersonNotes,
  };
}
