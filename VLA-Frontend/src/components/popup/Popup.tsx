import type { ReactNode } from "react";
import "./Popup.css"

interface PopupProps {
    title: ReactNode,
    text: ReactNode,
    bottomComonent?: ReactNode,
}

function Popup({children} : {children: PopupProps}){
    return (
        <span className="PopupBackground">
            <div className="PopupContainer">
                <div className="PopupTitle">{children.title}</div>
                <div className="PopupText">
                    {children.text} <br></br><br></br>
                    {children.bottomComonent}
                </div>
            </div>
        </span>
    );
}

export default Popup;