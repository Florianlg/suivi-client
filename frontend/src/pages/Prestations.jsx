import { useEffect, useState } from "react";
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
    MenuItem,
    TextField,
} from "@mui/material";
import axios from "axios";

const Prestations = () => {
    const [prestations, setPrestations] = useState([]);
    const [filteredPrestations, setFilteredPrestations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [yearFilter, setYearFilter] = useState("");
    const [quarterFilter, setQuarterFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    // Récupérer les prestations depuis l'API
    useEffect(() => {
        const fetchPrestations = async () => {
            try {
                const res = await axios.get("http://localhost:4000/prestations");
                setPrestations(res.data);
                setFilteredPrestations(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des prestations :", error);
                setLoading(false);
            }
        };

        fetchPrestations();
    }, []);

    // Appliquer les filtres
    useEffect(() => {
        let filtered = prestations;

        // Filtrer par année
        if (yearFilter) {
            filtered = filtered.filter(
                (prestation) => new Date(prestation.date).getFullYear() === parseInt(yearFilter)
            );
        }

        // Filtrer par trimestre
        if (quarterFilter) {
            filtered = filtered.filter((prestation) => {
                const month = new Date(prestation.date).getMonth() + 1; // Mois (1-12)
                const quarter = Math.ceil(month / 3); // Trimestre (1-4)
                return quarter === parseInt(quarterFilter);
            });
        }

        // Filtrer par mois
        if (monthFilter) {
            filtered = filtered.filter(
                (prestation) => new Date(prestation.date).getMonth() + 1 === parseInt(monthFilter)
            );
        }

        setFilteredPrestations(filtered);
    }, [yearFilter, quarterFilter, monthFilter, prestations]);

    // Générer les années disponibles à partir des prestations
    const getAvailableYears = () =>
        [...new Set(prestations.map((p) => new Date(p.date).getFullYear()))].sort();

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Liste des Prestations
            </Typography>

            {/* Filtres */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    select
                    label="Année"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">Toutes les années</MenuItem>
                    {getAvailableYears().map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Trimestre"
                    value={quarterFilter}
                    onChange={(e) => setQuarterFilter(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">Tous les trimestres</MenuItem>
                    {[1, 2, 3, 4].map((quarter) => (
                        <MenuItem key={quarter} value={quarter}>
                            Trimestre {quarter}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Mois"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="">Tous les mois</MenuItem>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <MenuItem key={month} value={month}>
                            {new Date(2000, month - 1).toLocaleString("default", { month: "long" })}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Tableau des prestations */}
            {loading ? (
                <CircularProgress />
            ) : filteredPrestations.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Client</strong></TableCell>
                                <TableCell><strong>Type</strong></TableCell>
                                <TableCell><strong>Prix (€)</strong></TableCell>
                                <TableCell><strong>Prestataire</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPrestations.map((prestation) => (
                                <TableRow key={prestation.id}>
                                    <TableCell>{new Date(prestation.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{prestation.clientName}</TableCell>
                                    <TableCell>{prestation.prestationType}</TableCell>
                                    <TableCell>{prestation.price}</TableCell>
                                    <TableCell>{prestation.provider}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1">Aucune prestation trouvée.</Typography>
            )}
        </Box>
    );
};

export default Prestations;
