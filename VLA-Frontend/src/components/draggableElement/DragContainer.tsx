import "../draggableElement/Draggable"
import "../../styles/DragContainer.css"
import { createContext, useRef, useState, type ReactElement } from "react";

export type MousePosition = {
    x: number,
    y: number,
}

const MouseContext = createContext<MousePosition>({ x: 0, y: 0 });
    
export default function DragContainer(children: React.ReactNode) {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

    function handlePointerMove(event: React.PointerEvent<HTMLSpanElement>){
        setMousePosition({ x: event.clientX, y: event.clientY });
    }

    return (
        <span id="DragContainer" onPointerMove={handlePointerMove}>
            <MouseContext value={mousePosition}>
                {children}
            </MouseContext>
        </span>
    )
}