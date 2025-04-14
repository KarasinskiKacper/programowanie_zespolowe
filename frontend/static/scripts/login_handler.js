// przypisanie elementów strony do zmiennych
const loginWrapper = document.querySelector(".login__login");
const registerWrapper = document.querySelector(".login__register");
const mainWrapper = document.querySelector(".login__main-wrapper");
const loginRegisterChoice = document.querySelectorAll(".login__login-register-choice-text");

// listenery przesuwające formularze logowania i rejestracji
loginRegisterChoice[0].addEventListener("click", () => {
  mainWrapper.classList.remove("login__main-wrapper--shift");
  loginRegisterChoice[0].classList.add("login__login-register-choice-text--active");
  loginRegisterChoice[1].classList.remove("login__login-register-choice-text--active");
});
loginRegisterChoice[1].addEventListener("click", () => {
  mainWrapper.classList.add("login__main-wrapper--shift");
  loginRegisterChoice[0].classList.remove("login__login-register-choice-text--active");
  loginRegisterChoice[1].classList.add("login__login-register-choice-text--active");
});



