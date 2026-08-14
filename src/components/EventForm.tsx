import dayjs from "dayjs";
import Box from "@mui/material/Box";
import DateTimeField from "./DateTimeField";
import ProfileSelect from "./ProfileSelect";
import TimezoneSelect from "./TimezoneSelect";
import type { EventFormValues } from "./eventFormValues";

interface EventFormProps {
  values: EventFormValues;
  onChange: (values: EventFormValues) => void;
}

function EventForm({ values, onChange }: EventFormProps) {
  const isEndValid = (date: string, time: string) => {
    if (!values.startDate || !values.startTime) return true;
    return dayjs(`${date}T${time}`).isAfter(
      dayjs(`${values.startDate}T${values.startTime}`),
    );
  };

  const applyStartChange = (next: EventFormValues): EventFormValues => {
    if (!next.startDate || !next.startTime) return next;
    const end =
      next.endDate && next.endTime
        ? dayjs(`${next.endDate}T${next.endTime}`)
        : null;
    if (end && !end.isAfter(dayjs(`${next.startDate}T${next.startTime}`))) {
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
    if (!isEndValid(value, values.endTime)) return;
    onChange({ ...values, endDate: value });
  };

  const handleEndTimeChange = (value: string) => {
    if (!isEndValid(values.endDate, value)) return;
    onChange({ ...values, endTime: value });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ProfileSelect
        value={values.profiles}
        onChange={(profiles) => onChange({ ...values, profiles })}
      />
      <TimezoneSelect
        value={values.timezone}
        onChange={(timezone) => onChange({ ...values, timezone })}
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
