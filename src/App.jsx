import { useState, useEffect } from "react";
import StopwatchContainer from "./components/StopwatchContainer";
import CountdownContainer from "./components/CountdownContainer";
import TabBar from "./components/TabBar";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "stopwatch";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⏱</span>
          <h1>STOPWATCH</h1>
        </div>
        <p className="tagline">Precision. Every Second.</p>
      </header>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {activeTab === "stopwatch" ? (
          <StopwatchContainer />
        ) : (
          <CountdownContainer />
        )}
      </main>
    </div>
  );
}

export default App;
