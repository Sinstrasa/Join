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
  return new Promise((resolve) => {
    if (reference.classList.contains("slide_out")) {
      resolve();
      return;
    }
    reference.classList.add("slide_out");
    reference.addEventListener(
      "animationend", () => {
        reference.classList.remove("slide_out");
        reference.close();
        resolve();
      },
      { once: true },
    );
  });
}

// export {closeAnimation, openAnimation};