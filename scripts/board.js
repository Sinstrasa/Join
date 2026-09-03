const taskList = {};
const subtaskProgressKey = "join-subtask-progress";
let isSearch = false;
let ticketAkku = [];
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
  sortReference(myArray);
}

async function sortReference(reference) {
  await sort(reference);
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
  updateColumn(taskList.toDo, "toDo");
  updateColumn(taskList.inProgress, "inProgress");
  updateColumn(taskList.awaitFeedback, "awaitFeedback");
  await updateColumn(taskList.done, "done");
  updateSubtaskProgress();
}

async function updateColumn(arr, id) {
  document.getElementById(id).innerHTML = ``;
  for (let index = 0; index < arr.length; index++) {
    document.getElementById(id).innerHTML += await somethingTemplate(
      arr,
      index,
      id,
    );
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

// async function readAssigned(arr, index) {
//   const safeAssigned = Array.isArray(arr[index]?.assigned)
//     ? arr[index].assigned : [];
//   let htmlString = ``;
//   for (let subindex = 0; subindex < safeAssigned.length; subindex++) {
//     htmlString += await taskDialogNamesTemplate(safeAssigned[subindex]);
//   }
//   return htmlString;
// }

// async function addInitials(arr, index) {
//   const safeAssigned = Array.isArray(arr[index]?.assigned)
//     ? arr[index].assigned : [];
//   let assignedRef = document.getElementById("assignedInitals");
//   for (let subindex = 0; subindex < safeAssigned.length; subindex++) {
//     assignedRef.innerHTML += await contactInitials(safeAssigned[subindex]);
//   }
// }

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

function validateSearch() {
  isSearch = true;
  let searchRef = document.getElementById("searchField").value;
  switch (searchRef.length) {
    case 0:
      isSearch = false;
      cardColumn();
      break;
    default:
      search(searchRef);
      break;
  }
}

async function search(input) {
  let myArray = await getTickets("/tickets");
  ticketAkku = [];
  for (let index = 0; index < myArray.length; index++) {
    for (
      let subindex = 0;
      subindex < (await myArray[index].title.length);
      subindex++
    ) {
      let compare = (await myArray[index].title).slice(
        subindex,
        input.length + subindex,
      );
      if (
        input == compare &&
        !ticketAkku.some((ticket) => ticket.title === myArray[index].title)
      ) {
        ticketAkku.push(myArray[index]);
      }
    }
  }
  await sortReference(ticketAkku);
}

async function deleteTicket(path = "") {
  let myArray = await getTickets("/tickets");
  let myTicket = await (await fetch(baseUrl + path + ".json")).json();
  let akkumulator = myTicket.id;
  for (let index = akkumulator; index < myArray.length-1; index++) {
    putTicket("/tickets/"+(index), {
    id: index,
    title: myArray[index+1].title,
    description: myArray[index+1].description,
    date: myArray[index+1].date,
    priority: myArray[index+1].priority,
    assigned: myArray[index+1].assigned,
    category: myArray[index+1].category,
    subtasks: myArray[index+1].subtasks,
    status: myArray[index+1].status,
    });
  }
  await fetch(baseUrl + "/tickets/" + (myArray.length-1) + ".json",
    {method: "DELETE"});
  await cardColumn();
}

async function putTicket(path = "", data = {}) {
  await fetch(baseUrl + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function reduceDescription(arr, index) {
  if (await arr[index].description.length > 51) {
    return await arr[index].description.slice(0, 50) + "...";    
  } else {
    return await arr[index].description;
  }
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
  document
    .getElementById("searchField")
    .addEventListener("input", validateSearch);
  updateSubtaskProgress();
  document.addEventListener("change", (event) => {
    if (!event.target.classList.contains("subtask_checkbox")) return;
    const dialog = event.target.closest("dialog");
    saveSubtaskState(dialog.dataset.taskId,
      event.target.dataset.subtaskIndex, event.target.checked);
    updateSubtaskProgress();
  });
});

async function openSpecificDialog(listKey, index, reference) {
  let dialogRef = document.getElementById("dialog");
  dialogRef.innerHTML = ``;
  if (reference == "taskBoardDialog") {
    dialogRef.classList.add("task_board_dialog");
    taskDialog(listKey, index, dialogRef);
  } else {
    dialogRef.classList.add("add_task_dialog");
    dialogRef.innerHTML = await addTaskDialogTemplate();
    initAddTask();
  }
  dialogRef.showModal();
  openAnimation(dialogRef);
  document.body.classList.add("dialog_open");
}

async function taskDialog(listKey, index, dialogRef) {
  let arr = taskList[listKey];
  dialogRef.dataset.taskId = arr[index].id;
  dialogRef.innerHTML = await taskDialogTemplate(arr, index);
}

async function closeSpecificDialog(reference) {
  let dialogRef = document.getElementById(reference);
  await closeAnimation(dialogRef);
  document.body.classList.remove("dialog_open");
  dialogRef.classList.remove("task_board_dialog");
  dialogRef.classList.remove("add_task_dialog");
}
