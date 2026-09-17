const state = {
  contacts: [],
};

function createContact(uid, contactData) {
  return fetch(baseUrl + "users/" + uid + "/contacts.json", {
    method: "POST",
    body: JSON.stringify(contactData),
  });
}

function deleteContact(uid, contactId) {
  const path = "users/" + uid + "/contacts/" + contactId + ".json";
  return fetch(baseUrl + path, {
    method: "DELETE",
  });
}

function updateContact(uid, contactId, contactData) {
  const path = "users/" + uid + "/contacts/" + contactId + ".json";
  return fetch(baseUrl + path, {
    method: "PATCH",
    body: JSON.stringify(contactData),
  });
}

function getRandomContactColor() {
  const randomIndex = Math.floor(Math.random() * 15) + 1;
  return "--contact_color_" + randomIndex;
}

function generateContact(name, email, phone) {
  const uid = localStorage.getItem("uid");

  return createContact(uid, {
    name,
    email,
    phone,
    color: getRandomContactColor(),
  });
}

function injectAddContactDialog() {
  const mainContent = document.querySelector(".main_content");
  mainContent.insertAdjacentHTML("beforeend", addContactDialogTemplate());
}

function injectEditContactDialog(contact) {
  removeExistingEditDialog();

  const mainContent = document.querySelector(".main_content");
  mainContent.insertAdjacentHTML("beforeend", editContactDialogTemplate(contact));
}

function removeExistingEditDialog() {
  const dialog = document.getElementById("editContact");
  if (dialog) dialog.remove();
}

function openDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  dialog.showModal();
}

function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  dialog.close();
}

function stopPropagation(event) {
  event.stopPropagation();
}

function mapContactsToArray(contactsData) {
  if (!contactsData) return [];

  return Object.keys(contactsData).map((key) => {
    return {
      id: key,
      ...contactsData[key],
    };
  });
}

function sortContactsByName(contacts) {
  return [...contacts].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

function groupContactsByLetter(contacts) {
  const groups = {};

  contacts.forEach((contact) => {
    addContactToGroup(groups, contact);
  });

  return groups;
}

function addContactToGroup(groups, contact) {
  const letter = contact.name.charAt(0).toUpperCase();
  if (!groups[letter]) groups[letter] = [];
  groups[letter].push(contact);
}

function contactGroupHeaderTemplate(letter) {
  return `<li class="contact_group_header">${letter}</li>`;
}

function renderContactsList(contacts) {
  const list = document.getElementById("contactsList");
  const sorted = sortContactsByName(contacts);
  const grouped = groupContactsByLetter(sorted);

  list.innerHTML = createContactsListHtml(grouped);
}

function createContactsListHtml(grouped) {
  return Object.keys(grouped)
    .sort()
    .map((letter) => createContactGroupHtml(letter, grouped[letter]))
    .join("");
}

function createContactGroupHtml(letter, contacts) {
  const header = contactGroupHeaderTemplate(letter);
  const items = contacts.map(contactsListItemTemplate).join("");
  return header + items;
}

function loadContacts(uid) {
  const url = baseUrl + "users/" + uid + "/contacts.json";

  return fetch(url)
    .then((response) => response.json())
    .then(saveAndRenderContacts);
}

function saveAndRenderContacts(data) {
  state.contacts = mapContactsToArray(data);
  renderContactsList(state.contacts);
}

function findContactById(contacts, id) {
  return contacts.find((contact) => contact.id === id);
}

function showContactDetail(contact) {
  if (!contact) return;

  const card = document.getElementById("contactCard");
  card.innerHTML = contactDetailTemplate(contact);
}

function handleContactClick(event) {
  const item = event.target.closest(".contact_item");
  if (!item) return;

  const contact = findContactById(state.contacts, item.dataset.contactId);
  showContactDetail(contact);
  openMobileContactDetail();
}

function openMobileContactDetail() {
  if (window.innerWidth >= 1024) return;

  const list = document.querySelector(".contacts_container");
  const details = document.querySelector(".contact_details_container");

  list.classList.add("mobile_detail_hidden");
  details.classList.add("mobile_detail_open");
}

function closeMobileContactDetail() {
  const list = document.querySelector(".contacts_container");
  const details = document.querySelector(".contact_details_container");

  list.classList.remove("mobile_detail_hidden");
  details.classList.remove("mobile_detail_open");
}

function handleDeleteContact(contactId) {
  const uid = localStorage.getItem("uid");

  deleteContact(uid, contactId).then(() => {
    clearContactDetail();
    closeMobileContactDetail();
    loadContacts(uid);
  });
}

function clearContactDetail() {
  const card = document.getElementById("contactCard");
  card.innerHTML = "<p>Select a contact to see details.</p>";
}

function handleEditContact(contactId) {
  const contact = findContactById(state.contacts, contactId);
  if (!contact) return;

  injectEditContactDialog(contact);
  registerEditDialogListeners();
  openEditContactDialog();
}

function openEditContactDialog() {
  const dialog = document.getElementById("editContact");
  openDialog("editContact");
  openAnimation(dialog);
}

function handleContactCardClick(event) {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    handleMobileContactAction(actionButton);
    return;
  }

  handleDesktopContactAction(event);
}

