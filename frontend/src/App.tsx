import "./App.css";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { theme } from "./theme";
import store, { type AppDispatch } from "./store";
import { fetchEvents } from "./features/events/eventSlice";
import { fetchProfiles } from "./features/profiles/profileSlice";
import { logout, selectIsAuthenticated } from "./features/auth/authSlice";
import { AUTH_UNAUTHORIZED_EVENT } from "./api";
import Header from "./components/Header";
import Body from "./components/Body";
import Login from "./components/Login";

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const didFetch = useRef(false);

  useEffect(() => {
    const handleUnauthorized = () => dispatch(logout());
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || didFetch.current) return;
    didFetch.current = true;
    dispatch(fetchProfiles());
    dispatch(fetchEvents());
  }, [isAuthenticated, dispatch]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthenticated ? (
          <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <Header />
            <Body />
          </Box>
        ) : (
          <Login />
        )}
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
