// walidacja dla rejestracji
// obiekt do walidacji
const phoneRegex = /^\+?[1-9][0-9]{7,14}$/;
const user = Zod.object({
  Email: Zod.string().email("Podaj prawidłowy email"),
  Password: Zod.string().min(8, "Hasło musi mieć przynajmniej 8 znaków"),
});

// przypisanie elementów do zmiennych
const registerForm = document.querySelector(".login__register");
const registerEmail = document.getElementById("register_email");
const registerPassword = document.getElementById("register_password");
const registerPhone = document.getElementById("phone");
const inputElements = document.querySelectorAll("input");

// listener uruchamiający walidację
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = {
    Email: registerEmail.value,
    Password: registerPassword.value,
    phone_num: Number(registerPhone.value),
  };

  try {
    const validatedData = user.parse(formData);
    console.log("Dane poprawne:", validatedData);
    // registerForm.submit();
  } catch (error) {
    registerForm.er;
    console.error("Błędy walidacji:", error.errors);
    displayErrors(error.errors);
  }
});

// ustawienie niestandardowych wiadomości błędów

function displayErrors(errors) {
  // Wyczyść poprzednie błędy
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((el) => el.remove());

  // Wyświetl nowe błędy
  errors.forEach((error) => {
    const field = error.path[0]; // Pole, którego dotyczy błąd
    if (field === "phone_num") {
      registerPhone.setCustomValidity("Podaj prawidłowy numer telefonu");
      registerPhone.reportValidity();
    } else if (field === "Email") {
      registerEmail.setCustomValidity("Podaj prawidłowy email");
      registerEmail.reportValidity();
    } else if (field === "Password") {
      registerPassword.setCustomValidity("Hasło musi mieć przynajmniej 8 znaków");
      registerPassword.reportValidity();
    }
  });
}
// Ustaw niestandardowy komunikat błędu
// inputElement.setCustomValidity("Wprowadź poprawną wartość!");

// // Wywołaj raport walidacji, dzięki czemu przeglądarka wyświetli komunikat
// inputElement.reportValidity();

// Opcjonalnie: resetowanie komunikatu błędu po modyfikacji inputu
inputElements.forEach((inputElement) => {
  inputElement.addEventListener("input", function () {
    inputElement.setCustomValidity("");
  });
});

const inputElement = document.getElementById("test");

// Ustaw niestandardowy komunikat błędu
inputElement.setCustomValidity("Wprowadź poprawną wartość!");

// Wywołaj raport walidacji, dzięki czemu przeglądarka wyświetli komunikat
inputElement.reportValidity();
