import { generateCalendar } from "./generate_calendar.js";

/**
 * Funkcja generująca małe kalendarze na stronie miesiąca.
 *
 * @param {Date} date - Data do generowania kalendarzy.
 *
 * @returns {void}
 */
export function generateSmallCalendars(date) {
  
/**
 * Funkcja generująca strukture małego kalendarza na stronie miesiąca.
 *
 * @param {Date} date - Data bazowa od której generuje się struktura kalendarza.
 * @param {number} offset - Przesunięcie (w miesiacach) od bazowej daty.
 * 
 * @returns {void}
 */
  function createStructureOfCalendar(date, offset) {
    const { calendar, month } = generateCalendar(date, offset);

    // ustawienie nazwy miesiaca
    const smallCalendarMonth = document.getElementById(
      `small-calendar__month-${offset == -1 ? "past" : "future"}`
    );
    smallCalendarMonth.innerHTML = month;

    // ustawienie dni kalendarza
    const smallCalendarDaysWrapper = document.getElementById(
      `small-calendar__days-wrapper-${offset == -1 ? "past" : "future"}`
    );
    let newInnerhtml = "";
    let counter = 1;
    calendar.forEach((week) => {
      week.forEach((day) => {
        if (day === counter) {
          newInnerhtml += `<p class="small-calendar__days numeric-font">${day}</p>`;
          counter++;
        } else {
          newInnerhtml += `<p class="small-calendar__days numeric-font"></p>`;
        }
      });
    });
    for (let i = calendar.length; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        newInnerhtml += `<p class="small-calendar__days numeric-font"></p>`;
      }
    }
    smallCalendarDaysWrapper.innerHTML = newInnerhtml;
  }

  // wywołanie dla kalendarza z poprzedniego miesiąca
  createStructureOfCalendar(date, -1);
  // wywołanie dla kalendarza z następnego miesiąca
  createStructureOfCalendar(date, 1);
}
