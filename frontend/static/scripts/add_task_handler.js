// przypisanie do zmiennej: wrappera (tła), checkboxa i wyłączalnych inputów
const addTaksWrapper = document.querySelector(".add-task__wrapper");
const allDayCheckbox = document.querySelector(".add-task__all_day_check");
const disableableInputs = document.querySelectorAll(
  ".add-task__input--disableable"
);

// listener chowający popup po kliknięciu poza jego obszar
addTaksWrapper.addEventListener("click", (e) => {
  if (e.target.className === "add-task__wrapper") {
    addTaksWrapper.classList.add("add-task__wrapper--hidden");
  }
});

// listener przełączający inputy po kliknięciu checkboxa
allDayCheckbox.addEventListener("change", () => {
  if (allDayCheckbox.checked) {
    disableableInputs.forEach((input) => (input.disabled = true));
  } else {
    disableableInputs.forEach((input) => (input.disabled = false));
  }
});
