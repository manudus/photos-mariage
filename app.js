```javascript
const PASSWORD = "6626";

/* Remplace par ton URL Apps Script */
const ENDPOINT =
"https://script.google.com/macros/s/AKfycbzBzpcJvudmqQ3NB6oQl_WTbRaZYEe3npbsSqALQ6vHD3zm0I06at692vjej4OgDCA/exec

";

/* ==========================
   LOGIN
========================== */

function login() {
  const pwd = document.getElementById("pwd").value;
  const error = document.getElementById("error");

  if (pwd === PASSWORD) {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("uploadBox").classList.remove("hidden");

    error.textContent = "";

    loadGallery();
  } else {
    error.textContent = "Mot de passe incorrect";
  }
}

/* ==========================
   UPLOAD
========================== */

async function uploadFiles() {

  const files =
    document.getElementById("files").files;

  const status =
    document.getElementById("status");

  const progress =
    document.getElementById("progressBar");

  if (!files.length) {
    status.textContent =
      "Sélectionne au moins une photo";
    return;
  }

  status.textContent =
    "Upload en cours...";

  progress.style.width = "0%";

  try {

    for (
      let i = 0;
      i < files.length;
      i++
    ) {

      const file = files[i];

      const base64 =
        await readFile(file);

      await sendFile(
        file.name,
        file.type,
        base64
      );

      const percent =
        Math.round(
          ((i + 1) /
            files.length) *
            100
        );

      progress.style.width =
        percent + "%";
    }

    status.textContent =
      "Upload terminé ✔";

    loadGallery();

  } catch (err) {

    status.textContent =
      "Erreur : " +
      err.message;

    console.error(err);
  }
}

/* ==========================
   LECTURE FICHIER
========================== */

function readFile(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.onload = () => {

        resolve(
          reader.result
            .split(",")[1]
        );

      };

      reader.onerror =
        reject;

      reader.readAsDataURL(
        file
      );

    }
  );

}

/* ==========================
   ENVOI
========================== */

async function sendFile(
  filename,
  mimeType,
  data
) {

  const res =
    await fetch(
      ENDPOINT,
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "text/plain"
        },

        body:
          JSON.stringify(
            {
              filename,
              mimeType,
              data,
              token:
                PASSWORD
            }
          )
      }
    );

  if (!res.ok) {

    throw new Error(
      "Upload refusé (" +
        res.status +
        ")"
    );

  }

  return await res.text();

}

/* ==========================
   GALERIE
========================== */

async function loadGallery() {

  const gallery =
    document.getElementById(
      "gallery"
    );

  gallery.innerHTML =
    "<p>Chargement…</p>";

  try {

    const res =
      await fetch(
        ENDPOINT
      );

    if (!res.ok) {
      throw new Error(
        "Impossible de charger"
      );
    }

    const images =
      await res.json();

    gallery.innerHTML =
      "";

    if (
      !images.length
    ) {

      gallery.innerHTML =
        "<p>Aucune photo</p>";

      return;

    }

    images.forEach(
      img => {

        const el =
          document.createElement(
            "img"
          );

        el.src =
          img.url;

        el.loading =
          "lazy";

        gallery.appendChild(
          el
        );

      }
    );

  } catch (err) {

    gallery.innerHTML =
      "<p>Galerie indisponible</p>";

    console.error(
      err
    );

  }

}
```
