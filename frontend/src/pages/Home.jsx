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
} from "@mui/material";

const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:4000";


const Home = () => {
    const [clientName, setClientName] = useState("");
    const [newClientName, setNewClientName] = useState("");
    const [prestationType, setPrestationType] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState("");
    const [provider, setProvider] = useState("");
    const [clients, setClients] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    // Champs spécifiques à Préparation mentale
    const [sessionType, setSessionType] = useState(""); // Type d'accompagnement
    const [startDate, setStartDate] = useState(""); // Date de début
    const [endDate, setEndDate] = useState(""); // Date de fin

    // Nouvelle option : Exclure des objectifs
    const [excludeFromObjectives, setExcludeFromObjectives] = useState(false);

    // Récupérer les clients depuis l'API du backend
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/prestations/clients`, {
                    withCredentials: true,
                });
                setClients(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des clients :", error);
                setMessage("Impossible de charger les clients.");
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    // Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalClientName =
            clientName === "Nouveau client" ? newClientName : clientName;

        if (!finalClientName || !prestationType || !date || !price || !provider) {
            setMessage("Tous les champs sont obligatoires.");
            return;
        }

        // Créer l'objet prestation
        const prestation = {
            clientName: finalClientName,
            prestationType,
            date,
            price,
            provider,
            sessionType: prestationType === "Préparation mentale" ? sessionType : null,
            startDate: prestationType === "Préparation mentale" ? startDate : null,
            endDate: prestationType === "Préparation mentale" ? endDate : null,
            excludeFromObjectives,
        };

        try {
            // Envoi de la prestation au backend MySQL
            const response = await axios.post(`${API_BASE_URL}/prestations/clients`, prestation);
            setMessage("Prestation ajoutée avec succès !");
            // Réinitialisez le formulaire
            setClientName("");
            setPrestationType("");
            setDate("");
            setPrice("");
            setProvider("");
            setNewClientName("");
            setSessionType("");
            setStartDate("");
            setEndDate("");
            setExcludeFromObjectives(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la prestation :", error);
            setMessage("Erreur lors de l'ajout de la prestation.");
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 600,
                mx: "auto",
                p: 3,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Ajouter une prestation
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit}>
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

                    {prestationType === "Préparation mentale" && (
                        <>
                            <TextField
                                select
                                label="Type d'accompagnement"
                                value={sessionType}
                                onChange={(e) => setSessionType(e.target.value)}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value="A la séance">A la séance</MenuItem>
                                <MenuItem value="Forfait annuel">Forfait annuel</MenuItem>
                                <MenuItem value="Forfait tournois">Forfait tournois</MenuItem>
                            </TextField>

                            <TextField
                                label="Date de début"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                            />

                            <TextField
                                label="Date de fin"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </>
                    )}

                    <TextField
                        label="Date de la prestation"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        label="Montant"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

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

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={excludeFromObjectives}
                                onChange={(e) => setExcludeFromObjectives(e.target.checked)}
                            />
                        }
                        label="Ne pas enregistrer dans Objectifs"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Ajouter la prestation
                    </Button>
                </form>
            )}

            {message && (
                <Typography
                    variant="body1"
                    sx={{ mt: 2, color: message.includes("Erreur") ? "red" : "green" }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Home;
