import { monday_first } from "./utils.js";

export function generate_calendar(date, offset = 0) {
  // stworzenie zmiennych przechowujących daty i zmiana daty o offset
  // small_calendar_base_date - zmienna przechowująca miesiąc do którego generowany jest kalendarz
  // small_calendar_date - zmienna pomocnicza do generowania struktury kalendarza
  let small_calendar_base_date = new Date(date);
  let small_calendar_date = new Date(date);
  small_calendar_base_date.setMonth(
    small_calendar_base_date.getMonth() + offset
  );
  small_calendar_date.setMonth(small_calendar_date.getMonth() + offset);
  small_calendar_date.setDate(1);

  if (monday_first(small_calendar_date.getDay()) != 0) {
    small_calendar_date.setDate(0);
    small_calendar_date.setDate(
      small_calendar_date.getDate() - monday_first(small_calendar_date.getDay())
    );
  }

  // generowanie nazwy miesiaca
  const month = small_calendar_base_date.toLocaleString("pl-PL", {
    month: "long",
  });

  // generowanie dat
  let is_past_month = true;
  let calendar = [];
  let week = [];
  while (
    small_calendar_date.getMonth() == small_calendar_base_date.getMonth() ||
    week.length != 0 ||
    is_past_month
  ) {
    week.push(small_calendar_date.getDate());
    if (week.length == 7) {
      calendar.push(week);
      week = [];
    }
    small_calendar_date.setDate(small_calendar_date.getDate() + 1);

    if (small_calendar_date.getMonth() == small_calendar_base_date.getMonth()) {
      is_past_month = false;
    }
  }

  return { calendar, month };
}
