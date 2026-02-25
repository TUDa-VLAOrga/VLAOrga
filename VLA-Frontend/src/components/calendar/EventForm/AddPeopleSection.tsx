import { useState } from "react";
import type {Person} from "@/lib/databaseTypes";



type AddPeopleSectionProps = {
  people: Person[];
  selectedPeople: Person[];
  onPeopleChange: (persons: Person[]) => void;
  onAddPerson: (person: Person) => void;
};

export default function AddPeopleSection({
  people,
  selectedPeople,
  onPeopleChange,
  onAddPerson,
}: AddPeopleSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonEmail, setNewPersonEmail] = useState("");
  //const [newPersonRole, setNewPersonRole] = useState("");
  let notSynchronisedId = -1;  // negative ID signals a not-yet-saved entity

  const handleAdd = () => {
    // TODO: Backend - POST request to create new person
    if (newPersonName.trim()) {
      const newPerson: Person = {
        id: notSynchronisedId--,
        name: newPersonName.trim(),
        email: newPersonEmail.trim(),
        // role: newPersonRole.trim() || undefined,
        notes: "",
        lectures: [],
        linusUserId: undefined,
      };
      onAddPerson(newPerson);
      setNewPersonName("");
      setNewPersonEmail("");
      // setNewPersonRole("");
      setIsAdding(false);
    }
  };

  const handleTogglePerson = (person: Person) => {
    if (selectedPeople.includes(person)) {
      onPeopleChange(selectedPeople.filter(currSelected => currSelected.id !== person.id));
    } else {
      onPeopleChange([...selectedPeople, person]);
    }
  };

  return (
    <div className="cv-formGroup">
      <div className="cv-formLabelRow">
        <label className="cv-formLabel">Personen</label>
        <button
          type="button"
          className="cv-addBtn"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? "Abbrechen" : "+ Neue Person"}
        </button>
      </div>

      {isAdding && (
        <div className="cv-addSection">
          <input
            type="text"
            className="cv-formInput"
            placeholder="Name *"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <input
            type="email"
            className="cv-formInput"
            placeholder="E-Mail (optional)"
            value={newPersonEmail}
            onChange={(e) => setNewPersonEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          {/*}
          <input
            type="text"
            className="cv-formInput"
            placeholder="Rolle (optional)"
            value={newPersonRole}
            onChange={(e) => setNewPersonRole(e.target.value)}
          />
          {*/}
          <button
            type="button"
            className="cv-formBtn cv-formBtnSubmit"
            onClick={handleAdd}
            disabled={!newPersonName.trim()}
          >
            Person hinzufügen
          </button>
        </div>
      )}

      {people.length > 0 && (
        <div className="cv-peopleList">
          {people.map((person) => (
            <label key={person.id} className="cv-personCheckbox">
              <input
                type="checkbox"
                checked={selectedPeople.map(p => p.id).includes(person.id)}
                onChange={() => handleTogglePerson(person)}
              />
              <span className="cv-personInfo">
                <span className="cv-personName">{person.name}</span>
                {/*}{person.role && <span className="cv-personRole">({person.role})</span>}{*/}
              </span>
            </label>
          ))}
        </div>
      )}


      {selectedPeople.length > 0 && (
        <div className="cv-selectedPeoplePreview">
          <small className="cv-formHint">
            Ausgewählt: {selectedPeople.map(selectedPerson => selectedPerson.name).join(", ")}
          </small>
        </div>
      )}

      <small className="cv-formHint">
        Personen auswählen oder neue hinzufügen.
      </small>
      <small className="cv-formHint">
        Personenspezifische Notizen können nach dem Erstellen eines Termins in der Detailansicht hinzugefügt werden.
      </small>
      
    </div>
  );
}
