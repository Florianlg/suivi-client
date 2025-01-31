import { useState } from "react";
import App from "../App";
import { Box, Button, TextField, Typography } from "@mui/material";

const ProtectedApp = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    const correctPassword = "mdp";

    const handleLogin = () => {
        if (password === correctPassword) {
            setAuthenticated(true);
        } else {
            alert("Mot de passe incorrect");
        }
    };

    if (!authenticated) {
        return (
            <Box sx={{ textAlign: "center", mt: 5, maxWidth: 400, mx: "auto", p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Connexion requise
                </Typography>
                <TextField
                    type="password"
                    label="Entrez le mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={handleLogin} fullWidth sx={{ mt: 2 }}>
                    Se connecter
                </Button>
            </Box>
        );
    }

    return <App />;
};


export default ProtectedApp;
