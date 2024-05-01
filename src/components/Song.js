import React from "react";
import { usePlayerContext } from "../PlayerContext";
import runningCow from "../assets/running-cow.gif";
import stopImage from "../assets/stopImage.jpg";

const Song = ({ currentSong }) => {
  const { isSongPlaying } = usePlayerContext();

  return (
    <div className="song-container">
      <img
        src={isSongPlaying ? runningCow : stopImage}
        alt={currentSong.name}
      />
      <h2>{currentSong.name}</h2>
      <h3>{currentSong.artist}</h3>
    </div>
  );
};

export default Song;
