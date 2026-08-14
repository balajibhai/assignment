import "./App.css";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { theme } from "./theme";
import store, { type AppDispatch } from "./store";
import { fetchEvents } from "./features/events/eventSlice";
import { fetchProfiles } from "./features/profiles/profileSlice";
import Header from "./components/Header";
import Body from "./components/Body";

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    dispatch(fetchProfiles());
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
          <Header />
          <Body />
        </Box>
      </ThemeProvider>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
