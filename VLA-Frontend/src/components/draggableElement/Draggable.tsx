import { useContext, useState } from "react"
import "../../styles/Draggable.css"
import { MouseContext } from "./MouseContext"

type DraggableProps = {
    posX?: number
    posY?: number
    children: React.ReactNode
}

const defaultPosition = {
    posX: 10,
    posY: 10,
}

// On mobile no typing possibilities

export default function Draggable(props: DraggableProps){
    const mousePosition = useContext(MouseContext);

    const [position, setPosition] = useState(defaultPosition);

    const [dragOffset, setDragOffset] = useState({ 
        xOffset: 0,
        yOffset: 0,
        isBeingDragged: false,
    });

    const noInteractionPadding = 20;

    /**
     * Determines the inital offset when dragging the component
     * @param e The window event used
     * @param clientX Initial input X position of the input modality
     * @param clientY Initial input Y position of the input modality
     */
    function handleStart(clientX: number, clientY: number, boundingBox: DOMRect){

        // Safety padding for dragging
        if(clientX - boundingBox.left < noInteractionPadding) return;
        if(boundingBox.right - clientX < noInteractionPadding) return;
        if(clientY - boundingBox.top < noInteractionPadding) return;
        if(boundingBox.bottom - clientY < noInteractionPadding) return;

        setDragOffset({
            xOffset: clientX - boundingBox.left,
            yOffset: clientY - boundingBox.top,
            isBeingDragged: true,
        });
    }

    /**
     * Determines the position while dragging the component
     * @param e The window event used
     * @param clientX Initial input X position of the input modality
     * @param clientY Initial input Y position of the input modality
     */
    function handleMove(e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, clientX: number, clientY: number){
        const elementBoundingBox = e.currentTarget.getBoundingClientRect();

        setPosition({
            // Min and Max functions prevent note from going offscreen
            posX: Math.max(Math.min(clientX - dragOffset.xOffset, window.innerWidth - elementBoundingBox.width), 0),
            posY: Math.max(Math.min(clientY - dragOffset.yOffset, window.innerHeight - elementBoundingBox.height), 0),
        });
    }

    /**
     * Finalizes the dragging position of the component
     * @param e The window event used
     * @param clientX Initial input X position of the input modality
     * @param clientY Initial input Y position of the input modality
     */
    function handleEnd(e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, clientX: number, clientY: number){     
        if(dragOffset.isBeingDragged) handleMove(e, clientX, clientY);

        setDragOffset({
            xOffset: 0,
            yOffset: 0,
            isBeingDragged: false,
        });
    }

    /**
     * Handles mouse initiating dragging
     * @param e The triggering window event
     */
    function handleDragStart(e: React.PointerEvent<HTMLDivElement>){
        e.stopPropagation();

        const elementBoundingBox = e.currentTarget.getBoundingClientRect();

        handleStart(mousePosition.x, mousePosition.y, elementBoundingBox);
    }

    /**
     * Handles mouse while dragging
     * @param e The triggering window event
     */
    function handleDragMove(e: React.PointerEvent<HTMLDivElement>){
        if(dragOffset.isBeingDragged) handleMove(e, mousePosition.x, mousePosition.y);
    }

    /**
     * Handles mouse releasing the drag
     * @param e The triggering window event
     */
    function handleDragEnd(e: React.PointerEvent<HTMLDivElement>){
        e.stopPropagation();

        handleEnd(e, mousePosition.x, mousePosition.y);
    }

    /**
     * Handles touch initiating dragging
     * @param e The triggering window event
     */
    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>){
        const relevantTouch = e.touches[0];
        const elementBoundingBox = e.currentTarget.getBoundingClientRect();

        handleStart(relevantTouch.clientX, relevantTouch.clientY, elementBoundingBox);
    }

    /**
     * Handles touch dragging previewing
     * @param e The triggering window event
     */
    function handleTouch(e: React.TouchEvent<HTMLDivElement>){
        const relevantTouch = e.touches[0];
        handleMove(e, relevantTouch.clientX, relevantTouch.clientY);
    }

    /**
     * Handles touch releasing the drag
     * @param e The triggering window event
     */
    function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>){
        const relevantTouch = e.changedTouches[0];
        handleEnd(e, relevantTouch.clientX, relevantTouch.clientY);
    }

    return (
        <span 
        className="DragComponent"

        // These have to be pointer events
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}

        onTouchStart={handleTouchStart}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
        
        style={{
            left: position.posX,
            top: position.posY,
            // Here we should disable the padding if wanted
            cursor: dragOffset.isBeingDragged ? "grabbing" : "grab",
        }}>
            {props.children}
        </span>
    );
}