  const addTaskBaseUrl =
    "https://joindb-ccbc2-default-rtdb.europe-west1.firebasedatabase.app/";

  let selectedPriority = "Medium";
  let subtasks = [];

  function initAddTask() {
    const uid = localStorage.getItem('uid');
  if (!uid) {
    window.location.href = '../index.html';
    return;
  }
   loadOwnProfile(uid);
  setupOutsideClick();
  initPriorityButtons();
  initDropdownButtons();
  initDropdownOptions();
  initSubtaskListEvents();
  addContactsToSelection();
  initActionButtons("toDo");
  setPriority("Medium");
  setMinimumDueDate();
}

function setMinimumDueDate() {
  const dueDate = document.getElementById("dueDate");
  if (!dueDate) return;
  dueDate.min = getTodayDate();
}

function getTodayDate() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - offset * 60000);
  return localDate.toISOString().split("T")[0];
}

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

  function initActionButtons(stat) {
    addClickListener("clearTaskButton", clearTaskForm);
    addClickListener("createTaskButton", () => createTask(stat));
    addClickListener("clearSubtaskButton", removeInput);
    addClickListener("addSubtaskButton", addInput);
  }

  function addClickListener(id, callback) {
    const button = document.getElementById(id);
    if (!button) return;
    button.addEventListener("click", callback);
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
    const subtaskRef = document.getElementById('subtaskListItem'+index)
    const subtext = document.getElementById('subtaskName'+index).innerText;
    subtaskRef.innerHTML = subtaskEditTemplate(subtext, index);
  }

  function editSubtask(subtext, index) {
    const newValue = document.getElementById(subtext).value;
    if (newValue === null) return;
    updateSubtask(index, newValue);
  }

  // function editSubtask(index) {
  //   const newValue = prompt("Edit subtask:", subtasks[index]);
  //   if (newValue === null) return;
  //   updateSubtask(index, newValue);
  // }

  function updateSubtask(index, value) {
    let subtaskRef = document.getElementById('subtaskListItem'+index);
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    subtasks[index] = trimmedValue;
    subtaskRef.innerHTML = recreateSubtaskTemplate();
    renderSubtasks();
  }

  // function updateSubtask(index, value) {
  //   const trimmedValue = value.trim();
  //   if (!trimmedValue) return;
  //   subtasks[index] = trimmedValue;
  //   renderSubtasks();
  // }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  }

  function validateTask() {
  if (!getRequiredValues().every(Boolean)) {
    showTaskMessage("Please fill in all required fields.");
    return false;
  }
  return validateDueDate();
}

function validateDueDate() {
  const dueDate = getInputValue("dueDate");
  if (dueDate >= getTodayDate()) return true;
  showTaskMessage("Due date cannot be in the past.");
  return false;
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

  function formatDate(date) {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  async function getAddTaskData(path = "") {
    const response = await fetch(addTaskBaseUrl + path + ".json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  }

  async function getNextTaskId() {
    const tasks = await getAddTaskData("/tickets");
    if (!tasks) return 0;
    const ids = Object.keys(tasks).filter(isNumericKey).map(Number);
    if (ids.length === 0) return 0;
    return Math.max(...ids) + 1;
  }

  function isNumericKey(key) {
    return /^\d+$/.test(key);
  }

  async function putAddTaskData(path = "", data = {}) {
    const response = await fetch(
      addTaskBaseUrl + path + ".json",
      getPutOptions(data)
    );
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  }

  function getPutOptions(data) {
    return {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  }

  async function createTask(stat) {
    if (!validateTask()) return showValidationError();
    const id = await getNextTaskId();
    const task = collectTaskData(id, stat);
    await saveTask(task);
  }

  function collectTaskData(id, stat) {
    return {
      id: id,
      title: getInputValue("taskTitle"),
      description: getInputValue("description"),
      date: formatDate(getInputValue("dueDate")),
      priority: selectedPriority,
      assigned: getAssignedContacts(),
      category: getInputValue("category"),
      subtasks: [...subtasks],
      status: stat,
    };
  }

  function getAssignedContacts() {
    const assigned = getInputValue("assigned");
    return assigned ? [assigned] : [];
  }

  async function saveTask(task) {
    try {
      await putAddTaskData(`/tickets/${task.id}`, task);
      handleSuccessfulTaskCreation();
    } catch (error) {
      handleTaskCreationError(error);
    }
  }

  function handleSuccessfulTaskCreation() {
  clearTaskForm();
  showTaskMessage("Task added to board");
}

  function handleTaskCreationError(error) {
  console.error("Task could not be created:", error);
  showTaskMessage("Task could not be created.");
}

function showTaskMessage(text) {
  const message = document.getElementById("taskMessage");
  if (!message) return;
  message.textContent = text;
  message.classList.add("task_message_show");
  setTimeout(hideTaskMessage, 2000);
}

function hideTaskMessage() {
  const message = document.getElementById("taskMessage");
  if (!message) return;
  message.classList.remove("task_message_show");
}

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

  async function addContactsToSelection() {
    const contactRef = document.getElementById("contactList");
    const contacts = await getAddTaskData("/users");
    if (!contactRef || !contacts) return;
    const contactsArray = Object.values(contacts);
    renderContacts(contactRef, contactsArray);
  }

  async function renderContacts(contactRef, contacts) {
    for (const contact of contacts) {
      contactRef.innerHTML += await contactsTemplate(contact);
    }
  }

  window.initAddTask = initAddTask;
