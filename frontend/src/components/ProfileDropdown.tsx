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
} from "../features/profiles/profileSlice";
import type { AppDispatch } from "../store";

function ProfileDropdown() {
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

  const handleSelectProfile = (profileId: string) => {
    dispatch(setCurrentProfile(profileId));
    handleClose();
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
        color={currentProfile ? "primary" : "inherit"}
        onClick={handleOpen}
        endIcon={
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
            <path d="M6 0 L11 5 H1 Z" fill="currentColor" />
            <path d="M6 14 L11 9 H1 Z" fill="currentColor" />
          </svg>
        }
        sx={{ minWidth: 200, justifyContent: "space-between" }}
      >
        {currentProfile ? currentProfile.name : "Select current profile..."}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 300, mt: 1, p: 1 } } }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search current profile..."
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
            <MenuItem
              key={profile.id}
              onClick={() => handleSelectProfile(profile.id)}
            >
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

export default ProfileDropdown;
