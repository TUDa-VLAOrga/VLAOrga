import type { GlobalNote } from "@/lib/databaseTypes";
import { fetchCSRFToken } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import {API_URL_GLOBAL_NOTES} from "@/lib/api.ts";

export const NotSynchronisedId = -1;

type GlobalNoteEntryProps = {
  note: GlobalNote,
  setDraftNote?: React.Dispatch<React.SetStateAction<GlobalNote | undefined>> 
};

interface globalNoteEntryEditingState {
  isEditing: boolean,
  title: string,
  content: string,
  color: string,
}

function handleTitleInput(input: string){
  return input.replaceAll("\n", "").replaceAll("\t", "");
}

function handleEnterUnfocus(event: React.KeyboardEvent<HTMLTextAreaElement>){
  if(event.key === "Enter") {
    event.preventDefault();
    event.currentTarget.blur();
  }
}

function isInvalidTitle(editingState: globalNoteEntryEditingState): boolean {
  return editingState.title.trim() === "";
}

export default function GlobalNoteEntry({note, setDraftNote: setDraftNote} : GlobalNoteEntryProps){
  const [isContentOpen, setIsContentOpen] = useState<boolean>(note.id === NotSynchronisedId);

  const [editingState, setEditingState] = useState<globalNoteEntryEditingState>({
    isEditing: note.id === NotSynchronisedId,
    title: note.title,
    content: note.content,
    color: note.color,
  });

  function handleNoteCreationSubmit(note: GlobalNote){
    fetchCSRFToken()
      .then(csrfToken =>
        fetch(API_URL_GLOBAL_NOTES, {
          method: "POST",
          headers: {
            "Content-Type":"application/json",
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify(note),
        })
      );

    if(note.id === NotSynchronisedId) {
      setDraftNote!(undefined);
    }
  }

  function handleNoteUpdateSubmit(note: GlobalNote){
    if(note.id === NotSynchronisedId) {
      handleNoteCreationSubmit(note);
      return;
    }

    fetchCSRFToken()
      .then(csrfToken => {
        fetch(`${API_URL_GLOBAL_NOTES}/${note.id}`, {
          method: "PUT",
          headers: {
            "Content-Type":"application/json",
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify(note),
        });
      });
  }

  function handleDelete(){
    if(note.id === NotSynchronisedId) {
      setDraftNote!(undefined);
      return;
    }

    fetchCSRFToken()
      .then(csrfToken => {
        fetch(`${API_URL_GLOBAL_NOTES}/${note.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type":"application/json",
            'X-CSRF-TOKEN': csrfToken,
          },
        });
      });
  }

  function handleSubmit(){
    if(isInvalidTitle(editingState)) return;

    const postNote: GlobalNote = {
      id: note.id,
      title: editingState.title,
      content: editingState.content,
      color: editingState.color,
    };
        
    const submitfunction = note.id == NotSynchronisedId ? handleNoteCreationSubmit : handleNoteUpdateSubmit;
    submitfunction(postNote);

    setEditingState(
      {
        ...editingState,
        isEditing: false,
      }
    );
  }

  useEffect(() => {
    setEditingState({
      isEditing: note.id === NotSynchronisedId,
      title: note.title,
      content: note.content,
      color: note.color,
    });
  }, [note]);

  return (
    <div className="globalNoteEntry" 
      style={{
        backgroundColor: 
          editingState.isEditing ?
            editingState.color 
            : 
            note.color,
      }}
    >

      <div className="globalNoteTitle" onClick={() => setIsContentOpen(!isContentOpen)}>
        {
          editingState.isEditing ? (
            <>
              <textarea
                name="title"
                value={editingState.title}
                rows={1}
                maxLength={255}
                placeholder="Sie müssen hier einen Notiztitel eingeben"
                onChange={(e) => 
                  setEditingState({
                    ...editingState,
                    title: handleTitleInput(e.target.value),
                  })
                }
                onKeyDown={(e) => handleEnterUnfocus(e)}
                required
              >
              </textarea>
            </>
          ) : (
            <>
              {note.title}
            </>
          )
        }
      </div>
            
      <div className="globalNoteContent"
        style={{
          display: isContentOpen || editingState.isEditing ? "" : "none",
          border: "5px solid " + (editingState.isEditing ? editingState.color : note.color),
        }}>
                
        {
          editingState.isEditing ? (
            <>
              <textarea
                name="content"
                value={editingState.content}
                rows={6}
                maxLength={4096}
                placeholder="Fügen Sie hier ihre Notiz ein und laden Sie diese nach dem Schreiben hoch."
                onChange={(e) => 
                  setEditingState({
                    ...editingState,
                    content: e.target.value,
                  })
                }
                
                required
              >
              </textarea>
            </>
          ) : (
            <>
              <span className="displayedNoteContent">
                {note.content}
              </span>
            </>
          )
        }

        <br/>

        {
          editingState.isEditing && 
                <>
                  <i>
                    Hinweis: Sie sind aktuell im Editiermodus. 
                    Sie können nun Titel, Farbe und Inhalt der Notiz durch
                    einen Klick auf das entsprechende Feld bzw. den Text ändern.
                  </i>
                    
                  {
                    setDraftNote !== undefined && 
                    <>
                      <br/><br/>
                      <i>
                        Achtung: Diese Notiz ist noch nicht hochgeladen.
                        Wenn Sie diese speichern wollen, laden Sie sie hoch. 
                      </i>
                    </>
                  }

                  <br/>
                  <br/>
                  <i>
                    Gewählte Notizfarbe
                  </i>
                  <br/>
                  <input
                    type="color"
                    name="noteColor"
                    value={editingState.color}
                    onChange={e => 
                      setEditingState({
                        ...editingState,
                        color: e.target.value,
                      })
                    }
                  />
                  <br/>
                </>
        }

        <br/>
        <Button 
          text = {editingState.isEditing ? "Änderungen verwerfen" : "Notiz editieren"}
          backgroundColor = {editingState.isEditing ? editingState.color : note.color}
          onClick = {() => 
            setEditingState({
              ...editingState,
              isEditing: !editingState.isEditing,
            })
          }
        />

        {
          editingState.isEditing &&
                <>
                  <br/>
                  <Button
                    text = {"Änderungen hochladen" + (isInvalidTitle(editingState) ? "*" : "")}
                    backgroundColor = {editingState.color}
                    onClick = {() => handleSubmit()}
                    cursor = {isInvalidTitle(editingState) ? "not-allowed" : "pointer"}
                  />
                  {
                    isInvalidTitle(editingState) &&
                  <>
                    <br/>
                    <i>* Notizen mit einem leeren Titel können nicht hochgeladen werden</i>
                    <br/>
                  </>
                  }
                </>
        }
                

        {
          editingState.isEditing &&
                <>
                  <br/>
                  <Button
                    text = "Notiz unwiderrufbar löschen"
                    backgroundColor = {editingState.color}
                    onClick = {() => handleDelete()}
                  />
                </>
        }
      </div>
    </div>
  );
}
