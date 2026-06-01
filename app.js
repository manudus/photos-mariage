const PASSWORD = "6626";

function login() {

alert("LOGIN OK");

const pwd =
document
.getElementById("pwd")
.value
.trim();

if (pwd === PASSWORD) {

document
.getElementById("loginBox")
.style.display =
"none";

document
.getElementById("uploadBox")
.style.display =
"block";

} else {

document
.getElementById("error")
.textContent =
"Mot de passe incorrect";

}

}

/* 🔥 rend la fonction accessible globalement */
window.login = login;
