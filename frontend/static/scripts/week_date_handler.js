import { mondayFirst } from "./utils.js";
import { resetTable, populateTable } from "./table_utils.js";
import { setDefaultDates } from "./add_task_handler.js";

// stałe
const msInDay = 86400000;
const currentDate = new Date(Date.now());

// definicja date z domyślnym ustawieniem obecnej daty
let date = currentDate;
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
  let dayOfWeek = mondayFirst(date.getDay());
  let time = date.getTime();
  const startDate = new Date(time - dayOfWeek * msInDay + msInDay * 7 * offset);
  date = new Date(startDate);

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
      currentDate.getDate() === date.getDate() &&
      currentDate.getMonth() === date.getMonth() &&
      currentDate.getFullYear() === date.getFullYear()
    ) {
      dayArray[index].parentElement.classList.add("week-layout__day--current");
    } else {
      dayArray[index].parentElement.classList.remove(
        "week-layout__day--current"
      );
    }
    // dodanie listenera wyświetlającego add task popup
    dayArray[index].addEventListener("click", () => {
      setDefaultDates(daysOfCurrentWeek[index]);
      document
        .querySelector(".add-task__wrapper")
        .classList.remove("add-task__wrapper--hidden");
    });

    // przesunięcie daty o jeden dzień
    date.setTime(date.getTime() + msInDay);
  }

  // ustawienie tekstu z datą końca tygodnia
  date.setTime(date.getTime() - msInDay);
  const endDate = new Date(date);

  document.getElementById(
    "current-week__text--end"
  ).innerHTML = `<span class="numeric-font">${date
    .getDate()
    .toString()
    .padStart(2, "0")}</span> ${date.toLocaleString("pl-PL", {
    month: "long",
  })} <span class="numeric-font">${date.getFullYear()}</span>`;

  // Wyczyszczenie tabeli ze starych zadań i wstawienie zadań z wybranego tygodnia
  resetTable();
  populateTable(startDate, endDate);
}

// Wygenerowanie obecnego tygodnia
changeWeek(0);

// Obsługa przycisków do zmiany wyświetlanego tygodnia
const backwardButton = document.getElementById("current-week__arrow--backward");
const forwardButton = document.getElementById("current-week__arrow--forward");
backwardButton.addEventListener("click", () => changeWeek(-1));
forwardButton.addEventListener("click", () => changeWeek(1));
