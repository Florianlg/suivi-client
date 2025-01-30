import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";

const API_BASE_URL = "https://backend-latest-b4sq.onrender.com"; // || "http://localhost:4000"

const ClientDetails = () => {
    const { clientName } = useParams(); // Récupération du nom du client depuis l'URL
    const [clientData, setClientData] = useState(null); // Initialiser les données à `null`
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientData = async () => {
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
        };

        fetchClientData();
    }, [clientName]);


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
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!clientData || clientData.length === 0) {
        return (
            <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography>Aucune prestation disponible pour ce client.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Fiche client : {clientName}
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {clientData.map((prestation) => (
                            <TableRow key={prestation.id}>
                                <TableCell>{prestation.date}</TableCell>
                                <TableCell>{prestation.prestationType}</TableCell>
                                <TableCell>{prestation.price} €</TableCell>
                                <TableCell>{prestation.provider}</TableCell>
                                {/* Si tu as ajouté de nouveaux champs, les afficher ici */}
                                {prestation.excludeFromObjectives && (
                                    <TableCell>Exclu des objectifs</TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ClientDetails;
