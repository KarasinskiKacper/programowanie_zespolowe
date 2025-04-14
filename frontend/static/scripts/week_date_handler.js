import { monday_first } from "./utils.js";
import { resetTable, populateTable } from "./table_utils.js";
import { setDefaultDates } from "./add_task_handler.js";

// stałe
const ms_in_day = 86400000;
const current_date = new Date(Date.now());

// definicja date z domyślnym ustawieniem obecnej daty
let date = current_date;
// tablica z datami aktualnego tygodnia
let daysOfCurrentWeek = [null, null, null, null, null, null, null];

/**
 * Domyślnie wyświetla obecny tydzień na stronie widoku tygodnia. Z parametrem offset zmienia wyświetlany tydzień na przeszły dla wartości ujemnych i przyszły dla dodatnich.
 *
 * @param {number} [offset=0] Przesunięcie względem obecnie ustawionej daty.
 * @returns {void}
 */
function changeWeek(offset = 0) {
  // ustawienie daty na podstawie offsetu
  let day_of_week = monday_first(date.getDay());
  let time = date.getTime();
  const start_date = new Date(time - day_of_week * ms_in_day + ms_in_day * 7 * offset);
  date = new Date(start_date);

  // ustawienie tekstu z datą początku tygodnia
  document.getElementById(
    "current-week__text--start"
  ).innerHTML = `<span class="numeric-font">${date
    .getDate()
    .toString()
    .padStart(2, "0")}</span> ${date.toLocaleString("pl-PL", {
    month: "long",
  })} <span class="numeric-font">${date.getFullYear()}</span>`;

  // pobranie elementów do wpisania dat
  let dayArray = document.getElementsByClassName("week-layout__day--date");

  for (let index = 0; index < 7; index++) {
    // zapisanie dat aktualnego tygodnia
    daysOfCurrentWeek[index] = new Date(date);

    // wpisanie daty do elementu
    dayArray[index].innerHTML = `${date.getDate()}`;
    // sprawdzenie czy data jest dniem dzisiejszym i dodanie/usunięcie klasy dnia dzisiejszego
    if (
      current_date.getDate() === date.getDate() &&
      current_date.getMonth() === date.getMonth() &&
      current_date.getFullYear() === date.getFullYear()
    ) {
      dayArray[index].parentElement.classList.add("week-layout__day--current");
    } else {
      dayArray[index].parentElement.classList.remove("week-layout__day--current");
    }
    // dodanie listenera wyświetlającego add task popup
    dayArray[index].addEventListener("click", () => {
      setDefaultDates(daysOfCurrentWeek[index]);
      document.querySelector(".add-task__wrapper").classList.remove("add-task__wrapper--hidden");
    });

    // przesunięcie daty o jeden dzień
    date.setTime(date.getTime() + ms_in_day);
  }

  // ustawienie tekstu z datą końca tygodnia
  date.setTime(date.getTime() - ms_in_day);
  const end_date = new Date(date);

  document.getElementById("current-week__text--end").innerHTML = `<span class="numeric-font">${date
    .getDate()
    .toString()
    .padStart(2, "0")}</span> ${date.toLocaleString("pl-PL", {
    month: "long",
  })} <span class="numeric-font">${date.getFullYear()}</span>`;

  // Wyczyszczenie tabeli ze starych zadań i wstawienie zadań z wybranego tygodnia
  resetTable();
  populateTable(start_date, end_date);
}

// Wygenerowanie obecnego tygodnia
changeWeek(0);

// Obsługa przycisków do zmiany wyświetlanego tygodnia
const backward_button = document.getElementById("current-week__arrow--backward");
const forward_button = document.getElementById("current-week__arrow--forward");
backward_button.addEventListener("click", () => changeWeek(-1));
forward_button.addEventListener("click", () => changeWeek(1));
