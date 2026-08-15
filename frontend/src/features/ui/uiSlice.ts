import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

const defaultTimezone = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Etc/UTC";
  } catch {
    return "Etc/UTC";
  }
})();

interface UiState {
  timezone: string;
}

const initialState: UiState = {
  timezone: defaultTimezone,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTimezone(state, action: { payload: string }) {
      state.timezone = action.payload;
    },
  },
});

export const { setTimezone } = uiSlice.actions;

export const selectTimezone = (state: RootState) => state.ui.timezone;

export default uiSlice.reducer;
