import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

export interface Profile {
  id: string;
  name: string;
}

interface ProfilesState {
  profiles: Profile[];
  currentProfileId: string | null;
}

const initialState: ProfilesState = {
  profiles: [],
  currentProfileId: null,
};

const profilesSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    addProfile: {
      reducer(state, action: PayloadAction<Profile>) {
        state.profiles.push(action.payload);
      },
      prepare(name: string) {
        return { payload: { id: nanoid(), name } };
      },
    },
    setCurrentProfile(state, action: PayloadAction<string | null>) {
      state.currentProfileId = action.payload;
    },
  },
});

export const { addProfile, setCurrentProfile } = profilesSlice.actions;

export const selectProfiles = (state: RootState) => state.profiles.profiles;

export const selectCurrentProfile = (state: RootState) =>
  state.profiles.profiles.find(
    (profile) => profile.id === state.profiles.currentProfileId,
  ) ?? null;

export default profilesSlice.reducer;
