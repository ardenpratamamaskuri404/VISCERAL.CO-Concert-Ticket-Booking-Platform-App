/**
 * Formats a date/timestamp as `HH:mm WIB` in Asia/Jakarta timezone.
 * Optionally shifts by `offsetHours` (e.g. `-1` for Open Gate 1 hour before event).
 */
export const formatWibTime = (dateInput, offsetHours = 0) => {
  if (!dateInput) return '-';
  const date = new Date(new Date(dateInput).getTime() + offsetHours * 60 * 60 * 1000);
  if (Number.isNaN(date.getTime())) return '-';
  const formatted = date
    .toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace('.', ':');
  return `${formatted} WIB`;
};
