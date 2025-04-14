// przypisanie kontenera do zmiennej
const scheduleContainer = document.querySelector(".schedule__main");
// zmienna przechowująca id klikniętego zadania
let currentTaskId = null;
// zmienna przechowująca dzisiejszą datę (bez godziny)
const todayDate = new Date(Date.now())
todayDate.setHours(0,0,0,0)

function fetchData() {
  const res = fetch(`/api/tasks/schedule/2025/3/25/8`)
    .then((response) => response.json())
    .then((tasks) => {
      // Grupuj zadania według dni
      const tasksByDay = {};
      tasks.forEach((task) => {
        if (!tasksByDay[task.day]) {
          tasksByDay[task.day] = [];
        }
        tasksByDay[task.day].push(task);
      });
    });

  return res;
}

// pobranie daty z url
function parseURLParams(url) {
  var queryStart = url.indexOf("?") + 1,
    queryEnd = url.indexOf("#") + 1 || url.length + 1,
    query = url.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    parms = {},
    i,
    n,
    v,
    nv;

  if (query === url || query === "") return;

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=", 2);
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);

    if (!parms.hasOwnProperty(n)) parms[n] = [];
    parms[n].push(nv.length === 2 ? v : null);
  }
  return parms;
}
let scheduleDateStart = parseURLParams(window.location.href)?.date
  ? parseURLParams(window.location.href).date[0].split("-").join("/")
  : new Date(Date.now()).toISOString().split("T")[0].split("-").join("/");
let scheduleDateEnd = scheduleDateStart;

// TODO dodać automatyczne ustawianie powtarzania i koloru
function showEditTaskPopup(id, dateStart, dateEnd, title, duration, description, taskType, color) {
  currentTaskId = id;
  // przypisanie do zmiennych elementów popupa edycja zadania
  const wrapper = document.querySelector(".edit-task__wrapper");
  const titleInput = document.querySelector(".edit-task__title");
  const checkbox = document.querySelector(".edit-task__all_day_check");
  const dateInput = document.querySelectorAll(".edit-task__input-date");
  const timeInput = document.querySelectorAll(".edit-task__input-time");
  const disableableInputs = document.querySelectorAll(".edit-task__input--disableable");
  const descriptionInput = document.querySelector(".edit-task__description");
  const repeatSelect = document.querySelector(".edit-task__repeat-select");
  const colorInput = document.querySelector(".edit-task__input-color");
  console.log(dateStart, dateEnd);

  // pokazanie popupa i przekazanie mu danych o zadaniu
  wrapper.classList.remove("edit-task__wrapper--hidden");
  titleInput.value = title;
  dateInput[0].value = dateStart;
  if (duration === "cały dzień") {
    checkbox.checked = true;
    disableableInputs.forEach((input) => (input.disabled = true));
    timeInput[0].value = "00:00";
    timeInput[1].value = "23:59";
  } else {
    checkbox.checked = false;
    disableableInputs.forEach((input) => (input.disabled = false));
    timeInput[0].value = duration.split(" - ")[0];
    timeInput[1].value = duration.split(" - ")[1];
  }
  dateInput[1].value = dateEnd;
  descriptionInput.value = description;

  // ustawienie automatyczne powtarzania zadan
  if (taskType === "0") {
    repeatSelect.value = "none";
  } else if (taskType === "1") {
    repeatSelect.value = "weekly";
  } else if (taskType === "2") {
    repeatSelect.value = "monthly";
  } else if (taskType === "3") {
    repeatSelect.value = "yearly";
  } else if (taskType === "4") {
    repeatSelect.value = "daily";
  }

  // ustawienie automatycznego koloru
  colorInput.value = "#" + color;
}

/**
 * Załadowanie nowych zadań na koniec aktualnie wyświetlanych zadań. Funcja może przyjąć dowolną (również zerową) ilość dni i zadań wewnątrz dni do załadowania.
 * @param {Array.<{date: String, weekDay: String, dayTask: Array.<{title: String, description: String, duration: String}>}>} tasksToLoad Dane taksków do załadowania
 * @returns {Array} załadowane zadania
 */
