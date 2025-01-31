import { AppBar, Toolbar, Button, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import theme from "../theme/theme";

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{ width: 240, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" } }}
            >
                <Box sx={{ p: 2, fontWeight: "bold", fontSize: "1.2rem", color: theme.colors.primary }}>
                    Suivi Client
                </Box>
                <List>
                    {[
                        { label: "Ajouter une prestation", to: "/" },
                        { label: "Voir les prestations", to: "/prestations" },
                        { label: "Statistiques", to: "/stats" },
                        { label: "Objectifs", to: "/objectifs" },
                        { label: "Préparation mentale", to: "/mental-preparation" },
                    ].map((item, index) => (
                        <ListItem button key={index} component={Link} to={item.to}>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <AppBar position="static" sx={{ bgcolor: theme.colors.secondary }}>
                    <Toolbar>
                        <Box sx={{ flexGrow: 1 }}>Tableau de Bord</Box>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
            </Box>
        </Box>
    );
};

export default Layout;