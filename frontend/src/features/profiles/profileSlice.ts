import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { api } from "../../api";

export interface Profile {
  id: string;
  name: string;
}

interface ProfilesState {
  profiles: Profile[];
  currentProfileId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProfilesState = {
  profiles: [],
  currentProfileId: null,
  status: "idle",
  error: null,
};

export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async () => {
    return api.get<Profile[]>("/profiles");
  },
);

export const addProfile = createAsyncThunk(
  "profiles/addProfile",
  async (name: string) => {
    return api.post<Profile>("/profiles", { name });
  },
);

const profilesSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    setCurrentProfile(state, action: PayloadAction<string | null>) {
      state.currentProfileId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profiles = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load profiles";
      })
      .addCase(addProfile.fulfilled, (state, action) => {
        state.profiles.push(action.payload);
      });
  },
});

export const { setCurrentProfile } = profilesSlice.actions;

export const selectProfiles = (state: RootState) => state.profiles.profiles;

export const selectCurrentProfile = (state: RootState) =>
  state.profiles.profiles.find(
    (profile) => profile.id === state.profiles.currentProfileId,
  ) ?? null;

export default profilesSlice.reducer;
