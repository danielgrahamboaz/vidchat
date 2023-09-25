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

import io from "socket.io-client";

const Room = () => {
  const params = useParams();
  const navigate = useNavigate();

  const endAudio = new Audio(endcall);
  const startAudio = new Audio(startcall);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();
  const peerRef = useRef();
  const senders = useRef([]);

  let channel;
  let token = null;

  // let localStream;
  let remoteStream;
  let peerConnection;

  let uid = String(Math.floor(Math.random() * 10000));

  console.log("params: ", params);

  const muteUnmute = () => {
    let audioTrack = userStream.current
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

    let videoTrack = userStream.current
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

  const leaveChannel = async () => {
    try {
      userStream.current.getVideoTracks()[0].enabled = false;
      peerRef.current = null;
    } catch (error) {
      console.error(error.message);
    }
  };

  const exit = async () => {
    var aud = document.getElementById("end-call");
    aud.play();
    leaveChannel();

    const tracks = await userStream.current.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

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

    const init = async () => {
      console.log("init params: ", params?.roomId);
      // grabbing the room id from the url and then sending it to the socket io server
      socketRef.current = io.connect(process.env.REACT_APP_WEBSOCKET_URL);
      socketRef.current.emit("join room", params?.roomId);

      // user a is joining
      socketRef.current.on("other user", (userID) => {
        callUser(userID);
        otherUser.current = userID;
        console.log("other user: ", userID);
      });

      // user b is joining
      socketRef.current.on("user joined", (userID) => {
        otherUser.current = userID;
        console.log("user joined: ", userID);
      });

      // calling the function when made an offer
      socketRef.current.on("offer", handleRecieveCall);

      // sending the answer back to socket
      socketRef.current.on("answer", handleAnswer);

      // joining the user after receiving offer
      socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
    };

    init().then(() => {
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        userStream.current = stream;
        userVideo.current.srcObject = stream;
        // userVideo.current.play();

        playEntry();
      });
    });

    window.addEventListener("beforeunload", leaveChannel);

    // playEntry();
    // startAudio.play();
  }, []);

  const callUser = async (userID) => {
    // taking the peer ID
    peerRef.current = await createPeerConnection(userID);

    // streaming the user a stream
    // giving access to our peer of our individual stream
    // storing all the objects sent by the user into the senders array
    userStream.current
      .getTracks()
      .forEach((track) =>
        senders.current.push(
          peerRef.current.addTrack(track, userStream.current)
        )
      );
  };

  const createPeerConnection = async (MemberId) => {
    // taking the peer ID
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    // partnerVideo.current.srcObject = remoteStream;
    partnerVideo.current.style.display = "block";

    userVideo.current.classList.add("smallFrame");

    if (!userStream.current) {
      userStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      userVideo.current.srcObject = userStream.current;
    }

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log("ice candidate found: ", event.candidate);
        const payload = {
          target: otherUser.current,
          candidate: event.candidate,
        };
        socketRef.current.emit("ice-candidate", payload);
      }
    };

    peerConnection.ontrack = (event) => {
      partnerVideo.current.srcObject = event.streams[0];

      event.streams[0].getTracks().forEach((track) => {
        // remoteStream.addTrack(track);
        console.log("remote stream track: ", track);
      });
    };

    peerConnection.onnegotiationneeded = () =>
      handleNegotiationNeededEvent(MemberId);

    return peerConnection;
  };

  // making the call
  // when the actual offer is created, it is then sent to the other user
  const handleNegotiationNeededEvent = (userID) => {
    peerRef.current
      .createOffer()
      .then((offer) => {
        // setting the local description from the users offer
        console.log("local description: ", offer);
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        // the person we are trying to make the offer to
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        console.log("remote peer payload: ", payload);
        socketRef.current.emit("offer", payload);
      })
      .catch((e) => console.log(e));
  };

  // recieving the call
  const handleRecieveCall = async (incoming) => {
    peerRef.current = await createPeerConnection();

    // remote description
    const desc = new RTCSessionDescription(incoming.sdp);

    // setting remote description and attaching the stream
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) =>
            peerRef.current.addTrack(track, userStream.current)
          );
      })
      .then(() => {
        // creating the answer
        const answer_ = peerRef.current.createAnswer();
        console.log("created answer: ", answer_);
        return answer_;
      })
      .then((answer) => {
        // setting local description
        const localDesc = peerRef.current.setLocalDescription(answer);
        console.log("local description: ", localDesc);
        return localDesc;
      })
      .then(() => {
        // sending data back to the caller
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        console.log("sending data to caller: ", payload);
        socketRef.current.emit("answer", payload);
      });
  };

  // function to handle the answer which the user a (who created the call) is receiving
  const handleAnswer = (message) => {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  };

  // swapping candidates until they reach on an agreement
  const handleNewICECandidateMsg = (incoming) => {
    const candidate = new RTCIceCandidate(incoming);
    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
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
