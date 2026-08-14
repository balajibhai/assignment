import "./App.css";
import Box from "@mui/material/Box";
import { CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { theme } from "./theme";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="div">
                Event Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create and manage events across multiple timezones
              </Typography>
            </Box>
            <Box sx={{ width: 240 }}></Box>
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
