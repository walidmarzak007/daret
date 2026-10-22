
"use strict";

const participantsList = document.getElementById("participants-liste");
const addParticipantButton = document.getElementById("ajouter-participant");
const participantsCounter = document.getElementById("participants-compteur");

const minParticipants = Number(participantsList.dataset.min);
const maxParticipants = Number(participantsList.dataset.max);

function createParticipantField() {
  const participantCount = participantsList.children.length;

  const listItem = document.createElement("li");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const removeButton = document.createElement("button");
  const error = document.createElement("p");

  const participantNumber = participantCount + 1;
  const inputId = `participant-${participantNumber}`;
  const errorId = `${inputId}-erreur`;

  label.htmlFor = inputId;
  label.className = "block font-medium";
  label.textContent = `Participant ${participantNumber}`;

  input.type = "text";
  input.id = inputId;
  input.name = "participants";
  input.autocomplete = "off";
  input.className =
    "mt-1 w-full rounded border border-daret-bordure px-3 py-2";
  input.setAttribute("aria-describedby", errorId);

  error.id = errorId;
  error.className = "mt-1 hidden text-sm font-medium text-daret-erreur";

  removeButton.type = "button";
  removeButton.textContent = "Retirer";
  removeButton.dataset.action = "retirer-participant";
  removeButton.className =
    "mt-2 rounded border border-daret-bordure px-3 py-1";

  listItem.append(label, input, error, removeButton);
  participantsList.append(listItem);
}
function renumberParticipants() {
  const items = participantsList.querySelectorAll("li");

  items.forEach((item, index) => {
    const number = index + 1;
    const label = item.querySelector("label");
    const input = item.querySelector("input");

    label.textContent = `Participant ${number}`;
    input.id = `participant-${number}`;
    label.htmlFor = input.id;

    const error = item.querySelector("p");
    error.id = `${input.id}-erreur`;
    input.setAttribute("aria-describedby", error.id);
  });
}
function updateParticipantsInterface() {
  const count = participantsList.children.length;

  participantsCounter.textContent =
    `${count} participant${count > 1 ? "s" : ""}`;

  addParticipantButton.disabled = count >= maxParticipants;

  participantsList
    .querySelectorAll('[data-action="retirer-participant"]')
    .forEach((button) => {
      button.disabled = count <= minParticipants;
    });
}

addParticipantButton.addEventListener("click", function () {
  if (participantsList.children.length >= maxParticipants) {
    return;
  }

  createParticipantField();
  updateParticipantsInterface();
});

participantsList.addEventListener("click", function (event) {
  const removeButton = event.target.closest(
    '[data-action="retirer-participant"]'
  );

  if (!removeButton || !participantsList.contains(removeButton)) {
    return;
  }

  if (participantsList.children.length <= minParticipants) {
    return;
  }

removeButton.closest("li").remove();
renumberParticipants();
updateParticipantsInterface();
});

for (let i = 0; i < 3; i++) {
  createParticipantField();
}

updateParticipantsInterface();

const circleNameInput = document.getElementById("nom-cercle");
const contributionInput = document.getElementById("cotisation");
const frequencyInput = document.getElementById("periodicite");
const startDateInput = document.getElementById("date-debut");
const daretForm = document.getElementById("daret-form");

