// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
if (span) {
  span.onclick = function () {
    modal.style.display = "none";
  };
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const moon = document.getElementById("moon");
const sun = document.getElementById("sun");
const body = document.body;

// Function to apply dark mode
function applyDarkMode() {
  body.classList.add("dark");
  document.querySelectorAll(".email-1").forEach((email) => {
    email.style.color = "grey";
  });
  document.querySelectorAll(".links").forEach((link) => {
    link.style.color = "white";
  });
  document.querySelector(".email").style.color = "grey";
}

// Function to remove dark mode
function removeDarkMode() {
  body.classList.remove("dark");
  document.querySelectorAll(".links").forEach((link) => {
    link.style.color = "black";
  });
}

// Check localStorage for dark mode state on page load
if (localStorage.getItem("darkMode") === "enabled") {
  applyDarkMode();
}

moon.addEventListener("click", () => {
  applyDarkMode();
  localStorage.setItem("darkMode", "enabled");
});

sun.addEventListener("click", () => {
  removeDarkMode();
  localStorage.setItem("darkMode", "disabled");
});

const comment = document.getElementById("comment");
const likes = document.getElementById("likes");
