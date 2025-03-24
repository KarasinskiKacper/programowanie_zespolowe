// przypisanie elementów do zmiennych
const addTaksWrapper = document.querySelector(".add-task__wrapper");
const allDayCheckbox = document.querySelector(".add-task__all_day_check");
const disableableInputs = document.querySelectorAll(".add-task__input--disableable");
const repeatSelect = document.querySelector(".add-task__repeat-select");
const dateInput = document.querySelectorAll(".add-task__input-date");
const timeInput = document.querySelectorAll(".add-task__input-time");
// TODO usunąć albo odkomentować
// const customRepeatWrapper = document.querySelector(
//   ".add-task__custom-repeat-wrapper"
// );

// listenery chowające popup po kliknięciu poza jego obszar
// listener ogólny
addTaksWrapper.addEventListener("click", (e) => {
  if (e.target.className === "add-task__wrapper") {
    if (customRepeatWrapper.classList.contains("add-task__custom-repeat-wrapper--hidden")) {
      addTaksWrapper.classList.add("add-task__wrapper--hidden");
    } else {
      customRepeatWrapper.classList.add("add-task__custom-repeat-wrapper--hidden");
    }
  }
});
// TODO usunąć albo odkomentować
// listener tylko dla popupa niestandardowego powtarzania
// customRepeatWrapper.addEventListener("click", (e) => {
//   if (e.target.className === "add-task__custom-repeat-wrapper") {
//     customRepeatWrapper.classList.add(
//       "add-task__custom-repeat-wrapper--hidden"
//     );
//   }
// });

// listener przełączający inputy po kliknięciu checkboxa
allDayCheckbox.addEventListener("change", () => {
  if (allDayCheckbox.checked) {
    disableableInputs.forEach((input) => (input.disabled = true));
    timeInput[0].value = "00:00";
    timeInput[1].value = "23:59";
  } else {
    disableableInputs.forEach((input) => (input.disabled = false));
  }
});

// ustawienie domyślych wartości dla dat i godzin
let timeDate = new Date();
let timeDateValues = timeDate.toISOString().split("T");

dateInput[0].value = timeDateValues[0];
timeInput[0].value = timeDateValues[1].split(":")[0] + ":" + timeDateValues[1].split(":")[1];

timeDate.setHours(timeDate.getHours() + 1);
timeDateValues = timeDate.toISOString().split("T");

dateInput[1].value = timeDateValues[0];
timeInput[1].value = timeDateValues[1].split(":")[0] + ":" + timeDateValues[1].split(":")[1];

// zabezpieczenie przed ustawieniem daty końcowej wcześniejszej niż początkowej dla dat
dateInput[1].min = dateInput[0].value;
dateInput[0].addEventListener("change", () => {
  dateInput[1].min = dateInput[0].value;
  if (dateInput[0].value === dateInput[1].value) {
    timeInput[1].min = timeInput[0].value;
  }
  if (dateInput[0].value > dateInput[1].value) {
    dateInput[1].value = dateInput[0].value;
  }
});

// zabezpieczenie przed ustawieniem daty końcowej wcześniejszej niż początkowej dla godzin
timeInput[1].min = timeInput[0].value;
timeInput[0].addEventListener("change", () => {
  if (dateInput[0].value === dateInput[1].value) {
    timeInput[1].min = timeInput[0].value;
  }
});
dateInput[1].addEventListener("change", () => {
  if (dateInput[0].value === dateInput[1].value) {
    timeInput[1].min = timeInput[0].value;
  }
});

// TODO usunąć albo odkomentować
// listener włączający popup niestandardowego powtarzania po wybraniu opcji "Niestandardowe"
// let isCustom = false;
// repeatSelect.addEventListener("click", () => {
//   if (repeatSelect.value === "custom" && !isCustom) {
//     document
//       .querySelector(".add-task__custom-repeat-wrapper")
//       .classList.remove("add-task__custom-repeat-wrapper--hidden");
//     isCustom = true;
//   } else {
//     isCustom = false;
//   }
// });
