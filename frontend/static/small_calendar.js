var past_small_calendar_month = document.querySelector(
  ".small-calendar-past",
  ".small-calendar__month"
);
var future_small_calendar_month = document.querySelector(
  ".small-calendar-future",
  ".small-calendar__month"
);

function create_small_calendar() {
  function monday_first(day) {
    return (day + 6) % 7;
  }
  var small_calendar_base_date;
  function generete_calendar(offset) {
    small_calendar_base_date = new Date(date);
    small_calendar_base_date.setMonth(
      small_calendar_base_date.getMonth() + offset
    );
    var calendar = [];
    var week = [];

    var small_calendar_date = new Date(date);
    small_calendar_date.setMonth(small_calendar_date.getMonth() + offset);

    small_calendar_date.setDate(1);
    if (monday_first(small_calendar_date.getDay()) != 0) {
      small_calendar_date.setDate(0);
      small_calendar_date.setDate(
        small_calendar_date.getDate() -
          monday_first(small_calendar_date.getDay())
      );
    }
  }

  // while (
  //   small_calendar_date.getMonth() <= small_calendar_base_date.getMonth() ||
  //   (small_calendar_date.getMonth() == 11 &&
  //     small_calendar_base_date.getMonth() == 0) ||
  //   0 != week.length
  // ) {
  //   week.push(small_calendar_date.getDate());
  //   if (week.length == 7) {
  //     calendar.push(week);
  //     week = [];
  //   }
  //   small_calendar_date.setDate(small_calendar_date.getDate() + 1);
  // }
  // console.log(calendar);
  // console.log(small_calendar_date);
  // console.log(
  //   small_calendar_base_date.toLocaleString("pl-PL", {
  //     month: "long",
  //   })
  // );
  generete_calendar(-1);
  past_small_calendar_month.innerHTML = small_calendar_base_date.toLocaleString(
    "pl-PL",
    {
      month: "long",
    }
  );
  generete_calendar(1);
  future_small_calendar_month.innerHTML =
    small_calendar_base_date.toLocaleString("pl-PL", {
      month: "long",
    });
}
create_small_calendar();
