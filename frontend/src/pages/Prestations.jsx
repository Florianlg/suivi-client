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
    MenuItem,
    TextField,
} from "@mui/material";

const API_BASE_URL = "/api";

const Prestations = () => {
    const [prestations, setPrestations] = useState([]);
    const [filteredPrestations, setFilteredPrestations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [yearFilter, setYearFilter] = useState("");
    const [quarterFilter, setQuarterFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    useEffect(() => {
        const fetchPrestations = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/prestations`, {
                    withCredentials: true,
                });
                setPrestations(res.data);
                setFilteredPrestations(res.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des prestations :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrestations();
    }, []);

    useEffect(() => {
        let filtered = prestations;
        if (yearFilter) {
            filtered = filtered.filter(
                (prestation) => new Date(prestation.date).getFullYear() === parseInt(yearFilter)
            );
        }
        if (quarterFilter) {
            filtered = filtered.filter((prestation) => {
                const month = new Date(prestation.date).getMonth() + 1;
                return Math.ceil(month / 3) === parseInt(quarterFilter);
            });
        }
        if (monthFilter) {
            filtered = filtered.filter(
                (prestation) => new Date(prestation.date).getMonth() + 1 === parseInt(monthFilter)
            );
        }
        setFilteredPrestations(filtered);
    }, [yearFilter, quarterFilter, monthFilter, prestations]);

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
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
                    {[...new Set(prestations.map((p) => new Date(p.date).getFullYear()))].sort().map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
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
                    {[1, 2, 3, 4].map((q) => (
                        <MenuItem key={q} value={q}>Trimestre {q}</MenuItem>
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
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <MenuItem key={m} value={m}>{new Date(2000, m - 1).toLocaleString("default", { month: "long" })}</MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Tableau des prestations */}
            {loading ? (
                <CircularProgress sx={{ display: "block", mx: "auto" }} />
            ) : filteredPrestations.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#ececec" }}>
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
                <Typography>Aucune prestation trouvée.</Typography>
            )}
        </Box>
    );
};

export default Prestations;
