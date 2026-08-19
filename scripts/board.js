const BaseUrl =
  "https://joindb-ccbc2-default-rtdb.europe-west1.firebasedatabase.app/";
const taskList = {};

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
  let toDo = arr.filter(t => t['status'] == 'toDo');
  let inProgress = arr.filter(t => t['status'] == 'inProgress');
  let awaitFeedback = arr.filter(t => t['status'] == 'awaitFeedback');
  let done = arr.filter(t => t['status'] == 'done');
  await updateHTML(toDo, inProgress, awaitFeedback, done);
}

async function updateHTML(toDo, inProgress, awaitFeedback, done) {
  taskList.toDo = toDo;
  taskList.inProgress = inProgress;
  taskList.awaitFeedback = awaitFeedback;
  taskList.done = done;
  document.getElementById("toDo").innerHTML = ``;
  for (let index = 0; index < toDo.length; index++) {
    document.getElementById("toDo").innerHTML += await somethingTemplate(toDo, index, 'toDo');
  }
  document.getElementById("inProgress").innerHTML = ``;
  for (let index = 0; index < inProgress.length; index++) {
    document.getElementById("inProgress").innerHTML += await somethingTemplate(inProgress, index, 'inProgress');
  }
  document.getElementById("awaitFeedback").innerHTML = ``;
  for (let index = 0; index < awaitFeedback.length; index++) {
    document.getElementById("awaitFeedback").innerHTML += await somethingTemplate(awaitFeedback, index, 'awaitFeedback');
  }
  document.getElementById("done").innerHTML = ``;
  for (let index = 0; index < done.length; index++) {
    document.getElementById("done").innerHTML += await somethingTemplate(done, index, 'done');
  }
}

async function readDatabase(arr, index, information) {
  return await arr[index][information];
}

function readPriority(priority) {
  switch (priority) {
    case "low":
      return `<img src="../assets/img/task/low.svg" alt="Low Symbol">`;
      break;
    case "urgent":
      return `<img src="../assets/img/task/urgent.svg" alt="Urgent Symbol">`;
      break;
    default:
      return `<img src="../assets/img/task/medium.svg" alt="Urgent Symbol">`;
      break;
  }
}

function readAssigned(arr, index, assigned) {
  const safeAssigned = Array.isArray(assigned) ? assigned : [];
  return safeAssigned
    .map((content) => taskDialogNamesTemplate(content))
    .join("");
}

function readSubtask(arr, index, subtasks) {
  const safeSubtasks = Array.isArray(subtasks) ? subtasks : [];
  return safeSubtasks
    .map((content) => taskDialogSubtasksTemplate(content))
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

async function openDialog(listKey, index, reference) {
  let arr = taskList[listKey];
  let dialogRef = document.getElementById(reference);
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
  const progressBars = document.querySelectorAll(".ladebalken");
  const subtaskLists = document.querySelectorAll(".checklist_subtask");
  subtaskLists.forEach((list, index) => {
    const inputs = list.querySelectorAll(".subtask_checkbox");
    const checkedCount = [...inputs].filter((input) => input.checked).length;
    const totalCount = inputs.length;
    const progressPx =
      totalCount > 0 ? Math.min(100, (checkedCount / totalCount) * 100) : 0;
    const activeBar = progressBars[index] || progressBars[0];
    if (!activeBar) return;
    activeBar.style.width = `${progressPx}px`;
    const textElement = activeBar
      .closest(".sub_ladebalken")
      ?.querySelector("p");
    if (textElement) {
      textElement.textContent = `${checkedCount}/${totalCount} Subtasks`;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateSubtaskProgress();
  document.querySelectorAll(".subtask_checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", updateSubtaskProgress);
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
