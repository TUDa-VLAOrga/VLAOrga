import { useEffect } from "react";
import { SSEHandler } from "./SSEHandler";

function SSEComponent(){
    useEffect(() => {
        SSEHandler.initialize();
    }, []);

    return "Waiting for event..";
}

export default SSEComponent;