import useSseConnectionWithInitialFetch from "@/hooks/useSseConnectionWithInitialFetch";
import { SseMessageType, type GlobalNote } from "@/lib/databaseTypes";

function handleGlobalNoteCreated(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
    return [];
} 

function handleGlobalNoteUpdated(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
    return [];
} 

function handleGlobalNoteDeleted(event: MessageEvent, currentState: GlobalNote[]): GlobalNote[]{
    return [];
} 

const sseHandler = new Map<SseMessageType, (event: MessageEvent, value: GlobalNote[]) => GlobalNote[]>
sseHandler.set(SseMessageType.GLOBALNOTECREATED, handleGlobalNoteCreated);
sseHandler.set(SseMessageType.GLOBALNOTEUPDATED, handleGlobalNoteUpdated);
sseHandler.set(SseMessageType.GLOBALNOTEDELETED, handleGlobalNoteDeleted);

export default function GlobalNoteContainer() {
    let globalNotes = useSseConnectionWithInitialFetch<GlobalNote[]>([], "/api/globalNotes", sseHandler);

    return (
        <div>
            {globalNotes.length}
        </div>
    );

    
}