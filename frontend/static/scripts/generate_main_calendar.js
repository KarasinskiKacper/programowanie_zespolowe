import { generate_calendar } from "./generate_calendar.js";
import { monthAddTask } from "./month_add_taks_handler.js";

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

  // Pobierz zadania z API
  fetch(`/api/tasks/${date.getFullYear()}/${date.getMonth() + 1}`)
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

      // pętla generująca html dla głównego kalendarza z zadaniami
      let new_innerhtml = "";
      let counter = 1;
      let is_past_month = true;
      calendar.forEach((week) => {
        week.forEach((day) => {
          if (day === counter) {
            // Sprawdź, czy dla tego dnia są zadania
            const dayTasks = tasksByDay[day] || [];
            let tasksHtml = "";
            // Przygotowanie tytułów zadań do wypisania w kalendarzu
            if (dayTasks.length <= 2) {
              tasksHtml = dayTasks
                .map((task) => `<p class="month__main-calendar-days-task">${task.name}</p>`)
                .join("");
            } else {
              tasksHtml = `<p class="month__main-calendar-days-task">${dayTasks[0].name}</p>`;
              tasksHtml += `<p class="month__main-calendar-days-task">+ ${
                dayTasks.length - 1
              } Więcej</p>`;
            }
            new_innerhtml += `<div class="month__main-calendar-day">
                      <p
                        class="month__main-calendar-days-text ${
                          is_current_month &&
                          day === current_date.getDate() &&
                          "month__main-calendar-days-text--today"
                        } ${dayTasks.length > 0 && "month__main-calendar-days-text--task"}"
                        ${
                          !(is_current_month && day === current_date.getDate()) &&
                          `style="color: #${dayTasks[0]?.color}"`
                        }
                      >
                        ${day}
                      </p>
                      ${tasksHtml}
                    </div>`;
            counter++;
            is_past_month = false;
          } else {
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
      });
      main_calendar.innerHTML = new_innerhtml;

      // dodanie listenera pokazującego popup dla dni głównego kalendarza
      const days = document.querySelectorAll(".month__main-calendar-day");
      days.forEach((day) => {
        day.children[0].addEventListener("click", (e) => {
          const clickedDate = new Date(date);
          clickedDate.setDate(e.target.innerText);
          monthAddTask(clickedDate);
        });
        // dodanie listenera zmieniającego stronę na /harmonogram dla zadań
        if (day.children.length > 1 && day.children[1].innerText) {
          Array.from(day.children).forEach((task, index) => {
            if (index > 0) {
              task.addEventListener("click", (e) => {
                let tmpDate = new Date(date);
                tmpDate.setDate(day.children[0].innerHTML.trim());
                tmpDate = tmpDate.toISOString().split("T")[0];

                document.location.href = `/harmonogram?date=${tmpDate}`;
              });
            }
          });
        }
      });
    });

  main_calendar.innerHTML = new_innerhtml;
}
