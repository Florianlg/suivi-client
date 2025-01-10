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

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Stats = () => {
    const [chartData, setChartData] = useState(null); // Données pour le graphique en barres
    const [pieChartData, setPieChartData] = useState(null); // Données pour le graphique en camembert
    const [loading, setLoading] = useState(true);
    const [prestations, setPrestations] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]); // Années sélectionnées pour le graphique
    const [selectedProviders, setSelectedProviders] = useState([]); // Prestataires sélectionnés pour le graphique
    const [pieChartYear, setPieChartYear] = useState(new Date().getFullYear()); // Année sélectionnée pour le camembert

    // Récupérer les prestations depuis l'API backend MySQL
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:4000/prestations", {
                    withCredentials: true,
                });
                setPrestations(res.data);
                setSelectedYears(getAvailableYears(res.data)); // Générer les années disponibles
                setSelectedProviders(["Florian", "Mélanie", "les deux"]); // Par défaut, tous les prestataires
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Générer les années disponibles
    const getAvailableYears = (data) =>
        [...new Set(data.map((prestation) => new Date(prestation.date).getFullYear()))].sort();

    // Ajouter l'option "les deux" dans la liste des prestataires
    const getAvailableProviders = (data) => {
        const providers = [...new Set(data.map((prestation) => prestation.provider))];
        return ["les deux", ...providers].sort();
    };

    // Filtrer les prestations selon les années et prestataires sélectionnés
    useEffect(() => {
        if (prestations.length > 0) {
            processBarChartData(prestations);
            processPieChartData(prestations, pieChartYear);
        }
    }, [selectedYears, selectedProviders, pieChartYear, prestations]);

    // Transformer les données pour le graphique en barres
    const processBarChartData = (data) => {
        const filteredData = data.filter((prestation) => {
            const year = new Date(prestation.date).getFullYear();
            const provider = prestation.provider;

            // Inclure les prestations avec "les deux" si sélectionné
            return (
                selectedYears.includes(year) &&
                (selectedProviders.includes(provider) || selectedProviders.includes("les deux"))
            );
        });

        const groupedData = filteredData.reduce((acc, prestation) => {
            const date = new Date(prestation.date);
            const year = date.getFullYear();
            const quarter = Math.ceil((date.getMonth() + 1) / 3);

            if (!acc[year]) {
                acc[year] = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, total: 0 };
            }

            acc[year][`Q${quarter}`] += prestation.price;
            acc[year].total += prestation.price;

            return acc;
        }, {});

        const labels = Object.keys(groupedData);
        const datasets = ["Q1", "Q2", "Q3", "Q4", "total"].map((key, index) => ({
            label: key === "total" ? "Année entière" : `Trimestre ${key.slice(1)}`,
            data: labels.map((year) => groupedData[year][key]),
            backgroundColor: `rgba(${index * 50}, ${index * 80}, ${index * 150}, 0.5)`,
        }));

        setChartData({ labels, datasets });
    };

    // Transformer les données pour le graphique en camembert
    const processPieChartData = (data, year) => {
        const filteredData = data.filter(
            (prestation) => new Date(prestation.date).getFullYear() === year
        );

        const prestationTypes = ["Site internet", "Formation", "Préparation mentale", "Autres"];
        const counts = prestationTypes.map((type) =>
            filteredData.filter((prestation) => prestation.prestationType === type).length
        );

        setPieChartData({
            labels: prestationTypes,
            datasets: [
                {
                    data: counts,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                    hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                },
            ],
        });
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Statistiques des Prestations
            </Typography>

            {/* Filtres pour le graphique en barres */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    select
                    label="Années à afficher"
                    value={selectedYears}
                    onChange={(e) => setSelectedYears(e.target.value)}
                    SelectProps={{ multiple: true }}
                    fullWidth
                >
                    {getAvailableYears(prestations).map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Prestataires"
                    value={selectedProviders}
                    onChange={(e) => setSelectedProviders(e.target.value)}
                    SelectProps={{ multiple: true }}
                    fullWidth
                >
                    {getAvailableProviders(prestations).map((provider) => (
                        <MenuItem key={provider} value={provider}>
                            {provider}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Graphique en barres */}
            {loading ? (
                <CircularProgress />
            ) : chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                            title: { display: true, text: "Comparatif des Chiffres d'Affaires par Années et Prestataires" },
                        },
                        scales: { y: { beginAtZero: true } },
                    }}
                />
            ) : (
                <Typography variant="body1">Aucune donnée disponible.</Typography>
            )}

            {/* Sélecteur d'année pour le graphique en camembert */}
            <FormControl sx={{ my: 3, minWidth: 200 }}>
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

            {/* Graphique en camembert */}
            {pieChartData ? (
                <Pie
                    data={pieChartData}
                    options={{
                        plugins: {
                            legend: { position: "bottom" },
                            title: { display: true, text: `Répartition des Types de Prestations pour ${pieChartYear}` },
                        },
                    }}
                />
            ) : (
                <Typography variant="body1">Aucune donnée disponible pour l'année sélectionnée.</Typography>
            )}
        </Box>
    );
};
export default Stats;