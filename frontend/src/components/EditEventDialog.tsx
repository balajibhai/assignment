import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { updateEvent } from "../features/events/eventSlice";
import type { Event } from "../features/events/eventSlice";
import { selectTimezone } from "../features/ui/uiSlice";
import type { AppDispatch } from "../store";
import EventForm from "./EventForm";
import { fromIsoUtc, toIsoUtc } from "../time";
import { isEventFormComplete, type EventFormValues } from "./eventFormValues";

interface EditEventDialogProps {
  event: Event;
  onClose: () => void;
}

function toValues(event: Event, timezone: string): EventFormValues {
  const start = fromIsoUtc(event.start, timezone);
  const end = fromIsoUtc(event.end, timezone);
  return {
    profiles: event.profiles,
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
  };
}

function EditEventDialog({ event, onClose }: EditEventDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const timezone = useSelector(selectTimezone);
  const [values, setValues] = useState<EventFormValues>(() =>
    toValues(event, timezone),
  );

  const canSubmit = isEventFormComplete(values);

  const handleUpdate = () => {
    if (!canSubmit) return;
    dispatch(
      updateEvent({
        id: event.id,
        changes: {
          profiles: values.profiles,
          start: toIsoUtc(values.startDate, values.startTime, timezone),
          end: toIsoUtc(values.endDate, values.endTime, timezone),
        },
      }),
    );
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <EventForm values={values} onChange={setValues} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={!canSubmit}
        >
          Update Event
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditEventDialog;
