import React, { useState } from "react";
import {
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";

const Library = ({
  songs,
  setCurrentSong,
  audioRef,
  isPlaying,
  setSongs,
  libraryStatus,
  setLibraryStatus,
}) => {
  const [open, setOpen] = useState(false);
  const [newSongData, setNewSongData] = useState({
    name: "",
    artist: "",
    audio: "",
    cover: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const buttonStyle = {
    backgroundColor: "rgb(179, 207, 255)",
    color: "rgb(0, 41, 112)",
    textTransform: "none",
    margin: "10px",
    padding: "7px 20px",
  };

  const handleAddSong = () => {
    const newSong = {
      ...newSongData,
      id: Math.random().toString(36).substr(2, 9),
      color: ["#000000", "#ffffff"],
      active: false,
    };

    const updatedSongs = [...songs, newSong];
    console.log("updatedSongs", updatedSongs);
    setSongs(updatedSongs);
    handleClose();
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h2" gutterBottom>
          Library
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          style={buttonStyle}
          size="large"
        >
          Add Music
        </Button>
      </Box>
      <Grid container spacing={2}>
        {songs.map((song) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={song.id}>
            <div className={`library-song ${song.active ? "selected" : ""}`}>
              <img src={song.cover} alt={song.name} />
              <div className="song-description">
                <h3>{song.name}</h3>
                <h4>{song.artist}</h4>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Music</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            sx={{ padding: "5px" }}
            name="name"
            value={newSongData.name}
            onChange={(e) =>
              setNewSongData({ ...newSongData, name: e.target.value })
            }
          />
          <TextField
            label="Artist"
            fullWidth
            sx={{ padding: "5px" }}
            name="artist"
            value={newSongData.artist}
            onChange={(e) =>
              setNewSongData({ ...newSongData, artist: e.target.value })
            }
          />
          <TextField
            label="Audio URL"
            fullWidth
            sx={{ padding: "5px" }}
            name="audio"
            value={newSongData.audio}
            onChange={(e) =>
              setNewSongData({ ...newSongData, audio: e.target.value })
            }
          />
          <TextField
            label="Cover URL"
            fullWidth
            sx={{ padding: "5px" }}
            name="cover"
            value={newSongData.cover}
            onChange={(e) =>
              setNewSongData({ ...newSongData, cover: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddSong}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Library;
