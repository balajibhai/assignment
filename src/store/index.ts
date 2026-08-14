import { configureStore } from "@reduxjs/toolkit";
import profilesReducer from "../features/profiles/profileSlice";

const store = configureStore({
  reducer: {
    profiles: profilesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
