import { URL_LOGOUT } from "@/lib/api";
import { fetchCSRFToken } from "@/lib/utils";
import { Logger } from "../logger/Logger";

function logout(){
    fetchCSRFToken()
    .then(csrfToken => {
        fetch(URL_LOGOUT, {
            method: "POST",
            credentials: "include",
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            }
        })
        // This triggers in the production case
        .then(_ => {
            window.location.reload();
        })
        // This triggers in dev mode due to CORS
        .catch(_ => {
            window.location.reload();
        });
    })
    .catch(err => 
        Logger.error("Error logging out", err)
    )
}

export default function LogoutButton(){   
    return (      
        <button
            className="cv-createBtn"
            onClick={() => logout()}
            aria-label="Ausloggen"
            type="button"
        >
            Logout
        </button>
    );
}