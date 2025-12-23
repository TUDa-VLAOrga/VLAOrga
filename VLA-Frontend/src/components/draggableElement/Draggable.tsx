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

export default function Draggable(props: DraggableProps){
    const [position, setPosition] = useState({ 
        x: props.posX == undefined ? defaultPosition.posX : props.posX,
        y: props.posY == undefined ? defaultPosition.posY : props.posY,
    });

    const [dragOffset, setDragOffset] = useState({ 
        xOffset: 0,
        yOffset: 0,
    });

    function handleStart(e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, clientX: number, clientY: number){
        const elementBoundingBox = e.currentTarget.getBoundingClientRect();
        
        setDragOffset({
            xOffset: elementBoundingBox.x - clientX,
            yOffset: elementBoundingBox.y - clientY,
        });
    }

    function handleMove(e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, clientX: number, clientY: number){
        const elementBoundingBox = e.currentTarget.getBoundingClientRect();

        setPosition({
            // Min and Max functions prevent note from going offscreen
            x: Math.max(Math.min(clientX + dragOffset.xOffset, window.innerWidth - elementBoundingBox.width), 0),
            y: Math.max(Math.min(clientY + dragOffset.yOffset, window.innerHeight - elementBoundingBox.height), 0),
        });
    }

    function handleDragStart(e: React.DragEvent<HTMLDivElement>){
        e.stopPropagation();

        handleStart(e, e.clientX, e.clientY);
    }

    function handleDragEnd(e: React.DragEvent<HTMLDivElement>){
        e.stopPropagation();

        handleMove(e, e.clientX, e.clientY);
    }

    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>){
        e.stopPropagation();

        const relevantTouch = e.touches[0];
        handleStart(e, relevantTouch.clientX, relevantTouch.clientY);
    }

    function handleTouch(e: React.TouchEvent<HTMLDivElement>){
        e.stopPropagation();

        const relevantTouch = e.touches[0];
        handleMove(e, relevantTouch.clientX, relevantTouch.clientY);
    }

    function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>){
        e.stopPropagation();

        const relevantTouch = e.touches[0];
        handleMove(e, relevantTouch.clientX, relevantTouch.clientY);
    }

    return (
        <div 
        className="DragComponent"
        draggable 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
        
        style={{
            left: position.x,
            top: position.y,
        }}>
            {props.children}
        </div>
    );
}