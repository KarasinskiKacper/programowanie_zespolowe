import { generateCalendar } from "./generate_calendar.js";

export function generateSmallCalendars(date) {
  // wygenerowanie html kalendarza
  function create_structure_of_calendar(date, offset) {
    const { calendar, month } = generateCalendar(date, offset);

    // ustawienie nazwy miesiaca
    const small_calendar_month = document.getElementById(
      `small-calendar__month-${offset == -1 ? "past" : "future"}`
    );
    small_calendar_month.innerHTML = month;

    // ustawienie dni kalendarza
    const small_calendar__days_wrapper = document.getElementById(
      `small-calendar__days-wrapper-${offset == -1 ? "past" : "future"}`
    );
    let new_innerhtml = "";
    let counter = 1;
    calendar.forEach((week) => {
      week.forEach((day) => {
        if (day === counter) {
          new_innerhtml += `<p class="small-calendar__days numeric-font">${day}</p>`;
          counter++;
        } else {
          new_innerhtml += `<p class="small-calendar__days numeric-font"></p>`;
        }
      });
    });
    for (let i = calendar.length; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        new_innerhtml += `<p class="small-calendar__days numeric-font"></p>`;
      }
    }
    small_calendar__days_wrapper.innerHTML = new_innerhtml;
  }

  // wywołanie dla kalendarza z poprzedniego miesiąca
  create_structure_of_calendar(date, -1);
  // wywołanie dla kalendarza z następnego miesiąca
  create_structure_of_calendar(date, 1);
}
