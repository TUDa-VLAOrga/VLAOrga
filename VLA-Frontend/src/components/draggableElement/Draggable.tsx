import { useEffect, useState } from "react"
import "../../styles/Draggable.css"
import { Logger } from "../logger/Logger"

type DraggableProps = {
    posX?: number
    posY?: number
    children: React.ReactNode
}

// TODO: Add mobile / touch support

export default function Draggable(props: DraggableProps){
    const [position, setPosition] = useState({ 
        x: props.posX == undefined ? 10 : props.posX,
        y: props.posY == undefined ? 10 : props.posY,
    });

    const [dragOffset, setDragOffset] = useState({ 
        xOffset: 0,
        yOffset: 0,
    });

    function handleDragStart(e: React.DragEvent<HTMLDivElement>){
        e.stopPropagation();
        const elementBoundingBox = e.currentTarget.getBoundingClientRect();
        
        setDragOffset({
            xOffset: elementBoundingBox.x - e.clientX,
            yOffset: elementBoundingBox.y - e.clientY,
        });
    }

    function handleDragEnd(e: React.DragEvent<HTMLDivElement>){
        const elementBoundingBox = e.currentTarget.getBoundingClientRect();

        setPosition({
            // Min and Max functions prevent note from going offscreen
            x: Math.max(Math.min(e.clientX + dragOffset.xOffset, window.innerWidth - elementBoundingBox.width), 0),
            y: Math.max(Math.min(e.clientY + dragOffset.yOffset, window.innerHeight - elementBoundingBox.height), 0),
        });
    }

    return (
        <div 
        className="DragComponent"
        draggable 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        
        style={{
            left: position.x,
            top: position.y,
        }}>
            {props.children}
        </div>
    );
}