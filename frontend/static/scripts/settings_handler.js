import { changeTheme } from "./utils.js";
// przypisanie elementów do zmiennych
const changeUsernameButton = document.querySelectorAll(".settings__button")[0];
const changeUsernameWrapper = document.querySelector(".change-username__wrapper");
const changePasswordButton = document.querySelectorAll(".settings__button")[1];
const changePasswordWrapper = document.querySelector(".change-password__wrapper");
const deleteTasksWrapper = document.getElementById("delete_tasks_confirmation");
const deleteAccountWrapper = document.getElementById("delete_account_confirmation");
const deleteTasksButton = document.querySelectorAll(".settings__delete-button")[0];
const deleteAccountButton = document.querySelectorAll(".settings__delete-button")[1];
const changeThemeSelect = document.getElementsByName("motyw")[0];


//zmiana motywu
changeThemeSelect.addEventListener("change", (e) => {
 changeTheme(e.target.value);
});

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

// pobranie danych użytkownika
fetch("/api/user/get_data", {
  method: "POST",
  credentials: "include"
})
.then(response => response.json())
.then(data => {
  const emailElement = document.querySelectorAll(".settings__text")[0];
  const usernameElement = document.querySelectorAll(".settings__text")[1];
  const passwordDateElement = document.querySelectorAll(".settings__text")[2];

  emailElement.textContent = data.email;
  usernameElement.textContent = data.username;
  passwordDateElement.textContent = data.password_date;
})
.catch(error => {
  console.error("Błąd podczas pobierania danych użytkownika:", error);
});