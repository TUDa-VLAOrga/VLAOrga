import type { ReactNode } from "react";
import "./Popup.css"

/**
 * Used for defining central components of the Popup
 */
interface PopupProps {
    title: ReactNode,
    text: ReactNode,
    bottomComonent?: ReactNode,
}

/**
 * Component for displaying responsive Popups
 * @param children Should be specified inside component according to {@link PopupProps}
 */
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