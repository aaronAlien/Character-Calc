export function getCurrentDay(date = new Date()) {
  return date
    .toLocaleDateString('en-GB', { weekday: 'long' })
    .toLowerCase();
}
