import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Hier würde normalerweise die Authentifizierung stattfinden
      navigate("/calendar"); // Weiterleitung
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <form 
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "300px"
        }}
      >
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        
      </form>
    </div>
  );
}
