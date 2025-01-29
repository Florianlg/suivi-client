import { useEffect, useState } from "react";
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

                console.log("📦 Données reçues de l'API :", response.data); // 🔍 Vérification des données API

                processStats(response.data);
                processClients(response.data);
                setLoading(false);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des statistiques :", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, [selectedYear]);


    const processStats = (data) => {
        const filtered = data.filter(
            (prestation) =>
                prestation.prestationtype?.toLowerCase().trim() === "préparation mentale" &&
                new Date(prestation.date).getFullYear() === parseInt(selectedYear)
        );
        filtered.forEach(prestation => {
            prestation.price = Number(prestation.price) || 0;
        });

        const quarters = ["Q1", "Q2", "Q3", "Q4"];
        const statsByQuarter = quarters.reduce((acc, quarter, index) => {
            const quarterData = filtered.filter((prestation) => {
                const month = new Date(prestation.date).getMonth() + 1;
                return month > index * 3 && month <= (index + 1) * 3;
            });
            acc[quarter] = {
                clients: [...new Set(quarterData.map((p) => p.clientName))].length,
                prestations: quarterData.length,
                ca: quarterData.reduce((sum, p) => sum + p.price, 0),
            };
            return acc;
        }, {});

        setStats(statsByQuarter);
    };

    const processClients = (data) => {
        const filtered = data.filter(
            (prestation) =>
                prestation.prestationtype?.toLowerCase().trim() === "préparation mentale" &&
                new Date(prestation.date).getFullYear() === parseInt(selectedYear)
        );

        console.log("📆 Clients filtrés pour l'année", selectedYear, ":", filtered);

        const clientsData = filtered.reduce((acc, prestation) => {
            const clientName = prestation.clientname; // Assurez-vous que la casse est correcte
            if (!clientName) return acc; // Évite les erreurs si `clientname` est manquant

            const client = acc[clientName] || { clientName, totalCA: 0 };
            client.totalCA += Number(prestation.price) || 0;
            acc[clientName] = client;
            return acc;
        }, {});

        setClients(Object.values(clientsData));
    };


    const chartData = {
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
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Préparation Mentale - Statistiques
            </Typography>
            <TextField
                select
                label="Année"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                fullWidth
                margin="normal"
            >
                {[2021, 2022, 2023, 2024].map((year) => (
                    <MenuItem key={year} value={year}>
                        {year}
                    </MenuItem>
                ))}
            </TextField>
            {loading ? (
                <CircularProgress />
            ) : stats ? (
                <Box>
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
                </Box>
            ) : (
                <Typography>Aucune donnée disponible pour cette année.</Typography>
            )}
            <Typography variant="h5" component="h2" sx={{ mt: 4 }}>
                Liste des Clients
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                                <TableRow key={index}>
                                    <TableCell>{client.clientName}</TableCell>
                                    <TableCell>{client.totalCA.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2}>Aucun client trouvé</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MentalPreparation;
