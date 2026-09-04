function createSubtaskTemplate(subtask, index) {
  return `
    <li>
      <p class="subtask_text">${escapeHtml(subtask)}</p>

      <button
        class="subtask_icon"
        type="button"
        data-action="edit"
        data-index="${index}"
        aria-label="Edit subtask"
      >
        <img
          src="../assets/img/summary/penValidate.svg"
          alt="Edit subtask"
        />
      </button>

      <div class="subtask_middle"></div>

      <button
        class="subtask_icon"
        type="button"
        data-action="delete"
        data-index="${index}"
        aria-label="Delete subtask"
      >
        <img
          src="../assets/img/general/delete.svg"
          alt="Delete subtask"
        />
      </button>
    </li>
  `;
}

async function contactsTemplate(contact) {
  // ${await getInitials(contact.name)}
  // <input type="checkbox" class="subtask_checkbox" data-subtask-index="${index}" ${checked ? "checked" : ""} />
  return `
    <button class="select_contacts_option assign" type="button" data-value="Contact">
      <div class="assign">
        <div class="contact_color" style="background-color: var(${await contact.color});">A</div>   
        <p class="select_areas_value">${await contact.username}</p>
      </div>
        <input type="checkbox" name="" id="">
    </button>
`;
}
