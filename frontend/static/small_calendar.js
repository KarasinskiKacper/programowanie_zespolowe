function create_small_calendar(offset = 0) {
  function monday_first(day) {
    return (day + 6) % 7;
  }
  var now = new Date('{{ date.strftime("%Y-%m-%dT%H:%M:%S") }}');
  now.setMonth(now.getMonth() + offset);
  var calendar = [];
  var week = [];

  var small_calendar_date = new Date(
    '{{ date.strftime("%Y-%m-%dT%H:%M:%S") }}'
  );
  small_calendar_date.setMonth(small_calendar_date.getMonth() + offset);

  small_calendar_date.setDate(1);
  if (monday_first(small_calendar_date.getDay()) != 0) {
    small_calendar_date.setDate(0);
    small_calendar_date.setDate(
      small_calendar_date.getDate() - monday_first(small_calendar_date.getDay())
    );
  }

  while (
    small_calendar_date.getMonth() <= now.getMonth() ||
    (small_calendar_date.getMonth() == 11 && now.getMonth() == 0) ||
    0 != week.length
  ) {
    week.push(small_calendar_date.getDate());
    if (week.length == 7) {
      calendar.push(week);
      week = [];
    }
    small_calendar_date.setDate(small_calendar_date.getDate() + 1);
  }
  console.log(calendar);
  console.log(small_calendar_date);
}
create_small_calendar(-1);
