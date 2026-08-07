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