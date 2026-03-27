import { useState, useEffect, useRef } from "react";
import { formatTime } from "../utils/formatTime";
import Button from "./Button";
import LapItem from "./LapItem";

function StopwatchContainer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sw_laps")) || [];
    } catch {
      return [];
    }
  });

  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const lapStartRef = useRef(0);

  // Load elapsed from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sw_elapsed");
    if (saved) setElapsed(Number(saved));
  }, []);

  // Save elapsed & laps to localStorage
  useEffect(() => {
    localStorage.setItem("sw_elapsed", elapsed);
  }, [elapsed]);

  useEffect(() => {
    localStorage.setItem("sw_laps", JSON.stringify(laps));
  }, [laps]);

  // Tick
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsed;
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStartStop = () => {
    if (!isRunning && elapsed === 0) {
      lapStartRef.current = 0;
    }
    setIsRunning((prev) => !prev);
  };

  const handleLap = () => {
    if (!isRunning) return;
    const lapDuration = elapsed - lapStartRef.current;
    const newLap = {
      number: laps.length + 1,
      duration: lapDuration,
      total: elapsed,
    };
    lapStartRef.current = elapsed;
    setLaps((prev) => [newLap, ...prev]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
    setLaps([]);
    lapStartRef.current = 0;
    localStorage.removeItem("sw_elapsed");
    localStorage.removeItem("sw_laps");
  };

  // Find fastest/slowest lap
  const fastestIdx = laps.length > 1
    ? laps.reduce((best, l, i) => l.duration < laps[best].duration ? i : best, 0)
    : -1;
  const slowestIdx = laps.length > 1
    ? laps.reduce((worst, l, i) => l.duration > laps[worst].duration ? i : worst, 0)
    : -1;

  const displayTime = formatTime(elapsed, false);
  const ms = String(Math.floor((elapsed % 1000) / 10)).padStart(2, "0");

  return (
    <>
      <div className="card">
        {/* Timer Display */}
        <div className="timer-display">
          <div className={`time-text ${isRunning ? "running" : ""}`}>
            {displayTime}
            <span className="ms-text">.{ms}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <Button
            variant={isRunning ? "danger" : "primary"}
            onClick={handleStartStop}
          >
            {isRunning ? "⏸ Pause" : elapsed === 0 ? "▶ Start" : "▶ Resume"}
          </Button>

          <Button
            variant="secondary"
            onClick={handleLap}
            disabled={!isRunning}
          >
            🔁 Lap
          </Button>

          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={isRunning && elapsed === 0}
          >
            ↺ Reset
          </Button>
        </div>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="card laps-section">
          <div className="laps-header">
            <span className="laps-title">Laps</span>
            <span className="laps-count">{laps.length} recorded</span>
          </div>
          <ul className="laps-list">
            {laps.map((lap, index) => (
              <LapItem
                key={lap.number}
                lap={lap}
                isFastest={index === fastestIdx}
                isSlowest={index === slowestIdx}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default StopwatchContainer;
