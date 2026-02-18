import type { GlobalNote } from "@/lib/databaseTypes"
import { NotSynchronisedId } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/Button";

type GlobalNoteEntryProps = {
    note: GlobalNote
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

export default function GlobalNoteEntry({note} : GlobalNoteEntryProps){
    const [isContentOpen, setIsContentOpen] = useState<boolean>(false);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTitle, setEditedTitle] = useState<string>(note.title);
    const [editedContent, setEditedContent] = useState<string>(note.content);
    const [editedColor, setEditedColor] = useState<string>(note.noteColor);


    function handleNoteCreationSubmit(note: GlobalNote){
        fetch("/api/globalNotes", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(note)
        });
    }

    function handleNoteUpdateSubmit(note: GlobalNote){
        fetch("/api/globalNotes/" + note.id, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(note)
        });
    }

    function handleSubmit(){
        const postNote: GlobalNote = {
            id: note.id,
            noteColor: editedColor,
            title: editedTitle,
            content: editedContent
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
                        placeholder="Notiztitel"
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
                        placeholder="Notiztext"
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
                <br/>
                
                {
                isEditing && 
                <>
                Gewählte Notizfarbe<br/>
                <input
                type="color"
                name="noteColor"
                value={editedColor}
                onChange={e => setEditedColor(e.target.value)}
                />
                </>
                }

                <br/>
                <br/>
                
                {isEditing && <i>Hinweis: Sie sind aktuell im Editiermodus, Sie können nun Titel, Farbe und Inhalt der Notiz durch einen Klick auf das entsprechende Feld ändern.</i>}

                <br/>
                <br/>
                <Button>
                    {{
                        text: isEditing ? "Änderungen verwerfen" : "Notiz editieren", 
                        onClick: () => setIsEditing(!isEditing)
                    }}
                </Button>
                <br/>

                {
                isEditing &&
                <Button>
                    {{
                        text: "Änderungen hochladen",
                        onClick: () => handleSubmit()
                    }}
                </Button>
                }
            </div>
        </div>
    );
}