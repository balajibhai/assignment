import { useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { login, selectAuthError, selectAuthStatus } from "../features/auth/authSlice";
import type { AppDispatch } from "../store";

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loading = status === "loading";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (username.trim() && password) {
      dispatch(login({ username: username.trim(), password }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, p: 4 }}>
        <Typography variant="h5" component="div" sx={{ mb: 1 }}>
          Event Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to manage events across multiple timezones
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoFocus
              autoComplete="username"
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              fullWidth
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !username.trim() || !password}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}

export default Login;
