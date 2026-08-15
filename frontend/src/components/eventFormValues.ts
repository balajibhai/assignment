import type { Profile } from "../features/profiles/profileSlice";

export interface EventFormValues {
  profiles: Profile[];
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export const emptyEventValues: EventFormValues = {
  profiles: [],
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
};

export const isEventFormComplete = (values: EventFormValues): boolean =>
  values.profiles.length > 0 &&
  Boolean(
    values.startDate && values.startTime && values.endDate && values.endTime,
  );
