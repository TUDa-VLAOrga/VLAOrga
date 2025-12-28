import { useState } from "react"
import "../../styles/Draggable.css"
import { Logger } from "../logger/Logger"

type DraggableProps = {
    posX?: number
    posY?: number
    children: React.ReactNode
}

const defaultPosition = {
    posX: 10,
    posY: 10,
}

const transparentPixel = new Image(0, 0);
transparentPixel.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export default function Draggable(props: DraggableProps){
    const [position, setPosition] = useState({ 
        x: props.posX == undefined ? defaultPosition.posX : props.posX,
        y: props.posY == undefined ? defaultPosition.posY : props.posY,
    });

    const [dragOffset, setDragOffset] = useState({ 
        xOffset: 0,
        yOffset: 0,
        isBeingDragged: false,
    });

    /**
     * Determines the inital offset when dragging the component
     * @param e The window event used
     * @param clientX Initial input X position of the input modality
     * @param clientY Initial input Y position of the input modality
     */
    function handleStart(e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, clientX: number, clientY: number){
        const elementBoundingBox = e.currentTarget.getBoundingClientRect();
        
        setDragOffset({
            xOffset: elementBoundingBox.x - clientX,
            yOffset: elementBoundingBox.y - clientY,
            isBeingDragged: true,
        });
    }

    /**
     * Determines the position while dragging the component
     * @param e The window event used
     * @param clientX Initial input X position of the input modality
     * @param clientY Initial input Y position of the input modality
     */
    function handleMove(e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, clientX: number, clientY: number){
        const elementBoundingBox = e.currentTarget.getBoundingClientRect();

        setPosition({
            // Min and Max functions prevent note from going offscreen
            x: Math.max(Math.min(clientX + dragOffset.xOffset, window.innerWidth - elementBoundingBox.width), 0),
            y: Math.max(Math.min(clientY + dragOffset.yOffset, window.innerHeight - elementBoundingBox.height), 0),
        });
    }

    /**
     * Finalizes the dragging position of the component
     * @param e The window event used
     * @param clientX Initial input X position of the input modality
     * @param clientY Initial input Y position of the input modality
     */
    function handleEnd(e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, clientX: number, clientY: number){     
        handleMove(e, clientX, clientY);

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
    function handleDragStart(e: React.DragEvent<HTMLDivElement>){
        e.stopPropagation();
        e.dataTransfer.setDragImage(transparentPixel, 0, 0);

        handleStart(e, e.clientX, e.clientY);
    }

    /**
     * Handles mouse while dragging
     * @param e The triggering window event
     */
    // @ts-expect-error - Deprecated as of now, we will maybe come back here at the end of development
    function _handleDragMove(e: React.DragEvent<HTMLDivElement>){
        e.stopPropagation();

        handleMove(e, e.clientX, e.clientY);
    }

    /**
     * Handles mouse releasing the drag
     * @param e The triggering window event
     */
    function handleDragEnd(e: React.DragEvent<HTMLDivElement>){
        e.stopPropagation();

        handleEnd(e, e.clientX, e.clientY);
    }

    /**
     * Handles touch initiating dragging
     * @param e The triggering window event
     */
    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>){

        const relevantTouch = e.touches[0];
        handleStart(e, relevantTouch.clientX, relevantTouch.clientY);
    }

    /**
     * Handles touch dragging previewing
     * @param e The triggering window event
     */
    // @ts-expect-error - Deprecated as of now, we will maybe come back here at the end of development
    function _handleTouch(e: React.TouchEvent<HTMLDivElement>){

        const relevantTouch = e.touches[0];
        handleMove(e, relevantTouch.clientX, relevantTouch.clientY);
    }

    /**
     * Handles touch releasing the drag
     * @param e The triggering window event
     */
    function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>){
        Logger.info("Touch end event")
        const relevantTouch = e.changedTouches[0];
        handleEnd(e, relevantTouch.clientX, relevantTouch.clientY);
    }

    return (
        <span 
        className="DragComponent"
        draggable 
        onDragStart={handleDragStart}
        // onDrag={handleDragMove}
        onDragEnd={handleDragEnd}

        onTouchStart={handleTouchStart}
        // onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
        // onTouchCancel should be used as supplement if errors arise
        
        style={{
            left: position.x,
            top: position.y,
            opacity: dragOffset.isBeingDragged ? 0 : 1,
        }}>
            {props.children}
        </span>
    );
}