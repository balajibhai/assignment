import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface DateTimeParts {
  date: string;
  time: string;
}

export const toIsoUtc = (
  date: string,
  time: string,
  timezone: string,
): string => {
  if (!date || !time || !timezone) return "";
  const instant = dayjs.tz(`${date}T${time}`, timezone);
  if (!instant.isValid()) return "";
  return instant.utc().toISOString();
};

export const fromIsoUtc = (iso: string, timezone: string): DateTimeParts => {
  if (!iso) return { date: "", time: "" };
  const instant = dayjs(iso);
  if (!instant.isValid()) return { date: "", time: "" };
  const inZone = timezone ? instant.tz(timezone) : instant.utc();
  return {
    date: inZone.format("YYYY-MM-DD"),
    time: inZone.format("HH:mm"),
  };
};

export const formatIsoInTimezone = (
  iso: string,
  timezone: string,
  format: string,
): string => {
  const instant = dayjs(iso);
  if (!instant.isValid()) return "—";
  return timezone
    ? instant.tz(timezone).format(format)
    : instant.format(format);
};
