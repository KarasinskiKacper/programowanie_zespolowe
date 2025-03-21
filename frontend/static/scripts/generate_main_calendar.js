import { generate_calendar } from "./generate_calendar.js";

export function generate_main_calendar(date) {
  const current_date = new Date(Date.now());
  const is_current_month = current_date.getMonth() === date.getMonth();

  const { calendar, month } = generate_calendar(date);
  const main_calendar = document.querySelector(
    ".month__main-calendar-days-wrapper"
  );
  let new_innerhtml = "";
  let counter = 1;
  let is_past_month = true;

  // pętla generująca html dla głównego kalendarza
  calendar.forEach((week) => {
    week.forEach((day) => {
      // TODO poniżej należy przekazać z bazy danych informacje dniach w których występuje zadanie oraz jego nazwę
      // day - numer dnia
      // przykład, miejsca do usupełnienia zanaczone: <<>>
      /*
      if (day === counter) {
        new_innerhtml += `<div class="month__main-calendar-day">
            <p
              class="month__main-calendar-days-text ${
                is_current_month &&
                day === current_date.getDate() &&
                "month__main-calendar-days-text--today"
              } ${
                << wyrażenie sprawdzające czy w tym dniu jest zadanie np: day === zmienna_z_numerem_dnia_zadania >> &&
                "month__main-calendar-days-text--task"
              }"
            >
              ${day}
            </p>
            <p class="month__main-calendar-days-task">
              << tytuł/y zadania/zadań >>
            </p>
          </div>`;
        counter++;
      } 
      */

      // html dla dni aktualnie wyświetlanego miesiąca
      if (day === counter) {
        new_innerhtml += `<div class="month__main-calendar-day">
            <p
              class="month__main-calendar-days-text ${
                is_current_month &&
                day === current_date.getDate() &&
                "month__main-calendar-days-text--today"
              }"
            >
              ${day}
            </p>
            <p class="month__main-calendar-days-task"></p>
          </div>`;
        counter++;
      }
      // html dla dni z końcówki poprzedniego i początku następnego miesiąca (w stosunku do akutualnie wyświetlanego miesiąca)
      else {
        new_innerhtml += `<div class="month__main-calendar-day">
            <p
              class="month__main-calendar-days-text month__main-calendar-days-text--${
                is_past_month ? "past" : "future"
              }"
            >
              ${day}
            </p>
            <p class="month__main-calendar-days-task"></p>
          </div>`;
      }
    });
    is_past_month = false;
  });
  main_calendar.innerHTML = new_innerhtml;
}
