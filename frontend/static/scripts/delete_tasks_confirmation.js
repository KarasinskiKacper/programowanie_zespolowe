// przypisanie elementów do zmiennych
const deleteTasksFormWrapper = document.getElementById("delete_tasks_confirmation");
const deleteTasksCancelButton = document.getElementById("delete_tasks_confirmation-cancel-button");

// listenery chowające popup
deleteTasksFormWrapper.addEventListener("click", (e) => {
  if (e.target.id === "delete_tasks_confirmation") {
    deleteTasksFormWrapper.classList.add("confirmation__wrapper--hidden");
  }
});
deleteTasksCancelButton.addEventListener("click", () => {
  deleteTasksFormWrapper.classList.add("confirmation__wrapper--hidden");
});
