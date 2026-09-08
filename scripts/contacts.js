const state = { contacts: [] };

// Creates a new contact under the current user's contacts branch
function createContact(uid, contactData) {
  return fetch(baseUrl + 'users/' + uid + '/contacts.json', {
    method: 'POST',
    body: JSON.stringify(contactData)
  });
}

// Deletes a contact from the current user's contacts branch
function deleteContact(uid, contactId) {
  return fetch(baseUrl + 'users/' + uid + '/contacts/' + contactId + '.json', {
    method: 'DELETE'
  });
}

// Picks a random contact color CSS variable name (--contact_color_1 to --contact_color_15)
function getRandomContactColor() {
  const randomIndex = Math.floor(Math.random() * 15) + 1;
  return '--contact_color_' + randomIndex;
}

// Generates a new Contact object with a random color and saves it to the database
function generateContact(name, email, phone) {
  const uid = localStorage.getItem('uid');
  return createContact(uid, {
    name: name,
    email: email,
    phone: phone,
    color: getRandomContactColor()
  });
}

// Injects the edit-contact dialog markup, pre-filled with the contact's data
function injectEditContactDialog(contact) {
  const existingDialog = document.getElementById('editContact');
  if (existingDialog) existingDialog.remove();
  document.querySelector('.main_content').insertAdjacentHTML('beforeend', editContactDialogTemplate(contact));
}

// Updates an existing contact's data in the database
function updateContact(uid, contactId, contactData) {
  return fetch(baseUrl + 'users/' + uid + '/contacts/' + contactId + '.json', {
    method: 'PATCH',
    body: JSON.stringify(contactData)
  });
}

// Handles the edit-contact form submission
function handleEditContactSubmit(event) {
  event.preventDefault();
  const uid = localStorage.getItem('uid');
  const contactId = document.getElementById('editContactId').value;
  const name = document.getElementById('editContactName').value;
  const email = document.getElementById('editContactEmail').value;
  const phone = document.getElementById('editContactPhone').value;

  updateContact(uid, contactId, { name, email, phone }).then(() => {
    document.getElementById('editContact').remove();
    loadContacts(uid).then(() => {
      showContactDetail(findContactById(state.contacts, contactId));
    });
  });
}

// Registers listeners for the freshly injected edit dialog
function registerEditDialogListeners() {
  document.getElementById('editContactForm').addEventListener('submit', handleEditContactSubmit);
  document.getElementById('closeEditContactButton').addEventListener('click', () => {
    closeAnimation(document.getElementById('editContact'));
  });
  document.getElementById('deleteEditContactButton').addEventListener('click', (event) => {
    handleDeleteContact(event.target.dataset.contactId);
    closeAnimation(document.getElementById('editContact'));
  });
}

// Opens a dialog by its id
function openDialog(id) {
  document.getElementById(id).showModal();
}

// Closes a dialog by its id
function closeDialog(id) {
  document.getElementById(id).close();
}

// Prevents a click inside the dialog content from bubbling up and closing the dialog
function stopPropagation(event) {
  event.stopPropagation();
}

// Inserts the add-contact dialog markup into the page
function injectAddContactDialog() {
  document.querySelector('.main_content').insertAdjacentHTML('beforeend', addContactDialogTemplate());
}

// Converts the raw contacts object from the database into an array with id fields
function mapContactsToArray(contactsData) {
  if (!contactsData) return [];
  return Object.keys(contactsData).map((key) => {
    return { id: key, ...contactsData[key] };
  });
}

// Sorts contacts alphabetically by name
function sortContactsByName(contacts) {
  return [...contacts].sort((a, b) => a.name.localeCompare(b.name));
}

// Groups sorted contacts by their first letter into an object like { A: [...], B: [...] }
function groupContactsByLetter(contacts) {
  const groups = {};
  contacts.forEach((contact) => {
    const letter = contact.name.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(contact);
  });
  return groups;
}

// Returns the HTML markup for a group header (the divider letter)
function contactGroupHeaderTemplate(letter) {
  return `<li class="contact_group_header">${letter}</li>`;
}

