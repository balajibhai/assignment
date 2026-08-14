import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ProfileDropdown from "./ProfileDropdown";

function Header() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, py: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div">
          Event Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create and manage events across multiple timezones
        </Typography>
      </Box>

      <ProfileDropdown />
    </Box>
  );
}

export default Header;
