import { useEffect, useState, useMemo } from "react";
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
    Grid,
    Card,
    CardContent,
    Button,
    Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "/api";

const Prestations = () => {
    const [prestations, setPrestations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ year: "", quarter: "", month: "" });
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrestations = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/prestations`, {
                    withCredentials: true,
                });
                setPrestations(res.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des prestations :", error);
            } finally {
                setLoading(false);
            }
        };
        if (!prestations.length) fetchPrestations();
    }, [prestations]);

    // Filtrage optimisé avec useMemo
    const filteredPrestations = useMemo(() => (Array.isArray(prestations) ? prestations.filter((prestation) => {
        const date = new Date(prestation.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const quarter = Math.ceil(month / 3);

        return (
            (!filters.year || year === parseInt(filters.year)) &&
            (!filters.quarter || quarter === parseInt(filters.quarter)) &&
            (!filters.month || month === parseInt(filters.month))
        );
    }) : []), [filters, prestations]);


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

            <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
                Liste des Prestations
            </Typography>

            {/* Filtres */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    { label: "Année", key: "year", values: [...new Set(prestations.map((p) => new Date(p.date).getFullYear()))].sort() },
                    { label: "Trimestre", key: "quarter", values: [1, 2, 3, 4] },
                    { label: "Mois", key: "month", values: Array.from({ length: 12 }, (_, i) => i + 1) },
                ].map((filter) => (
                    <Grid item xs={12} sm={4} key={filter.key}>
                        <TextField
                            select
                            label={filter.label}
                            value={filters[filter.key]}
                            onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                            fullWidth
                        >
                            <MenuItem value="">Tous</MenuItem>
                            {filter.values.map((val) => (
                                <MenuItem key={val} value={val}>
                                    {filter.key === "month" ? new Date(2000, val - 1).toLocaleString("default", { month: "long" }) : val}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                ))}
            </Grid>

            {/* Tableau des prestations */}
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
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
                        <Typography textAlign="center" sx={{ py: 2, fontStyle: "italic", color: "gray" }}>
                            Aucune prestation trouvée pour les filtres sélectionnés.
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default Prestations;
