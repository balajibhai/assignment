import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

interface DateTimeFieldProps {
  label: string;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  minDate?: string;
  minTime?: string;
}

function DateTimeField({
  label,
  date,
  time,
  onDateChange,
  onTimeChange,
  error,
  helperText,
  minDate,
  minTime,
}: DateTimeFieldProps) {
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          type="date"
          size="small"
          label="Pick a date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          error={error}
          helperText={helperText}
          sx={{
            "& input::-webkit-datetime-edit": {
              color: date ? "inherit" : "transparent",
            },
          }}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: minDate },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          type="time"
          size="small"
          value={time}
          onChange={(event) => onTimeChange(event.target.value)}
          error={error}
          slotProps={{
            htmlInput: { min: minTime },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <ClockIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default DateTimeField;
