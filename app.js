const ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";

async function uploadFiles() {

const files = document.getElementById("files").files;
const status = document.getElementById("status");

if (!files.length) {
status.textContent = "Aucune photo sélectionnée";
return;
}

status.textContent = "Upload en cours...";

for (let file of files) {

const base64 = await readFile(file);

await fetch(ENDPOINT, {
method: "POST",
body: JSON.stringify({
filename: file.name,
mimeType: file.type,
data: base64
})
});

}

showSuccess();

}

function readFile(file) {

return new Promise(resolve => {

const reader = new FileReader();

reader.onload = () => {
resolve(reader.result.split(",")[1]);
};

reader.readAsDataURL(file);

});

}

function showSuccess() {

document.getElementById("status").textContent = "";

document.getElementById("result").classList.remove("hidden");

/* 🎉 confettis simples */
for (let i = 0; i < 30; i++) {
setTimeout(() => {
let c = document.createElement("div");
c.innerHTML = "🎉";
c.style.position = "fixed";
c.style.left = Math.random() * 100 + "vw";
c.style.top = "-20px";
c.style.fontSize = "20px";
document.body.appendChild(c);

setTimeout(() => c.remove(), 3000);

}, i * 100);
}

}

function resetUpload() {
document.getElementById("files").value = "";
document.getElementById("result").classList.add("hidden");
}
