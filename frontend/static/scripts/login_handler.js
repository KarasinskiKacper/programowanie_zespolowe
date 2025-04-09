// przypisanie elementów strony do zmiennych
const loginWrapper = document.querySelector(".login__login");
const registerWrapper = document.querySelector(".login__register");
const mainWrapper = document.querySelector(".login__main-wrapper");
const loginRegisterChoice = document.querySelectorAll(".login__login-register-choice-text");

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

const registerF = document.querySelector(".login__register");
registerF.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Rejestracja");

  const data = Object.fromEntries(new FormData(registerF).entries());

  fetch("/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        console.log("Rejestracja zakończona sukcesem!");
      } else {
        const errorData = await res.json();
        console.error("Błąd rejestracji:", errorData.message);
      }
    })
    .catch((err) => {
      console.error("Błąd połączenia:", err);
    });
});