import { useState } from "react";

export type Person = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

type AddPeopleSectionProps = {
  people: Person[];
  selectedPeople: string[];
  onPeopleChange: (personIds: string[]) => void;
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
  const [newPersonRole, setNewPersonRole] = useState("");

  const handleAdd = () => {
    if (newPersonName.trim()) {
      const newPerson: Person = {
        id: `person_${Date.now()}`,
        name: newPersonName.trim(),
        email: newPersonEmail.trim() || undefined,
        role: newPersonRole.trim() || undefined,
      };
      onAddPerson(newPerson);
      setNewPersonName("");
      setNewPersonEmail("");
      setNewPersonRole("");
      setIsAdding(false);
    }
  };

  const handleTogglePerson = (personId: string) => {
    if (selectedPeople.includes(personId)) {
      onPeopleChange(selectedPeople.filter(id => id !== personId));
    } else {
      onPeopleChange([...selectedPeople, personId]);
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
          />
          <input
            type="email"
            className="cv-formInput"
            placeholder="E-Mail (optional)"
            value={newPersonEmail}
            onChange={(e) => setNewPersonEmail(e.target.value)}
          />
          <input
            type="text"
            className="cv-formInput"
            placeholder="Rolle (optional)"
            value={newPersonRole}
            onChange={(e) => setNewPersonRole(e.target.value)}
          />
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
                checked={selectedPeople.includes(person.id)}
                onChange={() => handleTogglePerson(person.id)}
              />
              <span className="cv-personInfo">
                <span className="cv-personName">{person.name}</span>
                {person.role && <span className="cv-personRole">({person.role})</span>}
              </span>
            </label>
          ))}
        </div>
      )}

      <small className="cv-formHint">
        Wähle Personen aus oder erstelle neue
      </small>
    </div>
  );
}