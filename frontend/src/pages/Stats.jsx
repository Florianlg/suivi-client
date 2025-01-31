import { useEffect, useState, useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import {
    Box,
    Typography,
    CircularProgress,
    MenuItem,
    TextField,
    FormControl,
    Select,
    InputLabel,
    Grid,
    Card,
    CardContent,
    Button,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "/api";

const API_BASE_URL = "/api";

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Stats = () => {
    const [chartData, setChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prestations, setPrestations] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [pieChartYear, setPieChartYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/prestations`, {
                    withCredentials: true,
                });
                setPrestations(res.data);
                setSelectedYears(getAvailableYears(res.data));
            } catch (error) {
                console.error("Erreur lors de la récupération des prestations :", error);
                setError("Impossible de charger les données.");
            } finally {
                setLoading(false);
            }
        };
        if (!prestations.length) fetchData();
    }, [prestations]);

    const getAvailableYears = (data) => [...new Set(data.map((p) => new Date(p.date).getFullYear()))].sort();

    useEffect(() => {
        if (prestations.length > 0) {
            processBarChartData(prestations);
            processPieChartData(prestations, pieChartYear);
        }
    }, [selectedYears, pieChartYear, prestations]);

    const processBarChartData = (data) => {
        const filteredData = data.filter((p) => selectedYears.includes(new Date(p.date).getFullYear()));

        const groupedData = filteredData.reduce((acc, prestation) => {
            const year = new Date(prestation.date).getFullYear();
            const quarter = Math.ceil((new Date(prestation.date).getMonth() + 1) / 3);
            acc[year] = acc[year] || { Q1: 0, Q2: 0, Q3: 0, Q4: 0, total: 0 };
            acc[year][`Q${quarter}`] += prestation.price;
            acc[year].total += prestation.price;
            return acc;
        }, {});

        setChartData({
            labels: Object.keys(groupedData),
            datasets: [
                { label: "Q1", data: Object.values(groupedData).map((y) => y.Q1 || 0), backgroundColor: "#4BC0C0" },
                { label: "Q2", data: Object.values(groupedData).map((y) => y.Q2 || 0), backgroundColor: "#FFCE56" },
                { label: "Q3", data: Object.values(groupedData).map((y) => y.Q3 || 0), backgroundColor: "#FF6384" },
                { label: "Q4", data: Object.values(groupedData).map((y) => y.Q4 || 0), backgroundColor: "#36A2EB" },
                { label: "Total", data: Object.values(groupedData).map((y) => y.total || 0), backgroundColor: "#7D3C98" },
            ],
        });
    };

    const processPieChartData = (data, year) => {
        const filteredData = data.filter((p) => new Date(p.date).getFullYear() === year);
        const prestationTypes = ["Site internet", "Formation", "Préparation mentale", "Autres"];
        const counts = prestationTypes.map((type) => filteredData.filter((p) => p.prestationType === type).length);

        setPieChartData({
            labels: prestationTypes,
            datasets: [{ data: counts, backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"] }],
        });
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => navigate(-1)}
            >
                ← Retour
            </Button>

            <Typography variant="h4" component="h1" gutterBottom textAlign="center" fontWeight="bold">
                Statistiques des Prestations
            </Typography>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {loading ? (
                <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
            ) : (
                <Grid container spacing={4}>
                    {/* Graphique en barres */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Revenus par trimestre
                                </Typography>
                                {chartData ? (
                                    <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
                                ) : (
                                    <Typography>Aucune donnée disponible.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Sélecteur d'année et Graphique en camembert */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                            <CardContent>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="pie-chart-year-select-label">Année</InputLabel>
                                    <Select
                                        labelId="pie-chart-year-select-label"
                                        value={pieChartYear}
                                        onChange={(e) => setPieChartYear(e.target.value)}
                                    >
                                        {getAvailableYears(prestations).map((year) => (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {pieChartData ? (
                                    <Pie data={pieChartData} options={{ plugins: { legend: { position: "bottom" } } }} />
                                ) : (
                                    <Typography>Aucune donnée disponible pour l'année sélectionnée.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default Stats;
