/**
 * Funkcja usuwa zawartość komórek w tabeli.
 *
 * @returns {void}
 */
export function resetTable() {
  let tableCells = document.getElementsByClassName("week-layout__grid-cell");
  let index = tableCells.length;
  while (index--) {
    tableCells[index].innerHTML = "";
  }
}

/**
 * Funkcja wstawiająca zadanie do komórki w tabeli.
 *
 * @param {number} dayOfWeek Numer dnia tygodnia (0-6)
 * @param {string} startTime Początkowa godzina zadania (HH:MM)
 * @param {string} endTime Końcowa godzina zadania (HH:MM)
 * @param {string} taskTitle Tytuł zadania
 * @param {string} taskText Treść tekstowa zadania
 * @param {number} taskId Unikalne id zadania
 * @param {Date} startDate date początku tygodnia
 * @param {string} color Kolor zadania (wartość szesnastkowa)
 * @returns {void}
 */
function insertTask(
  dayOfWeek,
  startTime,
  endTime,
  taskTitle,
  taskText,
  taskId,
  startDate,
  color
) {
  // Konwersja godzin do liczbowych wartości
  let [startHour, startMinutes] = startTime.split(":");
  startHour = parseInt(startHour);
  startMinutes = parseInt(startMinutes);

  let [endHour, endMinutes] = endTime ? endTime.split(":") : null;
  endHour = parseInt(endHour);
  endMinutes = parseInt(endMinutes);

  // Pobranie komórek tabeli
  let tableCells = document.getElementsByClassName(`week-layout__grid-cell`);

  // Wstawienie zadania do komórki
  tableCells[dayOfWeek + startHour * 7].innerHTML = `
  <div  style='
              transform: translateY(${-1 + startMinutes * 0.4}px);
              height: ${
                ((endHour - startHour) * 60 + (endMinutes - startMinutes)) * 0.4
              }px;
              background-color: #${color}' 
        id='week-layout__grid-task-${taskId}' 
        class='week-layout__grid-task'>
    <h1 class='week-layout__grid-task-title'>${taskTitle}</h1>
    <p class='week-layout__grid-task-text'>${taskText}</p>
  </div>`;

  // dodanie listenera zmieniającego stronę na /harmonogram dla zadań
  tableCells[dayOfWeek + startHour * 7].children[0].addEventListener(
    "click",
    () => {
      let tmpDate = new Date(startDate);
      tmpDate.setDate(tmpDate.getDate() + dayOfWeek);
      tmpDate = tmpDate.toISOString().split("T")[0];
      document.location.href = `/harmonogram?date=${tmpDate}`;
    }
  );
}

/**
 * Funkcja która ma wypełniać tabele z zadaniami.
 * @abstract Funkcja abstrakcyjna do zaimplementowania.
 *
 * @param {Date} startDate data pierwszego dnia w tabeli
 * @param {Date} endDate data ostatniego dnia w tabeli
 * @returns {void}
 */
export function populateTable(startDate, endDate) {
  const startDateIso = startDate.toISOString();
  const endDateIso = endDate.toISOString();
  fetch(`/tasks?start_date=${startDateIso}&end_date=${endDateIso}`)
    .then((response) => response.json()) // Parsowanie odpowiedzi jako JSON
    .then((tasks) => {
      // Wstawienie zadań do tabeli
      tasks.forEach((task) => {
        const {
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          task_title: taskTitle,
          task_text: taskText,
          task_id: taskId,
          color,
        } = task;

        // Wstawianie zadania do odpowiedniej komórki
        insertTask(
          dayOfWeek,
          startTime,
          endTime,
          taskTitle,
          taskText,
          taskId,
          startDate,
          color
        );
      });
    })
    .catch((error) => {
      console.error("Błąd pobierania zadań:", error);
    });
}
