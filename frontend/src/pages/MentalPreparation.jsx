import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    CircularProgress,
    MenuItem,
    TextField,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "/api";

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
                console.error("Erreur lors de la récupération des statistiques :", error);
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
                ca: quarterData.reduce((sum, p) => sum + p.price, 0),
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
                <Bar
                    data={{
                        labels: Object.keys(stats || {}),
                        datasets: [
                            {
                                label: "Nombre de clients",
                                data: Object.values(stats).map((s) => s.clients),
                            },
                            {
                                label: "Nombre de prestations",
                                data: Object.values(stats).map((s) => s.prestations),
                            },
                            {
                                label: "Chiffre d'affaires (€)",
                                data: Object.values(stats).map((s) => s.ca),
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                            title: { display: true, text: `Statistiques pour ${selectedYear}` },
                        },
                    }}
                />
            ) : (
                <Typography>Aucune donnée disponible pour cette année.</Typography>
            )}
        </Box>
    );
};

export default MentalPreparation;
