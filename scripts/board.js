const taskList = {};
const subtaskProgressKey = "join-subtask-progress";
let draggedTicket;

// Funktionen, die nur für board gedacht sind

function initialise() {
  cardColumn();
}

async function getTickets(path = "") {
  let response = await fetch(baseUrl + path + ".json");
  let responseToJson = await response.json();
  return Object.values(responseToJson);
}

async function cardColumn() {
  let myArray = await getTickets("/tickets");
  await sort(myArray);
  checkAmount("toDo");
  checkAmount("inProgress");
  checkAmount("awaitFeedback");
  checkAmount("done");
}

function dragTicket(id) {
  draggedTicket = id;
}

function changeStatus(listKey) {
  let arr = taskList[listKey];
  let index = arr.findIndex((findId) => findId.id == draggedTicket);
}

function allowDrop(event) {
  event.preventDefault();
}

async function sort(arr) {
  let toDo = arr.filter((t) => t["status"] == "toDo");
  let inProgress = arr.filter((t) => t["status"] == "inProgress");
  let awaitFeedback = arr.filter((t) => t["status"] == "awaitFeedback");
  let done = arr.filter((t) => t["status"] == "done");
  await updateHTML(toDo, inProgress, awaitFeedback, done);
}

async function updateHTML(toDo, inProgress, awaitFeedback, done) {
  taskList.toDo = toDo;
  taskList.inProgress = inProgress;
  taskList.awaitFeedback = awaitFeedback;
  taskList.done = done;
  updateColumn(taskList.toDo, 'toDo');
  updateColumn(taskList.inProgress, 'inProgress');
  updateColumn(taskList.awaitFeedback, 'awaitFeedback');
  await updateColumn(taskList.done, 'done');
  updateSubtaskProgress();
}

async function updateColumn(arr, id) {
  document.getElementById(id).innerHTML = ``;
  for (let index = 0; index < arr.length; index++) {
    document.getElementById(id).innerHTML +=
    await somethingTemplate(arr, index, id);
  }
}

async function readDatabase(arr, index, information) {
  return await arr[index][information];
}

function readPriority(priority) {
  switch (priority) {
    case "Low":
      return `<img src="../assets/img/task/low.svg" alt="Low Symbol">`;
    case "Urgent":
      return `<img src="../assets/img/task/urgent.svg" alt="Urgent Symbol">`;
    default:
      return `<img src="../assets/img/task/medium.svg" alt="Urgent Symbol">`;
  }
}

function readAssigned(arr, index) {
  const safeAssigned = Array.isArray(arr[index]?.assigned)
    ? arr[index].assigned
    : [];
  return safeAssigned
    .map((content) => taskDialogNamesTemplate(content))
    .join("");
}

function readSubtask(arr, index) {
  const safeSubtasks = Array.isArray(arr[index]?.subtasks)
    ? arr[index]?.subtasks
    : [];
  return safeSubtasks
    .map((content, subtaskIndex) =>
      taskDialogSubtasksTemplate(
        content,
        subtaskIndex,
        isSubtaskChecked(arr[index]?.id, subtaskIndex),
      ),
    )
    .join("");
}

function checkAmount(id) {
  let listRef = document.getElementById(id);
  const amount = listRef.querySelectorAll("li");
  switch (id) {
    case "done":
      if (amount.length == 0) {
        listRef.innerHTML += nothingDoneTemplate();
      }
      break;
    default:
      if (amount.length == 0) {
        listRef.innerHTML += nothingTemplate();
      }
      break;
  }
}

async function deleteTicket(path = "") {
  await fetch(baseUrl + path + ".json", { method: "DELETE" });
  await cardColumn();
}

function stopPropagation(event) {
  event.stopPropagation();
}

function updateSubtaskProgress() {
  const columns = ["toDo", "inProgress", "awaitFeedback", "done"];
  const progress = getSubtaskProgress();
  columns.forEach((column) => {
    const tasks = taskList[column] || [];
    const cards = document.querySelectorAll(`#${column} .board_card`);
    tasks.forEach((task, index) =>
      updateTaskSubtaskProgress(task, cards[index], progress));
  });
}

function updateTaskSubtaskProgress(task, card, progress) {
  const subtasks = Array.isArray(task?.subtasks) ? task.subtasks : [];
  const progressSection = card?.querySelector(".sub_ladebalken");
  const progressBar = card?.querySelector(".ladebalken");
  const progressText = card?.querySelector(".sub_ladebalken > p");
  if (!progressSection || !progressBar || !progressText) return;
  const checkedCount = subtasks.reduce(
    (count, _, index) => count + (progress[task.id]?.[index] ? 1 : 0), 0);
  progressSection.style.display = subtasks.length === 0 ? "none" : "";
  progressBar.style.width = `${subtasks.length ? (checkedCount / subtasks.length) * 100 : 0}px`;
  progressText.textContent = `${checkedCount}/${subtasks.length} Subtasks`;
}

