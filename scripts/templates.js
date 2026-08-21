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

function contactsListItemTemplate(contact) {
  return `
    <li class="contact_item" data-contact-id="${contact.id}">
        <div class="contact_color" style="background-color: var(${contact.color});">${contact.name.charAt(0).toUpperCase()}</div>
        <div class="contact_info">
            <p class="contact_name">${contact.name}</p>
            <p class="contact_email">${contact.email}</p>
            <p class="contact_phone">${contact.phone}</p>
        </div>
    </li>
  `;
}

export { addContactDialogTemplate, contactsListItemTemplate };