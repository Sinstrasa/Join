// Funktionen, die vermutlich ins Standardscript verlagert werden
function openDialog(reference) {
  let dialogRef = document.getElementById(reference);
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

// Funktionen, die nur für board gedacht sind
function removeInput() {
  let inputRef = document.getElementById("subtaskInput");
  inputRef.value = "";
}

function addInput() {
  let inputRef = document.getElementById("subtaskInput");
  let subtasksRef = document.getElementById("subtasks");
  if (inputRef.value != "") {
    subtasksRef.innerHTML += `
      <li>
        <p class="subtask_text">${inputRef.value}</p>
        <button class="subtask_icon">
          <img src="../assets/img/summary/penValidate.svg" alt="Edit subtask" />
        </button>
        <div class="subtask_middle"></div>
        <button class="subtask_icon">
          <img src="../assets/img/general/delete.svg" alt="Delete subtask" />
        </button>
      </li>
    `;
  }
  removeInput();
}

function toggleCustomDropdown(id) {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;

  document.querySelectorAll(".select_areas.open").forEach((openDropdown) => {
    if (openDropdown.id !== id) {
      openDropdown.classList.remove("open");
    }
  });

  dropdown.classList.toggle("open");
}

function selectCustomDropdown(optionButton) {
  const dropdown = optionButton.closest(".select_areas");
  const hiddenInput = dropdown.querySelector('input[type="hidden"]');
  const valueLabel = dropdown.querySelector(".select_areas_value");

  if (hiddenInput) {
    hiddenInput.value = optionButton.dataset.value;
  }

  if (valueLabel) {
    valueLabel.textContent = optionButton.textContent.trim();
  }

  dropdown.classList.remove("open");
}

document.addEventListener("click", (event) => {
  if (!event.target.closest(".select_areas")) {
    document.querySelectorAll(".select_areas.open").forEach((dropdown) => {
      dropdown.classList.remove("open");
    });
  }
});
