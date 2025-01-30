import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Paper,
} from "@mui/material";

const API_BASE_URL = "https://backend-latest-b4sq.onrender.com";

const Home = () => {
    // Déclaration des états pour gérer les champs du formulaire et les données
    const [clientName, setClientName] = useState("");
    const [newClientName, setNewClientName] = useState("");
    const [prestationType, setPrestationType] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState("");
    const [provider, setProvider] = useState("");
    const [clients, setClients] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [excludeFromObjectives, setExcludeFromObjectives] = useState(false);

    // Chargement des clients disponibles depuis l'API au montage du composant
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/prestations/clients`, {
                    withCredentials: true,
                });
                setClients(response.data);
            } catch (error) {
                setMessage("Impossible de charger les clients.");
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    // Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalClientName = clientName === "Nouveau client" ? newClientName : clientName;

        // Vérification des champs obligatoires
        if (!finalClientName || !prestationType || !date || !price || !provider) {
            setMessage("Tous les champs sont obligatoires.");
            return;
        }

        try {
            // Envoi des données de prestation au backend
            await axios.post(`${API_BASE_URL}/prestations/`, {
                clientName: finalClientName,
                prestationType,
                date,
                price,
                provider,
                excludeFromObjectives,
            });
            setMessage("Prestation ajoutée avec succès !");
            // Réinitialisation des champs du formulaire après soumission réussie
            setClientName("");
            setPrestationType("");
            setDate("");
            setPrice("");
            setProvider("");
            setNewClientName("");
            setExcludeFromObjectives(false);
        } catch (error) {
            setMessage("Erreur lors de l'ajout de la prestation.");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Ajouter une prestation
            </Typography>
            {loading ? (
                <CircularProgress sx={{ display: "block", mx: "auto" }} />
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Sélection du client existant ou ajout d'un nouveau client */}
                    <TextField
                        select
                        label="Client"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Nouveau client">Nouveau client</MenuItem>
                        {clients.map((client, index) => (
                            <MenuItem key={index} value={client.clientName}>
                                {client.clientName}
                            </MenuItem>
                        ))}
                    </TextField>
                    {clientName === "Nouveau client" && (
                        <TextField
                            label="Nom du nouveau client"
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    )}

                    {/* Sélection du type de prestation */}
                    <TextField
                        select
                        label="Type de prestation"
                        value={prestationType}
                        onChange={(e) => setPrestationType(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Site internet">Site internet</MenuItem>
                        <MenuItem value="Formation">Formation</MenuItem>
                        <MenuItem value="Préparation mentale">Préparation mentale</MenuItem>
                        <MenuItem value="Autres">Autres</MenuItem>
                    </TextField>

                    {/* Sélection de la date de prestation */}
                    <TextField
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />

                    {/* Sélection du prix de la prestation */}
                    <TextField
                        label="Prix (€)"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    {/* Sélection du prestataire */}
                    <TextField
                        select
                        label="Prestataire"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Florian">Florian</MenuItem>
                        <MenuItem value="Mélanie">Mélanie</MenuItem>
                        <MenuItem value="les deux">Les deux</MenuItem>
                    </TextField>

                    {/* Option pour exclure la prestation des objectifs */}
                    <FormControlLabel
                        control={<Checkbox checked={excludeFromObjectives} onChange={(e) => setExcludeFromObjectives(e.target.checked)} />}
                        label="Ne pas inclure dans Objectifs"
                    />

                    {/* Bouton de soumission */}
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Ajouter la prestation
                    </Button>
                </form>
            )}
            {message && <Typography sx={{ mt: 2, textAlign: "center", color: message.includes("Erreur") ? "red" : "green" }}>{message}</Typography>}
        </Box>
    );
};

export default Home;
