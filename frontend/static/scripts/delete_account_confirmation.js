// przypisanie elementów do zmiennych
const deleteAccountFormWrapper = document.getElementById("delete_account_confirmation");
const deleteAccountCancelButton = document.getElementById(
  "delete_account_confirmation-cancel-button"
);

// listenery chowające popup
deleteAccountFormWrapper.addEventListener("click", (e) => {
  if (e.target.id === "delete_account_confirmation") {
    deleteAccountFormWrapper.classList.add("confirmation__wrapper--hidden");
  }
});
deleteAccountCancelButton.addEventListener("click", () => {
  deleteAccountFormWrapper.classList.add("confirmation__wrapper--hidden");
});
