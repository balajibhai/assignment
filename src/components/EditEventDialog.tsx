import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { updateEvent } from "../features/events/eventSlice";
import type { Event } from "../features/events/eventSlice";
import type { AppDispatch } from "../store";
import EventForm from "./EventForm";
import { isEventFormComplete, type EventFormValues } from "./eventFormValues";

interface EditEventDialogProps {
  event: Event;
  onClose: () => void;
}

function toValues(event: Event): EventFormValues {
  return {
    profiles: event.profiles,
    timezone: event.timezone,
    startDate: event.startDate,
    startTime: event.startTime,
    endDate: event.endDate,
    endTime: event.endTime,
  };
}

function EditEventDialog({ event, onClose }: EditEventDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [values, setValues] = useState<EventFormValues>(() => toValues(event));

  const canSubmit = isEventFormComplete(values);

  const handleUpdate = () => {
    if (!canSubmit) return;
    dispatch(updateEvent({ id: event.id, changes: values }));
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
        <Button variant="contained" onClick={handleUpdate} disabled={!canSubmit}>
          Update Event
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditEventDialog;
