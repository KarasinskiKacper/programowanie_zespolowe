const h1_year = document.querySelector(".month__year");
const h2_month = document.querySelector(".month__month");

let date = new Date(Date.now());

function updateDate() {
  h1_year.innerHTML = date.getFullYear();
  h2_month.innerHTML = date.toLocaleString("pl-PL", {
    month: "long",
  });
}

function changeMonth(offset) {
  date.setMonth(date.getMonth() + offset);
  updateDate(date);
}

updateDate();
