import { useEffect, useState } from "react";
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
} from "@mui/material";
import axios from "axios";

const API_BASE_URL = "/api";

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Stats = () => {
    const [chartData, setChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prestations, setPrestations] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [pieChartYear, setPieChartYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/prestations`, {
                    withCredentials: true,
                });
                setPrestations(res.data);
                setSelectedYears(getAvailableYears(res.data));
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                { label: "Q1", data: Object.values(groupedData).map((y) => y.Q1), backgroundColor: "rgba(75, 192, 192, 0.4)" },
                { label: "Q2", data: Object.values(groupedData).map((y) => y.Q2), backgroundColor: "rgba(153, 102, 255, 0.4)" },
                { label: "Q3", data: Object.values(groupedData).map((y) => y.Q3), backgroundColor: "rgba(255, 159, 64, 0.4)" },
                { label: "Q4", data: Object.values(groupedData).map((y) => y.Q4), backgroundColor: "rgba(255, 99, 132, 0.4)" },
                { label: "Total", data: Object.values(groupedData).map((y) => y.total), backgroundColor: "rgba(54, 162, 235, 0.4)" },
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
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Statistiques des Prestations
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : chartData ? (
                <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
            ) : (
                <Typography>Aucune donnée disponible.</Typography>
            )}

            <FormControl sx={{ my: 3, minWidth: 200 }}>
                <InputLabel id="pie-chart-year-select-label">Année</InputLabel>
                <Select
                    labelId="pie-chart-year-select-label"
                    value={pieChartYear}
                    onChange={(e) => setPieChartYear(e.target.value)}
                >
                    {getAvailableYears(prestations).map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {pieChartData ? (
                <Pie data={pieChartData} options={{ plugins: { legend: { position: "bottom" } } }} />
            ) : (
                <Typography>Aucune donnée disponible pour l'année sélectionnée.</Typography>
            )}
        </Box>
    );
};
export default Stats;
