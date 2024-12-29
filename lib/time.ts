// lib/time.ts
export function hhmmToHHMMSS(timeStr: string): string {
  // Convert "HH:mm" to "HH:mm:ss"
  // If user only gives HH:mm, append :00
  if (!timeStr) return "00:00:00";
  const [hh, mm] = timeStr.split(':');
  const hhNum = Number(hh);
  const mmNum = Number(mm);
  if (isNaN(hhNum) || isNaN(mmNum)) return "00:00:00";
  return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:00`;
}

export function hhmmssToHHMMSS(timeStr: string): string {
  // Ensures a time string has HH:MM:SS format
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    return hhmmToHHMMSS(timeStr);
  }
  if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    const hhNum = Number(hh);
    const mmNum = Number(mm);
    const ssNum = Number(ss);
    if (isNaN(hhNum) || isNaN(mmNum) || isNaN(ssNum)) return "00:00:00";
    return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:${ss.padStart(2, '0')}`;
  }
  return "00:00:00";
}
