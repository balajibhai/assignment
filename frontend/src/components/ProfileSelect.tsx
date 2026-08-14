import { useState, type MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { addProfile, selectProfiles } from "../features/profiles/profileSlice";
import type { Profile } from "../features/profiles/profileSlice";
import type { AppDispatch } from "../store";

interface ProfileSelectProps {
  value: Profile[];
  onChange: (profiles: Profile[]) => void;
}

function ProfileSelect({ value, onChange }: ProfileSelectProps) {
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector(selectProfiles);
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
    const isSelected = value.some((p) => p.id === profile.id);
    onChange(
      isSelected ? value.filter((p) => p.id !== profile.id) : [...value, profile],
    );
  };

  const handleAddProfile = () => {
    const name = newProfileName.trim();
    if (!name) return;
    dispatch(addProfile(name));
    setNewProfileName("");
    setAdding(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleOpen}
        endIcon={
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
            <path d="M6 0 L11 5 H1 Z" fill="currentColor" />
            <path d="M6 14 L11 9 H1 Z" fill="currentColor" />
          </svg>
        }
        sx={{ minWidth: 220, justifyContent: "space-between", textTransform: "none" }}
      >
        {value.length === 0
          ? "Select profiles..."
          : `${value.length} ${value.length === 1 ? "profile" : "profiles"} selected`}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { width: 300, mt: 1, p: 1 } } }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search profiles..."
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
          filteredProfiles.map((profile) => {
            const isSelected = value.some((p) => p.id === profile.id);
            return (
              <MenuItem key={profile.id} onClick={() => handleToggle(profile)}>
                <Box
                  sx={{
                    width: 24,
                    mr: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isSelected && (
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
                {profile.name}
              </MenuItem>
            );
          })
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

export default ProfileSelect;
