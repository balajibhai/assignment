import { configureStore } from "@reduxjs/toolkit";
import profilesReducer from "../features/profiles/profileSlice";
import eventsReducer from "../features/events/eventSlice";
import uiReducer from "../features/ui/uiSlice";

const store = configureStore({
  reducer: {
    profiles: profilesReducer,
    events: eventsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
