import { formatTime } from "../utils/formatTime";

function LapItem({ lap, isFastest, isSlowest }) {
  const className = `lap-item ${isFastest ? "fastest" : ""} ${isSlowest ? "slowest" : ""}`;

  return (
    <li className={className}>
      <span className="lap-num">Lap {lap.number}</span>
      <span className="lap-time">{formatTime(lap.duration, true)}</span>
      {isFastest && <span className="lap-badge fastest">BEST</span>}
      {isSlowest && <span className="lap-badge slowest">SLOW</span>}
    </li>
  );
}

export default LapItem;
