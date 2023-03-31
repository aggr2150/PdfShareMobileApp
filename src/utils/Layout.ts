export function getNumColumns(width: number) {
  switch (true) {
    case width > 900:
      return 5;
    case width > 600:
      return 4;
    default:
      return 3;
  }
}
export function getHistoryNumColumns(width: number) {
  switch (true) {
    case width > 1200:
      return 3;
    case width > 600:
      return 2;
    default:
      return 1;
  }
}
