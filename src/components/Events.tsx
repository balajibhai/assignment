import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { selectEvents } from "../features/events/eventSlice";
import { selectCurrentProfile } from "../features/profiles/profileSlice";
import EventItem from "./EventItem";

function Events() {
  const events = useSelector(selectEvents);
  const currentProfile = useSelector(selectCurrentProfile);

  if (!currentProfile) {
    return (
      <Typography variant="body2" color="text.secondary">
        Select a profile to view its events
      </Typography>
    );
  }

  const profileEvents = events.filter((event) =>
    event.profiles.some((profile) => profile.id === currentProfile.id),
  );

  if (profileEvents.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No events found for this profile
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {profileEvents.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </Box>
  );
}

export default Events;
