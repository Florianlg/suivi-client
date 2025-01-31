import { useEffect, useState, useMemo } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    MenuItem,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Card,
    CardContent,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "/api"; // || "http://localhost:4000"

const MentalPreparation = () => {
    const [stats, setStats] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/prestations`, {
                    withCredentials: true,
                });

                processStats(response.data);
                processClients(response.data);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des statistiques :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [selectedYear]);

    const processStats = (data) => {
        const filtered = data.filter(
            (prestation) =>
                prestation.prestationType?.toLowerCase().trim() === "préparation mentale" &&
                new Date(prestation.date).getFullYear() === parseInt(selectedYear)
        );

        const quarters = ["Q1", "Q2", "Q3", "Q4"];
        const statsByQuarter = quarters.reduce((acc, quarter, index) => {
            const quarterData = filtered.filter((prestation) => {
                const month = new Date(prestation.date).getMonth() + 1;
                return month > index * 3 && month <= (index + 1) * 3;
            });
            acc[quarter] = {
                clients: [...new Set(quarterData.map((p) => p.clientName))].length,
                prestations: quarterData.length,
                ca: quarterData.reduce((sum, p) => sum + Number(p.price) || 0, 0),
            };
            return acc;
        }, {});

        setStats(statsByQuarter);
    };

    const processClients = (data) => {
        const filtered = data.filter(
            (prestation) =>
                prestation.prestationType?.toLowerCase().trim() === "préparation mentale" &&
                new Date(prestation.date).getFullYear() === parseInt(selectedYear)
        );

        const clientsData = filtered.reduce((acc, prestation) => {
            const clientName = prestation.clientName;
            if (!clientName) return acc;

            const client = acc[clientName] || { clientName, totalCA: 0 };
            client.totalCA += Number(prestation.price) || 0;
            acc[clientName] = client;
            return acc;
        }, {});

        setClients(Object.values(clientsData));
    };

    const chartData = useMemo(() => ({
        labels: Object.keys(stats || {}),
        datasets: [
            {
                label: "Nombre de clients",
                data: stats ? Object.values(stats).map((s) => s.clients) : [],
                backgroundColor: "rgba(75,192,192,0.4)",
            },
            {
                label: "Nombre de prestations",
                data: stats ? Object.values(stats).map((s) => s.prestations) : [],
                backgroundColor: "rgba(153,102,255,0.4)",
            },
            {
                label: "Chiffre d'affaires (€)",
                data: stats ? Object.values(stats).map((s) => s.ca) : [],
                backgroundColor: "rgba(255,159,64,0.4)",
            },
        ],
    }), [stats]);

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight="bold">
                Préparation Mentale - Statistiques
            </Typography>

            {/* Sélection de l'année */}
            <Card sx={{ mb: 3, p: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Sélectionner une année
                    </Typography>
                    <TextField
                        select
                        label="Année"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        fullWidth
                    >
                        {[2021, 2022, 2023, 2024].map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </TextField>
                </CardContent>
            </Card>

            {loading ? (
                <CircularProgress sx={{ display: "block", mx: "auto" }} />
            ) : stats ? (
                <Card sx={{ boxShadow: 3, mb: 3 }}>
                    <CardContent>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: "top",
                                    },
                                    title: {
                                        display: true,
                                        text: `Statistiques pour ${selectedYear}`,
                                    },
                                },
                            }}
                        />
                    </CardContent>
                </Card>
            ) : (
                <Typography textAlign="center" sx={{ mt: 3, fontStyle: "italic", color: "gray" }}>
                    Aucune donnée disponible pour cette année.
                </Typography>
            )}

            <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
                Liste des Clients
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nom du client</strong></TableCell>
                            <TableCell><strong>CA Total (€)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.length > 0 ? (
                            clients.map((client, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        cursor: "pointer",
                                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)" },
                                    }}
                                    onClick={() => navigate(`/client/${client.clientName}`)}
                                >
                                    <TableCell>{client.clientName}</TableCell>
                                    <TableCell>{client.totalCA.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} textAlign="center">
                                    Aucun client trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MentalPreparation;
