function initDropdownButtons() {
  const buttons = document.querySelectorAll(".select_areas_toggle");
  buttons.forEach((button) => {
    button.addEventListener("click", handleDropdownClick);
  });
}

function handleDropdownClick(event) {
  const dropdown = event.currentTarget.closest(".select_areas");
  if (!dropdown) return;
  toggleCustomDropdown(dropdown.id);
}

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

function initDropdownOptions() {
  const options = document.querySelectorAll(".select_areas_option");
  options.forEach((option) => {
    option.addEventListener("click", handleDropdownOption);
  });
}

function handleDropdownOption(event) {
  selectCustomDropdown(event.currentTarget);
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

function initPriorityButtons() {
  const buttons = document.querySelectorAll(".priority_button");
  buttons.forEach((button) => {
    button.addEventListener("click", handlePriorityClick);
  });
}

function handlePriorityClick(event) {
  const priority = event.currentTarget.dataset.priority;
  setPriority(priority);
}

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

function initSubtaskListEvents() {
  const list = document.getElementById("subtasks");
  if (!list) return;
  list.addEventListener("click", handleSubtaskListClick);
}

function handleSubtaskListClick(event) {
  const button = event.target.closest(".subtask_icon");
  if (!button) return;
  handleSubtaskAction(button);
}

function handleSubtaskAction(button) {
  const index = Number(button.dataset.index);
  if (button.dataset.action === "edit") beforeEditSubtask(index);
  if (button.dataset.action === "delete") deleteSubtask(index);
}

function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}

function beforeEditSubtask(index) {
  const subtaskRef = document.getElementById("subtaskListItem" + index);
  const subtext = document.getElementById("subtaskName" + index).innerText;
  subtaskRef.innerHTML = subtaskEditTemplate(subtext, index);
}

function editSubtask(subtext, index) {
  const newValue = document.getElementById(subtext).value;
  if (newValue === null) return;
  updateSubtask(index, newValue);
}

function updateSubtask(index, value) {
  const subtaskRef = document.getElementById("subtaskListItem" + index);
  const trimmedValue = value.trim();
  if (!trimmedValue) return;
  subtasks[index] = trimmedValue;
  subtaskRef.innerHTML = recreateSubtaskTemplate();
  renderSubtasks();
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}