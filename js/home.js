//Get the modal
var modal = document.getElementById("myModal");

//Get the button that opens the modal
var btn = document.getElementById("myBtn");

//Get the <span> element that closes the modal
var span = document.querySelector(".close"); // ✅ Yangilandi

// ✅ Modalni ochish
if (btn) {
  btn.onclick = function () {
    modal.style.display = "block";
  };
}

// ✅ Modalni yopish (agar mavjud bo‘lsa)
if (span) {
  span.onclick = function () {
    modal.style.display = "none";
  };
}

// ✅ Modalni tashqaridan bosganda yopish
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//Dark mode sozlamalari
const moon = document.getElementById("moon");
const sun = document.getElementById("sun");
const body = document.body;

// ✅ Dark mode funksiyasi
function applyDarkMode() {
  body.classList.add("dark");

  document.querySelectorAll(".email-1").forEach((email) => {
    email.style.color = "grey";
  });

  document.querySelectorAll(".links").forEach((link) => {
    link.style.color = "white";
  });

  let emailElement = document.querySelector(".email");
  if (emailElement) {
    emailElement.style.color = "grey";
  }
}

// ✅ Light mode funksiyasi
function removeDarkMode() {
  body.classList.remove("dark");

  document.querySelectorAll(".links").forEach((link) => {
    link.style.color = "black";
  });
}

//Sayt yuklanganda dark mode tekshirish
if (localStorage.getItem("darkMode") === "enabled") {
  applyDarkMode();
}

if (moon) {
  moon.addEventListener("click", () => {
    applyDarkMode();
    localStorage.setItem("darkMode", "enabled");
  });
}

if (sun) {
  sun.addEventListener("click", () => {
    removeDarkMode();
    localStorage.setItem("darkMode", "disabled");
  });
}

const footer = document.getElementById("footer");
const modalbir = document.getElementById("modalbir");

// LocalStorage'dan foydalanuvchini olish
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "../index.html";
}

console.log(user);
// Backenddan kelgan avatar yo‘liga to‘liq URL qo‘shish
const avatarUrl = `http://localhost:3000/${user.avatar}`;

function footerr() {
  if (!user || !user.avatar) {
    console.warn("User ma'lumotlari topilmadi!");
    return;
  }

  footer.innerHTML = `
    <div class="user">
      <img class="ava" src="${avatarUrl}" alt="user-ava">
      <div class="user-info">
        <p class="name">${user.ism || "Foydalanuvchi"} ${user.familiya}</p>
        <p style="color: grey;" class="email">@${
          user.username || "username"
        }</p>
      </div>
    </div>
    <i id="logoutBtn" class="fa-solid fa-right-from-bracket"></i>

  `;
  document.getElementById("logoutBtn").addEventListener("click", logout);
}

//Logout funksiyasi
function logout() {
  localStorage.removeItem("user"); // Foydalanuvchini localStorage'dan o‘chirish
  window.location.href = "../index.html"; // Index sahifasiga yo‘naltirish
}

//Funksiyani chaqirish
footerr();

function displaymodal() {
  if (!modalbir) {
    console.error("modalbir elementi topilmadi!");
    return;
  }

  modalbir.innerHTML = `
    <div class="modal-top">
      <img id="modalava" src="${avatarUrl}" alt="user-ava">
      <input class="what" type="text" placeholder="What's happening?" id="postText">
    </div>
    <div id="btn-input">
      <label for="file" class="file" id="im-file">
        <input class="img-input" type="file" id="file" accept="image/*">
        <i class="fa-solid fa-image"></i>
      </label>
      <button onclick="tweetpost()" class="tweet" id="myBtn">Tweet</button>
    </div>
    <div id="preview-container" style="display: none;">
      <span id="remove-img">❌</span> <br><br>
      <img id="preview-img" src="" alt="Preview" style="max-width: 100%;">
    </div>
  `;

  const fileInput = document.getElementById("file");
  const previewContainer = document.getElementById("preview-container");
  const previewImg = document.getElementById("preview-img");
  const removeImg = document.getElementById("remove-img");

  fileInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Faqat JPG, PNG va GIF formatidagi rasmlar yuklanadi!");
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result;
        previewContainer.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  removeImg.addEventListener("click", function () {
    fileInput.value = "";
    previewImg.src = "";
    previewContainer.style.display = "none";
  });
}

displaymodal();

