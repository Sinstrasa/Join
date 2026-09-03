import { auth, database } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


// Fetches all tasks from the database as an array
function loadTasks() {
  return get(ref(database, 'tickets')).then((snapshot) => {
    const data = snapshot.val();
    if (!data) return [];
    return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
  });
}

//Counts tickets matching given status
function countTicketsByStatus(tickets, status) {
  return tickets.filter(ticket => ticket.status === status).length;
}

// Counts urgent tickets that are not yet done
function countUrgentTickets(tickets) {
  return tickets.filter(ticket => ticket.priority === 'Urgent' && ticket.status !== 'done').length;
}

// Parses a date string in DD/MM/YYYY format into a Date object
function parseGermanDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day);
}

function findNextDueDate(tickets) {
  const dates = tickets.map(ticket => parseGermanDate(ticket.date)).filter((date) => !isNaN(date));
  if (dates.length === 0) return "No upcoming due dates";
  const nextDate = new Date(Math.min(...dates));
  return nextDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function countTicketsInBoard(tickets) {
  return tickets.filter(ticket => ticket.status !== 'done').length;
}

function renderSummaryTiles(tickets) {
  document.getElementById('todoCount').textContent = countTicketsByStatus(tickets, 'toDo');
  document.getElementById('doneCount').textContent = countTicketsByStatus(tickets, 'done');
  document.getElementById('urgentCount').textContent = countUrgentTickets(tickets);
  document.getElementById('upcomingDeadline').textContent = findNextDueDate(tickets);
  document.getElementById('tasksInBoardCount').textContent = countTicketsInBoard(tickets);
  document.getElementById('tasksInProgressCount').textContent = countTicketsByStatus(tickets, 'inProgress');
  document.getElementById('awaitingFeedbackCount').textContent = countTicketsByStatus(tickets, 'AwaitFeedback');
}

// Loads the current user's data from the database and displays a greeting
function loadUserGreeting(uid) {
  get(ref(database, 'users/' + uid)).then((snapshot) => {
    const userData = snapshot.val();
    displayGreeting(userData);
  });
}

// Returns a time-appropriate greeting word based on the current hour
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Fills the greeting element with the user's name and applies their color
function displayGreeting(userData) {
  const greeting = document.getElementById('greeting');
  const greetingName = document.getElementById('greetingName');
  greeting.textContent = getTimeBasedGreeting() + ',';
  greetingName.textContent = userData.username + '!';
  greetingName.style.color = `var(${userData.color})`;

  displayProfileIcon(userData);
}

// Entry point: waits for Firebase to confirm the logged-in user, then loads their data
function initSummary() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadUserGreeting(user.uid);
      loadTasks().then((tickets) => renderSummaryTiles(tickets));
    } else {
      window.location.href = '../pages/index.html';
    }
  });

  document.getElementById('logoutButton').addEventListener('click', handleLogout);
}

// Fills the profile icon with the user's first initial
function displayProfileIcon(userData) {
  const profileIcon = document.getElementById('userInitial');
  profileIcon.textContent = userData.username.charAt(0).toUpperCase();
}

// Signs the current user out and redirects to the login page
function handleLogout(event) {
    event.preventDefault();
  signOut(auth).then(() => {
    window.location.href = '../index.html';
  });
}

document.addEventListener('DOMContentLoaded', initSummary);