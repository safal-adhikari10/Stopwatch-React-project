/**
 * Formats milliseconds into HH:MM:SS or MM:SS:ms
 * @param {number} ms - milliseconds
 * @param {boolean} showMs - whether to show milliseconds
 */
export function formatTime(ms, showMs = false) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  const pad = (n) => String(n).padStart(2, "0");

  if (showMs) {
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
  }

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formats seconds into MM:SS
 */
export function formatCountdown(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}
