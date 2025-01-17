import { useState } from "react";
import App from "../App"; // Importez votre composant principal

const ProtectedApp = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    // Récupérer la variable d'environnement
    // const correctPassword = import.meta.env.VITE_REACT_APP_PASSWORD;
    const correctPassword = "mdp";

    console.log("Correct password from env:", correctPassword);

    const handleLogin = () => {
        if (password === correctPassword) {
            setAuthenticated(true);
        } else {
            alert("Mot de passe incorrect");
        }
    };

    if (!authenticated) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>Connexion requise</h1>
                <input
                    type="password"
                    placeholder="Entrez le mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} style={{ marginLeft: "10px" }}>
                    Se connecter
                </button>
            </div>
        );
    }

    return <App />; // Retourne votre application après authentification
};

export default ProtectedApp;
