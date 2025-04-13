const button = document.querySelector(".schedule__btn");

button.addEventListener("click", () => {
  document
    .querySelector(".add-task__wrapper")
    .classList.remove("add-task__wrapper--hidden");
});
