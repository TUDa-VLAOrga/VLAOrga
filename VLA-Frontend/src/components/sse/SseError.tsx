import Popup from "../popup/Popup";
import { Button } from "../ui/button";

function refreshPage(){
    window.location.reload();
}

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
                bottomComonent: <Button onClick={refreshPage}>Neuladen</Button>,
            }}
        </Popup>
    )
}

export default SseError;