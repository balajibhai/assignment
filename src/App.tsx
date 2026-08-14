import "./App.css";
import Box from "@mui/material/Box";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { theme } from "./theme";
import store from "./store";
import Header from "./components/Header";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <Header />
          </Box>
        </ThemeProvider>
      </div>
    </Provider>
  );
}

export default App;
