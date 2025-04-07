// przypisanie elementów do zmiennych
const changePasswordFormWrapper = document.querySelector(".change-password__wrapper");

// listener chowający popup
changePasswordFormWrapper.addEventListener("click", (e) => {
  if (e.target.className === "change-password__wrapper") {
    changePasswordFormWrapper.classList.add("change-password__wrapper--hidden");
  }
});
