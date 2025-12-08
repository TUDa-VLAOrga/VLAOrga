import Popup from "../popup/Popup";
import { Button } from "../ui/Button";

/**
 * Forces a reload of the current page
 */
function refreshPage(){
    window.location.reload();
}

/**
 * Error message for the SseHandler if eventSource should error
 */
function SseError(){
    return (
        <Popup>
            {{
                title: 
                <>
                    Verbindungsfehler
                </>,
                text: 
                <>
                    Eine verlässliche Verbindung zu dem zentralen Datenserver konnte leider nicht hergestellt werden.<br></br><br></br>
                    Überprüfen Sie, ob Sie sich im richtigen Netzwerk befinden und eine stabile Internetverbindung haben <br></br><br></br>
                    Bitte laden Sie die Seite neu.
                </>,
                bottomComonent:
                <Button>
                    {{
                        onClickEvent: refreshPage,
                        text: <><u>Neuladen</u></>
                    }}
                </Button>,
            }}
        </Popup>
    )
}

export default SseError;