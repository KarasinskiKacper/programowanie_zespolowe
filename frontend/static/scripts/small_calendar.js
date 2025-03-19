export function create_small_calendars(date) {
  function monday_first(day) {
    return (day + 6) % 7;
  }

  let small_calendar_base_date;

  function generate_calendar(offset) {
    // stworzenie zmiennych przechowujących daty i zmiana daty o offset
    // small_calendar_base_date - zmienna przechowująca miesiąc do którego generowany jest kalendarz
    // small_calendar_date - zmienna pomocnicza do generowania struktury kalendarza
    small_calendar_base_date = new Date(date);
    let small_calendar_date = new Date(date);
    small_calendar_base_date.setMonth(
      small_calendar_base_date.getMonth() + offset
    );
    small_calendar_date.setMonth(small_calendar_date.getMonth() + offset);
    small_calendar_date.setDate(1);

    if (monday_first(small_calendar_date.getDay()) != 0) {
      small_calendar_date.setDate(0);
      small_calendar_date.setDate(
        small_calendar_date.getDate() -
          monday_first(small_calendar_date.getDay())
      );
    }

    // ustawienie nazwy miesiaca
    const small_calendar_month = document.getElementById(
      `small-calendar__month-${offset == -1 ? "past" : "future"}`
    );
    small_calendar_month.innerHTML = small_calendar_base_date.toLocaleString(
      "pl-PL",
      {
        month: "long",
      }
    );

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

      if (
        small_calendar_date.getMonth() == small_calendar_base_date.getMonth()
      ) {
        is_past_month = false;
      }
    }

    // wygenerowanie html (dni kalendarza)
    const small_calendar__days_wrapper = document.getElementById(
      `small-calendar__days-wrapper-${offset == -1 ? "past" : "future"}`
    );
    let new_innerhtml = "";
    let counter = 1;
    calendar.forEach((week) => {
      week.forEach((day) => {
        if (day === counter) {
          new_innerhtml += `<p class="small-calendar__days numeric-font">${day}</p>`;
          counter++;
        } else {
          new_innerhtml += `<p class="small-calendar__days numeric-font"></p>`;
        }
      });
    });
    for (let i = calendar.length; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        new_innerhtml += `<p class="small-calendar__days numeric-font"></p>`;
      }
    }
    small_calendar__days_wrapper.innerHTML = new_innerhtml;
  }

  // wywołanie dla kalendarza z poprzedniego miesiąca
  generate_calendar(-1);
  // wywołanie dla kalendarza z następnego miesiąca
  generate_calendar(1);
}
