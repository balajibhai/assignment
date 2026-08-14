import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const timezones = Intl.supportedValuesOf("timeZone");

interface TimezoneSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

function TimezoneSelect({ value, onChange, label = "Timezone" }: TimezoneSelectProps) {
  return (
    <TextField
      select
      fullWidth
      size="small"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {timezones.map((timezone) => (
        <MenuItem key={timezone} value={timezone}>
          {timezone}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default TimezoneSelect;
