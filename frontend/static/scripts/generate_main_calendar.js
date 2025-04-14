import { generateCalendar } from "./generate_calendar.js";
import { monthAddTask } from "./month_add_taks_handler.js";

/**
 * Generuje html dla głównego kalendarza wraz z zadaniami
 *
 * @param {Date} date - data do wygenerowania kalendarza
 *
 * @returns {void}
 */
export function generateMainCalendar(date) {
  // zapisanie aktualnej daty
  const currentDate = new Date(Date.now());
  // Sprawdzenie, czy miesiąc jest aktualny
  const isCurrentMonth = currentDate.getMonth() === date.getMonth();

  const { calendar, month } = generateCalendar(date);
  const mainCalendar = document.querySelector(".month__main-calendar-days-wrapper");

  let newInnerhtml = "";

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
      let newInnerhtml = "";
      let counter = 1;
      let isPastMonth = true;
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
            newInnerhtml += `<div class="month__main-calendar-day">
                      <p
                        class="month__main-calendar-days-text ${
                          isCurrentMonth &&
                          day === currentDate.getDate() &&
                          "month__main-calendar-days-text--today"
                        } ${dayTasks.length > 0 && "month__main-calendar-days-text--task"}"
                        ${
                          !(isCurrentMonth && day === currentDate.getDate()) &&
                          `style="color: #${dayTasks[0]?.color}"`
                        }
                      >
                        ${day}
                      </p>
                      ${tasksHtml}
                    </div>`;
            counter++;
            isPastMonth = false;
          } else {
            newInnerhtml += `<div class="month__main-calendar-day">
                <p
                  class="month__main-calendar-days-text month__main-calendar-days-text--${
                    isPastMonth ? "past" : "future"
                  }"
                >
                  ${day}
                </p>
                <p class="month__main-calendar-days-task"></p>
              </div>`;
          }
        });
      });
      mainCalendar.innerHTML = newInnerhtml;

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

  mainCalendar.innerHTML = newInnerhtml;
}
