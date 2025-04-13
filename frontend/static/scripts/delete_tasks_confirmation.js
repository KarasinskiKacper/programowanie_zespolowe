// przypisanie elementów do zmiennych
const deleteTasksFormWrapper = document.getElementById("delete_tasks_confirmation");
const deleteTasksCancelButton = document.getElementById("delete_tasks_confirmation-cancel-button");
const deleteTasksForm = deleteTasksFormWrapper.querySelector("form");
// listenery chowające popup
deleteTasksFormWrapper.addEventListener("click", (e) => {
  if (e.target.id === "delete_tasks_confirmation") {
    deleteTasksFormWrapper.classList.add("confirmation__wrapper--hidden");
  }
});
deleteTasksCancelButton.addEventListener("click", () => {
  deleteTasksFormWrapper.classList.add("confirmation__wrapper--hidden");
});

deleteTasksForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/tasks/delete_all", {
      method: "POST",
    });

    if (response.ok) {
      const result = await response.json();
      window.location.href = "/";
    } else {
      console.error("Błąd usuwania konta");
    }
  } catch (error) {
    console.error("Wystąpił błąd:", error);
  }
});