function tweetpost() {
  const postText = document.getElementById("postText").value;
  const fileInput = document.getElementById("file");

  if (!postText.trim()) {
    alert("Iltimos, matn yozing");
    return;
  }

  const formData = new FormData();
  formData.append("user_id", user.id);
  formData.append("infos", postText);
  if (fileInput.files.length) {
    formData.append("image", fileInput.files[0]); // Backend `image` deb qabul qiladi
  }
  //  console.log("Yuborilayotgan rasm:", formData.get("image"));
  // console.log(formData)

  axios
    .post("http://localhost:3000/post/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      alert("Post joylandi!");
      location.reload();
      console.log("Post muvaffaqiyatli yuklandi:", res.data);
    })
    .catch((err) => {
      console.error("Xatolik:", err.message);
      alert("Xatolik yuz berdi: " + err.response?.data?.message || err.message);
    });
}

const home = document.getElementById("hom");
const boxx = document.getElementById("boxx");
const prof = document.getElementById("prof");

function displayPost() {
  axios
    .get("http://localhost:3000/post")
    .then((res) => {
      // console.log(res.data);
      const sortedPosts = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      boxx.innerHTML = "";

      sortedPosts.forEach((e) => {
        const postDate = new Date(e.created_at);
        const formattedDate = postDate.toLocaleString();
        setTimeout(() => {
          likeSoni(e.id);
        }, 100);

        let imageHtml = "";
        if (e.filepath) {
          const imageUrl = `http://localhost:3000/uploads/${e.filepath}`;
          imageHtml = `
            <div class="imageOta">
              <img class="image" src="${imageUrl}" alt="post-image">
            </div>
          `;
        }

        let avatarHtml = "";
        if (e.avatar && e.avatar !== "null") {
          let avatarUrl = `http://localhost:3000/${e.avatar}`; // ✅ IKKI MARTA "uploads/" YOZILMASIN!
          console.log("Avatar URL:", avatarUrl); // 🔍 Tekshirish uchun
          avatarHtml = `<img class="avatar-1" src="${avatarUrl}" alt="avatar">`;
        }

        let likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
        let isLiked = likedPosts.includes(e.id);
        // console.log(e)

        boxx.innerHTML += `
          <div class="box">
            <div class="box-top">
              <div>
                 ${avatarHtml}
                <div>
                  <p class="name-1">${e.ism} 
                    <span class="email">${formattedDate}</span>
                  </p>
                  <p class="user-info-1">${e.infos}</p>
                </div>
              </div>
             <i class="fa-solid fa-ellipsis"></i>
            </div>
            ${imageHtml} 
             <div class="box-bottom">
              <span onclick="openModal(${e.id})" style="cursor: pointer;">
                  <i class="fa-solid fa-comment"></i>
                           <span id="comment-count-${e.id}">0</span>
              </span>
              <span onclick="likePost(${e.id})" style="cursor: pointer;">
                <i class="fa-solid fa-heart" id="like-icon-${e.id}"></i>

                <span id="like-count-${e.id}">0</span>
              </span>

            </div>
          </div>
        `;
      });
    })
    .catch((err) => {
      console.error("Xatolik yuz berdi!", err);
    });
}

home.addEventListener("click", displayPost);

displayPost();

prof.addEventListener("click", (event) => {
  event.preventDefault();
  axios.get(`http://localhost:3000/post/${user.id}`).then((res) => {
    const sortedPosts = res.data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    boxx.innerHTML = "";

    sortedPosts.forEach((e) => {
      const postDate = new Date(e.created_at);
      const formattedDate = postDate.toLocaleString();
      setTimeout(() => {
        likeSoni(e.id);
      }, 100);

      let imageHtml = e.filepath
        ? `<div class="imageOta"><img class="image" src="http://localhost:3000/uploads/${e.filepath}" alt="post-image"></div>`
        : "";

      let avatarHtml =
        e.avatar && e.avatar !== "null"
          ? `<img class="avatar-1" src="http://localhost:3000/${e.avatar}" alt="avatar">`
          : "";

      let commentCount = e.comment_count || 0; // ⚡ Agar comment_count null bo‘lsa, 0 qo‘yamiz

      boxx.innerHTML += `
        <div class="box"  id="${e.id}">
          <div class="box-top">
            <div>
              ${avatarHtml}
              <div>
                <p class="name-1">${user.ism} 
                  <span class="email">${formattedDate}</span>
                </p>
                <p class="user-info-1">${e.infos}</p>
              </div>
            </div>
            <i class="fa-solid fa-trash" onclick="delPost(${e.id})" style="cursor: pointer;"></i>
          </div>
          ${imageHtml} 
          <div class="box-bottom">
            <span onclick="openModal(${e.id})" style="cursor: pointer;">
              <i class="fa-solid fa-comment"></i>
              <span id="comment-count-${e.id}">${commentCount}</span>
            </span>
            <span onclick="likePost(${e.id})" style="cursor: pointer;">
              <i class="fa-solid fa-heart" id="like-icon-${e.id}"></i>
              <span id="like-count-${e.id}">0</span>
            </span>
          </div>
        </div>
      `;
    });
  });
});

