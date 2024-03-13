import React from "react"
import ReactDOM from "react-dom"
import Leaderboard from "./LeaderboardComp"

import mockDataGen from "./mocks/performances_generation.json"
import mockDataRep from "./mocks/performances_repair.json"
import mockDataTest from "./mocks/performances_testgen.json"


ReactDOM.render(
  <React.StrictMode>
    <section className="hero">
      <div className="hero-body">
        <div className="container is-max-desktop">
          <div className="columns is-centered">
            <div className="column has-text-centered">
              <h1 className="title is-1 publication-title">
                LiveCodeBench: Holistic and Contamination Free Evaluation of
                Large Language Models for Code
              </h1>
              <div className="column has-text-centered">
                <div className="publication-links">
                  <span className="link-block">
                    <a
                      href="/"
                      className="external-link button is-normal is-rounded is-dark"
                    >
                      <span className="icon">
                        <i className="fas fa-home"></i>
                      </span>
                      <span>Home</span>
                    </a>
                  </span>
                </div>
              </div>
              <div className="column has-text-centered">
                <Leaderboard theme={{ base: "light" }} args={mockDataGen} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </React.StrictMode>,
  document.getElementById("root")
)
