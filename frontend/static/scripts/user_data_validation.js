// przypisanie elementów do zmiennych
const registerForm = document.querySelector(".login__register");
const loginForm = document.querySelector(".login__login");
const registerEmail = document.getElementById("register_email");
const registerPassword = document.getElementById("register_password");
const registerPhone = document.getElementById("phone");
const inputElements = document.querySelectorAll("input");
const loginPassword = document.getElementById("login_password");
const loginUsername = document.getElementById("login_username");
const registerUsername = document.getElementById("register_username");
const loginSubmit = document.querySelector(".login__submit");

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
  let isRegisterValid = false;
  try {
    registerUser.parse(formData);
    isRegisterValid = true;
  } catch (error) {
    registerForm.er;
    displayErrors(error.errors);
  }

  if (isRegisterValid) {
    const registerData = {
      email: registerEmail.value,
      password: registerPassword.value,
      phone: registerPhone.value,
      username: registerUsername.value
    };
    fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    })
      .then(async (res) => {        
        if (res.ok) {
          window.location.reload()
        } else if (res.status === 409) {
          registerEmail.setCustomValidity("Użytkownik o podanym emailu juz istnieje");
          registerEmail.reportValidity();
          
        } else if (res.status === 419) {
          registerUsername.setCustomValidity("Użytkownik o podanej nazwie użytkownika juz istnieje");
          registerUsername.reportValidity();
          
        } else if (res.status === 420) {
          registerPassword.setCustomValidity("Hasło musi mieć przynajmniej 8 znaków");
          registerPassword.reportValidity();

        } else {
          const errorData = await res.json();
          console.error("Błąd rejestracji:", errorData.message);
        }
      })
}});

// walidacja dla logowania
// obiekt do walidacji logowania
const loginUser = Zod.object({
  LPassword: Zod.string().min(8, "Hasło musi mieć przynajmniej 8 znaków"),
});
// listener uruchamiający walidację dla logowania
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  loginSubmit.setCustomValidity("");
  const formData = {
    LPassword: loginPassword.value,
  };
  let isLoginValid = false;
  try {
    loginUser.parse(formData);
    isLoginValid = true;
  } catch (error) {
    loginForm.er;
    displayErrors(error.errors);
  }
  if (isLoginValid) {
    const loginData = {
      password: loginPassword.value,
      username: loginUsername.value
    }

    fetch("/api/user/login", {
      method: "POST",    
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    })
      .then(async (res) => {
        if (res.ok) {
          window.location.href = '/';
        } else if (res.status === 409) {
          loginSubmit.setCustomValidity("Niepoprawny login lub hasło");
          loginSubmit.reportValidity();
        } else {
          const errorData = await res.json();
        }
      })
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
