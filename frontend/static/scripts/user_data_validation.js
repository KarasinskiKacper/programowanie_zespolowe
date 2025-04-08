// przypisanie elementów do zmiennych
const registerForm = document.querySelector(".login__register");
const loginForm = document.querySelector(".login__login");
const registerEmail = document.getElementById("register_email");
const registerPassword = document.getElementById("register_password");
const registerPhone = document.getElementById("phone");
const inputElements = document.querySelectorAll("input");
const loginPassword = document.getElementById("login_password");

// walidacja dla rejestracji
// obiekt do walidacji rejestracji
const phoneRegex = /^\+?[1-9][0-9]{8,10}$/;
const registerUser = Zod.object({
  Email: Zod.string().email("Podaj prawidłowy email"),
  RPassword: Zod.string().min(8, "Hasło musi mieć przynajmniej 8 znaków"),
  phone_num: Zod.preprocess(
    (value) => String(value),
    Zod.string().regex(phoneRegex, "Podaj prawidłowy numer telefonu")
  ),
});

// listener uruchamiający walidację dla rejestracji
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = {
    Email: registerEmail.value,
    RPassword: registerPassword.value,
    phone_num: Number(registerPhone.value),
  };
  try {
    registerUser.parse(formData);
    registerForm.submit();
  } catch (error) {
    registerForm.er;
    displayErrors(error.errors);
  }
});

// walidacja dla logowania
// obiekt do walidacji logowania
const loginUser = Zod.object({
  LPassword: Zod.string().min(8, "Hasło musi mieć przynajmniej 8 znaków"),
});
// listener uruchamiający walidację dla logowania
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = {
    LPassword: loginPassword.value,
  };

  try {
    loginUser.parse(formData);
    loginForm.submit();
  } catch (error) {
    loginForm.er;
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

    // dla rejestracji
    if (field === "phone_num") {
      registerPhone.setCustomValidity("Podaj prawidłowy numer telefonu");
      registerPhone.reportValidity();
    } else if (field === "Email") {
      registerEmail.setCustomValidity("Podaj prawidłowy email");
      registerEmail.reportValidity();
    } else if (field === "RPassword") {
      registerPassword.setCustomValidity("Hasło musi mieć przynajmniej 8 znaków");
      registerPassword.reportValidity();
    }
    // dla logowania
    else if (field === "LPassword") {
      loginPassword.setCustomValidity("Hasło musi mieć przynajmniej 8 znaków");
      loginPassword.reportValidity();
    }
  });
}

// resetowanie komunikatu błędu po modyfikacji input'u
inputElements.forEach((inputElement) => {
  inputElement.addEventListener("input", function () {
    inputElement.setCustomValidity("");
  });
});
