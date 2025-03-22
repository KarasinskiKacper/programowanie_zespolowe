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

// Pobierz zadania z API
fetch(`/api/tasks/${date.getFullYear()}/${date.getMonth() + 1}`)
  .then(response => response.json())
  .then(tasks => {
      // Grupuj zadania według dni
      const tasksByDay = {};
      tasks.forEach(task => {
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
                  const tasksHtml = dayTasks.map(task => 
                      `<p class="month__main-calendar-days-task">${task.name}</p>`
                  ).join('');
                  new_innerhtml += `<div class="month__main-calendar-day">
                      <p
                        class="month__main-calendar-days-text ${
                          is_current_month &&
                          day === current_date.getDate() &&
                          "month__main-calendar-days-text--today"
                        } ${
                          dayTasks.length > 0 &&
                          "month__main-calendar-days-text--task"
                        }"
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
  });
  main_calendar.innerHTML = new_innerhtml;
}
