async function taskDialogTemplate(arr, index) {
  return `
    <article class="task_board" id="taskBoard" onclick="stopPropagation(event)">
      <section class="task_board_header">
        <div class="category">
          <p>${await readDatabase(arr, index, 'category')}</p>
          <button class="close" onclick="${closeDialog('taskBoardDialog')}">
            <img src="../assets/img/general/close.svg" alt="Close Symbol" />
          </button>
        </div>
      </section>
      <h6>${await readDatabase(arr, index, 'title')}</h6>
      <p>${await readDatabase(arr, index, 'description')}</p>
      <section class="expiration">
        <p class="subtitle">Due Date:</p>
        <p>${await readDatabase(arr, index, 'date')}</p>
      </section>
      <section class="relevance">
        <p class="subtitle">Priority:</p>
        <div>
          <p>${await readDatabase(arr, index, 'priority')}</p>
          ${readPriority(await readDatabase(arr, index, 'priority'))}
        </div>
      </section>
      <section class="task_board_contacts">
        <p class="subtitle">Assigned To:</p>
        <ul class="task_board_names">
          <!-- ${readAssigned(arr, index, 'assigned')} -->
        </ul>
      </section>
      <section class="task_board_footer">
        <p class="subtitle">Subtasks</p>
        <ul class="checklist_subtask">
          <!-- ${readSubtask(arr, index, 'subtasks')} -->
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
    </article>
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

async function somethingTemplate(arr, index, listKey) {
  return `
    <li>
      <section class="something" draggable="true">
        <button class="board_card" id="card${+ await readDatabase(arr, index, 'id')}" onclick="openDialog('${listKey}', ${index}, 'taskBoardDialog')">
          <div class="board_card_content">
            <h4>${await readDatabase(arr, index, 'category')}</h4>
            <section class="card_text">
              <h5>${await readDatabase(arr, index, 'title')}</h5>
              <p>${await readDatabase(arr, index, 'description')}</p>
            </section>
            <section class="sub_ladebalken">
              <div class="ladebalken_background"></div>
              <div class="ladebalken"></div>
              <p></p>
            </section>
            <section class="card_footer">
              <p>Contacts</p>
              ${readPriority(await readDatabase(arr, index, 'priority'))}
            </section>
          </div>
        </button>
      </section>
    </li>
  `;
}
