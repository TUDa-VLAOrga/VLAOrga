import { useEffect, useRef, useState } from "react";
import { SSEHandler } from "./SseHandler";
import SseError from "./SseError";

function SSEComponent(){
    const [sseErrStatus, setSseErrStatus] = useState(false);
    const refSetSseErrStatus = useRef(setSseErrStatus);

    /**
     * Initializes the SSE Communication
     * Should be present in the component tree if SSE Features are wanted
     * There should only be exactly one component instance in all cases
     */
    useEffect(() => {
        refSetSseErrStatus.current = setSseErrStatus;
        SSEHandler.initialize(refSetSseErrStatus);
    }, []);


    /**
     * Displays the SseError when the EventSource errors
     * This can happen due to a broken pipe or no possible connection
     */
    return (
        <>
            {sseErrStatus ? <SseError></SseError> : ""}
        </>
    );
}

export default SSEComponent;
