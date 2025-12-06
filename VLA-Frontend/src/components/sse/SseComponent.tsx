import { useEffect, useRef, useState } from "react";
import { SSEHandler } from "./SseHandler";
import SseError from "./SseError";

function SSEComponent(){
    const [sseErrStatus, setSseErrStatus] = useState(false);
    const refSetSseErrStatus = useRef(setSseErrStatus);

    useEffect(() => {
        refSetSseErrStatus.current = setSseErrStatus;
        SSEHandler.initialize(refSetSseErrStatus);
    }, []);



    return (
        <>
            {sseErrStatus ? <SseError></SseError> : ""}
        </>
    );
}

export default SSEComponent;