const BaseUrl =
  "https://joindb-ccbc2-default-rtdb.europe-west1.firebasedatabase.app/";

function initialise() {
  checkAmount("toDo");
  checkAmount("inProgress");
  checkAmount("awaitFeedback");
  checkAmount("done");
  readDatabase("/tickets");
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

async function database(path = "") {
  let response = await fetch(BaseUrl + path + ".json");
  let responseToJson = await response.json();
  console.log(await responseToJson[0]);
}

async function readDatabase(path = "") {
  let test = document.getElementById("test");
  let response = await fetch(BaseUrl + path + ".json");
  let responseToJson = await response.json();
  let myArray = await Object.values(responseToJson);
  for (let index = 0; index < myArray.length; index++) {
    let title = myArray[index].title;
    let description = await myArray[index].description;
    let date = await myArray[index].date;
    let priority = await myArray[index].priority;
    let assigned = await myArray[index].assigned;
    let category = await myArray[index].category;
    let subtasks = await myArray[index].subtasks;
    test.innerHTML += await taskDialogTemplate(title, description, date, priority, assigned, category, subtasks);
  }
}

function readAssigned(assigned) {
  const safeAssigned = Array.isArray(assigned) ? assigned : [];
  return safeAssigned
    .map((content) => taskDialogNamesTemplate(content))
    .join("");
}

function readSubtask(subtasks) {
  const safeSubtasks = Array.isArray(subtasks) ? subtasks : [];
  return safeSubtasks
    .map((content) => taskDialogSubtasksTemplate(content))
    .join("");
}

function contentArray(arr, index) {
  let content = arr[index];
  return content;
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
  // let articleRef = document.getElementById('test');
  dialogRef.showModal();
  // articleRef.innerHTML += taskDialogTemplate();
  document.body.classList.toggle("dialog_open");
}

function closeDialog(reference) {
  let dialogRef = document.getElementById(reference);
  // let articleRef = document.getElementById('test');
  dialogRef.close();
  // articleRef.innerHTML = ``;
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
