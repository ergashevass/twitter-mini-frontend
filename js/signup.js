const name = document.getElementById("name");
const surname = document.getElementById("surname");
const avatar = document.getElementById("photo");
const username = document.getElementById("username");
const password = document.getElementById("password");
const signupp = document.getElementById("signupbtn");
const errorMessage = document.getElementById("error-message");
const preview = document.getElementById("preview");

avatar.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

function signup(event) {
  event.preventDefault();

  if (
    !name.value.trim() ||
    !surname.value.trim() ||
    !avatar.files.length ||
    !username.value.trim() ||
    !password.value.trim()
  ) {
    errorMessage.textContent = "Barcha maydonlarni to'ldiring!";
    return;
  }

  const formData = new FormData();
  formData.append("ism", name.value.trim());
  formData.append("familiya", surname.value.trim());
  formData.append("avatar", avatar.files[0]); // 📌 "photo" emas, "avatar"
  formData.append("username", username.value.trim());
  formData.append("password", password.value.trim());

  axios
    .post("http://localhost:3000/user/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      console.log(res.data);
      if (res.data.avatar) {
        preview.src = `http://localhost:3000${res.data.avatar}`;
        preview.style.display = "block";
      }
      window.location.href = "../index.html";
    })
    .catch((err) => {
      console.error(err);
      errorMessage.textContent = err.response.data;
    });
}

signupp.addEventListener("click", signup);
