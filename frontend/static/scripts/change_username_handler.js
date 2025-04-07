// przypisanie elementów do zmiennych
const changeUsernameFormWrapper = document.querySelector(".change-username__wrapper");

// listener chowający popup
changeUsernameFormWrapper.addEventListener("click", (e) => {
  if (e.target.className === "change-username__wrapper") {
    changeUsernameFormWrapper.classList.add("change-username__wrapper--hidden");
  }
});
