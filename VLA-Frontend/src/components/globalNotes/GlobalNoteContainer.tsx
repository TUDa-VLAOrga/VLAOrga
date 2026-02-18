import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";
import { SseMessageType, type GlobalNote } from "@/lib/databaseTypes";
import GlobalNoteEntry from "./GlobalNoteEntry";
import "@/styles/GlobalNote.css"
import { useState } from "react";
import { Button } from "../ui/Button";
import { NotSynchronisedId } from "@/lib/utils";

function handleGlobalNoteCreated(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
    const createdGlobalNote = JSON.parse(event.data) as GlobalNote;
    
    const newState: GlobalNote[] = [createdGlobalNote, ...currentState]
    
    return newState;
} 

function handleGlobalNoteUpdated(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
    console.log(currentState)
    const updatedGlobalNote = JSON.parse(event.data) as GlobalNote;
    
    let newState = currentState.filter(note => note.id != updatedGlobalNote.id);
    newState = [updatedGlobalNote, ...newState]

    return newState;
} 

function handleGlobalNoteDeleted(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
    const deletedGlobalNote = JSON.parse(event.data) as GlobalNote;
    
    const newState: GlobalNote[] = currentState.filter(note => note.id != deletedGlobalNote.id);
    
    return newState;
} 

const sseHandlers = new Map<SseMessageType, (event: MessageEvent, value: GlobalNote[]) => GlobalNote[]>
sseHandlers.set(SseMessageType.GLOBALNOTECREATED, handleGlobalNoteCreated);
sseHandlers.set(SseMessageType.GLOBALNOTEUPDATED, handleGlobalNoteUpdated);
sseHandlers.set(SseMessageType.GLOBALNOTEDELETED, handleGlobalNoteDeleted);

export default function GlobalNoteContainer() {
  const [globalNotes, setGlobalNotes] = useSseConnectionWithInitialFetch<GlobalNote[]>([], "/api/globalNotes", sseHandlers);
  const [draftNote, setDraftNote] = useState<GlobalNote | undefined>(undefined);
  const [viewVisible, setViewVisible] = useState<boolean>(false);

  function createNewDummyNote(){
    const draftNote: GlobalNote = {
      id: NotSynchronisedId,
      noteColor: "#0d6efd",
      title: "Neue Notiz (ändern Sie den Titel hier)",
      content: "Fügen Sie hier ihre Notiz ein und laden Sie diese nach dem Schreiben hoch."
    }

    setDraftNote(draftNote);
  }

  return (
  <>
  <div className="globalNoteToggle" onClick={() => setViewVisible(!viewVisible)}></div>
    <div className="globalNoteContainer" style={{display: viewVisible ? "" : "none"}}>
        <div className="globalNoteView">
          <div className="globalNoteTopBar">
            <div className="globalNoteCreation">
              <button onClick={createNewDummyNote}>Neu</button>
            </div>
            <div className="globalNoteTopBarTitle">Geteilte Notizen</div>
            <div className="globalNoteViewToggle" onClick={() => setViewVisible(!viewVisible)}></div>
          </div>
          {draftNote && <GlobalNoteEntry note={draftNote} key={draftNote.id} setDraftNote={setDraftNote}></GlobalNoteEntry>}
          {globalNotes.map(note => <GlobalNoteEntry note={note} key={note.id}></GlobalNoteEntry>)}
        </div>
    </div>
  </>
  );
}