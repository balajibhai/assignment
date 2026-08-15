import { useState, type MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  addProfile,
  selectCurrentProfile,
  selectProfiles,
  setCurrentProfile,
  type Profile,
} from "../features/profiles/profileSlice";
import type { AppDispatch } from "../store";

interface ProfilePickerProps {
  multiple?: boolean;
  value?: Profile[];
  onChange?: (profiles: Profile[]) => void;
}

function ProfilePicker({
  multiple = false,
  value = [],
  onChange,
}: ProfilePickerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector(selectProfiles);
  const currentProfile = useSelector(selectCurrentProfile);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");

  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setSearchQuery("");
    setAdding(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNewProfileName("");
  };

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const handleToggle = (profile: Profile) => {
    if (!multiple) {
      dispatch(setCurrentProfile(profile.id));
      handleClose();
      return;
    }
    const isSelected = value.some((p) => p.id === profile.id);
    onChange?.(
      isSelected
        ? value.filter((p) => p.id !== profile.id)
        : [...value, profile],
    );
  };

  const handleAddProfile = () => {
    const name = newProfileName.trim();
    if (!name) return;
    dispatch(addProfile(name));
    setNewProfileName("");
    setAdding(false);
  };

  const isSelected = (profile: Profile) =>
    multiple
      ? value.some((p) => p.id === profile.id)
      : profile.id === currentProfile?.id;

  const buttonLabel = multiple
    ? value.length === 0
      ? "Select profiles..."
      : `${value.length} ${value.length === 1 ? "profile" : "profiles"} selected`
    : currentProfile
      ? currentProfile.name
      : "Select current profile...";

  return (
    <>
      <Button
        variant="outlined"
        color={multiple || !currentProfile ? "inherit" : "primary"}
        onClick={handleOpen}
        endIcon={
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
            <path d="M6 0 L11 5 H1 Z" fill="currentColor" />
            <path d="M6 14 L11 9 H1 Z" fill="currentColor" />
          </svg>
        }
        sx={{
          justifyContent: "space-between",
          ...(multiple
            ? { minWidth: 220, textTransform: "none" }
            : { minWidth: 200 }),
        }}
      >
        {buttonLabel}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={
          multiple
            ? { vertical: "bottom", horizontal: "left" }
            : { vertical: "bottom", horizontal: "right" }
        }
        transformOrigin={
          multiple
            ? { vertical: "top", horizontal: "left" }
            : { vertical: "top", horizontal: "right" }
        }
        slotProps={{ paper: { sx: { width: 300, mt: 1, p: 1 } } }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder={
            multiple ? "Search profiles..." : "Search current profile..."
          }
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
          sx={{ mb: 1 }}
        />
        {filteredProfiles.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No profile found
            </Typography>
          </Box>
        ) : (
          filteredProfiles.map((profile) => (
            <MenuItem key={profile.id} onClick={() => handleToggle(profile)}>
              {multiple && (
                <Box
                  sx={{
                    width: 24,
                    mr: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isSelected(profile) && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </Box>
              )}
              {profile.name}
            </MenuItem>
          ))
        )}
        <Divider sx={{ my: 1 }} />
        {adding ? (
          <Box sx={{ display: "flex", gap: 1, p: 1 }}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              placeholder="Profile name"
              value={newProfileName}
              onChange={(event) => setNewProfileName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleAddProfile();
                event.stopPropagation();
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddProfile}
              disabled={!newProfileName.trim()}
            >
              Add
            </Button>
          </Box>
        ) : (
          <Button
            fullWidth
            onClick={() => setAdding(true)}
            sx={{ justifyContent: "flex-start", px: 2 }}
          >
            + Add Profile
          </Button>
        )}
      </Menu>
    </>
  );
}

export default ProfilePicker;
