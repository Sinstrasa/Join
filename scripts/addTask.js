const baseUrl =
  "https://joindb-ccbc2-default-rtdb.europe-west1.firebasedatabase.app/";

let selectedPriority = "Medium";
let subtasks = [];


/* Initialize */

document.addEventListener("DOMContentLoaded", initialiseAddTask);

function initialiseAddTask() {
  setPriority("Medium");
  setupOutsideClick();
}


/* Navigation */

function openDialog(reference) {
  const dialogRef = document.getElementById(reference);
  if (!dialogRef) return;
  dialogRef.showModal();
}

function closeDialog(reference) {
  const dialogRef = document.getElementById(reference);
  if (!dialogRef) return;
  dialogRef.close();
}

function stopPropagation(event) {
  event.stopPropagation();
}


/* Dropdowns */

function toggleCustomDropdown(id) {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;
  closeOtherDropdowns(id);
  dropdown.classList.toggle("open");
}

function closeOtherDropdowns(currentId) {
  document.querySelectorAll(".select_areas.open").forEach((dropdown) => {
    if (dropdown.id !== currentId) dropdown.classList.remove("open");
  });
}

function selectCustomDropdown(optionButton) {
  const dropdown = optionButton.closest(".select_areas");
  if (!dropdown) return;
  updateDropdownValue(dropdown, optionButton);
  dropdown.classList.remove("open");
}

function updateDropdownValue(dropdown, optionButton) {
  const hiddenInput = dropdown.querySelector('input[type="hidden"]');
  const valueLabel = dropdown.querySelector(".select_areas_value");
  if (hiddenInput) hiddenInput.value = optionButton.dataset.value;
  if (valueLabel) valueLabel.textContent = optionButton.textContent.trim();
}

function setupOutsideClick() {
  document.addEventListener("click", handleOutsideClick);
}

function handleOutsideClick(event) {
  if (event.target.closest(".select_areas")) return;
  closeAllDropdowns();
}

function closeAllDropdowns() {
  document.querySelectorAll(".select_areas.open").forEach((dropdown) => {
    dropdown.classList.remove("open");
  });
}


/* Priority */

function setPriority(priority) {
  selectedPriority = priority;
  resetPriorityButtons();
  activatePriorityButton(priority);
}

function resetPriorityButtons() {
  document.querySelectorAll(".priority_button").forEach((button) => {
    removePriorityClasses(button);
  });
}

function removePriorityClasses(button) {
  button.classList.remove(
    "priority_urgent_active",
    "priority_medium_active",
    "priority_low_active"
  );
}

function activatePriorityButton(priority) {
  const button = getPriorityButton(priority);
  if (!button) return;
  button.classList.add(getPriorityClass(priority));
}

function getPriorityButton(priority) {
  return document.querySelector(`[data-priority="${priority}"]`);
}

function getPriorityClass(priority) {
  if (priority === "Urgent") return "priority_urgent_active";
  if (priority === "Low") return "priority_low_active";
  return "priority_medium_active";
}


/* Subtasks */

function removeInput() {
  const inputRef = document.getElementById("subtaskInput");
  if (!inputRef) return;
  inputRef.value = "";
}

function addInput() {
  const value = getSubtaskInputValue();
  if (!value) return;
  subtasks.push(value);
  renderSubtasks();
  removeInput();
}

function getSubtaskInputValue() {
  const inputRef = document.getElementById("subtaskInput");
  if (!inputRef) return "";
  return inputRef.value.trim();
}

function renderSubtasks() {
  const list = document.getElementById("subtasks");
  if (!list) return;
  list.innerHTML = subtasks.map(createSubtaskTemplate).join("");
}

function createSubtaskTemplate(subtask, index) {
  return `
    <li>
      <p class="subtask_text">${escapeHtml(subtask)}</p>
      ${createEditButton(index)}
      <div class="subtask_middle"></div>
      ${createDeleteButton(index)}
    </li>
  `;
}

function createEditButton(index) {
  return `
    <button class="subtask_icon" type="button"
      onclick="editSubtask(${index})" aria-label="Edit subtask">
      <img src="../assets/img/summary/penValidate.svg" alt="Edit subtask" />
    </button>
  `;
}

function createDeleteButton(index) {
  return `
    <button class="subtask_icon" type="button"
      onclick="deleteSubtask(${index})" aria-label="Delete subtask">
      <img src="../assets/img/general/delete.svg" alt="Delete subtask" />
    </button>
  `;
}

function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}

function editSubtask(index) {
  const newValue = prompt("Edit subtask:", subtasks[index]);
  if (newValue === null) return;
  updateSubtask(index, newValue);
}

function updateSubtask(index, value) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return;
  subtasks[index] = trimmedValue;
  renderSubtasks();
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}


/* Validation */

function validateTask() {
  const requiredValues = getRequiredValues();
  return requiredValues.every(Boolean);
}

function getRequiredValues() {
  return [
    getInputValue("taskTitle"),
    getInputValue("dueDate"),
    getInputValue("category"),
  ];
}

function getInputValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}


/* Create Task */

async function createTask() {
  if (!validateTask()) return showValidationError();
  const task = collectTaskData();
  await saveTask(task);
}

function showValidationError() {
  alert("Please fill in all required fields.");
}

function collectTaskData() {
  return {
    id: Date.now(),
    title: getInputValue("taskTitle"),
    description: getInputValue("description"),
    date: getInputValue("dueDate"),
    priority: selectedPriority,
    assigned: getAssignedContacts(),
    category: getInputValue("category"),
    subtasks: [...subtasks],
    status: "toDo",
  };
}

function getAssignedContacts() {
  const assigned = getInputValue("assigned");
  return assigned ? [assigned] : [];
}

async function saveTask(task) {
  try {
    await postData("/tickets", task);
    handleSuccessfulTaskCreation();
  } catch (error) {
    handleTaskCreationError(error);
  }
}

function handleSuccessfulTaskCreation() {
  clearTaskForm();
  alert("Task created successfully.");
}

function handleTaskCreationError(error) {
  console.error("Task could not be created:", error);
  alert("Task could not be created.");
}

async function postData(path = "", data = {}) {
  const response = await fetch(baseUrl + path + ".json", getPostOptions(data));
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return await response.json();
}

function getPostOptions(data) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}


/* Clear Form */

function clearTaskForm() {
  clearTextInputs();
  clearHiddenInputs();
  resetDropdownLabels();
  resetSubtasks();
  setPriority("Medium");
}

function clearTextInputs() {
  clearInput("taskTitle");
  clearInput("description");
  clearInput("dueDate");
  clearInput("subtaskInput");
}

function clearHiddenInputs() {
  clearInput("assigned");
  clearInput("category");
}

function clearInput(id) {
  const input = document.getElementById(id);
  if (input) input.value = "";
}

function resetDropdownLabels() {
  setDropdownLabel("assignedDropdown", "Select contacts to assign");
  setDropdownLabel("categoryDropdown", "Select task category");
}

function setDropdownLabel(id, text) {
  const label = document.querySelector(`#${id} .select_areas_value`);
  if (label) label.textContent = text;
}

function resetSubtasks() {
  subtasks = [];
  renderSubtasks();
}