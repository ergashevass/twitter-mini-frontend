const mode = localStorage.getItem("darkmode");
console.log(mode);


const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("btn");

function login() {
  axios
    .post("http://localhost:3000/user/login", {
      username: usernameInput.value,
      password: passwordInput.value,
    })
    .then((res) => {
      console.log(res.data.user);
      window.location.href = "./html/home_page.html";
      localStorage.setItem("user", JSON.stringify(res.data.user));
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 500) {
        document.getElementById("error-message").textContent =
          "Serverda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.";
      } else if (error.status === 400) {
        document.getElementById("error-message").textContent =
          "Password yoki username hato";
      }
    });
}

loginBtn.addEventListener("click", login);
// Enter tugmachasini bosganda login ishlashi
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    login(); // Login funksiyasini chaqiramiz
  }
});
