import React, { useEffect, useState } from "react";
import videoImg from "../../assets/images/Video.jpg";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState();

  const navigate = useNavigate();

  const joinRoom = (e) => {
    e.preventDefault();
    console.log("roomId: ", roomId);

    navigate(`/room/${roomId}`);
  };

  const createNewRoom = () => {
    const roomId_ = uuid();

    console.log("roomId: ", roomId);

    navigate(`/room/${roomId_}`);
  };

  useEffect(() => {
    console.log("roomId: ", roomId);
  }, [roomId]);

  return (
    <main class="container bd- main pt-6">
      <div class="columns">
        <div class="column is-two-thirds pr-6">
          <figure class="image" id="shadow-card">
            <img src={videoImg} />
          </figure>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-content">
              <p class="title">Quality Video Calls...</p>
              <p class="subtitle">Now Free!</p>

              <form onSubmit={(e) => joinRoom(e)}>
                <div class="columns is-mobile">
                  <div class="column control is-two-thirds">
                    <input
                      class="input is-hovered"
                      type="text"
                      placeholder="Enter Room Id"
                      name="roomId"
                      value={roomId}
                      required
                      onChange={(e) => setRoomId(e.target.value)}
                    />
                  </div>
                  <div class="column">
                    <button
                      type="submit"
                      class="button is-outlined"
                      onClick={(e) => joinRoom(e)}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </form>

              <div class="columns is-mobile is-centered">
                <div class="column is-half">
                  <p class="bd-notification is-primary ml-2 mb-0"> OR</p>
                </div>
              </div>
              <div class="columns is-mobile">
                <div class="column is-three-quarters is-three-fifths is-offset-1">
                  <a onClick={createNewRoom}>
                    <button class="button is-black">Create A New Room</button>
                  </a>
                </div>
                <div class="column"></div>
                <div class="column"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