async function loadNextTasks(isFirstLoad = false) {
  const tasksToLoad = await fetch(`/api/tasks/schedule/${scheduleDateEnd}/8`)
    .then((response) => response.json())
    .then((tasks) => {
      // Grupuj zadania według dni
      const tasksByDay = [];
      let lastDay = null;
      tasks.forEach((task) => {
        let dateStart = task.start.split(" ")[0];
        let weekDay = new Date(dateStart);
        weekDay = weekDay.toLocaleString("pl-PL", {
          weekday: "long",
        });
        let durationStart = task.start.split(" ")[1].split(":");
        durationStart = durationStart[0] + ":" + durationStart[1];
        let durationEnd = task.end ? task.end.split(" ")[1].split(":") : null;
        if (durationEnd) {
          durationEnd = durationEnd[0] + ":" + durationEnd[1];
        }
        const dateEnd = task.end ? task.end.split(" ")[0] : null;
        let duration;
        if (durationEnd) {
          if (durationStart === "00:00" && durationEnd === "23:59") {
            duration = "cały dzień";
          } else {
            duration = durationStart + " - " + durationEnd;
          }
        } else {
          duration = durationStart;
        }

        if (dateStart !== lastDay) {
          tasksByDay.push({
            date: dateStart,
            dateEnd: dateEnd,
            weekDay: weekDay,
            dayTasks: [
              {
                id: task.id,
                title: task.name,
                description: task.description,
                duration: duration,
                type: task.type,
                startRepeat: task.start_repeat ? task.start_repeat : dateStart,
                endRepeat: task.end_repeat ? task.end_repeat : dateEnd,
                color: task.color,
              },
            ],
          });
        } else {
          tasksByDay[tasksByDay.length - 1].dayTasks.push({
            id: task.id,
            title: task.name,
            description: task.description,
            duration: duration,
            type: task.type,
            startRepeat: task.start_repeat ? task.start_repeat : dateStart,
            endRepeat: task.end_repeat ? task.end_repeat : dateEnd,
            color: task.color,
          });
        }
        lastDay = dateStart;
      });

      // ustawianie dat dla kolejnych pobrań zadań z bazy danych
      if (tasksByDay.length > 0) {
        let tmpDate = new Date(tasksByDay[tasksByDay.length - 1].date);
        tmpDate.setDate(tmpDate.getDate() + 1);
        tmpDate = tmpDate.toISOString().split("T")[0].split("-").join("/");
        scheduleDateEnd = tmpDate;

        if (isFirstLoad) {
          tmpDate = new Date(tasksByDay[0].date);
          tmpDate.setDate(tmpDate.getDate() - 1);
          tmpDate = tmpDate.toISOString().split("T")[0].split("-").join("/");
          scheduleDateStart = tmpDate;
        }
      }

      return tasksByDay;
    });

  // pętla wykonująca się po wszystkich dniach
  tasksToLoad.forEach((task) => {
    // stworzenie nowego elementu html dla dnia i przypisanie mu klasy
    const dayWrapper = document.createElement("div");
    dayWrapper.className = "schedule-day";

    // zapisanie daty zadania
    const taskDate = new Date(task.date)
    taskDate.setHours(0,0,0,0)

    // wypełnienie elementu treścią
    // wygenerowanie treści dla dnia    
    dayWrapper.innerHTML += `
    <h1 class="schedule-day__date ${taskDate.getTime() > todayDate.getTime() ? '' : taskDate.getTime() === todayDate.getTime() ? 'schedule-day__date--today':'schedule-day__date--past'}">
        <span class="numeric-font">${task.date}</span> ${task.weekDay}
    </h1>`;

    // pętla wykonująca się po wszystkich zadaniach w dniu
    task.dayTasks.forEach(
      (dayTask) =>
        // wygenerowanie treści dla zadań w dniu
        // onclick powoduje wykoczenie popupu edycji zadania
        (dayWrapper.innerHTML += `<div class="schedule-day__task-wrapper" 
          onclick="showEditTaskPopup('${dayTask.id}','${dayTask.startRepeat}','${dayTask.endRepeat}','${dayTask.title}','${dayTask.duration}','${dayTask.description}','${dayTask.type}','${dayTask.color}')" 
          >
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

  if (isFirstLoad) {
    // zabezpieczenie przed brakiem możliwości scrollowania
    scheduleContainer.scroll(0, 1);
    if (scheduleContainer.scrollTop === 0) {
      loadPreviousTasks();
    }
  }
}

/**
 * Załadowanie nowych zadań na początek aktualnie wyświetlanych zadań. Funcja może przyjąć dowolną (również zerową) ilość dni i zadań wewnątrz dni do załadowania.
 * @param {Array.<{date: String, weekDay: String, dayTask: Array.<{title: String, description: String, duration: String}>}>} tasksToLoad Dane taksków do załadowania
 * @returns {Array} załadowane zadania
 */
async function loadPreviousTasks() {
  // zmienna przechowująca dane do wstawienia na początek kontenera
  let newInnerHtml = "";
  const tasksToLoad = await fetch(`/api/tasks/schedule/${scheduleDateStart}/0`)
    .then((response) => response.json())
    .then((tasks) => {
      // Grupuj zadania według dni
      const tasksByDay = [];
      let lastDay = null;
      tasks.forEach((task) => {
        let dateStart = task.start.split(" ")[0];
        let weekDay = new Date(dateStart);
        weekDay = weekDay.toLocaleString("pl-PL", {
          weekday: "long",
        });
        let durationStart = task.start.split(" ")[1].split(":");
        durationStart = durationStart[0] + ":" + durationStart[1];
        let durationEnd = task.end ? task.end.split(" ")[1].split(":") : null;
        if (durationEnd) {
          durationEnd = durationEnd[0] + ":" + durationEnd[1];
        }
        const dateEnd = task.end ? task.end.split(" ")[0] : null;
        let duration;
        if (durationEnd) {
          if (durationStart === "00:00" && durationEnd === "23:59") {
            duration = "cały dzień";
          } else {
            duration = durationStart + " - " + durationEnd;
          }
        } else {
          duration = durationStart;
        }

        if (dateStart !== lastDay) {
          tasksByDay.push({
            date: dateStart,
            dateEnd: dateEnd,
            weekDay: weekDay,
            dayTasks: [
              {
                id: task.id,
                title: task.name,
                description: task.description,
                duration: duration,
                type: task.type,
                startRepeat: task.start_repeat ? task.start_repeat : dateStart,
                endRepeat: task.end_repeat ? task.end_repeat : dateEnd,
                color: task.color,
              },
            ],
          });
        } else {
          tasksByDay[tasksByDay.length - 1].dayTasks.push({
            id: task.id,
            title: task.name,
            description: task.description,
            duration: duration,
            type: task.type,
            startRepeat: task.start_repeat ? task.start_repeat : dateStart,
            endRepeat: task.end_repeat ? task.end_repeat : dateEnd,
            color: task.color,
          });
        }
        lastDay = dateStart;
      });

      if (tasksByDay.length > 0) {
        let tmpDate = new Date(tasksByDay[0].date);
        tmpDate.setDate(tmpDate.getDate() - 1);
        tmpDate = tmpDate.toISOString().split("T")[0].split("-").join("/");
        scheduleDateStart = tmpDate;
      }

      return tasksByDay;
    });

  // pętla wykonująca się po wszystkich dniach
  tasksToLoad.forEach((task) => {
    // stworzenie nowego elementu html dla dnia i przypisanie mu klasy
    const dayWrapper = document.createElement("div");
    dayWrapper.className = "schedule-day";

    // zapisanie daty zadania
    const taskDate = new Date(task.date)
    taskDate.setHours(0,0,0,0)

    // wypełnienie elementu treścią
    // wygenerowanie treści dla dnia
    newInnerHtml += `
    <h1 class="schedule-day__date ${taskDate.getTime() > todayDate.getTime() ? '' : taskDate.getTime() === todayDate.getTime() ? 'schedule-day__date--today':'schedule-day__date--past'}">
        <span class="numeric-font">${task.date}</span> ${task.weekDay}
    </h1>`;

    // pętla wykonująca się po wszystkich zadaniach w dniu
    task.dayTasks.forEach(
      (dayTask) =>
        // wygenerowanie treści dla zadań w dniu
        (newInnerHtml += `
      <div class="schedule-day__task-wrapper" onclick="showEditTaskPopup('${dayTask.id}','${task.date}','${task.dateEnd}','${dayTask.title}','${dayTask.duration}','${dayTask.description}','${dayTask.type}','${dayTask.color}')" >
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
  return tasksToLoad;
}

// TODO przekazać dane zadań, które mają się załadować odrazu przy renderowaniu strony

// pierwsze załadowanie zadań
// przestawienie scrolla o 1px w dół alby umożliwić wykrycie scrollowania w górę
async function firstLoadTasks() {
  await loadNextTasks(true);
}
firstLoadTasks();

// wykrywanie scrollowania
scheduleContainer.addEventListener("scroll", () => {
  if (
    scheduleContainer.scrollTop + scheduleContainer.clientHeight ===
    scheduleContainer.scrollHeight
  ) {
    loadNextTasks();
  } else if (scheduleContainer.scrollTop === 0) {
    loadPreviousTasks();
  }
});

// Usuwanie zadań
document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.querySelector(".edit-task__form");

  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony

    if (e.submitter.name === "remove") {
      const formData = {
        task_id: currentTaskId,
      };

      try {
        const response = await fetch("/api/tasks/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          taskForm.reset();
        }
      } catch (error) {
        console.error("Błąd połączenia z serwerem:", error);
      }
    }
    window.location.reload();
  });
});

// Edycja zadań
document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.querySelector(".edit-task__form");

  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony

    if (e.submitter.name === "edit") {
      const formData = {
        task_id: currentTaskId,
        title: document.querySelector(".edit-task__title").value,
        all_day: document.querySelector(".edit-task__all_day_check").checked,
        start_date: document.getElementsByClassName("edit-task__input-date")[0].value,
        start_hour: document.getElementsByClassName("edit-task__input-time")[0].value,
        end_date: document.getElementsByClassName("edit-task__input-date")[1].value,
        end_hour: document.getElementsByClassName("edit-task__input-time")[1].value,
        repeat_type: document.querySelector(".edit-task__repeat-select").value,
        color: document.querySelector(".edit-task__input-color").value,
        description: document.querySelector(".edit-task__description").value,
      };

      try {
        const response = await fetch("/api/tasks/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          taskForm.reset();
        }
      } catch (error) {
        console.error("Błąd połączenia z serwerem:", error);
      }
      window.location.reload();
    }
  });
});
