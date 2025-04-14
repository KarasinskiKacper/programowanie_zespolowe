const logoutButton = document.getElementById("nav_logout");

let isUser = false;
document.cookie.split("; ").forEach((cookie) => {
  let [name, value] = cookie.split("=");
  if (name === "user_id") {
    isUser = true;
  } 
});
if (isUser) {
    logoutButton.innerHTML = "Wyloguj";
} else{
    logoutButton.innerHTML = "Zaloguj";
}



