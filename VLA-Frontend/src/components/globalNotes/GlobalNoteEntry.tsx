import type { GlobalNote } from "@/lib/databaseTypes";
import { NotSynchronisedId } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/Button";

type GlobalNoteEntryProps = {
  note: GlobalNote,
  setDraftNote?: React.Dispatch<React.SetStateAction<GlobalNote | undefined>> 
};

function handleTitleInput(input: string){
  return input.replaceAll("\n", "").replaceAll("\t", "");
}

function handleEnterUnfocus(event: React.KeyboardEvent<HTMLTextAreaElement>){
  if(event.key === "Enter") {
    event.preventDefault();
    event.currentTarget.blur();
  }
}

export default function GlobalNoteEntry({note, setDraftNote: setDraftNote} : GlobalNoteEntryProps){
  const [isContentOpen, setIsContentOpen] = useState<boolean>(note.id === NotSynchronisedId);

  const [isEditing, setIsEditing] = useState<boolean>(note.id === NotSynchronisedId);
  const [editedTitle, setEditedTitle] = useState<string>(note.title);
  const [editedContent, setEditedContent] = useState<string>(note.content);
  const [editedColor, setEditedColor] = useState<string>(note.noteColor);


  function handleNoteCreationSubmit(note: GlobalNote){
    fetch("/api/globalNotes", {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify(note),
    });

    if(note.id === NotSynchronisedId) {
      setDraftNote!(undefined);
    }
  }

  function handleNoteUpdateSubmit(note: GlobalNote){
    if(note.id === NotSynchronisedId) {
      handleNoteCreationSubmit(note);
      return;
    }

    fetch("/api/globalNotes/" + note.id, {
      method: "PUT",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify(note),
    });
  }

  function handleDelete(){
    if(note.id === NotSynchronisedId) {
      setDraftNote!(undefined);
      return;
    }

    fetch("/api/globalNotes/" + note.id, {
      method: "DELETE",
      headers: {
        "Content-Type":"application/json",
      },
    });
  }

  function handleSubmit(){
    const postNote: GlobalNote = {
      id: note.id,
      noteColor: editedColor,
      title: editedTitle,
      content: editedContent,
    };
        
    const submitfunction = note.id == NotSynchronisedId ? handleNoteCreationSubmit : handleNoteUpdateSubmit;
    submitfunction(postNote);
        
    setIsEditing(false);
  }

  return (
    <div className="globalNoteEntry" style={{backgroundColor: isEditing ? editedColor : note.noteColor}}>
      <div className="globalNoteTitle" onClick={() => setIsContentOpen(!isContentOpen)}>
        {
          isEditing ? (
            <>
              <textarea
                name="title"
                value={editedTitle}
                rows={1}
                maxLength={255}
                placeholder="Sie müssen hier einen Notiztitel eingeben"
                onChange={(e) => setEditedTitle(handleTitleInput(e.target.value))}
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
          display: isContentOpen || isEditing ? "" : "none",
          border: "5px solid " + (isEditing ? editedColor : note.noteColor),
        }}>
                
        {
          isEditing ? (
            <>
              <textarea
                name="content"
                value={editedContent}
                rows={6}
                maxLength={4096}
                placeholder="Geben Sie hier ihre Notiz ein"
                onChange={(e) => setEditedContent(e.target.value)}
                required
              >
              </textarea>
            </>
          ) : (
            <>
              {note.content}
            </>
          )
        }

        <br/>

        {
          isEditing && 
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
                    value={editedColor}
                    onChange={e => setEditedColor(e.target.value)}
                  />
                  <br/>
                </>
        }

        <br/>
        <Button 
        text = {isEditing ? "Änderungen verwerfen" : "Notiz editieren"}
        backgroundColor = {isEditing ? editedColor : note.noteColor}
        onClick = {() => setIsEditing(!isEditing)}
        />

        {
          isEditing &&
                <>
                  <br/>
                  <Button
                  text = "Änderungen hochladen"
                  backgroundColor = {editedColor}
                  onClick = {() => handleSubmit()}
                  />
                </>
        }
                

        {
          isEditing &&
                <>
                  <br/>
                  <Button
                  text = "Notiz unwiderrufbar löschen"
                  backgroundColor = {editedColor}
                  onClick = {() => handleDelete()}
                  />
                </>
        }
      </div>
    </div>
  );
}
