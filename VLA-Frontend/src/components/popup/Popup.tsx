import type { ReactNode } from "react";
import "./Popup.css"

/**
 * Used for defining central components of the Popup
 */
interface PopupProps {
    title: ReactNode,
    body: ReactNode,
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
                    {children.body}
                </div>
            </div>
        </span>
    );
}

export default Popup;
