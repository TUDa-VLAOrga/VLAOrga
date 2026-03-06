import { URL_LOGIN, URL_LOGOUT } from "@/lib/api";
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
        // This errors as this already does not have permissions anymore
        .catch(_ => {
            window.location.href = URL_LOGIN;
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