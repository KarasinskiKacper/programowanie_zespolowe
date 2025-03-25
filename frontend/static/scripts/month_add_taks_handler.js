import { setDefaultDates } from "./add_task_handler.js";

/**
 * Otwiera popup dodawania nowego zadania i ustawia domyślną datę
 *
 * @param {Date} date - data do ustawienia
 * @returns {void}
 */
export function monthAddTask(date) {
  setDefaultDates(date);

  document.querySelector(".add-task__wrapper").classList.remove("add-task__wrapper--hidden");
}
