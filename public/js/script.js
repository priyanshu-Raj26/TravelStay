(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

const taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch?.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (info of taxInfo) {
    if (info.style.display !== "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});

document.querySelectorAll(".confirm-delete-form").forEach((form) => {
  const button = form.querySelector(".confirm-delete-btn");
  const originalLabel = button.textContent.trim();
  let confirmationPending = false;
  let resetTimer;

  form.addEventListener("submit", (event) => {
    if (confirmationPending) return;

    event.preventDefault();
    confirmationPending = true;
    button.textContent = button.dataset.confirmLabel;
    button.classList.add("confirm-delete-btn-pending");
    button.setAttribute(
      "aria-label",
      `${button.dataset.confirmLabel} Click again to confirm`,
    );
    button.focus();

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      confirmationPending = false;
      button.textContent = originalLabel;
      button.classList.remove("confirm-delete-btn-pending");
      button.removeAttribute("aria-label");
    }, 3000);
  });
});
