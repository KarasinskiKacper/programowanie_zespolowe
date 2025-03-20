/**
 * Generowanie kolumny z godzinami.
 *
 * @returns {void}
 */
function generateHourColumn() {
  // Znalezienie i przypisanie ostatniej kolumny z godzinami
  let indx = document.getElementsByClassName(
    "week-layout__grid-hour-column"
  ).length;

  let hour_column = document.getElementsByClassName(
    "week-layout__grid-hour-column"
  )[indx - 1];

  // Generowanie godzin w kolumnie
  for (let i = 1; i < 24; i++) {
    hour_column.innerHTML += `
          <p class=" week-layout__grid-hour numeric-font">
          ${i.toString().padStart(2, "0")}:00
          </p>`;
  }
}

/**
 * Generowanie tabeli dla widoku tygodnia.
 *
 * @returns {void}
 */
function generateTable() {
  // Przypisanie wrappera do zmiennej
  let wrapper = document.getElementsByClassName("week-layout__grid-wrapper")[0];

  // Wygenerowanie pierwszej kolumny z godzinami
  wrapper.innerHTML = `<div class="week-layout__grid-hour-column"></div>`;
  generateHourColumn();

  // Wygenerowanie komórek tabeli
  wrapper.innerHTML += `<div class="week-layout__grid"></div>`;
  let table = document.getElementsByClassName("week-layout__grid")[0];
  for (let i = 0; i < 7 * 24; i++) {
    table.innerHTML += `<div class='week-layout__grid-cell'></div>`;
  }

  // Wygenerowanie drugiej kolumny z godzinami
  wrapper.innerHTML += `<div class="week-layout__grid-hour-column"></div>`;
  generateHourColumn();
}

generateTable();
