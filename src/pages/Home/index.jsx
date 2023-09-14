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
    <main className="container bd- main pt-6">
      <div className="columns">
        <div className="column is-two-thirds pr-6">
          <figure className="image" id="shadow-card">
            <img src={videoImg} />
          </figure>
        </div>

        <div className="column">
          <div className="card">
            <div className="card-content">
              <p className="title">Quality Video Calls...</p>
              <p className="subtitle">Now Free!</p>

              <form onSubmit={(e) => joinRoom(e)}>
                <div className="columns is-mobile">
                  <div className="column control is-two-thirds">
                    <input
                      className="input is-hovered"
                      type="text"
                      placeholder="Enter Room Id"
                      name="roomId"
                      value={roomId}
                      required
                      onChange={(e) => setRoomId(e.target.value)}
                    />
                  </div>
                  <div className="column">
                    <button
                      type="submit"
                      className="button is-outlined"
                      onClick={(e) => joinRoom(e)}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </form>

              <div className="columns is-mobile is-centered">
                <div className="column is-half">
                  <p className="bd-notification is-primary ml-2 mb-0"> OR</p>
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-three-quarters is-three-fifths is-offset-1">
                  <a onClick={createNewRoom}>
                    <button className="button is-black">
                      Create A New Room
                    </button>
                  </a>
                </div>
                <div className="column"></div>
                <div className="column"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
