import { useCallback, useRef, useState } from "react";
import "../../styles/Draggable.css";
import { Button } from "../ui/Button";

type DraggableProps = {
  children: React.ReactNode,
  onClose: () => void
};

type DragOffset = {
  xOffset: number,
  yOffset: number,
  isBeingDragged: boolean,
}

type WindowPosition = {
  posX: number;
  posY: number;
}

const defaultPosition = {
  posX: 10,
  posY: 10,
};

const noInteractionPaddingPx = 20;

export default function Draggable({children, onClose}: DraggableProps){
  const [position, setPosition] = useState<WindowPosition>(defaultPosition);

  const dragOffset = useRef<DragOffset>({ 
    xOffset: 0,
    yOffset: 0,
    isBeingDragged: false,
  });

  const thisElement = useRef<HTMLSpanElement | null>(null);

  /**
     * Determines the inital offset when starting to drag the component
     * @param clientX Initial input X position of the input modality
     * @param clientY Initial input Y position of the input modality
     */
  const handleStart = (clientX: number, clientY: number) => {
    const boundingBox = thisElement.current!.getBoundingClientRect();

    // Safety padding for dragging
    if(clientX - boundingBox.left < noInteractionPaddingPx) return;
    if(boundingBox.right - clientX < noInteractionPaddingPx) return;
    // if(clientY - boundingBox.top < noInteractionPadding) return;
    if(boundingBox.bottom - clientY < noInteractionPaddingPx) return;

    dragOffset.current = ({
      xOffset: clientX - boundingBox.left,
      yOffset: clientY - boundingBox.top,
      isBeingDragged: true,
    });

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);

    setPosition(position);
  };

  /**
     * Determines the position while dragging the component
     * @param e The window pointer event triggering the function
     */
  const handleMove = useCallback((e: PointerEvent) => {
    const clientX = e.clientX;
    const clientY = e.clientY;

    const elementBoundingBox = thisElement.current!.getBoundingClientRect();

    setPosition({
      // Min and Max functions prevent note from going offscreen
      posX: Math.max(Math.min(clientX - dragOffset.current.xOffset, window.innerWidth - elementBoundingBox.width), 0),
      posY: Math.max(Math.min(clientY - dragOffset.current.yOffset, window.innerHeight - elementBoundingBox.height), 0),
    });
  }, []);

  /**
     * Removes all window listeners from component and updates the component state
     */
  const handleEnd = useCallback(() => {

    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", handleEnd);

    dragOffset.current = ({
      xOffset: 0,
      yOffset: 0,
      isBeingDragged: false,
    });

    // React generally caches the state
    // The new dragOffset will not be displayed if the position state is not updated
    setPosition({...position});
  }, [position]);

  /**
     * Handles mouse initiating dragging
     * @param e The triggering window event
     */
  function handleDragStart(e: React.PointerEvent<HTMLSpanElement>){
    e.stopPropagation();

    thisElement.current = e.currentTarget;

    handleStart(e.clientX, e.clientY);
  }

  /**
     * Handles mouse releasing the drag
     * @param e The triggering window event
     */
  function handleDragEnd(e: React.PointerEvent<HTMLSpanElement>){
    e.stopPropagation();
    handleEnd();
  }

  /**
     * Handles touch initiating dragging
     * @param e The triggering window event
     */
  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>){
    e.stopPropagation();

    thisElement.current = e.currentTarget

    const relevantTouch = e.touches[0];
    handleStart(relevantTouch.clientX, relevantTouch.clientY);
  }

  /**
     * Handles touch releasing the drag
     * @param e The triggering window event
     */
  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>){
    e.stopPropagation();
    handleEnd();
  }

  return (
    <span 
      className="DragComponent"

      onPointerDown={handleDragStart}
      onPointerUp={handleDragEnd}

      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
        
      style={{
        left: position.posX,
        top: position.posY,
        // Here we should disable the padding if wanted
        cursor: dragOffset.current.isBeingDragged ? "grabbing" : "grab",
      }}>
      
      <div className="dragClose">
        <Button text="x" onClick={_ => onClose()} marginBottom="0"/>
      </div>

      {children}
    </span>
  );
}
