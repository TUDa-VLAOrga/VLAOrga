import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Loginpage.css";
import Draggable from "@/components/draggableElement/Draggable";



export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    //TODO: Authentifizierung implementieren
    // Hier würde normalerweise die Authentifizierung stattfinden
      navigate("/calendar"); // Weiterleitung
  }

  return (
    <div className="login-container">
      <form onSubmit={onSubmit} className="login-form">
        <h2 className="login-title">Login</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          className="login-input"
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <Draggable>
        Test!
      </Draggable>
    </div>
  );
}