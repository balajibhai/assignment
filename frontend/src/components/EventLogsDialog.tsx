import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { fetchEventLogs, selectEventLogs } from "../features/events/eventSlice";
import type { Event, ModifiedKey } from "../features/events/eventSlice";
import { selectTimezone } from "../features/ui/uiSlice";
import type { AppDispatch } from "../store";
import { formatIsoInTimezone } from "../time";

interface EventLogsDialogProps {
  event: Event;
  onClose: () => void;
}

function describeChange(modifiedKey: ModifiedKey): string {
  switch (modifiedKey.key) {
    case "start":
      return "Start date/time updated";
    case "end":
      return "End date/time updated";
    case "profiles":
      return `Profiles changed to: ${(modifiedKey.new as string[]).join(", ")}`;
    default:
      return `${modifiedKey.key} changed`;
  }
}

function EventLogsDialog({ event, onClose }: EventLogsDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const logs = useSelector(selectEventLogs);
  const timezone = useSelector(selectTimezone);
  const fetchedEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (fetchedEventIdRef.current === event.id) return;
    fetchedEventIdRef.current = event.id;
    dispatch(fetchEventLogs(event.id));
  }, [dispatch, event.id]);

  const eventLogs = logs
    .filter((log) => log.entityId === event.id)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>Event Update History</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 2 }}>
        {eventLogs.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No update history for this event
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {eventLogs.map((log) => (
              <Card key={log._id} sx={{ p: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <ScheduleIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {formatIsoInTimezone(
                      log.timestamp,
                      timezone,
                      "MMM D, YYYY [at] hh:mm A",
                    )}
                  </Typography>
                </Box>
                {log.modifiedKeys.map((modifiedKey) => (
                  <Typography
                    key={modifiedKey.key}
                    variant="body2"
                    color="text.secondary"
                  >
                    {describeChange(modifiedKey)}
                  </Typography>
                ))}
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EventLogsDialog;