const isDarkMode = document.body.classList.contains("dark-mode");

function delPost(eve) {
  axios.delete(`http://localhost:3000/post/${eve}`).then((res) => {
    document.getElementById(eve).remove();
  });
}

function likePost(postId) {
  const likeIcon = document.getElementById(`like-icon-${postId}`);
  axios
    .post("http://localhost:3000/like", {
      user_id: user.id,
      post_id: postId,
    })
    .then((res) => {
      if (res.data.success) {
        likeIcon.style.color = "red";
      } else {
        // likeIcon.style.color = isDarkMode ? "white" : "black";
        likeIcon.style.color = "white";
      }
      console.log(res.data);
      likeSoni(postId);
    });
}

function likeSoni(postid) {
  const likeCount = document.getElementById(`like-count-${postid}`);
  console.log("postid:", postid);
  console.log("Element:", document.getElementById(`like-count-${postid}`));

  if (!likeCount) {
    console.error(`Element topilmadi: like-count-${postid}`);
    return;
  }
  console.log(likeCount);
  axios
    .get(`http://localhost:3000/like_count/${postid}`)
    .then((res) => {
      const likeSon = res.data.like_count;

      if (res.data.success) {
        likeCount.innerText = likeSon;
      }
    })
    .catch((err) => console.log(err.message));
}

likeSoni();

// let currentPostId = null;
const modall = document.getElementById("comment-modal");
const commentsList = document.getElementById("comments-list");

// **🟢 MODALNI OCHISH**
function openModal(postId) {
  console.log("Post ID:", postId);

  // **Modalni ko‘rsatish**
  modall.style.display = "flex";
  document.getElementById("user-avatar").src = avatarUrl;
  document.getElementById("user-name").innerText = user.username;

  axios
    .get(`http://localhost:3000/comments/${postId}`)
    .then((res) => {
      commentsList.innerHTML = "";

      if (res.data.length === 0) {
        commentsList.innerHTML = "<p class='no-comments'>No comments yet</p>";
      } else {
        res.data.forEach((comment) => {
          commentsList.innerHTML += `
          <div class="comment">
            <img src="http://localhost:3000/${comment.user_avatar}" class="comment-avatar" alt="Avatar">
            <div class="comment-text">
              <strong>${comment.user_name}</strong>
              <p>${comment.comment_text}</p>
            </div>
          </div>
        `;
        });
      }
    })
    .catch((err) => {
      console.error("Xatolik:", err.message);
      commentsList.innerHTML =
        "<p class='no-comments'>Commentlar mavjud emas</p>";
    });

  // **Komment yozish**
  document.getElementById("postCom").addEventListener("click", () => {
    const commentText = document.getElementById("comment-text");
    const errorMessage = document.getElementById("error-message");

    if (!commentText.value.trim()) {
      errorMessage.innerText = "Maydonni to‘ldiring!";
      errorMessage.style.color = "red"; // Qizil rangda chiqarish
      return; // Formani yuborishni to‘xtatish
    }

    // Error xabarini tozalash
    errorMessage.innerText = "";

    const newComment = {
      user_id: user.id,
      post_id: postId,
      text: commentText.value,
    };

    axios
      .post("http://localhost:3000/comments/add", newComment)
      .then((res) => {
        console.log(res.data);
        const noCommentsText = document.querySelector(".no-comments");
        if (noCommentsText) {
          noCommentsText.remove();
        }

        // commentsList.innerHTML =""

        // **Yangi commentni ekranga chiqarish**
        commentsList.innerHTML += `
        <div class="comment">
          <img src="http://localhost:3000/${user.avatar}" class="comment-avatar" alt="Avatar">
          <div class="comment-text">
            <strong>${user.username}</strong>
            <p>${newComment.text}</p>
          </div>
        </div>
      `;

        // **Kommentlar sonini yangilash**
        const commentCountElement = document.getElementById(
          `comment-count-${postId}`
        );
        if (commentCountElement) {
          commentCountElement.innerText =
            parseInt(commentCountElement.innerText) + 1;
        }

        // **Inputni tozalash**
        commentText.value = "";
      })
      .catch((err) => {
        console.error("Xatolik:", err.message);
        console.log(err.status);
      });
  });
}

// **🔴 MODALNI YOPISH**
function closeModal() {
  modall.style.display = "none"; // Modalni berkitamiz
}

document.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:3000/comments")
    .then((res) => {
      console.log(res.data);
      res.data.forEach((comment) => {
        const commentCountElement = document.getElementById(
          `comment-count-${comment.post_id}`
        );
        if (commentCountElement) {
          commentCountElement.innerText = comment.comment_count;
        }
      });
    })
    .catch((err) => console.error("Xatolik:", err.message));
});
