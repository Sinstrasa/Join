import{getInitials} from "./contacts.js";


//-----------------Add Contact Dialog Template-----------------//
function addContactDialogTemplate() {
  return `
   <dialog class="add_contact_dialog" id="addContact">
  <button class="close" type="button" id="closeAddContactButton">
    <img src="../assets/img/general/close.svg" alt="Close Symbol" />
  </button>
  <article class="add_contact">
    <section class="add_contact_header">
      <img src="../assets/img/general/joinLogo.svg" alt="Join Logo" />
      <h2>Add contact</h2>
      <p>Tasks are better with a team!</p>
      <div class="title_underline"></div>
    </section>
      <section class="contact_placeholder">
        <img src="../assets/img/contacts/person.svg" alt="Contact Placeholder" />
      </section>
      <section class="add_contact_content">
      <form id="addContactForm">
        <div class="form_group">
          <label for="contactName" class="sr_only">Name</label>
          <input id="contactName" name="contactName" type="text" placeholder="Name" required>
          <img src="../assets/img/contacts/person.svg" alt="" class="field_icon">
          <p class="error_message" id="contactNameError"></p>
        </div>
        <div class="form_group">
          <label for="contactEmail" class="sr_only">Email</label>
          <input id="contactEmail" name="contactEmail" type="email" placeholder="Email" required>
          <img src="../assets/img/contacts/mail.svg" alt="" class="field_icon">
          <p class="error_message" id="contactEmailError"></p>
        </div>
        <div class="form_group">
          <label for="contactPhone" class="sr_only">Phone</label>
          <input id="contactPhone" name="contactPhone" type="tel" placeholder="Phone" required>
          <img src="../assets/img/contacts/phone.svg" alt="" class="field_icon">
          <p class="error_message" id="contactPhoneError"></p>
        </div>
        <div class="footer_buttons">
          <button class="cancel" type="button" id="cancelAddContactButton">Cancel ✕</button>
          <button class="highlighted_button" type="submit">Create contact ✓</button>
        </div>
      </form>
    </section>
  </article>
</dialog>
  `;
}

function editContactDialogTemplate(contact) {
  return `
   <dialog class="add_contact_dialog" id="editContact">
  <button class="close" type="button" id="closeEditContactButton">
    <img src="../assets/img/general/close.svg" alt="Close Symbol" />
  </button>
  <article class="add_contact">
    <section class="add_contact_header">
      <img src="../assets/img/general/joinLogo.svg" alt="Join Logo" />
      <h2>Edit contact</h2>
      <div class="title_underline"></div>
    </section>
      <section class="contact_edit_color_spacer">
        <div class="contact_card_color contact_edit_color" style="background-color: var(${contact.color});">${getInitials(contact.name)}</div>
      </section>
      <section class="add_contact_content">
      <form id="editContactForm">
        <input type="hidden" id="editContactId" value="${contact.id}">
        <div class="form_group">
          <label for="editContactName" class="sr_only">Name</label>
          <input id="editContactName" name="editContactName" type="text" value="${contact.name}" required>
          <img src="../assets/img/contacts/person.svg" alt="" class="field_icon">
        </div>
        <div class="form_group">
          <label for="editContactEmail" class="sr_only">Email</label>
          <input id="editContactEmail" name="editContactEmail" type="email" value="${contact.email}" required>
          <img src="../assets/img/contacts/mail.svg" alt="" class="field_icon">
        </div>
        <div class="form_group">
          <label for="editContactPhone" class="sr_only">Phone</label>
          <input id="editContactPhone" name="editContactPhone" type="tel" value="${contact.phone}" required>
          <img src="../assets/img/contacts/phone.svg" alt="" class="field_icon">
        </div>
        <div class="footer_buttons">
           <button class="cancel" type="button" id="deleteEditContactButton" data-contact-id="${contact.id}">Delete</button>
          <button class="highlighted_button" type="submit">Save ✓</button>
        </div>
      </form>
    </section>
  </article>
</dialog>
  `;
}

function contactsListItemTemplate(contact) {
  return `
    <li class="contact_item" data-contact-id="${contact.id}">
        <div class="contact_color" style="background-color: var(${contact.color});">${getInitials(contact.name)}</div>
        <div class="contact_info">
            <p class="contact_name">${contact.name}</p>
            <p class="contact_email">${contact.email}</p>
            <p class="contact_phone">${contact.phone}</p>
        </div>
    </li>
  `;
}

/// Returns the HTML markup for a single contact's detail view
function contactDetailTemplate(contact) {
  return `
    <div class="contact_card_header">
      <div class="contact_card_color" style="background-color: var(${contact.color});">${getInitials(contact.name)}</div>
      <div class="name_and_buttons">
        <h2>${contact.name}</h2>
        <div class="contact_card_buttons">
          <button class="contact_buttons" type="button" id="editContactButton" data-contact-id="${contact.id}">
          <img src="../assets/img/general/edit.svg" alt="" class="button_icon">
          Edit</button>
          <button class="contact_buttons" type="button" id="deleteContactButton" data-contact-id="${contact.id}">
          <img src="../assets/img/general/delete.svg" alt="" class="button_icon">
          Delete</button>
        </div>
      </div>
    </div>
    <section class="contact_card_info">
      <p class="subtitle">Contact Information</p>
      <p class="detail_label">Email</p>
      <p class="detail_value contact_email">${contact.email}</p>
      <p class="detail_label">Phone</p>
      <p class="detail_value">+ ${contact.phone}</p>
    </section>
  `;
}


export { addContactDialogTemplate, editContactDialogTemplate, contactsListItemTemplate, contactDetailTemplate};