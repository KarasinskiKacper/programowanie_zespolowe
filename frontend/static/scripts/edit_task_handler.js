const editTaksWrapper = document.querySelector(".edit-task__wrapper");

editTaksWrapper.addEventListener("click", (e) => {
  if (e.target.className === "edit-task__wrapper") {
    // TODO usunąć albo odkomentować
    // if (customRepeatWrapper.classList.contains("add-task__custom-repeat-wrapper--hidden")) {
    editTaksWrapper.classList.add("edit-task__wrapper--hidden");
    // TODO usunąć albo odkomentować
    // } else {
    //   customRepeatWrapper.classList.add("add-task__custom-repeat-wrapper--hidden");
    // }
  }
});
