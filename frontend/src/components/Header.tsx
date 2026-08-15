import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ProfilePicker from "./ProfilePicker";
import { logout } from "../features/auth/authSlice";
import type { AppDispatch } from "../store";

function Header() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, py: 2, textAlign: "left" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div">
          Event Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create and manage events across multiple timezones
        </Typography>
      </Box>

      <ProfilePicker />
      <Button variant="outlined" color="inherit" onClick={() => dispatch(logout())}>
        Log out
      </Button>
    </Box>
  );
}

export default Header;
