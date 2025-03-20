/**
 *  Funkcja przekształcająca domyślny format daty gdzie niedziela jest pierwszym dniem tygodnia na format gdzie poniedziałek jest pierwszym dniem tygodnia.
 *
 * @param {number} day
 * @returns {number} odpowiedni dzień tygodnia dla poniedziałku = 0
 */
export function monday_first(day) {
  return (day + 6) % 7;
}
