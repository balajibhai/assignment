import { useState } from "react";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { addEvent } from "../features/events/eventSlice";
import type { AppDispatch } from "../store";
import EventForm from "./EventForm";
import { toUtc } from "../time";
import {
  emptyEventValues,
  isEventFormComplete,
  type EventFormValues,
} from "./eventFormValues";

function CreateEvent() {
  const dispatch = useDispatch<AppDispatch>();
  const [values, setValues] = useState<EventFormValues>(() => ({
    ...emptyEventValues,
  }));

  const canSubmit = isEventFormComplete(values);

  const handleCreateEvent = () => {
    if (!canSubmit) return;
    const utcValues: EventFormValues = {
      ...values,
      ...toUtc(values.startDate, values.startTime, values.timezone),
      ...toUtc(values.endDate, values.endTime, values.timezone),
    };
    dispatch(addEvent(utcValues));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <EventForm values={values} onChange={setValues} />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        onClick={handleCreateEvent}
        disabled={!canSubmit}
      >
        + Create Event
      </Button>
    </Box>
  );
}

export default CreateEvent;
