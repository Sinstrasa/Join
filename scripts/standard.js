const baseUrl =
  "https://joindb-ccbc2-default-rtdb.europe-west1.firebasedatabase.app/";

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

function openAnimation(reference) {
  reference.classList.add("slide_in");
  reference.addEventListener(
    "animationend",
    () => reference.classList.remove("slide_in"),
    { once: true },
  );
}

function closeAnimation(reference) {
  if (reference.classList.contains("slide_out")) return;
  reference.classList.add("slide_out");
  reference.addEventListener(
    "animationend", () => {
      reference.classList.remove("slide_out");
      reference.close();
      document.body.classList.remove("dialog_open");
    },
    { once: true },
  );
}
