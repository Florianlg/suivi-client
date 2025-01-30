import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
} from "@mui/material";

const API_BASE_URL = "/api";

const Objectifs = () => {
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchPrestations = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/prestations`, {
                    withCredentials: true,
                });
                processMonthlyData(res.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des prestations :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrestations();
    }, []);

    const processMonthlyData = (data) => {
        const targetCA = 2500;
        const groupedData = {};

        data
            .filter((p) => !p.excludeFromObjectives)
            .forEach((p) => {
                const date = new Date(p.date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const key = `${year}-${month}`;

                if (!groupedData[key]) {
                    groupedData[key] = { Florian: 0, Mélanie: 0 };
                }

                if (p.provider === "Florian") {
                    groupedData[key].Florian += Number(p.price) || 0;
                } else if (p.provider === "Mélanie") {
                    groupedData[key].Mélanie += Number(p.price) || 0;
                } else if (p.provider === "les deux") {
                    const halfAmount = p.price / 2;
                    groupedData[key].Florian += halfAmount;
                    groupedData[key].Mélanie += halfAmount;
                }
            });

        const sortedKeys = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
        const monthlyDataArray = sortedKeys.map((key) => {
            const [year, month] = key.split("-");
            const { Florian, Mélanie } = groupedData[key];
            return {
                year,
                month,
                Florian,
                Mélanie,
                validatedFlorian: Florian >= targetCA,
                validatedMelanie: Mélanie >= targetCA,
            };
        });

        setMonthlyData(monthlyDataArray);
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
                Objectifs Mensuels
            </Typography>
            {loading ? (
                <CircularProgress sx={{ display: "block", mx: "auto" }} />
            ) : monthlyData.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#ececec" }}>
                                <TableCell><strong>Mois</strong></TableCell>
                                <TableCell><strong>Florian (€)</strong></TableCell>
                                <TableCell><strong>Mélanie (€)</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monthlyData.map(({ year, month, Florian, Mélanie, validatedFlorian, validatedMelanie }) => (
                                <TableRow key={`${year}-${month}`}>
                                    <TableCell>{new Date(year, month - 1).toLocaleString("fr-FR", { month: "long", year: "numeric" })}</TableCell>
                                    <TableCell sx={{ bgcolor: validatedFlorian ? "rgba(0, 128, 0, 0.1)" : "rgba(255, 0, 0, 0.1)" }}>
                                        {Florian.toFixed(2)}
                                    </TableCell>
                                    <TableCell sx={{ bgcolor: validatedMelanie ? "rgba(0, 128, 0, 0.1)" : "rgba(255, 0, 0, 0.1)" }}>
                                        {Mélanie.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>Aucune donnée disponible.</Typography>
            )}
        </Box>
    );
};

export default Objectifs;