// Renders the grouped, sorted contacts list into the contactsList element
function renderContactsList(contacts) {
  const contactsList = document.getElementById('contactsList');
  const sorted = sortContactsByName(contacts);
  const grouped = groupContactsByLetter(sorted);

  const html = Object.keys(grouped).sort().map((letter) => {
    const header = contactGroupHeaderTemplate(letter);
    const items = grouped[letter].map((contact) => contactsListItemTemplate(contact)).join('');
    return header + items;
  }).join('');

  contactsList.innerHTML = html;
}

// Fetches the current user's contacts from the database, stores and renders them
function loadContacts(uid) {
  return fetch(baseUrl + 'users/' + uid + '/contacts.json')
    .then(response => response.json())
    .then((data) => {
      state.contacts = mapContactsToArray(data);
      renderContactsList(state.contacts);
    });
}

// Finds a contact by its id within the currently loaded contacts array
function findContactById(contacts, id) {
  return contacts.find((contact) => contact.id === id);
}

// Renders the detail view for a specific contact
function showContactDetail(contact) {
  const contactCard = document.getElementById('contactCard');
  contactCard.innerHTML = contactDetailTemplate(contact);
}

// Handles a click on a contact list item and shows its details
function handleContactClick(event) {
  const item = event.target.closest('.contact_item');
  if (!item) return;

  const contact = findContactById(state.contacts, item.dataset.contactId);
  showContactDetail(contact);
}

// Deletes the contact and clears the detail view
function handleDeleteContact(contactId) {
  const uid = localStorage.getItem('uid');
  deleteContact(uid, contactId).then(() => {
    document.getElementById('contactCard').innerHTML = '<p>Select a contact to see details.</p>';
    loadContacts(uid);
  });
}

// Opens the edit dialog for a specific contact, pre-filled with its data
function handleEditContact(contactId) {
  const contact = findContactById(state.contacts, contactId);
  injectEditContactDialog(contact);
  registerEditDialogListeners();
  openDialog('editContact');
  openAnimation(document.getElementById('editContact'));
}

// Handles clicks within the contact detail card (edit or delete buttons)
function handleContactCardClick(event) {
  const deleteButton = event.target.closest('#deleteContactButton');
  const editButton = event.target.closest('#editContactButton');

  if (deleteButton) {
    handleDeleteContact(deleteButton.dataset.contactId);
  } else if (editButton) {
    handleEditContact(editButton.dataset.contactId);
  }
}

// Handles the add-contact form submission
function handleAddContactSubmit(event) {
  event.preventDefault();
  const uid = localStorage.getItem('uid');

  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const phone = document.getElementById('contactPhone').value;

  generateContact(name, email, phone).then(() => {
    document.getElementById('addContactForm').reset();
    closeDialog('addContact');
    loadContacts(uid);
  });
}

// Registers listeners for the add-contact dialog (open, close, cancel, submit)
function registerDialogListeners() {
  document.getElementById('addContactForm').addEventListener('submit', handleAddContactSubmit);
  document.getElementById('addContactButton').addEventListener('click', () => {
    openDialog('addContact');
    openAnimation(document.getElementById('addContact'));
  });
  document.getElementById('closeAddContactButton').addEventListener('click', () => {
    closeAnimation(document.getElementById('addContact'));
  });
  document.getElementById('cancelAddContactButton').addEventListener('click', () => {
    closeAnimation(document.getElementById('addContact'));
  });
  document.querySelector('.add_contact').addEventListener('click', stopPropagation);
}

// Registers listeners for the contacts list and detail card
function registerContactListeners() {
  document.getElementById('contactsList').addEventListener('click', handleContactClick);
  document.getElementById('contactCard').addEventListener('click', handleContactCardClick);
}

// Entry point: checks for a logged-in user, injects dialog markup, and registers listeners
function initContacts() {
  const uid = localStorage.getItem('uid');

  if (!uid) {
    window.location.href = '../index.html';
    return;
  }

  injectAddContactDialog();
  loadContacts(uid);
  registerDialogListeners();
  registerContactListeners();
}

document.addEventListener('DOMContentLoaded', initContacts);