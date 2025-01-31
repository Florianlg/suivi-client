import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import theme from "../theme/theme";

const StatCard = ({ title, value, icon }) => {
    return (
        <Card sx={{ width: 250, p: 2, boxShadow: theme.shadow, borderRadius: theme.borderRadius }}>
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {icon}
                    <Box>
                        <Typography variant="h6" sx={{ color: theme.colors.primary, fontWeight: "bold" }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>{value}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatCard;