function handleDesktopContactAction(event) {
  const editButton = event.target.closest("#editContactButton");
  const deleteButton = event.target.closest("#deleteContactButton");

  if (editButton) handleEditContact(editButton.dataset.contactId);
  if (deleteButton) handleDeleteContact(deleteButton.dataset.contactId);
}

function handleMobileContactAction(button) {
  const action = button.dataset.action;

  if (action === "toggle-menu") toggleMobileContactMenu();
  if (action === "edit-mobile") openMobileEdit(button);
  if (action === "delete-mobile") deleteMobileContact(button);
}

function toggleMobileContactMenu() {
  const menu = document.querySelector(".contact_mobile_menu");
  if (!menu) return;

  menu.classList.toggle("contact_mobile_menu_open");
}

function closeMobileContactMenu() {
  const menu = document.querySelector(".contact_mobile_menu");
  if (!menu) return;

  menu.classList.remove("contact_mobile_menu_open");
}

function openMobileEdit(button) {
  closeMobileContactMenu();
  handleEditContact(button.dataset.contactId);
}

function deleteMobileContact(button) {
  closeMobileContactMenu();
  handleDeleteContact(button.dataset.contactId);
}

function handleAddContactSubmit(event) {
  event.preventDefault();

  const uid = localStorage.getItem("uid");
  const data = getAddContactFormData();

  generateContact(data.name, data.email, data.phone).then(() => {
    finishAddContact(uid);
  });
}

function getAddContactFormData() {
  return {
    name: document.getElementById("contactName").value,
    email: document.getElementById("contactEmail").value,
    phone: document.getElementById("contactPhone").value,
  };
}

function finishAddContact(uid) {
  document.getElementById("addContactForm").reset();
  closeDialog("addContact");
  loadContacts(uid);
}

function handleEditContactSubmit(event) {
  event.preventDefault();

  const uid = localStorage.getItem("uid");
  const data = getEditContactFormData();

  updateContact(uid, data.id, data.contact).then(() => {
    finishEditContact(uid, data.id);
  });
}

function getEditContactFormData() {
  return {
    id: document.getElementById("editContactId").value,
    contact: {
      name: document.getElementById("editContactName").value,
      email: document.getElementById("editContactEmail").value,
      phone: document.getElementById("editContactPhone").value,
    },
  };
}

function finishEditContact(uid, contactId) {
  document.getElementById("editContact").remove();

  loadContacts(uid).then(() => {
    const contact = findContactById(state.contacts, contactId);
    showContactDetail(contact);
  });
}

function registerEditDialogListeners() {
  const form = document.getElementById("editContactForm");
  const close = document.getElementById("closeEditContactButton");
  const remove = document.getElementById("deleteEditContactButton");

  form.addEventListener("submit", handleEditContactSubmit);
  close.addEventListener("click", closeEditContactDialog);
  remove.addEventListener("click", handleEditDelete);
}

function closeEditContactDialog() {
  const dialog = document.getElementById("editContact");
  closeAnimation(dialog);
}

function handleEditDelete(event) {
  const contactId = event.currentTarget.dataset.contactId;

  handleDeleteContact(contactId);
  closeAnimation(document.getElementById("editContact"));
}

function registerDialogListeners() {
  registerAddContactForm();
  registerAddContactButtons();
  registerCloseContactButtons();
}

function registerAddContactForm() {
  const form = document.getElementById("addContactForm");
  form.addEventListener("submit", handleAddContactSubmit);
}

function registerAddContactButtons() {
  const desktop = document.getElementById("addContactButton");
  const mobile = document.getElementById("mobileAddContactButton");

  desktop.addEventListener("click", openAddContactDialog);
  mobile.addEventListener("click", openAddContactDialog);
}

function openAddContactDialog() {
  const dialog = document.getElementById("addContact");

  openDialog("addContact");
  openAnimation(dialog);
}

function registerCloseContactButtons() {
  const close = document.getElementById("closeAddContactButton");
  const cancel = document.getElementById("cancelAddContactButton");

  close.addEventListener("click", closeAddContactDialog);
  cancel.addEventListener("click", closeAddContactDialog);
}

function closeAddContactDialog() {
  const dialog = document.getElementById("addContact");
  closeAnimation(dialog);
}

function registerContactListeners() {
  const list = document.getElementById("contactsList");
  const card = document.getElementById("contactCard");

  list.addEventListener("click", handleContactClick);
  card.addEventListener("click", handleContactCardClick);
}

function initContacts() {
  const uid = localStorage.getItem("uid");

  if (!uid) {
    window.location.href = "../index.html";
    return;
  }

  initializeContactsPage(uid);
}

function initializeContactsPage(uid) {
  loadOwnProfile(uid);
  injectAddContactDialog();
  loadContacts(uid);
  registerDialogListeners();
  registerContactListeners();
}