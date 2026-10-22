
"use strict";

// 1. Select the elements we need from the HTML
const participantsList = document.getElementById("participants-liste");
const addParticipantButton = document.getElementById("ajouter-participant");
const participantsCounter = document.getElementById("participants-compteur");

// 2. Read the minimum and maximum from the HTML data attributes
const minParticipants = Number(participantsList.dataset.min);
const maxParticipants = Number(participantsList.dataset.max);

// 3. Create one participant field
function createParticipantField() {
  const participantCount = participantsList.children.length;

  // Create the elements
  const listItem = document.createElement("li");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const removeButton = document.createElement("button");
  const error = document.createElement("p");

  // Give each field a unique ID
  const participantNumber = participantCount + 1;
  const inputId = `participant-${participantNumber}`;
  const errorId = `${inputId}-erreur`;

  // Configure the label
  label.htmlFor = inputId;
  label.className = "block font-medium";
  label.textContent = `Participant ${participantNumber}`;

  // Configure the input
  input.type = "text";
  input.id = inputId;
  input.name = "participants";
  input.autocomplete = "off";
  input.className =
    "mt-1 w-full rounded border border-daret-bordure px-3 py-2";
  input.setAttribute("aria-describedby", errorId);

  // Configure the error message
  error.id = errorId;
  error.className = "mt-1 hidden text-sm font-medium text-daret-erreur";

  // Configure the remove button
  removeButton.type = "button";
  removeButton.textContent = "Retirer";
  removeButton.dataset.action = "retirer-participant";
  removeButton.className =
    "mt-2 rounded border border-daret-bordure px-3 py-1";

  // Assemble the elements
  listItem.append(label, input, error, removeButton);
  participantsList.append(listItem);
}

// 4. Update the participant counter and button states
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

// 5. Add a participant when the user clicks the add button
addParticipantButton.addEventListener("click", function () {
  if (participantsList.children.length >= maxParticipants) {
    return;
  }

  createParticipantField();
  updateParticipantsInterface();
});

// 6. One delegated listener handles all remove buttons
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
  updateParticipantsInterface();
});

// 7. Start with three participant fields
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

  if (contributionInput.value.trim() === "" || !Number.isFinite(value) || value <= 0) {
    error.textContent = "La cotisation doit être un nombre supérieur à zéro.";
    error.classList.remove("hidden");
    contributionInput.setAttribute("aria-invalid", "true");
    return false;
  }

  error.textContent = "";
  error.classList.add("hidden");
  contributionInput.removeAttribute("aria-invalid");
  return true;
}
contributionInput.addEventListener("input", validateContribution);
function validateStartDate() {
  const value = startDateInput.value;
  const error = document.getElementById("date-debut-erreur");

  if (value === "") {
    error.textContent = "Veuillez choisir une date de début.";
    error.classList.remove("hidden");
    startDateInput.setAttribute("aria-invalid", "true");
    return false;
  }

  error.textContent = "";
  error.classList.add("hidden");
  startDateInput.removeAttribute("aria-invalid");
  return true;
}

startDateInput.addEventListener("change", validateStartDate);
function validateParticipants() {
  const inputs = participantsList.querySelectorAll(
    'input[name="participants"]'
  );

  let allValid = true;

  inputs.forEach((input) => {
    const name = input.value.trim();
    const error = document.getElementById(`${input.id}-erreur`);

    if (name === "") {
      error.textContent = "Veuillez saisir le nom du participant.";
      error.classList.remove("hidden");
      input.setAttribute("aria-invalid", "true");
      allValid = false;
    } else {
      error.textContent = "";
      error.classList.add("hidden");
      input.removeAttribute("aria-invalid");
    }
  });

  return allValid;
}
daretForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const isCircleNameValid = validateCircleName();
  const isContributionValid = validateContribution();
  const isStartDateValid = validateStartDate();
  const areParticipantsValid = validateParticipants();
if (
  !isCircleNameValid ||
  !isContributionValid ||
  !isStartDateValid ||
  !areParticipantsValid
) {
  return;
}

  console.log("Formulaire valide !");
});

