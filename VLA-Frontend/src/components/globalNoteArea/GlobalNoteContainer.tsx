import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";
import { SseMessageType, type GlobalNote } from "@/lib/databaseTypes";

function handleGlobalNoteCreated(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
    const createdGlobalNote = JSON.parse(event.data) as GlobalNote;
    
    const newState: GlobalNote[] = [...currentState, createdGlobalNote]
    
    return newState;
} 

function handleGlobalNoteUpdated(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
    const updatedGlobalNote = JSON.parse(event.data) as GlobalNote;
    
    let newState = currentState.filter(note => note.id != updatedGlobalNote.id);
    newState = [...newState, updatedGlobalNote]

    return newState;
} 

function handleGlobalNoteDeleted(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
    const deletedGlobalNote = JSON.parse(event.data) as GlobalNote;
    
    const newState: GlobalNote[] = currentState.filter(note => note.id != deletedGlobalNote.id);
    
    return newState;
} 

const sseHandler = new Map<SseMessageType, (event: MessageEvent, value: GlobalNote[]) => GlobalNote[]>
sseHandler.set(SseMessageType.GLOBALNOTECREATED, handleGlobalNoteCreated);
sseHandler.set(SseMessageType.GLOBALNOTEUPDATED, handleGlobalNoteUpdated);
sseHandler.set(SseMessageType.GLOBALNOTEDELETED, handleGlobalNoteDeleted);

/*
fetch("/api/globalNotes", {
    method: "POST",
    headers: {
        "Content-Type":"application/json"
    },
    body: JSON.stringify({title: "Test", content: "Test", noteColor: "#ffffff"})
})
*/

export default function GlobalNoteContainer() {
    let globalNotes = useSseConnectionWithInitialFetch<GlobalNote[]>([], "/api/globalNotes", sseHandler);

    return (
        <div>
            {globalNotes.length}
        </div>
    );

    
}