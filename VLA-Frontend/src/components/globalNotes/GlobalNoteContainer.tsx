import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";
import { SseMessageType, type GlobalNote } from "@/lib/databaseTypes";
import GlobalNoteEntry from "./GlobalNoteEntry";
import "@/styles/GlobalNote.css"
import { useState } from "react";

function handleGlobalNoteCreated(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
    const createdGlobalNote = JSON.parse(event.data) as GlobalNote;
    
    const newState: GlobalNote[] = [createdGlobalNote, ...currentState]
    
    return newState;
} 

function handleGlobalNoteUpdated(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
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
  const globalNotes = useSseConnectionWithInitialFetch<GlobalNote[]>([], "/api/globalNotes", sseHandlers);
  const [viewVisible, setViewVisible] = useState<boolean>(false);

  return (
      <div className="globalNoteContainer">
          <div className="globalNoteToggle" onClick={() => setViewVisible(!viewVisible)}></div>
          <div className="globalNoteView" style={{display: viewVisible ? "" : "none"}}>
            <div className="globalNoteTopBar">
              <div></div>
              <div className="globalNoteTopBarTitle">Geteilte Notizen</div>
              <div className="globalNoteViewToggle" onClick={() => setViewVisible(!viewVisible)}></div>
            </div>
            
            {globalNotes.map(note => <GlobalNoteEntry note={note} key={note.id}></GlobalNoteEntry>)}
          </div>
      </div>
  );

    
}