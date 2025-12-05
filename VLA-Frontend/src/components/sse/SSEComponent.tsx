import { useEffect, useRef, useState } from "react";
import { SSEHandler } from "./SSEHandler";

function SSEComponent(){
    const [sseErrStatus, setSseErrStatus] = useState(false);
    const refSetSseErrStatus = useRef(setSseErrStatus);

    useEffect(() => {
        refSetSseErrStatus.current = setSseErrStatus;
        SSEHandler.initialize(refSetSseErrStatus);
    }, []);



    return (
        <>
            Event source status: {sseErrStatus ? "Errored" : "Setting up / Ready"}
        </>
    );
}

export default SSEComponent;