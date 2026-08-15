import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { Profile } from "../profiles/profileSlice";
import { api } from "../../api";

export interface Event {
  id: string;
  profiles: Profile[];
  start: string;
  end: string;
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

export type EventChanges = Omit<Event, "id" | "createdAt" | "updatedAt">;

interface EventsState {
  events: Event[];
  logs: EventLog[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  logs: [],
  status: "idle",
  error: null,
};

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  return api.get<Event[]>("/events");
});

export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (payload: EventChanges) => {
    return api.post<Event>("/events", payload);
  },
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, changes }: { id: string; changes: EventChanges }) => {
    return api.put<{ event: Event; log: EventLog | null }>(
      `/events/${id}`,
      changes,
    );
  },
);

export const fetchEventLogs = createAsyncThunk(
  "events/fetchEventLogs",
  async (entityId: string) => {
    return api.get<EventLog[]>(`/events/${entityId}/logs`);
  },
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load events";
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const { event, log } = action.payload;
        const index = state.events.findIndex((e) => e.id === event.id);
        if (index !== -1) {
          state.events[index] = event;
        } else {
          state.events.push(event);
        }
        if (log) {
          const logIndex = state.logs.findIndex((l) => l._id === log._id);
          if (logIndex !== -1) {
            state.logs[logIndex] = log;
          } else {
            state.logs.push(log);
          }
        }
      })
      .addCase(fetchEventLogs.fulfilled, (state, action) => {
        const entityId = action.meta.arg;
        state.logs = [
          ...state.logs.filter((log) => log.entityId !== entityId),
          ...action.payload,
        ];
      });
  },
});

export const selectEvents = (state: RootState) => state.events.events;

export const selectEventLogs = (state: RootState) => state.events.logs;

export default eventsSlice.reducer;
