const state = {
  contacts: [],
  ownUser: null,
};


function createContact(uid, contactData) {
  const token = localStorage.getItem("idToken");
  const path = `users/${uid}/contacts.json?auth=${token}`;

  return fetch(baseUrl + path, {
    method: "POST",
    body: JSON.stringify(contactData),
  });
}


function deleteContact(uid, contactId) {
  const token = localStorage.getItem("idToken");
  const path = `users/${uid}/contacts/${contactId}.json?auth=${token}`;

  return fetch(baseUrl + path, {
    method: "DELETE",
  });
}


function updateContact(uid, contactId, contactData) {
  const token = localStorage.getItem("idToken");
  const path = `users/${uid}/contacts/${contactId}.json?auth=${token}`;

  return fetch(baseUrl + path, {
    method: "PATCH",
    body: JSON.stringify(contactData),
  });
}


function updateOwnUser(uid, userData) {
  const token = localStorage.getItem("idToken");
  const path = `users/${uid}.json?auth=${token}`;

  return fetch(baseUrl + path, {
    method: "PATCH",
    body: JSON.stringify(userData),
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


async function loadContacts(uid) {
  const contacts = await loadContactsData(uid);
  const ownUser = await loadOwnContact(uid);

  saveAndRenderContacts(contacts, ownUser);
}


async function loadContactsData(uid) {
  const token = localStorage.getItem("idToken");
  const path = `users/${uid}/contacts.json?auth=${token}`;
  const response = await fetch(baseUrl + path);

  return response.json();
}


async function loadOwnContact(uid) {
  if (localStorage.getItem("isGuest") === "true") {
    return null;
  }

  const user = await getOwnUserData(uid);
  return createOwnContact(user, uid);
}


async function getOwnUserData(uid) {
  const token = localStorage.getItem("idToken");
  const path = `users/${uid}.json?auth=${token}`;
  const response = await fetch(baseUrl + path);

  return response.json();
}


function createOwnContact(user, uid) {
  if (!user) return null;

  return {
    id: uid,
    name: user.username,
    email: user.email || "",
    phone: user.phone || "",
    color: user.color || "--contact_color_1",
    isOwnUser: true,
  };
}


function mapContactsToArray(data) {
  if (!data) return [];

  return Object.keys(data).map((key) => {
    return {
      id: key,
      ...data[key],
    };
  });
}


function saveAndRenderContacts(data, ownUser = null) {
  state.contacts = mapContactsToArray(data);
  state.ownUser = ownUser;

  renderOwnUser(ownUser);
  renderContactsList(state.contacts);
}


function findContactById(contacts, id) {
  return contacts.find((contact) => contact.id === id);
}


function getContactById(contactId) {
  if (state.ownUser?.id === contactId) {
    return state.ownUser;
  }

  return findContactById(state.contacts, contactId);
}


function createOwnUserUpdateData(contact) {
  return {
    username: contact.name,
    email: contact.email,
    phone: contact.phone,
  };
}