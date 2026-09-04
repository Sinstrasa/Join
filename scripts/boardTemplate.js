async function taskDialogTemplate(arr, index) {
  // ${await readAssigned(arr, index)}
  return `
    <article class="task_board" id="taskBoard" onclick="stopPropagation(event)">
      <section class="task_board_header">
        <div class="category">
          <p>${await readDatabase(arr, index, "category")}</p>
          <button class="close" onclick="closeSpecificDialog('dialog')">
            <img src="../assets/img/general/close.svg" alt="Close Symbol" />
          </button>
        </div>
      </section>
      <h6>${await readDatabase(arr, index, "title")}</h6>
      <p>${await readDatabase(arr, index, "description")}</p>
      <section class="expiration">
        <p class="subtitle">Due Date:</p>
        <p>${await readDatabase(arr, index, "date")}</p>
      </section>
      <section class="relevance">
        <p class="subtitle">Priority:</p>
        <div>
          <p>${await readDatabase(arr, index, "priority")}</p>
          ${readPriority(await readDatabase(arr, index, "priority"))}
        </div>
      </section>
      <section class="task_board_contacts">
        <p class="subtitle">Assigned To:</p>
        <ul class="task_board_names">
          
        </ul>
      </section>
      <section class="task_board_footer">
        <p class="subtitle">Subtasks</p>
        <ul class="checklist_subtask">
          ${readSubtask(arr, index, "subtasks")}
        </ul>
      </section>
      <section class="delete_edit">
        <button class="task_board_buttons" onclick="deleteTicket('/tickets/${await readDatabase(arr, index, "id")}'), closeDialog('dialog')">
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

async function addTaskDialogTemplate(stat) {
  return `
    <article class="add_task" onclick="stopPropagation(event)">
      <section class="add_task_head">
        <h3>Add Task</h3>
      </section>
      <article class="add_task_main">
        <section class="add_task_left">
          <div class="add_task_input">
            <p>Title<span>*</span></p>
            <input
              class="input_areas"
              id="taskTitle"
              type="text"
              placeholder="Enter a title"
              required/>
          </div>
          <div class="add_task_input">
            <p>Description</p>
            <textarea
              class="description"
              id="description"
              placeholder="Enter a Description"
            ></textarea>
          </div>
          <div class="add_task_input">
            <p>Due Date<span>*</span></p>
            <input
              class="input_areas"
              id="dueDate"
              type="date"
              required/>
          </div>
        </section>
        <div class="add_task_middle"></div>
        <section class="add_task_right">
          <div class="add_task_input">
            <p>Priority</p>
            <section class="priority">
              <button
                class="priority_button"
                type="button"
                data-priority="Urgent">
                Urgent
                <img
                  src="../assets/img/task/urgent.svg"
                  alt="Urgent priority"/>
              </button>
              <button
                class="priority_button"
                type="button"
                data-priority="Medium">
                Medium
                <img
                  src="../assets/img/task/medium.svg"
                  alt="Medium priority"/>
              </button>
              <button
                class="priority_button"
                type="button"
                data-priority="Low">
                Low
                <img
                  src="../assets/img/task/low.svg"
                  alt="Low priority"/>
              </button>
            </section>
          </div>
          <div class="add_task_input">
            <p>Assigned To</p>
            <div class="select_areas" id="assignedDropdown">
              <button
                class="select_areas_toggle"
                type="button">
                <span class="select_areas_value">
                  Select contacts to assign
                </span>
                <span class="select_areas_arrow">▾</span>
              </button>
              <div class="select_areas_menu" id="contactList"></div>
              <input
                type="hidden"
                id="assigned"
                name="assigned"
                value=""/>
            </div>
          </div>
          <div class="add_task_input">
            <p>Category<span>*</span></p>
            <div class="select_areas" id="categoryDropdown">
              <button
                class="select_areas_toggle"
                type="button">
                <span class="select_areas_value">
                  Select task category
                </span>
                <span class="select_areas_arrow">▾</span>
              </button>
              <div class="select_areas_menu">
                <button
                  class="select_areas_option"
                  type="button"
                  data-value="Technical Task">
                  Technical Task
                </button>
                <button
                  class="select_areas_option"
                  type="button"
                  data-value="User Story">
                  User Story
                </button>
              </div>
              <input
                type="hidden"
                id="category"
                name="category"
                value=""/>
            </div>
          </div>
          <div class="add_task_input">
            <p>Subtasks</p>
            <section class="subtask_wrapper">
              <input
                class="input_areas"
                id="subtaskInput"
                type="text"
                placeholder="Add new subtask"/>
              <div class="subtask_validating">
                <button
                  id="clearSubtaskButton"
                  type="button">
                  <img
                    src="../assets/img/general/close.svg"
                    alt="Clear"/>
                </button>
                <div class="subtask_middle"></div>
                <button
                  class="subtask_check"
                  id="addSubtaskButton"
                  type="button">
                  <img
                    src="../assets/img/summary/checkValidate.svg"
                    alt="Add subtask"/>
                </button>
              </div>
            </section>
          </div>
          <div class="subtasks_displayer">
            <ul class="subtasks_list" id="subtasks"></ul>
          </div>
        </section>
      </article>
      <section class="add_task_footer">
        <p><span>*</span>This field is required</p>
        <div class="footer_buttons">
          <button
            class="cancel"
            id="clearTaskButton"
            type="button">
            Clear
            <img
              src="../assets/img/general/close.svg"
              alt="Clear"/>
          </button>
          <button
            class="highlighted_button"
            id="createTaskButton"
            onclick="createTask('${stat}')"
            type="button">
            Create Task
            <img
              src="../assets/img/general/check.svg"
              alt="Create task"
            />
          </button>
        </div>
      </section>
    </article>
  `
}

async function taskDialogNamesTemplate(contact) {
  // <div class="contact_color" style="background-color: var(${await contact.color});">${getInitials(contact.name)}</div>
  //     <p class="contact_name">${await contact.name}</p>
  return `
    <li>
      
    </li>
  `;
}

function taskDialogSubtasksTemplate(content, index, checked) {
  return `
    <li class="subtask">
      <label
        class="subtask_checkbox_label"
        aria-label="Mark task as done"
      >
        <input type="checkbox" class="subtask_checkbox" data-subtask-index="${index}" ${checked ? "checked" : ""} />
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
  // <div id="assignedInitials">${await addInitials()}</div>
  return `
    <li>
      <section class="something" draggable="true" ondragstart="dragTicket(${await readDatabase(arr, index, "id")})">
        <button class="board_card" id="card${+(await readDatabase(arr, index, "id"))}" onclick="openSpecificDialog('${listKey}', ${index}, ${null}, 'taskBoardDialog')">
          <div class="board_card_content">
            <h4>${await readDatabase(arr, index, "category")}</h4>
            <section class="card_text">
              <h5>${await readDatabase(arr, index, "title")}</h5>
              <p>${await reduceDescription(arr, index)}</p>
            </section>
            <section class="sub_ladebalken">
              <div class="ladebalken_background"></div>
              <div class="ladebalken"></div>
              <p></p>
            </section>
            <section class="card_footer">
              
              ${readPriority(await readDatabase(arr, index, "priority"))}
            </section>
          </div>
        </button>
      </section>
    </li>
  `;
}

// async function contactInitials(contact) {
//   return `
//     <div class="contact_color" style="background-color: var(${await contact.color});">${getInitials(contact.name)}</div>
//   `
// }