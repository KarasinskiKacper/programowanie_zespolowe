// przypisanie elementów do zmiennych
const deleteAccountFormWrapper = document.getElementById("delete_account_confirmation");
const deleteAccountCancelButton = document.getElementById(
  "delete_account_confirmation-cancel-button"
);
const deleteAccountForm = deleteAccountFormWrapper.querySelector("form");

// listenery chowające popup
deleteAccountFormWrapper.addEventListener("click", (e) => {
  if (e.target.id === "delete_account_confirmation") {
    deleteAccountFormWrapper.classList.add("confirmation__wrapper--hidden");
  }
});
deleteAccountCancelButton.addEventListener("click", () => {
  deleteAccountFormWrapper.classList.add("confirmation__wrapper--hidden");
});


deleteAccountForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("/api/user/delete_account", {
      method: "POST",
    });

    if (response.ok) {
      const result = await response.json();
      window.location.href = "/login";
    } else {
      console.error("Błąd usuwania konta");
    }
  } catch (error) {
    console.error("Wystąpił błąd:", error);
  }
});

