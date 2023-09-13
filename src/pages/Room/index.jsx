import React, { useEffect } from "react";

import { useParams, Navigate, useNavigate } from "react-router-dom";
import endcall from "../../assets/audio/end-call.mp3";
import startcall from "../../assets/audio/start-call.mp3";

import "../../styles.css";

const Room = () => {
  const params = useParams();
  const navigate = useNavigate();

  const endAudio = new Audio(endcall);
  const startAudio = new Audio(startcall);

  console.log("params: ", params);

  const muteUnmute = () => {};

  const playStop = () => {
    console.log("object");
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo();
    } else {
      setStopVideo();
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  };

  const copyId = () => {
    const copyText = document.getElementById("id_copy");

    copyText.focus();
    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");

    alert("Copied RoomId: " + copyText.value);
  };

  const exit = () => {
    var aud = document.getElementById("end-call");
    aud.play();

    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const playEntry = () => {
    var aud = document.getElementById("start-call");
    aud.play();
  };

  if (!params.roomId) {
    <Navigate to="/home" replace />;
  }

  useEffect(() => {
    startAudio.muted = false;

    // playEntry();
    // startAudio.play();
  }, []);

  return (
    <div className="main">
      <div className="main__left">
        <div className="main__videos">
          <div id="video-grid"></div>
        </div>
        <div className="main__controls">
          <div className="main__controls__block">
            <div
              onClick={() => muteUnmute()}
              className="main__controls__button main__mute_button"
            >
              <i className="fas fa-microphone"></i>
              <span>Mute</span>
            </div>
            <div
              onClick={() => playStop()}
              className="main__controls__button main__video_button"
            >
              <i className="fas fa-video"></i>
              <span>Stop Video</span>
            </div>
          </div>
          <div className="main__controls__block">
            <div onClick={() => copyId()} className="main__controls__button">
              <input
                className="copyfrom"
                type="text"
                value={params.roomId}
                id="id_copy"
                aria-hidden="true"
              />
              <i className="fa fa-copy"></i>
              <span className="copy-id">Copy Room ID</span>
            </div>
          </div>
          <div onClick={() => exit()} className="main__controls__block">
            <div className="main__controls__button">
              <audio id="end-call">
                <source src={endcall} type="audio/mpeg" />
              </audio>
              <span className="leave_meeting">Leave Meeting</span>
            </div>
          </div>
        </div>
      </div>

      <audio id="start-call">
        <source src={startcall} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default Room;
