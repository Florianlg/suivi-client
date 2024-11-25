import React, { useEffect, useState } from "react";
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
import axios from "axios";

// Utilitaire pour obtenir le nom d’un mois
const getMonthName = (month) => {
    const date = new Date(2000, month - 1); // Crée une date fictive
    return date.toLocaleString("fr-FR", { month: "long" });
};

// Utilitaire pour incrémenter un mois
const getNextMonthKey = (year, month) => {
    const nextMonth = month + 1;
    if (nextMonth > 12) {
        return `${year + 1}-1`; // Passer à janvier de l'année suivante
    }
    return `${year}-${nextMonth}`;
};

const Objectifs = () => {
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchPrestations = async () => {
            try {
                const res = await axios.get("http://localhost:4000/prestations");
                processMonthlyData(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des prestations :", error);
                setLoading(false);
            }
        };

        fetchPrestations();
    }, []);

    const processMonthlyData = (data) => {
        const targetCA = 2500; // Objectif mensuel par personne
        const groupedData = {};

        // Grouper les prestations par mois
        data
            .filter((prestation) => !prestation.excludeFromObjectives) // Exclure les prestations avec excludeFromObjectives
            .forEach((prestation) => {
                const date = new Date(prestation.date);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const key = `${year}-${month}`;

                if (!groupedData[key]) {
                    groupedData[key] = { Florian: 0, Mélanie: 0 };
                }

                // Répartir le montant selon le prestataire
                if (prestation.provider === "Florian") {
                    groupedData[key].Florian += prestation.price;
                } else if (prestation.provider === "Mélanie") {
                    groupedData[key].Mélanie += prestation.price;
                } else if (prestation.provider === "les deux") {
                    const halfAmount = prestation.price / 2;
                    groupedData[key].Florian += halfAmount;
                    groupedData[key].Mélanie += halfAmount;
                }
            });

        // Propager les excédents mois par mois
        const sortedKeys = Object.keys(groupedData).sort((a, b) => {
            const [yearA, monthA] = a.split("-").map(Number);
            const [yearB, monthB] = b.split("-").map(Number);
            return yearA === yearB ? monthA - monthB : yearA - yearB;
        });

        let allKeys = [...sortedKeys];

        // Boucle pour gérer les excédents
        for (let i = 0; i < allKeys.length; i++) {
            let currentKey = allKeys[i];
            let { Florian, Mélanie } = groupedData[currentKey];

            while (Florian > targetCA || Mélanie > targetCA) {
                const [year, month] = currentKey.split("-").map(Number);
                const nextKey = getNextMonthKey(year, month);

                if (!groupedData[nextKey]) {
                    groupedData[nextKey] = { Florian: 0, Mélanie: 0 };
                    allKeys.push(nextKey);
                }

                if (Florian > targetCA) {
                    const excessFlorian = Florian - targetCA;
                    groupedData[nextKey].Florian += excessFlorian;
                    Florian = targetCA;
                }

                if (Mélanie > targetCA) {
                    const excessMelanie = Mélanie - targetCA;
                    groupedData[nextKey].Mélanie += excessMelanie;
                    Mélanie = targetCA;
                }

                groupedData[currentKey].Florian = Florian;
                groupedData[currentKey].Mélanie = Mélanie;
                currentKey = nextKey;
            }
        }

        // Convertir en tableau pour affichage
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));

        const monthlyDataArray = Object.keys(groupedData)
            .sort((a, b) => {
                const [yearA, monthA] = a.split("-").map(Number);
                const [yearB, monthB] = b.split("-").map(Number);
                return yearA === yearB ? monthA - monthB : yearA - yearB;
            })
            .map((key) => {
                const [year, month] = key.split("-");
                const { Florian, Mélanie } = groupedData[key];
                const validatedFlorian = Florian >= targetCA;
                const validatedMelanie = Mélanie >= targetCA;

                return {
                    year,
                    month,
                    monthName: `${getMonthName(month)} ${year}`,
                    Florian,
                    Mélanie,
                    validatedFlorian,
                    validatedMelanie,
                    date: new Date(year, month - 1), // Ajout pour comparaison
                };
            })
            .filter(({ date }) => {
                // Filtrer les mois entamés et les 3 derniers mois
                return date >= threeMonthsAgo || (date.getFullYear() === currentYear && date.getMonth() + 1 >= currentMonth);
            });

        setMonthlyData(monthlyDataArray);
    };


    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Objectifs Mensuels
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : monthlyData.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Mois</strong></TableCell>
                                <TableCell><strong>Florian (€)</strong></TableCell>
                                <TableCell><strong>Mélanie (€)</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monthlyData.map(({ monthName, Florian, Mélanie, validatedFlorian, validatedMelanie }) => (
                                <TableRow key={monthName}>
                                    <TableCell>{monthName}</TableCell>
                                    <TableCell
                                        sx={{
                                            bgcolor: validatedFlorian ? "rgba(0, 128, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
                                        }}
                                    >
                                        {Florian.toFixed(2)}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            bgcolor: validatedMelanie ? "rgba(0, 128, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
                                        }}
                                    >
                                        {Mélanie.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1">Aucune donnée disponible.</Typography>
            )}
        </Box>
    );
};

export default Objectifs;
