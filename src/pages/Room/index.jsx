import React, { useEffect, useRef, useState } from "react";

import { Navigate, useNavigate, useParams } from "react-router-dom";
import endcall from "../../assets/audio/end-call.mp3";
import startcall from "../../assets/audio/start-call.mp3";

import "../../styles.css";
import "../../room.css";

import { constraints, servers } from "../../constants";

import { createChannel, createClient } from "agora-rtm-react";
import {
  setMuteButton,
  setPlayVideo,
  setStopVideo,
  setUnmuteButton,
} from "../../utilities";

const Room = () => {
  const params = useParams();
  const navigate = useNavigate();

  const endAudio = new Audio(endcall);
  const startAudio = new Audio(startcall);

  const userVideo = useRef();
  const partnerVideo = useRef();

  const useClient = createClient(process.env.REACT_APP_AGORA_APP_ID);
  let client = useClient();

  let channel;
  let token = null;

  let localStream;
  let remoteStream;
  let peerConnection;

  let uid = String(Math.floor(Math.random() * 10000));

  console.log("params: ", params);

  const muteUnmute = () => {
    let audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack.enabled) {
      audioTrack.enabled = false;
      setUnmuteButton();
    } else {
      audioTrack.enabled = true;
      setMuteButton();
    }
  };

  const playStop = () => {
    console.log("object");

    let videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack.enabled) {
      videoTrack.enabled = false;
      setPlayVideo();
    } else {
      videoTrack.enabled = true;
      setStopVideo();
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

  // useChannel(params.roomId, (channel_) => {
  //   channel = channel_;
  // });

  useEffect(() => {
    startAudio.muted = false;

    const init = async () => {
      console.log("init params: ", params?.roomId);
      const channel_ = createChannel(params?.roomId);
      channel = channel_(client);

      console.log("channellll: ", channel);

      await client.login({ uid, token });
      await channel.join();
    };

    init().then(() => {
      console.log("channel: ", channel);

      channel.on("MemberJoined", handleUserJoined);
      channel.on("MemberLeft", handleUserLeft);

      client.on("MessageFromPeer", handleMessageFromPeer);

      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        localStream = stream;
        userVideo.current.srcObject = localStream;
        userVideo.current.play();
      });
    });

    // playEntry();
    // startAudio.play();
  }, []);

  const createPeerConnection = async (MemberId) => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    partnerVideo.current.srcObject = remoteStream;
    partnerVideo.current.style.display = "block";

    userVideo.current.classList.add("smallFrame");

    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      userVideo.current.srcObject = localStream;
    }

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        client.sendMessageToPeer(
          {
            text: JSON.stringify({
              type: "candidate",
              candidate: event.candidate,
            }),
          },
          MemberId
        );
      }
    };
  };

  const handleUserJoined = async (memberId) => {};

  const handleUserLeft = async (memberId) => {
    partnerVideo.current.style.display = "none";
    userVideo.current.classList.remove("smallFrame");
  };

  const handleMessageFromPeer = async (message, peerId) => {};

  const addAnswer = async (answer) => {
    if (!peerConnection.currentRemoteDescription) {
      peerConnection.setRemoteDescription(answer);
    }
  };

  const createAnswer = async (MemberId, offer) => {
    await createPeerConnection(MemberId);

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    client.sendMessageToPeer(
      { text: JSON.stringify({ type: "answer", answer: answer }) },
      MemberId
    );
  };

  const leaveChannel = async () => {
    await channel.leave();
    await client.logout();
  };

  return (
    <div className="main">
      <div className="main__left">
        <div className="main__videos">
          <div id="videos">
            <video
              className="video-player"
              id="user-1"
              muted
              autoPlay
              playsInline
              ref={userVideo}
            ></video>
            <video
              className="video-player"
              id="user-2"
              autoPlay
              playsInline
              ref={partnerVideo}
            ></video>
          </div>
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
                defaultValue={params.roomId}
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
