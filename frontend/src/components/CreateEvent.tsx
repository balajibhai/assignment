import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { addEvent } from "../features/events/eventSlice";
import { selectCurrentProfile } from "../features/profiles/profileSlice";
import { selectTimezone } from "../features/ui/uiSlice";
import type { AppDispatch } from "../store";
import EventForm from "./EventForm";
import { toIsoUtc } from "../time";
import {
  emptyEventValues,
  isEventFormComplete,
  type EventFormValues,
} from "./eventFormValues";

function CreateEvent() {
  const dispatch = useDispatch<AppDispatch>();
  const timezone = useSelector(selectTimezone);
  const currentProfile = useSelector(selectCurrentProfile);
  const [values, setValues] = useState<EventFormValues>(() => ({
    ...emptyEventValues,
    profiles: currentProfile ? [currentProfile] : [],
  }));

  const canSubmit = isEventFormComplete(values);

  const handleCreateEvent = () => {
    if (!canSubmit) return;
    dispatch(
      addEvent({
        profiles: values.profiles,
        start: toIsoUtc(values.startDate, values.startTime, timezone),
        end: toIsoUtc(values.endDate, values.endTime, timezone),
      }),
    );
    setValues({
      ...emptyEventValues,
      profiles: currentProfile ? [currentProfile] : [],
    });
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
