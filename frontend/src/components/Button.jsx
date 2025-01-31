import React from "react";
import { Button } from "@mui/material";
import theme from "../theme/theme";

const CustomButton = ({ label, onClick, variant = "contained", color = "primary", sx }) => {
    return (
        <Button
            onClick={onClick}
            variant={variant}
            sx={{
                bgcolor: theme.colors[color],
                color: "white",
                fontWeight: "bold",
                borderRadius: theme.borderRadius,
                textTransform: "none",
                px: 3,
                py: 1,
                boxShadow: theme.shadow,
                "&:hover": {
                    bgcolor: theme.colors[color],
                    opacity: 0.9,
                },
                ...sx,
            }}
        >
            {label}
        </Button>
    );
};

export default CustomButton;