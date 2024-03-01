import React from "react"
import ReactDOM from "react-dom"
import Leaderboard from "./LeaderboardComp"

import mockData from "./mocks/2024_02_26.json"

ReactDOM.render(
  <React.StrictMode>
    <div>
      <h1 style={{ textAlign: "center" }}>LiveCodeBench</h1>
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
    </div>
    <Leaderboard theme={{ base: "light" }} args={mockData} />
  </React.StrictMode>,
  document.getElementById("root")
)
