export function toHHMMSS(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    seconds %= 3600;
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    seconds = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}