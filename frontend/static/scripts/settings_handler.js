// przypisanie elementów do zmiennych
const changeUsernameButton = document.querySelectorAll(".settings__button")[0];
const changeUsernameWrapper = document.querySelector(".change-username__wrapper");
const changePasswordButton = document.querySelectorAll(".settings__button")[1];
const changePasswordWrapper = document.querySelector(".change-password__wrapper");
const deleteTasksWrapper = document.getElementById("delete_tasks_confirmation");
const deleteAccountWrapper = document.getElementById("delete_account_confirmation");
const deleteTasksButton = document.querySelectorAll(".settings__delete-button")[0];
const deleteAccountButton = document.querySelectorAll(".settings__delete-button")[1];

// listenery pokazujące popupy
deleteTasksButton.addEventListener("click", () => {
  deleteTasksWrapper.classList.remove("confirmation__wrapper--hidden");
});
deleteAccountButton.addEventListener("click", () => {
  deleteAccountWrapper.classList.remove("confirmation__wrapper--hidden");
});
changeUsernameButton.addEventListener("click", () => {
  changeUsernameWrapper.classList.remove("change-username__wrapper--hidden");
});
changePasswordButton.addEventListener("click", () => {
  changePasswordWrapper.classList.remove("change-password__wrapper--hidden");
});
