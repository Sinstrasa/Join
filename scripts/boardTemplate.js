function taskDialogTemplate(
  title,
  description,
  date,
  priority,
  assigned,
  category,
  subtasks,
) {
  return `
    <section class="task_board_header">
      <div class="category">
            <p>${category}</p>
            <button class="close" onclick="closeDialog('taskBoard')">
              <img src="../assets/img/general/close.svg" alt="Close Symbol" />
            </button>
          </div>
        </section>
        <h6>${title}</h6>
        <p>${description}</p>
        <section class="expiration">
          <p class="subtitle">Due Date:</p>
          <p>${date}</p>
        </section>
        <section class="relevance">
          <p class="subtitle">Priority:</p>
          <div>
            <p>${priority}</p>
            <img src="../assets/img/task/medium.svg" alt="Medium Symbol" />
          </div>
        </section>
        <section class="task_board_contacts">
          <p class="subtitle">Assigned To:</p>
          <ul class="task_board_names">
            ${readAssigned(assigned)}
          </ul>
        </section>
        <section class="task_board_footer">
          <p class="subtitle">Subtasks</p>
          <ul class="checklist_subtask">
            ${readSubtask(subtasks)}
          </ul>
        </section>
        <section class="delete_edit">
          <button class="task_board_buttons">
            <div>
              <img src="../assets/img/general/delete.svg" alt="Delete Symbol" />
              <p>Delete</p>
            </div>
          </button>
          <div class="subtask_middle"></div>
          <button class="task_board_buttons">
            <div>
              <img
                src="../assets/img/summary/penValidate.svg"
                alt="Pen Symbol"
              />
              <p>Edit</p>
            </div>
          </button>
        </section>
    `;
}

function taskDialogNamesTemplate(content) {
  return `
    <li>
      <img src="../assets/img/board/search.svg" alt="" />
      <p>${content}</p>
    </li>
  `;
}

function taskDialogSubtasksTemplate(content) {
  return `
    <li class="subtask">
      <label
        class="subtask_checkbox_label"
        aria-label="Mark task as done"
      >
        <input type="checkbox" class="subtask_checkbox" />
        <span class="subtask_checkbox_custom"></span>
      </label>
      <p>${content}</p>
    </li>
  `;
}

function nothingTemplate() {
  return `
    <li>
      <div class="nothing">
        <p>No tasks to do</p>
      </div>
    </li>
  `;
}

function nothingDoneTemplate() {
  return `
    <li>
      <div class="nothing">
        <p>No tasks Done</p>
      </div>
    </li>
  `;
}
