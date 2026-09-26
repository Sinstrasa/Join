function contactsListItemTemplate(contact) {
  return `
    <li
      class="contact_item"
      data-contact-id="${contact.id}"
    >
      ${contactListAvatarTemplate(contact)}
      ${contactListInfoTemplate(contact)}
    </li>
  `;
}


function contactListAvatarTemplate(contact) {
  return `
    <div
      class="contact_color"
      style="background-color: var(${contact.color});"
    >
      ${getInitials(contact.name)}
    </div>
  `;
}


function contactListInfoTemplate(contact) {
  return `
    <div class="contact_info">
      <p class="contact_name">
        ${contact.name}
      </p>

      <p class="contact_email">
        ${contact.email}
      </p>

      <p class="contact_phone">
        ${contact.phone || ""}
      </p>
    </div>
  `;
}


function contactDetailTemplate(contact) {
  return `
    ${contactDetailHeaderTemplate(contact)}
    ${contactInformationTemplate(contact)}
    ${mobileContactActionsTemplate(contact)}
  `;
}


function contactDetailHeaderTemplate(contact) {
  return `
    <div class="contact_card_header">
      ${contactDetailAvatarTemplate(contact)}

      <div class="name_and_buttons">
        <h2>${contact.name}</h2>

        <div class="contact_card_buttons">
          ${contactEditButtonTemplate(contact)}
          ${contactDeleteButtonTemplate(contact)}
        </div>
      </div>
    </div>
  `;
}


function contactDetailAvatarTemplate(contact) {
  return `
    <div
      class="contact_card_color"
      style="background-color: var(${contact.color});"
    >
      ${getInitials(contact.name)}
    </div>
  `;
}


function contactInformationTemplate(contact) {
  return `
    <section class="contact_card_info">
      <p class="subtitle">
        Contact Information
      </p>

      <p class="detail_label">
        Email
      </p>

      <p class="detail_value contact_email">
        ${contact.email}
      </p>

      <p class="detail_label">
        Phone
      </p>

      <p class="detail_value">
        ${contact.phone || ""}
      </p>
    </section>
  `;
}


function contactEditButtonTemplate(contact) {
  return `
    <button
      class="contact_buttons"
      type="button"
      id="editContactButton"
      data-contact-id="${contact.id}"
    >
      <img
        src="../assets/img/general/edit.svg"
        alt=""
        class="button_icon"
      />
      Edit
    </button>
  `;
}


function contactDeleteButtonTemplate(contact) {
  if (contact.isOwnUser) return "";

  return `
    <button
      class="contact_buttons"
      type="button"
      id="deleteContactButton"
      data-contact-id="${contact.id}"
    >
      <img
        src="../assets/img/general/delete.svg"
        alt=""
        class="button_icon"
      />
      Delete
    </button>
  `;
}


function mobileContactActionsTemplate(contact) {
  return `
    <div class="mobile contact_mobile_actions">
      <button
        class="contact_more_button"
        type="button"
        data-action="toggle-menu"
        aria-label="Contact options"
      >
        ⋮
      </button>

      <div class="contact_mobile_menu">
        ${mobileEditButtonTemplate(contact)}
        ${mobileDeleteButtonTemplate(contact)}
      </div>
    </div>
  `;
}


function mobileEditButtonTemplate(contact) {
  return `
    <button
      type="button"
      data-action="edit-mobile"
      data-contact-id="${contact.id}"
    >
      <img
        src="../assets/img/general/edit.svg"
        alt=""
      />
      Edit
    </button>
  `;
}


function mobileDeleteButtonTemplate(contact) {
  if (contact.isOwnUser) return "";

  return `
    <button
      type="button"
      data-action="delete-mobile"
      data-contact-id="${contact.id}"
    >
      <img
        src="../assets/img/general/delete.svg"
        alt=""
      />
      Delete
    </button>
  `;
}


function getInitials(name) {
  const parts = name
    .trim()
    .split(" ")
    .filter((part) => part !== "");

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return getTwoInitials(parts);
}


function getTwoInitials(parts) {
  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();

  return first + last;
}