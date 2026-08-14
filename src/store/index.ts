import { configureStore } from "@reduxjs/toolkit";
import profilesReducer from "../features/profiles/profileSlice";
import eventsReducer from "../features/events/eventSlice";

const store = configureStore({
  reducer: {
    profiles: profilesReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
