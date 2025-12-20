import { useEffect, useState } from "react";
import type { LogMessage } from "./LoggerTypes";
import { Logger } from "./Logger";
import "./../../styles/Logger.css";

function LoggerComponent(){
    const [logMessages, setLogMessages] = useState<LogMessage[]>([]);

    useEffect(() => {
        Logger.overrideComponenentMessageSetterRef(setLogMessages);
    }, []);

    return (
        <span className="LoggerContainer">
        
        <label className="LoggerToggle" htmlFor="LoggerToggler">
            <input type="checkbox" id="LoggerToggler"></input>
            Logger
        </label>

        <div className="Logger">

        {logMessages.map((logMessage, index) => 
            <div key={"logEntry-" + index} className="LogEntry" data-log-event-type={logMessage.eventType} data-log-level={logMessage.level}>
                <div className="LogDate">{logMessage.date.toLocaleTimeString()}</div>
                <div className="LogLevel">[{logMessage.level}]</div>
                <div className="LogMessage">{logMessage.message}</div>
            </div>
        )}
        </div>

        </span>
    )
}

export default LoggerComponent;