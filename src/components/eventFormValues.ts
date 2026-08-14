import type { Profile } from "../features/profiles/profileSlice";

export interface EventFormValues {
  profiles: Profile[];
  timezone: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export const emptyEventValues: EventFormValues = {
  profiles: [],
  timezone: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
};
