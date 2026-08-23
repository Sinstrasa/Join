import { auth, database } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { ref, push, set, get } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";
import { addContactDialogTemplate, contactsListItemTemplate} from "./contactsTemplates.js";

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

  generateContact(name, email, phone).then(() => {
    document.getElementById('addContactForm').reset();
    closeDialog('addContact');
    loadContacts(auth.currentUser.uid);
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

// Fetches the current user's contacts from the database and renders them
function loadContacts(uid) {
  get(ref(database, 'users/' + uid + '/contacts')).then((snapshot) => {
    const contacts = mapContactsToArray(snapshot.val());
    renderContactsList(contacts);
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