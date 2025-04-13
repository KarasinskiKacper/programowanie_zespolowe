// przypisanie elementów do zmiennych
const changeUsernameFormWrapper = document.querySelector(".change-username__wrapper");

// listener chowający popup
changeUsernameFormWrapper.addEventListener("click", (e) => {
  if (e.target.className === "change-username__wrapper") {
    changeUsernameFormWrapper.classList.add("change-username__wrapper--hidden");
  }
});

const changeUsernameForm = document.querySelector(".change-username__form");

changeUsernameForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const usernameInput = changeUsernameForm.querySelector(".change-username__input");
  const username = usernameInput.value;

  fetch("/api/user/change_username", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username }),
  })
  .then(async (res) => {
    if (res.ok) {
      window.location.reload();
    }
  });
});