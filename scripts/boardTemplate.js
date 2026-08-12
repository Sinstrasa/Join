function taskDialogTemplate() {
  return `
    <section class="task_board_header">
        <div class="category">
            <p>User Story</p>
            <button class="close" onclick="closeDialog('taskBoard')">
              <img src="../assets/img/general/close.svg" alt="Close Symbol" />
            </button>
        </div>
    </section>
    <h6>Kochwelt Page & Recipe Recommender</h6>
    <p>Build start page with recipe recommendation.</p>
    <section class="expiration">
      <p class="subtitle">Due Date:</p>
      <p>10/05/2023</p>
    </section>
    <section class="relevance">
      <p class="subtitle">Priority:</p>
      <div>
        <p>Medium</p>
        <img src="../assets/img/task/medium.svg" alt="Medium Symbol" />
      </div>
    </section>
    <section>
      <p class="subtitle">Assigned To:</p>
      <div>
        <p>Contacts</p>
      </div>
    </section>
    <section class="task_board_footer">
      <p class="subtitle">Subtasks</p>
      <div class="checklist_subtask">
        <p>Subtask</p>
      </div>
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
