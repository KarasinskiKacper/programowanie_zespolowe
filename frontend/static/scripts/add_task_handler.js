const addTaksWrapper = document.querySelector(".add-task__wrapper");

addTaksWrapper.addEventListener("click", (e) => {
  if (e.target.className === "add-task__wrapper") {
    addTaksWrapper.classList.add("add-task__wrapper--hidden");
  }
});
