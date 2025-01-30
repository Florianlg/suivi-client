import { useState } from 'react';
import { Box, Button, Grid2, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

const Home = () => {
    const [clientName, setClientName] = useState('');
    const [prestationType, setPrestationType] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [provider, setProvider] = useState('');
    const [newClientName, setNewClientName] = useState('');
    const [sessionType, setSessionType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [excludeFromObjectives, setExcludeFromObjectives] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const prestation = {
            clientName,
            prestationType,
            date,
            price,
            provider,
            newClientName,
            sessionType,
            startDate,
            endDate,
            excludeFromObjectives,
        };

        try {
            const response = await axios.post(`https://backend-latest-b4sq.onrender.com/prestations/`, prestation);
            setMessage("Prestation ajoutée avec succès !");
            // Réinitialisez le formulaire
            setClientName('');
            setPrestationType('');
            setDate('');
            setPrice('');
            setProvider('');
            setNewClientName('');
            setSessionType('');
            setStartDate('');
            setEndDate('');
            setExcludeFromObjectives(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la prestation :", error);
            setMessage("Erreur lors de l'ajout de la prestation.");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Ajouter une prestation
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={12}>
                        <TextField
                            fullWidth
                            label="Nom du client"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                            aria-label="Nom du client"
                        />
                    </Grid2>
                    <Grid2 item xs={12}>
                        <TextField
                            fullWidth
                            label="Type de prestation"
                            value={prestationType}
                            onChange={(e) => setPrestationType(e.target.value)}
                            required
                            aria-label="Type de prestation"
                        />
                    </Grid2>
                    <Grid2 item xs={12}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            InputLabelProps={{ shrink: true }}
                            aria-label="Date"
                        />
                    </Grid2>
                    <Grid2 item xs={12}>
                        <TextField
                            fullWidth
                            label="Prix"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            aria-label="Prix"
                        />
                    </Grid2>
                    <Grid2 item xs={12}>
                        <TextField
                            fullWidth
                            label="Fournisseur"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            required
                            aria-label="Fournisseur"
                        />
                    </Grid2>
                    <Grid2 item xs={12}>
                        <TextField
                            fullWidth
                            label="Nouveau nom du client"
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            aria-label="Nouveau nom du client"
                        />
                    </Grid2>
                    <Grid2 item xs={12}>
                        <TextField
                            fullWidth
                            label="Type de session"
                            value={sessionType}
                            onChange={(e) => setSessionType(e.target.value)}
                            aria-label="Type de session"
                        />
                    </Grid2>
                    <Grid2 item xs={12}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Date de début"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            aria-label="Date de début"
                        />
                    </Grid2>
                    <Grid2 item xs={12}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Date de fin"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            aria-label="Date de fin"
                        />
                    </Grid2>
                    <Grid2 item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={excludeFromObjectives}
                                    onChange={(e) => setExcludeFromObjectives(e.target.checked)}
                                    aria-label="Exclure des objectifs"
                                />
                            }
                            label="Exclure des objectifs"
                        />
                    </Grid2>
                    <Grid2 item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Ajouter
                        </Button>
                    </Grid2>
                </Grid2>
            </form>
            {message && (
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default Home;