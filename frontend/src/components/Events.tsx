import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { selectEvents } from "../features/events/eventSlice";
import { selectCurrentProfile } from "../features/profiles/profileSlice";
import { selectTimezone, setTimezone } from "../features/ui/uiSlice";
import type { AppDispatch } from "../store";
import EventItem from "./EventItem";
import TimezoneSelect from "./TimezoneSelect";

function Events() {
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector(selectEvents);
  const currentProfile = useSelector(selectCurrentProfile);
  const timezone = useSelector(selectTimezone);

  const profileEvents = currentProfile
    ? events.filter((event) =>
        event.profiles.some((profile) => profile.id === currentProfile.id),
      )
    : [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TimezoneSelect
        value={timezone}
        onChange={(value) => dispatch(setTimezone(value))}
      />
      {!currentProfile ? (
        <Typography variant="body2" color="text.secondary">
          Select a profile to view its events
        </Typography>
      ) : profileEvents.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No events found for this profile
        </Typography>
      ) : (
        profileEvents.map((event) => <EventItem key={event.id} event={event} />)
      )}
    </Box>
  );
}

export default Events;
