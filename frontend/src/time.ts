import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface DateTimeParts {
  date: string;
  time: string;
}

export const toUtc = (
  date: string,
  time: string,
  timezone: string,
): DateTimeParts => {
  if (!date || !time || !timezone) return { date, time };
  const instant = dayjs.tz(`${date}T${time}`, timezone);
  if (!instant.isValid()) return { date, time };
  return {
    date: instant.utc().format("YYYY-MM-DD"),
    time: instant.utc().format("HH:mm"),
  };
};

export const fromUtc = (
  date: string,
  time: string,
  timezone: string,
): DateTimeParts => {
  if (!date || !time || !timezone) return { date, time };
  const instant = dayjs.utc(`${date}T${time}`);
  if (!instant.isValid()) return { date, time };
  return {
    date: instant.tz(timezone).format("YYYY-MM-DD"),
    time: instant.tz(timezone).format("HH:mm"),
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
