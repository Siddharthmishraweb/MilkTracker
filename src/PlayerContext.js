import React, { createContext, useState, useContext } from "react";

const PlayerContext = createContext();

export const usePlayerContext = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [startMilkTime, setStartMilkingTime] = useState(false);

  return (
    <PlayerContext.Provider value={{ isSongPlaying, setIsSongPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
};
