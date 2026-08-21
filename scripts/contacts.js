import { auth, database } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { ref, push, set, get } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";
import { addContactDialogTemplate, contactsListItemTemplate} from "./templates.js";

// Creates a new contact under the current user's contacts branch
function createContact(uid, contactData) {
  const contactsRef = ref(database, 'users/' + uid + '/contacts');
  const newContactRef = push(contactsRef);
  return set(newContactRef, contactData);
}

// Picks a random contact color CSS variable name (--contact_color_1 to --contact_color_15)
function getRandomContactColor() {
  const randomIndex = Math.floor(Math.random() * 15) + 1;
  return '--contact_color_' + randomIndex;
}

// Generates a new Contact object with a random color and saves it to the database under the current user's contacts
function generateContact(name, email, phone) {
  return createContact(auth.currentUser.uid, {
    name: name,
    email: email,
    phone: phone,
    color: getRandomContactColor()
  });
}

// Handles the add-contact form submission and closes the dialog on success
function handleAddContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const phone = document.getElementById('contactPhone').value;

  generateContact(name, email, phone).then(() => closeDialog('addContact'));
  loadContacts(auth.currentUser.uid); // Refresh the contacts list after adding a new contact
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

// Fetches the current user's contacts from the database and renders them
function loadContacts(uid) {
  get(ref(database, 'users/' + uid + '/contacts')).then((snapshot) => {
    const contacts = mapContactsToArray(snapshot.val());
    renderContactsList(contacts);
  });
}

// Renders the list of contacts into the contactsList element
function renderContactsList(contacts) {
  const contactsList = document.getElementById('contactsList');
  contactsList.innerHTML = contacts.map((contact) => contactsListItemTemplate(contact)).join('');
}


// Entry point: injects the dialog markup, then attaches all event listeners
function initContacts() {
  injectAddContactDialog();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadContacts(user.uid);
    } else {
      window.location.href = '../index.html';
    }
  });

  document.getElementById('addContactForm').addEventListener('submit', handleAddContactSubmit);
  document.getElementById('addContactButton').addEventListener('click', () => openDialog('addContact'));
  document.getElementById('addContactForm').addEventListener('submit', handleAddContactSubmit);
  document.getElementById('addContactButton').addEventListener('click', () => openDialog('addContact'));
  document.getElementById('closeAddContactButton').addEventListener('click', () => closeDialog('addContact'));
  document.getElementById('cancelAddContactButton').addEventListener('click', () => closeDialog('addContact'));
  document.getElementById('addContact').addEventListener('click', () => closeDialog('addContact'));
  document.querySelector('.add_contact').addEventListener('click', stopPropagation);
}

document.addEventListener('DOMContentLoaded', initContacts);