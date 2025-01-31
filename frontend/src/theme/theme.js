import { createTheme } from "@mui/material/styles";
import typography from "./typography";
import colors from "./colors";

const theme = createTheme({
  typography, // Intègre la typographie
  palette: colors, // Intègre la palette de couleurs
  borderRadius: "8px",
  shadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
  font: {
    main: "Inter, Roboto, sans-serif",
    size: {
      small: "14px",
      medium: "16px",
      large: "20px",
    },
  },
});

export default theme;
