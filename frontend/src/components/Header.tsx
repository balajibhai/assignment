import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ProfilePicker from "./ProfilePicker";

function Header() {
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
    </Box>
  );
}

export default Header;
