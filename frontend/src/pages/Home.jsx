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
    Grid,
    Alert
} from "@mui/material";
import StatCard from "../components/StatCard";
import ClientTable from "../components/ClientTable";
import CustomButton from "../components/CustomButton";
import { FaUser, FaChartLine, FaClipboardList } from "react-icons/fa";

const API_BASE_URL = "https://backend-latest-b4sq.onrender.com";

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
    const [excludeFromObjectives, setExcludeFromObjectives] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/prestations/clients`, {
                    withCredentials: true,
                });
                setClients(response.data);
                setLoading(false);
            } catch (error) {
                setMessage("Impossible de charger les clients.");
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalClientName = clientName === "Nouveau client" ? newClientName : clientName;
        if (!finalClientName || !prestationType || !date || !price || !provider) {
            setMessage("Tous les champs sont obligatoires.");
            return;
        }
        try {
            await axios.post(`${API_BASE_URL}/prestations/`, {
                clientName: finalClientName,
                prestationType,
                date,
                price,
                provider,
                excludeFromObjectives,
            });
            setMessage("Prestation ajoutée avec succès !");
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

    // Données des statistiques (exemple)
    const stats = [
        { title: "Clients", value: clients.length, icon: <FaUser size={32} color="#0057A3" /> },
        { title: "Prestations", value: "85", icon: <FaClipboardList size={32} color="#0057A3" /> },
        { title: "Revenu Total", value: "15,000€", icon: <FaChartLine size={32} color="#0057A3" /> },
    ];

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
            <Typography variant="h4" gutterBottom textAlign="center" sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}>
                Tableau de Bord
            </Typography>

            {/* Section des Statistiques */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
                    </Grid>
                ))}
            </Grid>

            {/* Formulaire d'ajout de prestation */}
            <Paper sx={{ p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom textAlign="center">
                    Ajouter une prestation
                </Typography>
                {loading ? (
                    <CircularProgress sx={{ display: "block", mx: "auto" }} />
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
                        <TextField
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Prix (€)"
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
                            control={<Checkbox checked={excludeFromObjectives} onChange={(e) => setExcludeFromObjectives(e.target.checked)} />}
                            label="Ne pas inclure dans Objectifs"
                        />
                        <CustomButton label="Ajouter la prestation" type="submit" sx={{ mt: 2, width: "100%" }} />
                    </form>
                )}
                {message && (
                    <Alert severity={message.includes("Erreur") ? "error" : "success"} sx={{ mt: 2 }}>
                        {message}
                    </Alert>
                )}
            </Paper>

            {/* Liste des Clients */}
            <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>Derniers Clients</Typography>
            <ClientTable clients={clients} />
        </Box>
    );
};

export default Home;