const circleNameRegex = /^[\p{L}\p{M}0-9 -]{3,40}$/u;
const nameRegex = /^[\p{L}\p{M}'-]{2,30}$/u;
function validateCircleName() {
  const name = circleNameInput.value.trim();
  const error = document.getElementById("nom-cercle-erreur");

  if (!circleNameRegex.test(name)) {
    error.textContent =
      "Le nom doit contenir 3 à 40 caractères : lettres, chiffres, espaces ou tirets.";
    error.classList.remove("hidden");

    circleNameInput.setAttribute("aria-invalid", "true");
    circleNameInput.setAttribute(
      "aria-describedby",
      "nom-cercle-erreur"
    );

    return false;
  }

  error.textContent = "";
  error.classList.add("hidden");
  circleNameInput.removeAttribute("aria-invalid");
  circleNameInput.removeAttribute("aria-describedby");

  return true;
}

circleNameInput.addEventListener("input", validateCircleName);

function validateContribution() {
  const value = Number(contributionInput.value);
  const error = document.getElementById("cotisation-erreur");

  const isValid =
    contributionInput.value.trim() !== "" &&
    Number.isInteger(value) &&
    value >= 100 &&
    value <= 50000;

  if (!isValid) {
    error.textContent =
      "La cotisation doit être un nombre entier entre 100 et 50 000 MAD.";
    error.classList.remove("hidden");
    contributionInput.setAttribute("aria-invalid", "true");
    contributionInput.setAttribute(
      "aria-describedby",
      "cotisation-erreur"
    );
    return false;
  }

  error.textContent = "";
  error.classList.add("hidden");
  contributionInput.removeAttribute("aria-invalid");
  contributionInput.setAttribute(
    "aria-describedby",
    "cotisation-erreur"
  );

  return true;
}

contributionInput.addEventListener("input", validateContribution);

function validateStartDate() {
  const value = startDateInput.value;
  const error = document.getElementById("date-debut-erreur");
 // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayString = `${year}-${month}-${day}`;
  if (value === "" || value < todayString) {
    error.textContent =
      "La date de début doit être aujourd'hui ou une date future.";
    error.classList.remove("hidden");
    startDateInput.setAttribute("aria-invalid", "true");
    startDateInput.setAttribute(
      "aria-describedby",
      "date-debut-erreur"
    );
 return false;
  }
  error.textContent = "";
  error.classList.add("hidden");
  startDateInput.removeAttribute("aria-invalid");
  startDateInput.setAttribute(
    "aria-describedby",
    "date-debut-erreur"
  );

  return true;
}



startDateInput.addEventListener("change", validateStartDate);

function validateFrequency() {
  const value = frequencyInput.value;
  const error = document.getElementById("periodicite-erreur");

  const allowedFrequencies = [
    "hebdomadaire",
    "quinzaine",
    "mensuelle"
  ];

  if (!allowedFrequencies.includes(value)) {
    error.textContent = "Veuillez choisir une fréquence valide.";
    error.classList.remove("hidden");
    frequencyInput.setAttribute("aria-invalid", "true");
    frequencyInput.setAttribute(
      "aria-describedby",
      "periodicite-erreur"
    );
    return false;
  }

  error.textContent = "";
  error.classList.add("hidden");
  frequencyInput.removeAttribute("aria-invalid");
  frequencyInput.setAttribute(
    "aria-describedby",
    "periodicite-erreur"
  );

  return true;
}

function validateParticipants() {
  const inputs = participantsList.querySelectorAll(
    'input[name="participants"]'
  );

  const nameRegex = /^[\p{L}\p{M}'-]{2,30}$/u;
  const usedNames = new Set();
  let allValid = true;

  inputs.forEach((input) => {
    const name = input.value.trim();
    const normalizedName = name.toLocaleLowerCase();
    const error = document.getElementById(`${input.id}-erreur`);

    let message = "";

    if (name.length < 2 || name.length > 30) {
      message = "Le prénom doit contenir entre 2 et 30 caractères.";
    } else if (!nameRegex.test(name)) {
      message =
        "Utilisez uniquement des lettres, accents, apostrophes ou tirets.";
    } else if (usedNames.has(normalizedName)) {
      message = "Chaque participant doit avoir un prénom différent.";
    }

    if (message !== "") {
      error.textContent = message;
      error.classList.remove("hidden");
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", error.id);
      allValid = false;
    } else {
      error.textContent = "";
      error.classList.add("hidden");
      input.removeAttribute("aria-invalid");
      input.setAttribute("aria-describedby", error.id);
      usedNames.add(normalizedName);
    }
  });

  return allValid;
}

daretForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const isCircleNameValid = validateCircleName();
  const isContributionValid = validateContribution();
  const isFrequencyValid = validateFrequency();
  const isStartDateValid = validateStartDate();
  const areParticipantsValid = validateParticipants();

  if (
    !isCircleNameValid ||
    !isContributionValid ||
    !isFrequencyValid ||
    !isStartDateValid ||
    !areParticipantsValid
  ) {
    const firstInvalidField = daretForm.querySelector(
      '[aria-invalid="true"]'
    );

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return;
  }

});


