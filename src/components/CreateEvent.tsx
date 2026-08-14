import { useState } from "react";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { addEvent } from "../features/events/eventSlice";
import type { Profile } from "../features/profiles/profileSlice";
import type { AppDispatch } from "../store";
import DateTimeField from "./DateTimeField";
import ProfileSelect from "./ProfileSelect";
import TimezoneSelect from "./TimezoneSelect";

function CreateEvent() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [timezone, setTimezone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const isEndValid = (date: string, time: string) => {
    if (!startDate || !startTime) return true;
    const start = dayjs(`${startDate}T${startTime}`);
    return dayjs(`${date}T${time}`).isAfter(start);
  };

  const handleEndDateChange = (value: string) => {
    if (!isEndValid(value, endTime)) return;
    setEndDate(value);
  };

  const handleEndTimeChange = (value: string) => {
    if (!isEndValid(endDate, value)) return;
    setEndTime(value);
  };

  const handleCreateEvent = () => {
    dispatch(
      addEvent({
        profiles: selectedProfiles,
        timezone,
        startDate,
        startTime,
        endDate,
        endTime,
      }),
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ProfileSelect value={selectedProfiles} onChange={setSelectedProfiles} />
      <TimezoneSelect value={timezone} onChange={setTimezone} />
      <DateTimeField
        label="Start Date & Time"
        date={startDate}
        time={startTime}
        onDateChange={setStartDate}
        onTimeChange={setStartTime}
      />
      <DateTimeField
        label="End Date & Time"
        date={endDate}
        time={endTime}
        onDateChange={handleEndDateChange}
        onTimeChange={handleEndTimeChange}
        minDate={startDate || undefined}
        minTime={endDate === startDate ? startTime || undefined : undefined}
      />
      <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={handleCreateEvent}>
        + Create Event
      </Button>
    </Box>
  );
}

export default CreateEvent;
