import { useEffect, useRef, useState } from "react";
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
import MilkingHistory from "./components/MilkingHistory";
import "./styles/app.css";
import { v4 as uuidv4 } from "uuid";
import chillHop from "./data";
import { PlayerProvider } from "./PlayerContext";
import { Route, Router, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";

function App() {
  const [songs, setSongs] = useState(chillHop());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [milkingSessions, setMilkingSessions] = useState([]);
  const [milkingStartTime, setMilkingStartTime] = useState(null);
  const audioRef = useRef(null);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);
    setSongInfo({
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };

  const startMilkingHandler = () => {
    setMilkingStartTime(new Date());
  };

  const stopMilkingHandler = (milkingAmount, currentSong) => {
    if (milkingStartTime) {
      const endTime = new Date();
      const milkingDuration = Math.floor((endTime - milkingStartTime) / 1000);
      console.log("aaya h", milkingDuration);

      const milkingSession = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        startTime: milkingStartTime?.toLocaleTimeString(),
        endTime: endTime?.toLocaleTimeString(),
        totalTime: formatMilkingTime(milkingDuration),
        totalMilk: milkingAmount,
        currentSong: currentSong,
      };
      console.log("milkingSession: ", milkingSession);

      setMilkingSessions((prevSessions) => [...prevSessions, milkingSession]);
      setMilkingStartTime(null);
    }
  };

  useEffect(() => {
    localStorage.setItem("milkingSession", JSON.stringify(milkingSessions));
  }, [milkingSessions]);

  const formatMilkingTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  return (
    <PlayerProvider>
      <div>
        <Nav
          libraryStatus={libraryStatus}
          setLibraryStatus={setLibraryStatus}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Song currentSong={currentSong} />
                <Player
                  id={currentSong.id}
                  songs={songs}
                  songInfo={songInfo}
                  setSongInfo={setSongInfo}
                  audioRef={audioRef}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentSong={currentSong}
                  setCurrentSong={setCurrentSong}
                  setSongs={setSongs}
                  startMilkingHandler={startMilkingHandler}
                  stopMilkingHandler={stopMilkingHandler}
                />
                <audio
                  onLoadedMetadata={timeUpdateHandler}
                  onTimeUpdate={timeUpdateHandler}
                  src={currentSong.audio}
                  ref={audioRef}
                  onEnded={songEndHandler}
                />
              </>
            }
          />
          <Route
            path="/library"
            element={
              <Library
                libraryStatus={libraryStatus}
                setLibraryStatus={setLibraryStatus}
                songs={songs}
                setCurrentSong={setCurrentSong}
                audioRef={audioRef}
                isPlaying={isPlaying}
                setSongs={setSongs}
              />
            }
          />
          <Route
            path="/milking-history"
            element={<MilkingHistory milkingSessions={milkingSessions} />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard milkingSessions={milkingSessions} />}
          />
        </Routes>
      </div>
    </PlayerProvider>
  );
}

export default App;
