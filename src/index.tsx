import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom"
import Leaderboard from "./LeaderboardComp"

import "./index.css"

import mockDataGen from "./mocks/performances_generation.json"
import mockDataRep from "./mocks/performances_repair.json"
import mockDataTest from "./mocks/performances_testgen.json"
import mockDataExec from "./mocks/performances_execution.json"


const LeaderboardTabs = () => {
  // State to track the currently selected tab
  const [activeTab, setActiveTab] = useState('tab1');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to render the leaderboard based on the selected tab
  const renderLeaderboard = () => {
    // console.log(activeTab);
    switch (activeTab) {
      case 'tab1':
        return <Leaderboard theme={{ base: "light" }} args={mockDataGen} />;
      case 'tab2':
        return <Leaderboard theme={{ base: "light" }} args={mockDataRep} />;
      case 'tab3':
        return <Leaderboard theme={{ base: "light" }} args={mockDataTest} />;
      case 'tab4':
        return <Leaderboard theme={{ base: "light" }} args={mockDataExec} />;
      default:
        return <div>Select a tab</div>;
    }
  };
  return (
    <div className="tabs-container">
      <ul className={`tabs ${isMobile ? 'mobile' : ''}`}>
        <li className={activeTab === 'tab1' ? 'is-active' : ''} onClick={() => setActiveTab('tab1')}><a>Code Generation</a></li>
        <li className={activeTab === 'tab2' ? 'is-active' : ''} onClick={() => setActiveTab('tab2')}><a>Self Repair</a></li>
        <li className={activeTab === 'tab3' ? 'is-active' : ''} onClick={() => setActiveTab('tab3')}><a>Test Output Prediction</a></li>
        <li className={activeTab === 'tab4' ? 'is-active' : ''} onClick={() => setActiveTab('tab4')}><a>Code Execution</a></li>
      </ul>
      <div className="tab-content">
        {renderLeaderboard()}
      </div>
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
