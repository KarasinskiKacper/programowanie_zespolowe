/**
 *  Funkcja przekształcająca domyślny format daty gdzie niedziela jest pierwszym dniem tygodnia na format gdzie poniedziałek jest pierwszym dniem tygodnia.
 *
 * @param {number} day
 * @returns {number} odpowiedni dzień tygodnia dla poniedziałku = 0
 */
export function mondayFirst(day) {
  return (day + 6) % 7;
}

/**
 *  Funkcja nadająca klase dark-theme do body w zależności od ustawienia w localstorage.
 *
 */
export function updateTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  }
}

/**
 *  Funkcja zmieniająca motyw w localstorage na podstawie parametru.
 *
 * @param {string} theme
 */
export function changeTheme(theme) {
  localStorage.setItem("theme", theme);
  location.reload();
}
