import { auth, database } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { ref, push, set, get, remove } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";
import { addContactDialogTemplate, contactsListItemTemplate, contactDetailTemplate } from "./contactsTemplates.js";

// Shared state: holds the currently loaded contacts array
const state = { contacts: [] };

// Creates a new contact under the current user's contacts branch
function createContact(uid, contactData) {
  const contactsRef = ref(database, 'users/' + uid + '/contacts');
  const newContactRef = push(contactsRef);
  return set(newContactRef, contactData);
}

// Deletes a contact from the current user's contacts branch
function deleteContact(uid, contactId) {
  return remove(ref(database, 'users/' + uid + '/contacts/' + contactId));
}

// Picks a random contact color CSS variable name (--contact_color_1 to --contact_color_15)
function getRandomContactColor() {
  const randomIndex = Math.floor(Math.random() * 15) + 1;
  return '--contact_color_' + randomIndex;
}

// Generates a new Contact object with a random color and saves it to the database
function generateContact(name, email, phone) {
  return createContact(auth.currentUser.uid, {
    name: name,
    email: email,
    phone: phone,
    color: getRandomContactColor()
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

// Extracts initials from a full name — first letter of the first and last word
function getInitials(name) {
  const parts = name.trim().split(' ').filter((part) => part !== '');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
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
  get(ref(database, 'users/' + uid + '/contacts')).then((snapshot) => {
    state.contacts = mapContactsToArray(snapshot.val());
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
  deleteContact(auth.currentUser.uid, contactId).then(() => {
    document.getElementById('contactCard').innerHTML = '<p>Select a contact to see details.</p>';
    loadContacts(auth.currentUser.uid);
  });
}

// Placeholder for the edit-contact feature, to be implemented
function handleEditContact(contactId) {
  console.log('Edit contact:', contactId);
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

  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const phone = document.getElementById('contactPhone').value;

  generateContact(name, email, phone).then(() => {
    document.getElementById('addContactForm').reset();
    closeDialog('addContact');
    loadContacts(auth.currentUser.uid);
  });
}

// Redirects to login if no user is signed in, otherwise loads their contacts
function handleAuthStateChange(user) {
  if (user) {
    loadContacts(user.uid);
  } else {
    window.location.href = '../index.html';
  }
}

// Registers listeners for the add-contact dialog (open, close, cancel, submit)
function registerDialogListeners() {
  document.getElementById('addContactForm').addEventListener('submit', handleAddContactSubmit);
  document.getElementById('addContactButton').addEventListener('click', () => openDialog('addContact'));
  document.getElementById('closeAddContactButton').addEventListener('click', () => closeDialog('addContact'));
  document.getElementById('cancelAddContactButton').addEventListener('click', () => closeDialog('addContact'));
  document.getElementById('addContact').addEventListener('click', () => closeDialog('addContact'));
  document.querySelector('.add_contact').addEventListener('click', stopPropagation);
}

// Registers listeners for the contacts list and detail card
function registerContactListeners() {
  document.getElementById('contactsList').addEventListener('click', handleContactClick);
  document.getElementById('contactCard').addEventListener('click', handleContactCardClick);
}

// Entry point: injects the dialog markup, sets up auth handling, and registers listeners
function initContacts() {
  injectAddContactDialog();
  onAuthStateChanged(auth, handleAuthStateChange);
  registerDialogListeners();
  registerContactListeners();
}

document.addEventListener('DOMContentLoaded', initContacts);
export{getInitials};