import { createTheme } from "@mui/material/styles";
import typography from "./typography";
import colors from "./colors";

const theme = createTheme({
  typography, // Charge la typographie
  palette: colors.palette, // ✅ Utilise bien la structure attendue par MUI
  shape: {
    borderRadius: 8,
  },
  shadows: ["none", "0px 2px 10px rgba(0, 0, 0, 0.1)"],
});

export default theme;
