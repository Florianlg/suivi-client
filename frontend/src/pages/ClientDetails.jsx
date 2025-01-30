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
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";

const API_BASE_URL = "https://backend-latest-b4sq.onrender.com";

const ClientDetails = () => {
    const { clientName } = useParams();
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/prestations/client/${encodeURIComponent(clientName)}`, {
                    withCredentials: true,
                });
                setClientData(response.data);
            } catch (err) {
                setError("Impossible de récupérer les données du client.");
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, [clientName]);

    if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 3 }} />;
    if (error) return <Typography color="error" sx={{ textAlign: "center", mt: 3 }}>{error}</Typography>;
    if (!clientData?.length) return <Typography sx={{ textAlign: "center", mt: 3 }}>Aucune prestation disponible.</Typography>;

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Fiche client : {clientName}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Prix (€)</strong></TableCell>
                            <TableCell><strong>Prestataire</strong></TableCell>
                            <TableCell><strong>Objectifs</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientData.map((prestation) => (
                            <TableRow key={prestation.id}>
                                <TableCell>{new Date(prestation.date).toLocaleDateString()}</TableCell>
                                <TableCell>{prestation.prestationType}</TableCell>
                                <TableCell>{prestation.price} €</TableCell>
                                <TableCell>{prestation.provider}</TableCell>
                                <TableCell>{prestation.excludeFromObjectives ? "Exclu" : "Inclus"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ClientDetails;