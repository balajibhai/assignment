import { useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import type { Event } from "../features/events/eventSlice";
import { selectTimezone } from "../features/ui/uiSlice";
import { formatIsoInTimezone, fromIsoUtc } from "../time";
import EditEventDialog from "./EditEventDialog";
import EventLogsDialog from "./EventLogsDialog";

interface EventItemProps {
  event: Event;
}

function EventItem({ event }: EventItemProps) {
  const timezone = useSelector(selectTimezone);
  const [editing, setEditing] = useState(false);
  const [viewingLogs, setViewingLogs] = useState(false);

  const startParts = fromIsoUtc(event.start, timezone);
  const endParts = fromIsoUtc(event.end, timezone);
  const start =
    startParts.date && startParts.time
      ? dayjs(`${startParts.date}T${startParts.time}`)
      : null;
  const end =
    endParts.date && endParts.time
      ? dayjs(`${endParts.date}T${endParts.time}`)
      : null;

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "action.hover",
            borderRadius: 2,
            px: 1.5,
            py: 1,
          }}
        >
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {event.profiles.map((profile) => profile.name).join(", ")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarMonthIcon fontSize="small" color="action" />
            <Typography variant="body2">
              Start: {start ? start.format("MMM D, YYYY") : "—"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ScheduleIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {start ? start.format("h:mm a") : "—"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarMonthIcon fontSize="small" color="action" />
            <Typography variant="body2">
              End: {end ? end.format("MMM D, YYYY") : "—"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ScheduleIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {end ? end.format("h:mm a") : "—"}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Typography variant="body2" color="text.secondary">
          Created:{" "}
          {formatIsoInTimezone(
            event.createdAt,
            timezone,
            "MMM D, YYYY [at] hh:mm A",
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Updated:{" "}
          {formatIsoInTimezone(
            event.updatedAt,
            timezone,
            "MMM D, YYYY [at] hh:mm A",
          )}
        </Typography>

        <Divider />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
          <Button
            size="small"
            startIcon={<ArticleIcon />}
            onClick={() => setViewingLogs(true)}
          >
            View Logs
          </Button>
        </Box>
      </Box>

      {editing && (
        <EditEventDialog event={event} onClose={() => setEditing(false)} />
      )}
      {viewingLogs && (
        <EventLogsDialog event={event} onClose={() => setViewingLogs(false)} />
      )}
    </Card>
  );
}

export default EventItem;
