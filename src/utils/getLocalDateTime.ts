export function getLocalDateTime(now: Date = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}T${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}`;
}
