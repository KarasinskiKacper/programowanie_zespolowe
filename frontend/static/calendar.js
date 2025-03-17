// 09.2025, 11.2025
function monday_first(day) {
  return (day + 6) % 7;
}
const now = new Date(date);
const calendar = [];
let week = [];

let my_date = new Date(date);

my_date.setDate(1);
if (monday_first(my_date.getDay()) != 0) {
  my_date.setDate(0);
  my_date.setDate(my_date.getDate() - monday_first(my_date.getDay()));
}

while (
  my_date.getMonth() <= now.getMonth() ||
  (my_date.getMonth() == 11 && now.getMonth() == 0) ||
  0 != week.length
) {
  week.push(my_date.getDate());
  if (week.length == 7) {
    calendar.push(week);
    week = [];
  }
  my_date.setDate(my_date.getDate() + 1);
}
console.log("aaa");
