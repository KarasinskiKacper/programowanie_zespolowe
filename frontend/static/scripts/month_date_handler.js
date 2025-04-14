import { generateSmallCalendars } from "./generate_small_calendars.js";
import { generateMainCalendar } from "./generate_main_calendar.js";

const h1Year = document.querySelector(".month__year");
const h2Month = document.querySelector(".month__month");

let date = new Date(Date.now());

/**
 * Funkcja rerenderująca kalendarze.
 * @returns {void}
 */

function updateDate() {
  h1Year.innerHTML = date.getFullYear();
  h2Month.innerHTML = date.toLocaleString("pl-PL", {
    month: "long",
  });
  generateSmallCalendars(date);
  generateMainCalendar(date);
}

/**
 * Funkcja zmieniająca aktualny miesiąc.
 *
 * @param {number} offset - [-1, 1] przesunięcie w miesiacach
 * @returns {void}
 */

function changeMonth(offset) {
  date.setMonth(date.getMonth() + offset);
  updateDate(date);
}
const backButton = document.getElementById("month__change-month-button-back");
const forwardButton = document.getElementById("month__change-month-button-forward");
backButton.addEventListener("click", () => changeMonth(-1));
forwardButton.addEventListener("click", () => changeMonth(1));

// wywołanie funkcji przy generowaniu strony
updateDate();
generateSmallCalendars(date);
generateMainCalendar(date);
