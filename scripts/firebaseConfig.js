import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBqXuaXjnWIvN5to5PuH5jif1FhT_9KKw",
  authDomain: "joindb-ccbc2.firebaseapp.com",
  databaseURL: "https://joindb-ccbc2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "joindb-ccbc2",
  storageBucket: "joindb-ccbc2.firebasestorage.app",
  messagingSenderId: "1070762316786",
  appId: "1:1070762316786:web:ff0016d25f4f9c225f116b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };