import { mondayFirst } from "./utils.js";

/**
 * Generuje kalendarz miesiaca na podstawie podanej daty.
 *
 * @param {Date} date - Bazowa data do generowania kalendarza.
 * @param {number} [offset=0] - Przesunięcie (w miesiącach) względem obecnie ustawionej daty.
 *
 * @returns {Object} Obiekt zawierający::
 *  - {Array} calendar: Tablica 2D zawierająca numery dni w miesiacu.
 *  - {string} month: Nazwa miesiaca.
 */
export function generateCalendar(date, offset = 0) {
  // stworzenie zmiennych przechowujących daty i zmiana daty o offset
  // smallCalendarBaseDate - zmienna przechowująca miesiąc do którego generowany jest kalendarz
  // smallCalendarDate - zmienna pomocnicza do generowania struktury kalendarza
  let smallCalendarBaseDate = new Date(date);
  let smallCalendarDate = new Date(date);
  smallCalendarBaseDate.setMonth(smallCalendarBaseDate.getMonth() + offset);
  smallCalendarDate.setMonth(smallCalendarDate.getMonth() + offset);
  smallCalendarDate.setDate(1);

  if (mondayFirst(smallCalendarDate.getDay()) != 0) {
    smallCalendarDate.setDate(0);
    smallCalendarDate.setDate(
      smallCalendarDate.getDate() - mondayFirst(smallCalendarDate.getDay())
    );
  }

  // generowanie nazwy miesiaca
  const month = smallCalendarBaseDate.toLocaleString("pl-PL", {
    month: "long",
  });

  // generowanie dat
  let isPastMonth = true;
  let calendar = [];
  let week = [];
  while (
    smallCalendarDate.getMonth() == smallCalendarBaseDate.getMonth() ||
    week.length != 0 ||
    isPastMonth
  ) {
    week.push(smallCalendarDate.getDate());
    if (week.length == 7) {
      calendar.push(week);
      week = [];
    }
    smallCalendarDate.setDate(smallCalendarDate.getDate() + 1);

    if (smallCalendarDate.getMonth() == smallCalendarBaseDate.getMonth()) {
      isPastMonth = false;
    }
  }

  return { calendar, month };
}
