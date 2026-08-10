// Funktion, die vermutlich ins Standardscript verlagert wird
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

function toggleCustomDropdown(id) {
  const dropdown = document.getElementById(id);
  if (!dropdown) return;

  document.querySelectorAll('.select_areas.open').forEach((openDropdown) => {
    if (openDropdown.id !== id) {
      openDropdown.classList.remove('open');
    }
  });

  dropdown.classList.toggle('open');
}

function selectCustomDropdown(optionButton) {
  const dropdown = optionButton.closest('.select_areas');
  const hiddenInput = dropdown.querySelector('input[type="hidden"]');
  const valueLabel = dropdown.querySelector('.select_areas_value');

  if (hiddenInput) {
    hiddenInput.value = optionButton.dataset.value;
  }

  if (valueLabel) {
    valueLabel.textContent = optionButton.textContent.trim();
  }

  dropdown.classList.remove('open');
}

document.addEventListener('click', (event) => {
  if (!event.target.closest('.select_areas')) {
    document.querySelectorAll('.select_areas.open').forEach((dropdown) => {
      dropdown.classList.remove('open');
    });
  }
});
