import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import theme from "../theme/theme";

const ClientTable = ({ clients }) => {
    return (
        <TableContainer component={Paper} sx={{ boxShadow: theme.shadow, borderRadius: theme.borderRadius }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: theme.colors.primary }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nom</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Téléphone</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Statut</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clients.length > 0 ? (
                        clients.map((client, index) => (
                            <TableRow key={index}>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell>{client.status}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} sx={{ textAlign: "center", py: 2 }}>
                                <Typography variant="body1">Aucun client trouvé</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ClientTable;