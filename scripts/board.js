const BaseUrl =
  "https://joindb-ccbc2-default-rtdb.europe-west1.firebasedatabase.app/";
const taskList = {};
const subtaskProgressKey = "join-subtask-progress";

function initialise() {
  cardColumn();
  // checkAmount('toDo');
  // checkAmount('inProgress');
  // checkAmount('awaitFeedback');
  // checkAmount('done');
}

async function getTickets(path = "") {
  let response = await fetch(BaseUrl + path + ".json");
  let responseToJson = await response.json();
  return await Object.values(responseToJson);
}

// async function postData(path = "", data = {}) {
//   let response = await fetch(BaseUrl + path + ".json", {
//     method: "POST",
//     header: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
// }

// postData("/tickets", {
//     title: "Kochwelt Page & Recipce Recommender",
//     description: "Build start page with recipe recommendation",
//     dueDate: "10/05/2023",
//     priority: "Medium",
//     assigned: ["Emmanuel Mauer", "Marcel Bauer", "Anton Mayer"],
//     category: "User Story",
//     subtasks: ["Implementation Recipe Recommendation", "Start Page Layout"],
//   });

async function cardColumn() {
  let myArray = await getTickets("/tickets");
  await sort(myArray);
  await checkAmount("toDo");
  await checkAmount("inProgress");
  await checkAmount("awaitFeedback");
  await checkAmount("done");
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
  document.getElementById("toDo").innerHTML = ``;
  for (let index = 0; index < toDo.length; index++) {
    document.getElementById("toDo").innerHTML += await somethingTemplate(
      toDo,
      index,
      "toDo",
    );
  }
  document.getElementById("inProgress").innerHTML = ``;
  for (let index = 0; index < inProgress.length; index++) {
    document.getElementById("inProgress").innerHTML += await somethingTemplate(
      inProgress,
      index,
      "inProgress",
    );
  }
  document.getElementById("awaitFeedback").innerHTML = ``;
  for (let index = 0; index < awaitFeedback.length; index++) {
    document.getElementById("awaitFeedback").innerHTML +=
      await somethingTemplate(awaitFeedback, index, "awaitFeedback");
  }
  document.getElementById("done").innerHTML = ``;
  for (let index = 0; index < done.length; index++) {
    document.getElementById("done").innerHTML += await somethingTemplate(
      done,
      index,
      "done",
    );
  }
  updateSubtaskProgress();
}

async function readDatabase(arr, index, information) {
  return await arr[index][information];
}

function readPriority(priority) {
  switch (priority) {
    case "Low":
      return `<img src="../assets/img/task/low.svg" alt="Low Symbol">`;
      break;
    case "Urgent":
      return `<img src="../assets/img/task/urgent.svg" alt="Urgent Symbol">`;
      break;
    default:
      return `<img src="../assets/img/task/medium.svg" alt="Urgent Symbol">`;
      break;
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

function openDialog(reference) {
  let dialogRef = document.getElementById(reference);
  dialogRef.showModal();
  document.body.classList.toggle("dialog_open");
}

async function openTaskDialog(listKey, index, reference) {
  let arr = taskList[listKey];
  let dialogRef = document.getElementById(reference);
  dialogRef.dataset.taskId = arr[index].id;
  dialogRef.innerHTML = await taskDialogTemplate(arr, index);
  dialogRef.showModal();
  document.body.classList.toggle("dialog_open");
}

function closeDialog(reference) {
  let dialogRef = document.getElementById(reference);
  dialogRef.close();
  document.body.classList.toggle("dialog_open");
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
    tasks.forEach((task, index) => {
      const subtasks = Array.isArray(task?.subtasks) ? task.subtasks : [];
      const checkedCount = subtasks.reduce(
        (count, _, subtaskIndex) =>
          count + (progress[task.id]?.[subtaskIndex] ? 1 : 0), 0);
      const progressBar = cards[index]?.querySelector(".ladebalken");
      const progressText = cards[index]?.querySelector(".sub_ladebalken > p");
      if (!progressBar || !progressText) return;
      const progressPercent =
        subtasks.length > 0 ? (checkedCount / subtasks.length) * 100 : 0;
      progressBar.style.width = `${progressPercent}px`;
      progressText.textContent = `${checkedCount}/${subtasks.length} Subtasks`;
    });
  });
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

// Funktionen, die nur für board gedacht sind

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
