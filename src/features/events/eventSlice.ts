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

interface EventsState {
  events: Event[];
}

const initialState: EventsState = {
  events: [],
};

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
  },
});

export const { addEvent } = eventsSlice.actions;

export const selectEvents = (state: RootState) => state.events.events;

export default eventsSlice.reducer;
