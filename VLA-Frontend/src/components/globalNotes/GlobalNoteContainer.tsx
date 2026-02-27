import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";
import { SseMessageType, type GlobalNote } from "@/lib/databaseTypes";
import GlobalNoteEntry, {NotSynchronisedId} from "./GlobalNoteEntry";
import "@/styles/GlobalNote.css";
import { useState } from "react";
import { Button } from "../ui/Button";
import {API_URL_GLOBAL_NOTES} from "@/lib/api.ts";

function handleGlobalNoteCreated(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
  const createdGlobalNote = JSON.parse(event.data) as GlobalNote;
    
  const newState: GlobalNote[] = [createdGlobalNote, ...currentState];
    
  return newState;
} 

function handleGlobalNoteUpdated(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
  console.log(currentState);
  const updatedGlobalNote = JSON.parse(event.data) as GlobalNote;
    
  let newState = currentState.filter(note => note.id != updatedGlobalNote.id);
  newState = [updatedGlobalNote, ...newState];

  return newState;
} 

function handleGlobalNoteDeleted(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
  const deletedGlobalNote = JSON.parse(event.data) as GlobalNote;
    
  const newState: GlobalNote[] = currentState.filter(note => note.id != deletedGlobalNote.id);
    
  return newState;
} 

const sseHandlers = new Map<SseMessageType, (event: MessageEvent, value: GlobalNote[]) => GlobalNote[]>;
sseHandlers.set(SseMessageType.GLOBALNOTECREATED, handleGlobalNoteCreated);
sseHandlers.set(SseMessageType.GLOBALNOTEUPDATED, handleGlobalNoteUpdated);
sseHandlers.set(SseMessageType.GLOBALNOTEDELETED, handleGlobalNoteDeleted);

export default function GlobalNoteContainer() {
  const [globalNotes, _setGlobalNotes] = 
    useSseConnectionWithInitialFetch<GlobalNote[]>(
      [],
      API_URL_GLOBAL_NOTES,
      sseHandlers
    );
  const [draftNote, setDraftNote] = useState<GlobalNote | undefined>(undefined);
  const [viewVisible, setViewVisible] = useState<boolean>(false);

  function createNewDummyNote(){
    const draftNote: GlobalNote = {
      id: NotSynchronisedId,
      color: "#0d6efd",
      title: "Neue Notiz (ändern Sie den Titel hier)",
      content: "",
    };

    setDraftNote(draftNote);
  }

  return (
    <>
      <div className="globalNoteToggle"
        onClick={() => setViewVisible(!viewVisible)}
        style={{display: viewVisible ? "none" : ""}}
      >
      </div>
      <div className="globalNoteContainer" style={{display: viewVisible ? "" : "none"}}>
        <div className="globalNoteView">
          <div className="globalNoteTopBar">
            <div className="globalNoteCreation"
            >
              <Button
                text="+ Notiz"
                marginBottom="0px"
                backgroundColor={draftNote === undefined ? "" : "#AAA"}
                onClick={createNewDummyNote}
                cursor={draftNote === undefined ? "pointer" : "not-allowed"}
                title={
                  draftNote === undefined ? 
                    "Notiz erstellen"
                    :
                    "Laden Sie ihre aktuell entworfene Notiz hoch, um eine weitere Erstellen zu können"
                }
              />
            </div>
            <div className="globalNoteTopBarTitle">Geteilte Notizen</div>
            <div className="globalNoteViewToggle" onClick={() => setViewVisible(!viewVisible)}>
              <Button text="Zurück" marginBottom="0px"/>
            </div>
          </div>
          {
            draftNote &&
          <GlobalNoteEntry note={draftNote} key={draftNote.id} setDraftNote={setDraftNote}></GlobalNoteEntry>
          }
          {globalNotes.map(note => <GlobalNoteEntry note={note} key={note.id}></GlobalNoteEntry>)}
        </div>
      </div>
    </>
  );
}
