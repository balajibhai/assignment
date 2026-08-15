import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

interface TimezoneOption {
  value: string;
  label: string;
}

function timezoneLabel(timezone: string): string {
  const isUtc =
    timezone === "Etc/UTC" ||
    timezone === "Etc/GMT" ||
    timezone === "UTC" ||
    timezone === "GMT";
  if (isUtc) return "Coordinated Universal Time (UTC)";

  const name = (kind: "longGeneric" | "shortGeneric") =>
    new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: kind })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")?.value;

  const long = name("longGeneric");
  const short = name("shortGeneric");
  const isAbbreviation = (s: string) => /^[A-Z]{2,5}$/.test(s);
  if (long && long !== timezone) {
    return short && isAbbreviation(short) && short !== long
      ? `${long} (${short})`
      : long;
  }
  return timezone;
}

const timezones: TimezoneOption[] = (() => {
  const preferredZones = [
    "Etc/UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Anchorage",
    "Pacific/Honolulu",
    "Europe/London",
    "Europe/Paris",
    "Europe/Athens",
    "America/Mexico_City",
    "America/Sao_Paulo",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Shanghai",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Pacific/Auckland",
  ];
  const allTimezones = Intl.supportedValuesOf("timeZone");
  const preferred = preferredZones.filter((zone) =>
    allTimezones.includes(zone),
  );
  const rest = allTimezones.filter((zone) => !preferred.includes(zone));

  return [...preferred, ...rest]
    .map((timezone) => ({ value: timezone, label: timezoneLabel(timezone) }))
    .filter(
      (option, index, options) =>
        options.findIndex((o) => o.label === option.label) === index,
    )
    .sort((a, b) => a.label.localeCompare(b.label));
})();

interface TimezoneSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

function TimezoneSelect({
  value,
  onChange,
  label = "Timezone",
}: TimezoneSelectProps) {
  return (
    <TextField
      select
      fullWidth
      size="small"
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {timezones.map(({ value, label }) => (
        <MenuItem key={value} value={value} title={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default TimezoneSelect;
