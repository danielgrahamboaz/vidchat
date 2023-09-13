import React from "react";
import videoImg from "../../assets/images/Video.jpg";

const Home = () => {
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

              <form method="POST" action="/join-room">
                <div class="columns is-mobile">
                  <div class="column control is-two-thirds">
                    <input
                      class="input is-hovered"
                      type="text"
                      placeholder="Enter Room Id"
                      name="roomId"
                      required
                    />
                  </div>
                  <div class="column">
                    <button class="button is-outlined">Join</button>
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
                  <a href="/user/start-call">
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
