import React from "react"
import ReactDOM from "react-dom"
import Leaderboard from "./Leaderboard"

import mockData from "./mocks/2024_02_26.json"

ReactDOM.render(
  <React.StrictMode>
    <p>Hi</p>
    <Leaderboard {...mockData} />
    <p>Hello</p>
  </React.StrictMode>,
  document.getElementById("root")
)
