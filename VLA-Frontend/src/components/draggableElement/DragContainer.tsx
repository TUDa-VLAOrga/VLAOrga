import "../draggableElement/Draggable"
import "../../styles/DragContainer.css"
import { createContext, useRef, useState, type ReactElement } from "react";
import { Logger } from "../logger/Logger";

export type MousePosition = {
    x: number,
    y: number,
}

export const MouseContext = createContext<MousePosition>({ x: 0, y: 0 });
    
export type DragContainerProps = {
    children: React.ReactNode,
}

export default function DragContainer({ children } : DragContainerProps) {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>){
        setMousePosition({ x: event.clientX, y: event.clientY });
    }

    return (
        <div id="DragContainer" onPointerMove={handlePointerMove}>
            <MouseContext.Provider value={mousePosition}>
                {children}
            </MouseContext.Provider>
        </div>
    )
}