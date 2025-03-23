const addTaksWrapper = document.querySelector(".add-taks__wrapper");

addTaksWrapper.addEventListener("click", (e) => {
  if (e.target.className === "add-taks__wrapper") {
    addTaksWrapper.className = "add-taks__wrapper--hidden";
  }
});
