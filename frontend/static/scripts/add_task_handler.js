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
    // TODO usunąć albo odkomentować
    // if (customRepeatWrapper.classList.contains("add-task__custom-repeat-wrapper--hidden")) {
    addTaksWrapper.classList.add("add-task__wrapper--hidden");
    // TODO usunąć albo odkomentować
    // } else {
    //   customRepeatWrapper.classList.add("add-task__custom-repeat-wrapper--hidden");
    // }
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

// ustawienie domyślych wartości dla dat i godzin
let timeDate = new Date(Date.now());
let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
let timeDateValues = new Date(timeDate - tzoffset).toISOString().split("T");

dateInput[0].value = timeDateValues[0];
timeInput[0].value = timeDateValues[1].split(":")[0] + ":" + timeDateValues[1].split(":")[1];

timeDate.setHours(timeDate.getHours() + 1);
tzoffset = timeDate.getTimezoneOffset() * 60000; //offset in milliseconds
timeDateValues = new Date(timeDate - tzoffset).toISOString().split("T");

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

/**
 * Ustawienie domyślnych dat dla popupa
 *
 * @param {Date} date - data do ustawienia.
 * @returns {void}
 */
export function setDefaultDates(date) {
  dateInput[0].value = date.toISOString().split("T")[0];
  dateInput[1].value = date.toISOString().split("T")[0];
}

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

document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.querySelector(".add-Task__form");

  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Zapobiega przeładowaniu strony

    const formData = {
      title: document.querySelector(".add-Task__title").value,
      all_day: document.querySelector(".add-task__all_day_check").checked,
      start_date: document.querySelector("[name='start_date']").value,
      start_hour: document.querySelector("[name='start_hour']").value,
      end_date: document.querySelector("[name='end_date']").value,
      end_hour: document.querySelector("[name='end_hour']").value,
      repeat_type: document.querySelector(".add-task__repeat-select").value,
      color: document.querySelector(".add-task__input-color").value,
      description: document.querySelector(".add-task__description").value,
    };

    try {
      const response = await fetch("/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Zadanie dodane!");
        taskForm.reset();
      }
    } catch (error) {
      console.error("Błąd połączenia z serwerem:", error);
    }
    window.location.reload();
  });
});
