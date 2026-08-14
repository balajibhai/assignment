import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { Profile } from "../profiles/profileSlice";

export interface Event {
  id: string;
  profiles: Profile[];
  timezone: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModifiedKey {
  key: string;
  old: string | string[];
  new: string | string[];
}

export interface EventLog {
  _id: string;
  entityId: string;
  entityType: string;
  modifiedKeys: ModifiedKey[];
  timestamp: string;
}

interface EventsState {
  events: Event[];
  logs: EventLog[];
}

const initialState: EventsState = {
  events: [],
  logs: [],
};

const sameProfiles = (a: Profile[], b: Profile[]) =>
  a.length === b.length &&
  a.every((profile, index) => profile.id === b[index].id);

const dateTime = (date: string, time: string) =>
  date && time ? `${date}T${time}` : "";

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: {
      reducer(state, action: PayloadAction<Event>) {
        state.events.push(action.payload);
      },
      prepare(payload: Omit<Event, "id" | "createdAt" | "updatedAt">) {
        const now = new Date().toISOString();
        return {
          payload: { ...payload, id: nanoid(), createdAt: now, updatedAt: now },
        };
      },
    },
    updateEvent(
      state,
      action: PayloadAction<{
        id: string;
        changes: Omit<Event, "id" | "createdAt" | "updatedAt">;
      }>,
    ) {
      const event = state.events.find((e) => e.id === action.payload.id);
      if (!event) return;
      const { changes } = action.payload;

      const modifiedKeys: ModifiedKey[] = [];

      if (changes.timezone !== event.timezone) {
        modifiedKeys.push({
          key: "timezone",
          old: event.timezone,
          new: changes.timezone,
        });
      }
      if (
        dateTime(changes.startDate, changes.startTime) !==
        dateTime(event.startDate, event.startTime)
      ) {
        modifiedKeys.push({
          key: "start",
          old: dateTime(event.startDate, event.startTime),
          new: dateTime(changes.startDate, changes.startTime),
        });
      }
      if (
        dateTime(changes.endDate, changes.endTime) !==
        dateTime(event.endDate, event.endTime)
      ) {
        modifiedKeys.push({
          key: "end",
          old: dateTime(event.endDate, event.endTime),
          new: dateTime(changes.endDate, changes.endTime),
        });
      }
      if (!sameProfiles(changes.profiles, event.profiles)) {
        modifiedKeys.push({
          key: "profiles",
          old: event.profiles.map((profile) => profile.name),
          new: changes.profiles.map((profile) => profile.name),
        });
      }

      Object.assign(event, changes);
      event.updatedAt = new Date().toISOString();

      if (modifiedKeys.length > 0) {
        state.logs.push({
          _id: nanoid(),
          entityId: event.id,
          entityType: "event",
          modifiedKeys,
          timestamp: event.updatedAt,
        });
      }
    },
  },
});

export const { addEvent, updateEvent } = eventsSlice.actions;

export const selectEvents = (state: RootState) => state.events.events;

export const selectEventLogs = (state: RootState) => state.events.logs;

export default eventsSlice.reducer;
