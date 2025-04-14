// przypisanie elementów do zmiennych
const changePasswordFormWrapper = document.querySelector(".change-password__wrapper");
const newPassword = document.getElementsByName("newPassword")[0]

// listener chowający popup
changePasswordFormWrapper.addEventListener("click", (e) => {
  if (e.target.className === "change-password__wrapper") {
    changePasswordFormWrapper.classList.add("change-password__wrapper--hidden");
  }
});
const changePasswordForm = document.querySelector(".change-password__form");

changePasswordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const oldPasswordInput = changePasswordForm.querySelector('input[name="oldPassword"]');
  const newPasswordInput = changePasswordForm.querySelector('input[name="newPassword"]');
  const old_password = oldPasswordInput.value;
  const new_password = newPasswordInput.value

  newPassword.setCustomValidity("");
  newPassword.reportValidity();

  fetch("/api/user/change_password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        old_password: old_password,
        new_password: new_password
})
  })
  .then(async (res) => {
    if (res.ok) {
      window.location.reload();
    } else {
      newPassword.setCustomValidity("Podaj prawidłowe hasło");
      newPassword.reportValidity();
    }
  });
});