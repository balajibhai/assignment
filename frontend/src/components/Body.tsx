import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CreateEvent from "./CreateEvent";
import Events from "./Events";

function Body() {
  return (
    <Box sx={{ display: "flex", gap: 3, px: 3, py: 3, textAlign: "left" }}>
      <Card sx={{ flex: 1, p: 3 }}>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Create event
        </Typography>
        <CreateEvent />
      </Card>
      <Card sx={{ flex: 1, p: 3 }}>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Events
        </Typography>
        <Events />
      </Card>
    </Box>
  );
}

export default Body;
