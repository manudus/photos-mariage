const PASSWORD = "6626";

/* 🔥 TON URL APPS SCRIPT */
const ENDPOINT =
"https://script.google.com/macros/s/XXXXX/exec";

document.addEventListener("DOMContentLoaded", () => {

document
.getElementById("loginBtn")
.addEventListener("click", login);

document
.getElementById("uploadBtn")
.addEventListener("click", uploadFiles);

loadGallery();

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

/* ================= UPLOAD ================= */

async function uploadFiles() {

const files =
document.getElementById("files").files;

const status =
document.getElementById("status");

if (!files.length) {
status.textContent = "Aucune photo";
return;
}

for (let file of files) {

const base64 =
await readFile(file);

await fetch(ENDPOINT, {

method: "POST",
headers: {
"Content-Type": "text/plain"
},

body: JSON.stringify({
filename: file.name,
mimeType: file.type,
data: base64,
token: PASSWORD
})

});

}

status.textContent = "Upload terminé ✔";

loadGallery();

}

function readFile(file) {

return new Promise((resolve) => {

const reader = new FileReader();

reader.onload = () => {

resolve(reader.result.split(",")[1]);

};

reader.readAsDataURL(file);

});

}

/* ================= GALERIE ================= */

async function loadGallery() {

const gallery =
document.getElementById("gallery");

try {

const res = await fetch(ENDPOINT);

const data = await res.json();

gallery.innerHTML = "";

data.forEach(img => {

const el = document.createElement("img");

el.src = img.url;

gallery.appendChild(el);

});

} catch (e) {

gallery.innerHTML =
"<p>Erreur galerie</p>";

}

}
```
