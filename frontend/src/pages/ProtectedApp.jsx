import { useState, useEffect } from "react";
import App from "../App";
import { Box, Button, TextField, Typography, CircularProgress, Alert } from "@mui/material";

const ProtectedApp = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedAuth = sessionStorage.getItem("authenticated");
        if (storedAuth === "true") {
            setAuthenticated(true);
        }
    }, []);

    const hashPassword = async (input) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hash = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    };

    const handleLogin = async () => {
        setLoading(true);
        const hashedInput = await hashPassword(password);
        const correctHashedPassword = "3a1b7d2e3f6c5d8a9b0c"; // Mettre le hash réel

        if (hashedInput === correctHashedPassword) {
            sessionStorage.setItem("authenticated", "true");
            setAuthenticated(true);
        } else {
            setError("Mot de passe incorrect");
        }
        setLoading(false);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("authenticated");
        setAuthenticated(false);
        setPassword("");
    };

    if (!authenticated) {
        return (
            <Box sx={{ textAlign: "center", mt: 5, maxWidth: 400, mx: "auto", p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Connexion requise
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField
                    type="password"
                    label="Entrez le mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    fullWidth
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                sx={{ position: "absolute", top: 10, right: 10 }}
            >
                Déconnexion
            </Button>
            <App />
        </Box>
    );
};

export default ProtectedApp;
