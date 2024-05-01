import { usePlayerContext } from "../PlayerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  setSongInfo,
  songInfo,
  songs,
  setCurrentSong,
  setSongs,
  startMilkingHandler,
  stopMilkingHandler,
}) => {
  const [milkingAmount, setMilkingAmount] = useState("");
  const [isMilking, setIsMilking] = useState(false);
  const [milkingTime, setMilkingTime] = useState(0);
  const [milkingTimer, setMilkingTimer] = useState(null);
  const { isSongPlaying, setIsSongPlaying } = usePlayerContext();
  const { startMilkTime, setStartMilkingTime } = usePlayerContext();
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  // useEffect(() => {
  //   if (isMilking) {
  //     const timer = setInterval(() => {
  //       setMilkingTime((prevTime) => prevTime + 1);
  //     }, 1000);
  //     return () => clearInterval(timer);
  //   }
  // }, [isMilking]);

  useEffect(() => {
    if (isMilking && isPlaying) {
      const timer = setInterval(() => {
        setMilkingTime((prevTime) => prevTime + 1);
      }, 1000);
      setMilkingTimer(timer);
      return () => clearInterval(timer);
    } else {
      clearInterval(milkingTimer);
    }
  }, [isMilking, isPlaying]);
  

  const buttonStyle = {
    backgroundColor: "rgb(179, 207, 255)",
    color: "rgb(0, 41, 112)",
    textTransform: "none",
    margin: "10px",
    padding: "7px 20px",
  };

  const buttonStyleStop = {
    backgroundColor: "rgb(252,215,212)",
    color: "rgb(239,56,38)",
    textTransform: "none",
    margin: "10px",
    padding: "7px 20px",
  };

  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);
  };
  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "skip-forward") {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    }
    if (direction === "skip-back") {
      if ((currentIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1]);
        activeLibraryHandler(songs[songs.length - 1]);
        return;
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
    }
    if (isPlaying) audioRef.current.play();
  };

  const startMilkingHandlerSubmit = () => {
    if (!isMilking) {
      startMilkingHandler();
      playSongHandler();
      setIsMilking(true);
    } else {
      setIsPlaying(false);
      clearInterval(milkingTimer);
      playSongHandler();
      setMilkingTime(0);
      setShowModal(true);
    }
    setIsMilking(!isMilking);
  };

  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
      setIsSongPlaying(false);
      clearInterval(milkingTimer);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
      clearInterval(milkingTimer);
      setIsSongPlaying(true);
      if (!isMilking) {
        setIsMilking(true);
      }
    }
  };

  const submitMilkingHandler = () => {
    console.log(milkingAmount);
    setShowModal(false);
    stopMilkingHandler(milkingAmount, currentSong.name);
  };

  return (
    <div className="player">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div
          className="track"
          style={{
            background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
          }}
        >
          <input
            type="range"
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
          />
          <div className="animate-track" style={trackAnim}></div>
        </div>
        <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
          onClick={() => skipTrackHandler("skip-back")}
        />
        <FontAwesomeIcon
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
          onClick={playSongHandler}
        />
        <FontAwesomeIcon
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
          onClick={() => skipTrackHandler("skip-forward")}
        />
      </div>

      <Button
        onClick={startMilkingHandlerSubmit}
        variant="contained"
        style={isMilking ? buttonStyle : buttonStyleStop}
      >
        {isMilking ? "Stop Milking" : "Start Milking"}
      </Button>

      <div className="milking-timer">
        <p>{getTime(milkingTime)}</p>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Milk Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="milkingAmount">
            <Form.Label>Milk Quantity (Liters)</Form.Label>
            <Form.Control
              type="text"
              value={milkingAmount}
              onChange={(e) => setMilkingAmount(e.target.value)}
              placeholder="Enter milk quantity"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={submitMilkingHandler}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Player;