function getSubtaskProgress() {
  try {
    return JSON.parse(localStorage.getItem(subtaskProgressKey)) || {};
  } catch {
    return {};
  }
}

function isSubtaskChecked(taskId, index) {
  return Boolean(getSubtaskProgress()[taskId]?.[index]);
}

function saveSubtaskState(taskId, index, checked) {
  const progress = getSubtaskProgress();
  progress[taskId] = progress[taskId] || {};
  progress[taskId][index] = checked;
  localStorage.setItem(subtaskProgressKey, JSON.stringify(progress));
}

document.addEventListener("DOMContentLoaded", () => {
  updateSubtaskProgress();
  document.addEventListener("change", (event) => {
    if (!event.target.classList.contains("subtask_checkbox")) return;
    const dialog = event.target.closest("dialog");
    saveSubtaskState(
      dialog.dataset.taskId,
      event.target.dataset.subtaskIndex,
      event.target.checked,
    );
    updateSubtaskProgress();
  });
});

async function openTaskDialog(listKey, index) {
  let arr = taskList[listKey];
  let dialogRef = document.getElementById("taskBoardDialog");
  dialogRef.dataset.taskId = arr[index].id;
  dialogRef.innerHTML = await taskDialogTemplate(arr, index);
  dialogRef.showModal();
  dialogRef.classList.add("slide_in");
  dialogRef.addEventListener(
    "animationend",
    () => dialogRef.classList.remove("slide_in"),
    { once: true },
  );
  document.body.classList.toggle("dialog_open");
}

async function openAddTaskDialog() {
  let dialogRef = document.getElementById("addTask");
  dialogRef.showModal();
  dialogRef.classList.add("slide_in");
  dialogRef.addEventListener(
    "animationend",
    () => dialogRef.classList.remove("slide_in"),
    { once: true },
  );
}

async function closeSpecificDialog(reference) {
  let dialogRef = document.getElementById(reference);
  if (dialogRef.classList.contains("slide_out")) return;
  dialogRef.classList.add("slide_out");
  dialogRef.addEventListener(
    "animationend",
    () => {
      dialogRef.classList.remove("slide_out");
      dialogRef.close();
      document.body.classList.toggle("dialog_open");
    },
    { once: true },
  );
}

// if (dialogRef.classList.contains("task_board_dialog")) {
//     if (dialogRef.classList.contains("closing")) return;
//     dialogRef.classList.add("closing");
//     dialogRef.addEventListener(
//       "animationend",
//       () => {
//         dialogRef.classList.remove("closing");
//         dialogRef.close();
//         document.body.classList.toggle("dialog_open");
//       },
//       { once: true },
//     );
//     return;
// }

// Funktion, die zu Add Task eigentlich gehört

// function removeInput() {
//   let inputRef = document.getElementById("subtaskInput");
//   inputRef.value = "";
// }

// function addInput() {
//   let inputRef = document.getElementById("subtaskInput");
//   let subtasksRef = document.getElementById("subtasks");
//   if (inputRef.value != "") {
//     subtasksRef.innerHTML += `
//       <li>
//         <p class="subtask_text">${inputRef.value}</p>
//         <button class="subtask_icon">
//           <img src="../assets/img/summary/penValidate.svg" alt="Edit subtask" />
//         </button>
//         <div class="subtask_middle"></div>
//         <button class="subtask_icon">
//           <img src="../assets/img/general/delete.svg" alt="Delete subtask" />
//         </button>
//       </li>
//     `;
//   }
//   removeInput();
// }

// function toggleCustomDropdown(id) {
//   const dropdown = document.getElementById(id);
//   if (!dropdown) return;

//   document.querySelectorAll(".select_areas.open").forEach((openDropdown) => {
//     if (openDropdown.id !== id) {
//       openDropdown.classList.remove("open");
//     }
//   });

//   dropdown.classList.toggle("open");
// }

// function selectCustomDropdown(optionButton) {
//   const dropdown = optionButton.closest(".select_areas");
//   const hiddenInput = dropdown.querySelector('input[type="hidden"]');
//   const valueLabel = dropdown.querySelector(".select_areas_value");

//   if (hiddenInput) {
//     hiddenInput.value = optionButton.dataset.value;
//   }

//   if (valueLabel) {
//     valueLabel.textContent = optionButton.textContent.trim();
//   }

//   dropdown.classList.remove("open");
// }

// document.addEventListener("click", (event) => {
//   if (!event.target.closest(".select_areas")) {
//     document.querySelectorAll(".select_areas.open").forEach((dropdown) => {
//       dropdown.classList.remove("open");
//     });
//   }
// });
