import React, { useState } from 'react';
import ReactDOM from "react-dom"
import Leaderboard from "./LeaderboardComp"

import mockDataGen from "./mocks/performances_generation.json"
import mockDataRep from "./mocks/performances_repair.json"
import mockDataTest from "./mocks/performances_testgen.json"



const LeaderboardTabs = () => {
  // State to track the currently selected tab
  const [activeTab, setActiveTab] = useState('tab1');

  // Function to render the leaderboard based on the selected tab
  const renderLeaderboard = () => {
    console.log(activeTab);
    switch (activeTab) {
      case 'tab1':
        return <Leaderboard theme={{ base: "light" }} args={mockDataGen} />;
      case 'tab2':
        return <Leaderboard theme={{ base: "light" }} args={mockDataRep} />;
      case 'tab3':
        return <Leaderboard theme={{ base: "light" }} args={mockDataTest} />;
      default:
        return <div>Select a tab</div>;
    }
  };
  return (
    <div>
      <div className="tabs is-boxed">
        <ul>
          <li className={activeTab === 'tab1' ? 'is-active' : ''} onClick={() => setActiveTab('tab1')}><a>Code Generation</a></li>
          <li className={activeTab === 'tab2' ? 'is-active' : ''} onClick={() => setActiveTab('tab2')}><a>Self Repair</a></li>
          <li className={activeTab === 'tab3' ? 'is-active' : ''} onClick={() => setActiveTab('tab3')}><a>Test Output Prediction</a></li>
        </ul>

      </div>
      {renderLeaderboard()}
    </div>
  );
};


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
                <LeaderboardTabs />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </React.StrictMode>,
  document.getElementById("root")
)
