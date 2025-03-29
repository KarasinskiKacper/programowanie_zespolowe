// przypisanie elementów strony do zmiennych
const loginWrapper = document.querySelector(".login__login");
const registerWrapper = document.querySelector(".login__register");
const mainWrapper = document.querySelector(".login__main-wrapper");
const loginRegisterChoise = document.querySelectorAll(
  ".login__login-register-choise-text"
);

loginRegisterChoise[0].addEventListener("click", () => {
  mainWrapper.classList.remove("login__main-wrapper--shift");
  loginRegisterChoise[0].classList.add(
    "login__login-register-choise-text--active"
  );
  loginRegisterChoise[1].classList.remove(
    "login__login-register-choise-text--active"
  );
});
loginRegisterChoise[1].addEventListener("click", () => {
  mainWrapper.classList.add("login__main-wrapper--shift");
  loginRegisterChoise[0].classList.remove(
    "login__login-register-choise-text--active"
  );
  loginRegisterChoise[1].classList.add(
    "login__login-register-choise-text--active"
  );
});
