import { generateSmallCalendars } from "./generate_small_calendars.js";
import { generateMainCalendar } from "./generate_main_calendar.js";

const h1_year = document.querySelector(".month__year");
const h2_month = document.querySelector(".month__month");

let date = new Date(Date.now());


/**
 * Funkcja rerenderująca kalendarze.
 * @returns {void}
 */

function updateDate() {
  h1_year.innerHTML = date.getFullYear();
  h2_month.innerHTML = date.toLocaleString("pl-PL", {
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
const back_button = document.getElementById("month__change-month-button-back");
const forward_button = document.getElementById("month__change-month-button-forward");
back_button.addEventListener("click", () => changeMonth(-1));
forward_button.addEventListener("click", () => changeMonth(1));

// wywołanie funkcji przy generowaniu strony
updateDate();
generateSmallCalendars(date);
generateMainCalendar(date);
