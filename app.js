const PASSWORD = "6626";

document.addEventListener("DOMContentLoaded", () => {

document
.getElementById("loginBtn")
.addEventListener("click", login);

});

function login() {

const pwd =
document
.getElementById("pwd")
.value
.trim();

if (pwd === PASSWORD) {

document
.getElementById("loginBox")
.classList.add("hidden");

document
.getElementById("uploadBox")
.classList.remove("hidden");

} else {

document
.getElementById("error")
.textContent =
"Mot de passe incorrect";

}

}
