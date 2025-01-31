import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Card,
    CardContent,
    Button,
    Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://backend-latest-b4sq.onrender.com"; // || "http://localhost:4000"




const ClientDetails = () => {
    const { clientName } = useParams();
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchClientData = useCallback(async () => {
        try {
            const apiUrl = `${API_BASE_URL}/prestations/client/${encodeURIComponent(clientName)}`;
            console.log("🔍 URL de l'API appelée :", apiUrl);
            const response = await axios.get(apiUrl, {
                withCredentials: true,
            });
            setClientData(response.data);
        } catch (err) {
            console.error("Erreur lors de la récupération des données du client :", err.response ? err.response.data : err.message);
            setError("Impossible de récupérer les données du client.");
        } finally {
            setLoading(false);
        }
    }, [clientName]);

    useEffect(() => {
        if (!clientData) fetchClientData();
    }, [fetchClientData, clientData]);


    const prestations = useMemo(() => (Array.isArray(clientData) ? clientData : []), [clientData]);


    if (loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: "center", mt: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>
        );
    }

    if (!prestations.length) {
        return (
            <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography>Aucune prestation disponible pour ce client.</Typography>
            </Box>
        );
    }

    return (

        <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
                ← Retour
            </Button>

            <Card sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Fiche client : {clientName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Détails des prestations effectuées par ce client.
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#ececec" }}>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Type de prestation</strong></TableCell>
                                    <TableCell><strong>Prix (€)</strong></TableCell>
                                    <TableCell><strong>Prestataire</strong></TableCell>
                                    <TableCell><strong>Exclu des objectifs</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {prestations.map((prestation) => (
                                    <TableRow key={prestation.id}>
                                        <TableCell>{new Date(prestation.date).toLocaleDateString("fr-FR")}</TableCell>
                                        <TableCell>{prestation.prestationType}</TableCell>
                                        <TableCell>{prestation.price} €</TableCell>
                                        <TableCell>{prestation.provider}</TableCell>
                                        <TableCell>{prestation.excludeFromObjectives ? "Oui" : "Non"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ClientDetails;
