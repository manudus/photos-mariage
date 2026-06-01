const ENDPOINT = "https://script.google.com/macros/s/AKfycbzCQ3tL2DIti0UtniK9nUXbCr7MIEbs60tG_xS7DoxOLIL0_QcUAGBBfoDMwKAHKRA/exec";

async function uploadFiles() {

const files =
document.getElementById("files").files;

const status =
document.getElementById("status");

if (!files.length) {
status.textContent =
"Sélectionne au moins une photo";
return;
}

status.textContent =
"Upload en cours...";

try {

for (const file of files) {

const base64 =
await readFile(file);

const res =
await fetch(
ENDPOINT,
{
method: "POST",
headers: {
"Content-Type":
"text/plain"
},
body:
JSON.stringify({
filename:
file.name,
mimeType:
file.type,
data:
base64
})
}
);

const text =
await res.text();

console.log(text);

if (!res.ok) {
throw new Error(
"HTTP " +
res.status
);
}

}

showSuccess();

} catch (err) {

console.error(err);

status.textContent =
"Erreur : " +
err.message;

}

}

function readFile(file) {

return new Promise(
(resolve, reject) => {

const reader =
new FileReader();

reader.onload =
() =>
resolve(
reader.result
.split(",")[1]
);

reader.onerror =
reject;

reader.readAsDataURL(
file
);

}
);

}

function showSuccess() {

document
.getElementById(
"status"
)
.textContent =
"";

document
.getElementById(
"result"
)
.classList
.remove(
"hidden"
);

}

function resetUpload() {

document
.getElementById(
"files"
)
.value =
"";

document
.getElementById(
"result"
)
.classList
.add(
"hidden"
);

}
