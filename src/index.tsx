import React from "react"
import ReactDOM from "react-dom"
import Leaderboard from "./LeaderboardComp"

import mockData from "./mocks/2024_02_26.json"

ReactDOM.render(
  <React.StrictMode>
    <h1 style={{ textAlign: "center" }}>LiveCodeBench</h1>
    <Leaderboard theme={{ base: "light" }} args={mockData} />
  </React.StrictMode>,
  document.getElementById("root")
)
