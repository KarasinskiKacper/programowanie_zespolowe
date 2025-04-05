const editTaksWrapper = document.querySelector(".edit-task__wrapper");
const allDayCheckbox = document.querySelector(".edit-task__all_day_check");
const repeatSelect = document.querySelector(".edit-task__repeat-select");
const disableableInputs = document.querySelectorAll(
  ".edit-task__input--disableable"
);
const dateInput = document.querySelectorAll(".edit-task__input-date");
const timeInput = document.querySelectorAll(".edit-task__input-time");

editTaksWrapper.addEventListener("click", (e) => {
  if (e.target.className === "edit-task__wrapper") {
    editTaksWrapper.classList.add("edit-task__wrapper--hidden");
  }
});

// listener przełączający inputy po kliknięciu checkboxa
allDayCheckbox.addEventListener("change", () => {
  if (allDayCheckbox.checked) {
    disableableInputs.forEach((input) => (input.disabled = true));
    timeInput[0].value = "00:00";
    timeInput[1].value = "23:59";
    if (repeatSelect.value !== "none") {
      dateInput[1].disabled = false;
    }
  } else {
    disableableInputs.forEach((input) => (input.disabled = false));
  }
});
// wyłączenie disabled dla daty końcowej po ustawieniu zadania na powtarzające się
repeatSelect.addEventListener("change", () => {
  if (repeatSelect.value !== "none") {
    dateInput[1].disabled = false;
  } else if (allDayCheckbox.checked) {
    dateInput[1].disabled = true;
  }
});
