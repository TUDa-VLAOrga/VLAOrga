import "../draggableElement/Draggable";
import "../../styles/DragContainer.css";
import { useState } from "react";
import { MouseContext, type MousePosition } from "./MouseContext";

export type DragContainerProps = {
  children: React.ReactNode,
};

export default function DragContainer({ children } : DragContainerProps) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>){
    setMousePosition({ x: event.clientX, y: event.clientY });
  }

  return (
    <div id="DragContainer" onPointerMove={handlePointerMove}>
      <MouseContext.Provider value={mousePosition}>
        {children}
      </MouseContext.Provider>
    </div>
  );
}
