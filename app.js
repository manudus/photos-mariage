const PASSWORD = "6626";
const ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";

function login() {
  const pwd = document.getElementById("pwd").value;

  if (pwd === PASSWORD) {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("uploadBox").classList.remove("hidden");

    loadGallery();
  } else {
    document.getElementById("error").textContent = "Mot de passe incorrect";
  }
}

function uploadFiles() {
  const files = document.getElementById("files").files;
  const status = document.getElementById("status");

  if (!files.length) {
    status.textContent = "Aucun fichier";
    return;
  }

  let uploaded = 0;

  for (let file of files) {
    const reader = new FileReader();

    reader.onload = function () {
      sendFile(file.name, file.type, reader.result, () => {
        uploaded++;

        const percent = Math.round((uploaded / files.length) * 100);
        document.getElementById("progressBar").style.width = percent + "%";

        if (uploaded === files.length) {
          status.textContent = "Upload terminé ✔";
          loadGallery();
        }
      });
    };

    reader.readAsDataURL(file);
  }
}

function sendFile(name, type, data, callback) {
  const base64 = data.split(",")[1];

  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      filename: name,
      mimeType: type,
      data: base64,
      token: PASSWORD
    })
  })
  .then(() => callback())
  .catch(() => {
    document.getElementById("status").textContent = "Erreur upload";
  });
}

/* 🔥 GALERIE (version simple) */
function loadGallery() {
  const gallery = document.getElementById("gallery");

  // Version simple : recharge depuis ton Apps Script si tu ajoutes GET
  fetch(ENDPOINT)
    .then(res => res.json())
    .then(data => {
      gallery.innerHTML = "";

      data.forEach(img => {
        const el = document.createElement("img");
        el.src = img.url;
        gallery.appendChild(el);
      });
    })
    .catch(() => {
      gallery.innerHTML = "<p>Galerie indisponible</p>";
    });
}
