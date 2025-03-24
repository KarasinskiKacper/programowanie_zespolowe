/**
 * Funkcja usuwa zawartość komórek w tabeli.
 *
 * @returns {void}
 */
export function resetTable() {
  let table_cells = document.getElementsByClassName("week-layout__grid-cell");
  let index = table_cells.length;
  while (index--) {
    table_cells[index].innerHTML = "";
  }
}

/**
 * Funkcja wstawiająca zadanie do komórki w tabeli.
 *
 * @param {number} day_of_week Numer dnia tygodnia (0-6)
 * @param {string} start_time Początkowa godzina zadania (HH:MM)
 * @param {string} end_time Końcowa godzina zadania (HH:MM)
 * @param {string} task_title Tytuł zadania
 * @param {string} task_text Treść tekstowa zadania
 * @param {number} task_id Unikalne id zadania
 * @param {string} color Kolor zadania (wartość szesnastkowa)
 * @returns {void}
 */
function insertTask(
  day_of_week,
  start_time,
  end_time,
  task_title,
  task_text,
  task_id,
  color = "29A423"
) {
  // Konwersja godzin do liczbowych wartości
  let [start_hour, start_minutes] = start_time.split(":");
  start_hour = parseInt(start_hour);
  start_minutes = parseInt(start_minutes);

  let [end_hour, end_minutes] = end_time.split(":");
  end_hour = parseInt(end_hour);
  end_minutes = parseInt(end_minutes);

  // Pobranie komórek tabeli
  let table_cells = document.getElementsByClassName(`week-layout__grid-cell`);

  // Wstawienie zadania do komórki
  table_cells[day_of_week + start_hour * 7].innerHTML = `
  <div  style='
              transform: translateY(${-1 + start_minutes * 0.4}px);
              height: ${
                ((end_hour - start_hour) * 60 + (end_minutes - start_minutes)) *
                0.4
              }px;
              background-color: #${color}' 
        id='week-layout__grid-task-${task_id}' 
        class='week-layout__grid-task'>
    <h1 class='week-layout__grid-task-title'>${task_title}</h1>
    <p class='week-layout__grid-task-text'>${task_text}</p>
  </div>`;
}

//TODO implementacja populateTable
/**
 * Funkcja która ma wypełniać tabele z zadaniami.
 * @abstract Funkcja abstrakcyjna do zaimplementowania.
 *
 * @param {Date} start_date data pierwszego dnia w tabeli
 * @param {Date} end_date data ostatniego dnia w tabeli
 * @returns {void}
 */
export function populateTable(start_date, end_date) {
    const start_date_iso = start_date.toISOString();
    const end_date_iso = end_date.toISOString();
    fetch(`/tasks?start_date=${start_date_iso}&end_date=${end_date_iso}`)
        .then((response) => response.json())  // Parsowanie odpowiedzi jako JSON
        .then((tasks) => {
            // Wstawienie zadań do tabeli
            tasks.forEach((task) => {
                const { day_of_week, start_time, end_time, task_title, task_text, task_id, color } = task;

                // Wstawianie zadania do odpowiedniej komórki
                insertTask(day_of_week, start_time, end_time, task_title, task_text, task_id, color);
            });
        })
        .catch((error) => {
            console.error("Błąd pobierania zadań:", error);
        });
}

