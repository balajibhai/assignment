import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import DateTimeField from "./DateTimeField";
import ProfileSelect from "./ProfileSelect";
import TimezoneSelect from "./TimezoneSelect";
import { selectTimezone, setTimezone } from "../features/ui/uiSlice";
import type { AppDispatch } from "../store";
import type { EventFormValues } from "./eventFormValues";

interface EventFormProps {
  values: EventFormValues;
  onChange: (values: EventFormValues) => void;
}

function EventForm({ values, onChange }: EventFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const timezone = useSelector(selectTimezone);

  const isEndDateValid = (date: string) => {
    if (!values.startDate || !date) return true;
    return date >= values.startDate;
  };

  const isEndTimeValid = (date: string, time: string) => {
    if (!values.startDate || !values.startTime || !date || !time) return true;
    if (date > values.startDate) return true;
    return time > values.startTime;
  };

  const applyStartChange = (next: EventFormValues): EventFormValues => {
    if (!next.startDate || !next.startTime) return next;
    const endInvalid =
      Boolean(next.endDate && next.endTime) &&
      (next.endDate < next.startDate ||
        (next.endDate === next.startDate && next.endTime <= next.startTime));
    if (endInvalid) {
      return { ...next, endDate: "", endTime: "" };
    }
    return next;
  };

  const handleStartDateChange = (value: string) => {
    onChange(applyStartChange({ ...values, startDate: value }));
  };

  const handleStartTimeChange = (value: string) => {
    onChange(applyStartChange({ ...values, startTime: value }));
  };

  const handleEndDateChange = (value: string) => {
    if (!isEndDateValid(value)) return;
    if (values.endTime && !isEndTimeValid(value, values.endTime)) return;
    onChange({ ...values, endDate: value });
  };

  const handleEndTimeChange = (value: string) => {
    if (!isEndTimeValid(values.endDate, value)) return;
    onChange({ ...values, endTime: value });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ProfileSelect
        value={values.profiles}
        onChange={(profiles) => onChange({ ...values, profiles })}
      />
      <TimezoneSelect
        value={timezone}
        onChange={(value) => dispatch(setTimezone(value))}
      />
      <DateTimeField
        label="Start Date & Time"
        date={values.startDate}
        time={values.startTime}
        onDateChange={handleStartDateChange}
        onTimeChange={handleStartTimeChange}
      />
      <DateTimeField
        label="End Date & Time"
        date={values.endDate}
        time={values.endTime}
        onDateChange={handleEndDateChange}
        onTimeChange={handleEndTimeChange}
        minDate={values.startDate || undefined}
        minTime={
          values.endDate === values.startDate
            ? values.startTime || undefined
            : undefined
        }
      />
    </Box>
  );
}

export default EventForm;
