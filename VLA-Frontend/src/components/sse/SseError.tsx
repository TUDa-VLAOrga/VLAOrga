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
                body: 
                <>
                    Die Verbindung zum Server wurde unterbrochen.
                    <br/>
                    <br/>
                    Überprüfen Sie, ob Sie sich im richtigen Netzwerk befinden und eine stabile Internetverbindung haben <br></br><br></br>
                    Bitte schließen Sie auch weitere Tabs, falls die obigen Schritte das Problem nicht beenden sollten <br></br><br></br>
                    Bitte laden Sie die Seite neu.
                    <br/>
                    <br/>
                    <Button>
                    {{
                        onClickEvent: refreshPage,
                        text: <><u>Neu laden</u></>
                    }}
                </Button>
                </>,
            }}
        </Popup>
    )
}

export default SseError;
