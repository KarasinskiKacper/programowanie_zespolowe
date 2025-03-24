// przypisanie kontenera do zmiennej
const scheduleContainer = document.querySelector(".schedule__main");

// TODO zmienna dla przykładowych zadań, usunąć po podpięciu bazy danych
const tmpTasks = [
  {
    date: "12.03.2025",
    weekDay: "ŚRODA",
    dayTasks: [
      {
        title: "Zadanie 1",
        description:
          "opis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopiszadanie jedenopis zadanie jeden",
        duration: "cały dzień",
      },
      {
        title: "Zadanie 2",
        description:
          "opis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedeno pis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jeden opis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jede nopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jeden",
        duration: "17:30",
      },
    ],
  },
  {
    date: "13.03.2025",
    weekDay: "CZWARTEK",
    dayTasks: [
      {
        title: "Zadanie 1",
        description:
          "opis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopiszadanie jedenopis zadanie jeden",
        duration: "cały dzień",
      },
      {
        title: "Zadanie 2",
        description:
          "opis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedeno pis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jeden opis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jede nopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis  zadanie jeden",
        duration: "20:30 - 23:59",
      },
    ],
  },
  {
    date: "14.03.2025",
    weekDay: "PIĄTEK",
    dayTasks: [
      {
        title: "Zadanie 1",
        description:
          "opis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopis zadanie jedenopiszadanie jedenopis zadanie jeden",
        duration: "00:00 - 04:00",
      },
    ],
  },
];

/**
 * Załadowanie nowych zadań na koniec aktualnie wyświetlanych zadań. Funcja może przyjąć dowolną (również zerową) ilość dni i zadań wewnątrz dni do załadowania.
 * @param {Array.<{date: String, weekDay: String, dayTask: Array.<{title: String, description: String, duration: String}>}>} tasksToLoad Dane taksków do załadowania
 * @returns {void}
 */
function loadNextTasks(tasksToLoad) {
  // pętla wykonująca się po wszystkich dniach
  tasksToLoad.forEach((task) => {
    // stworzenie nowego elementu html dla dnia i przypisanie mu klasy
    const dayWrapper = document.createElement("div");
    dayWrapper.className = "schedule-day";

    // wypełnienie elementu treścią
    // wygenerowanie treści dla dnia
    dayWrapper.innerHTML += `
    <h1 class="schedule-day__date">
        <span class="numeric-font">${task.date}</span> ${task.weekDay}
    </h1>`;

    // pętla wykonująca się po wszystkich zadaniach w dniu
    task.dayTasks.forEach(
      (dayTask) =>
        // wygenerowanie treści dla zadań w dniu
        (dayWrapper.innerHTML += `<div class="schedule-day__task-wrapper">
          <div class="schedule-day__task-title-wrapper">
              <h2 class="schedule-day__task-title">${dayTask.title}</h2>
              <p class="schedule-day__task-duration numeric-font">
                ${dayTask.duration}
              </p>
          </div>

          <p class="schedule-day__task-description">${dayTask.description}</p>
        </div>`)
    );
    // dodanie elementu na koniec kontenera
    scheduleContainer.appendChild(dayWrapper);
  });
}

/**
 * Załadowanie nowych zadań na początek aktualnie wyświetlanych zadań. Funcja może przyjąć dowolną (również zerową) ilość dni i zadań wewnątrz dni do załadowania.
 * @param {Array.<{date: String, weekDay: String, dayTask: Array.<{title: String, description: String, duration: String}>}>} tasksToLoad Dane taksków do załadowania
 * @returns {void}
 */
function loadPreviousTasks(tasksToLoad) {
  // zmienna przechowująca dane do wstawienia na początek kontenera
  let newInnerHtml = "";

  // pętla wykonująca się po wszystkich dniach
  tasksToLoad.forEach((task) => {
    // stworzenie nowego elementu html dla dnia i przypisanie mu klasy
    const dayWrapper = document.createElement("div");
    dayWrapper.className = "schedule-day";

    // wypełnienie elementu treścią
    // wygenerowanie treści dla dnia
    newInnerHtml += `
    <h1 class="schedule-day__date">
        <span class="numeric-font">${task.date}</span> ${task.weekDay}
    </h1>`;

    // pętla wykonująca się po wszystkich zadaniach w dniu
    task.dayTasks.forEach(
      (dayTask) =>
        // wygenerowanie treści dla zadań w dniu
        (newInnerHtml += `
      <div class="schedule-day__task-wrapper">
          <div class="schedule-day__task-title-wrapper">
              <h2 class="schedule-day__task-title">${dayTask.title}</h2>
              <p class="schedule-day__task-duration numeric-font">
                  ${dayTask.duration}
              </p>
          </div>

          <p class="schedule-day__task-description">${dayTask.description}</p>
      </div>`)
    );
  });

  // zapisanie starej wysokości scrolla
  const oldHeight = scheduleContainer.scrollHeight;
  // wstawienie danych o nowych zadaniach na początek kontenera
  scheduleContainer.innerHTML = newInnerHtml + scheduleContainer.innerHTML;

  // przesunięcie scrolla na poprawną wysokość
  scheduleContainer.scroll(0, scheduleContainer.scrollHeight - oldHeight);
}

// TODO przekazać dane zadań, które mają się załadować odrazu przy renderowaniu strony
// pierwsze załadowanie zadań
loadNextTasks(tmpTasks);

// przestawienie scrolla o 1px w dół alby umożliwić wykrycie scrollowania w górę
scheduleContainer.scroll(0, 1);

// wykrywanie scrollowania
scheduleContainer.addEventListener("scroll", () => {
  if (
    scheduleContainer.scrollTop + scheduleContainer.clientHeight ===
    scheduleContainer.scrollHeight
  ) {
    // TODO przekazać dane zadań które mają się załadować gdy użytkownik dotarł do końca aktualnie wyświetlanych zadań (zadania z przyszłości)
    loadNextTasks(tmpTasks);
  } else if (scheduleContainer.scrollTop === 0) {
    // TODO przekazać dane zadań które mają się załadować gdy użytkownik dotarł do początku aktualnie wyświetlanych zadań (zadania z przeszłości)
    loadPreviousTasks(tmpTasks);
  }
});
