const ENDPOINT =
"https://script.google.com/macros/s/XXXXX/exec";

let TOKEN = null;

/* LOGIN */
async function login() {

const pwd =
document.getElementById("pwd").value;

const res = await fetch(ENDPOINT, {
method: "POST",
body: JSON.stringify({
action: "login",
password: pwd
})
});

const data = await res.json();

if (data.ok) {

TOKEN = data.token;

document
.getElementById("loginBox")
.classList.add("hidden");

document
.getElementById("uploadBox")
.classList.remove("hidden");

} else {

document
.getElementById("error")
.textContent = "Accès refusé";

}

}

/* UPLOAD */
async function uploadFiles() {

const files =
document.getElementById("files").files;

for (let file of files) {

const base64 = await readFile(file);

await fetch(ENDPOINT, {
method: "POST",
body: JSON.stringify({
action: "upload",
token: TOKEN,
filename: file.name,
mimeType: file.type,
data: base64
})
});

}

alert("Upload terminé");

}

/* FILE */
function readFile(file) {

return new Promise(resolve => {

const r = new FileReader();

r.onload = () =>
resolve(r.result.split(",")[1]);

r.readAsDataURL(file);

});

}
