import { useState, useEffect, useRef } from "react";
import { formatCountdown } from "../utils/formatCountdown";
import Button from "./Button";

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CountdownContainer() {
  const [inputH, setInputH] = useState("");
  const [inputM, setInputM] = useState("");
  const [inputS, setInputS] = useState("");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cd_history")) || [];
    } catch {
      return [];
    }
  });

  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("cd_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (isRunning) {
      endTimeRef.current = Date.now() + remaining * 1000;
      intervalRef.current = setInterval(() => {
        const rem = Math.ceil((endTimeRef.current - Date.now()) / 1000);
        if (rem <= 0) {
          clearInterval(intervalRef.current);
          setRemaining(0);
          setIsRunning(false);
          setIsFinished(true);
          // Save to history
          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
          const label = [h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null, s > 0 ? `${s}s` : null]
            .filter(Boolean).join(" ");
          setHistory((prev) => [
            { label, completedAt: new Date().toLocaleTimeString() },
            ...prev.slice(0, 4),
          ]);
        } else {
          setRemaining(rem);
        }
      }, 250);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleSet = () => {
    const h = parseInt(inputH) || 0;
    const m = parseInt(inputM) || 0;
    const s = parseInt(inputS) || 0;
    const total = h * 3600 + m * 60 + s;

    if (total <= 0) {
      setValidationMsg("Please enter a time greater than 0.");
      return;
    }
    if (h > 23 || m > 59 || s > 59) {
      setValidationMsg("Please enter valid time values.");
      return;
    }

    setValidationMsg("");
    setTotalSeconds(total);
    setRemaining(total);
    setIsFinished(false);
    setIsRunning(false);
  };

  const handleStartPause = () => {
    if (remaining === 0 && !isFinished) return;
    setIsFinished(false);
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemaining(totalSeconds);
    setIsFinished(false);
  };

  const handleClear = () => {
    setIsRunning(false);
    setRemaining(0);
    setTotalSeconds(0);
    setIsFinished(false);
    setInputH("");
    setInputM("");
    setInputS("");
    setValidationMsg("");
  };

  const handleInputChange = (setter, max) => (e) => {
    const val = e.target.value;
    if (val === "" || (Number(val) >= 0 && Number(val) <= max)) {
      setter(val);
      setValidationMsg("");
    }
  };

  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const isWarning = remaining <= 10 && remaining > 0 && totalSeconds > 0;
  const displayTime = remaining > 0 ? formatCountdown(remaining) : totalSeconds > 0 ? "00:00" : "--:--";

  return (
    <>
      <div className="card">
        {/* Input Row */}
        <div className="countdown-input-row">
          <div className="time-unit">
            <label>Hours</label>
            <input
              type="number"
              min="0"
              max="23"
              placeholder="00"
              value={inputH}
              onChange={handleInputChange(setInputH, 23)}
              disabled={isRunning}
            />
          </div>
          <span className="time-separator">:</span>
          <div className="time-unit">
            <label>Min</label>
            <input
              type="number"
              min="0"
              max="59"
              placeholder="00"
              value={inputM}
              onChange={handleInputChange(setInputM, 59)}
              disabled={isRunning}
            />
          </div>
          <span className="time-separator">:</span>
          <div className="time-unit">
            <label>Sec</label>
            <input
              type="number"
              min="0"
              max="59"
              placeholder="00"
              value={inputS}
              onChange={handleInputChange(setInputS, 59)}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Validation */}
        <div className="validation-msg">{validationMsg}</div>

        {/* Progress Ring */}
        <div className="progress-ring-wrap">
          <svg width="220" height="220" className="ring">
            <circle className="ring-bg" cx="110" cy="110" r={RADIUS} />
            <circle
              className={`ring-progress ${isWarning ? "warning" : ""}`}
              cx="110"
              cy="110"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className={`time-text ${isRunning ? "running" : ""} ${isWarning ? "warning" : ""}`}>
            {isFinished ? "✓ Done" : displayTime}
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <Button variant="primary" onClick={handleSet} disabled={isRunning}>
            ✓ Set
          </Button>

          <Button
            variant={isRunning ? "danger" : "primary"}
            onClick={handleStartPause}
            disabled={totalSeconds === 0}
          >
            {isRunning ? "⏸ Pause" : isFinished ? "↺ Restart" : "▶ Start"}
          </Button>

          <Button variant="secondary" onClick={handleReset} disabled={totalSeconds === 0}>
            ↺ Reset
          </Button>

          <Button variant="secondary" onClick={handleClear}>
            ✕ Clear
          </Button>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="card history-section">
          <div className="laps-header">
            <span className="laps-title">Recent Sessions</span>
            <button
              className="btn btn-secondary"
              style={{ padding: "4px 12px", fontSize: "0.65rem" }}
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("cd_history");
              }}
            >
              Clear
            </button>
          </div>
          {history.map((item, i) => (
            <div className="history-item" key={i}>
              <div>
                <div className="history-time">{item.label}</div>
                <div className="history-label">Completed</div>
              </div>
              <div className="history-label">{item.completedAt}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default CountdownContainer;
