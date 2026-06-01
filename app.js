const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEujXcCRFt80cAILTlB3HNGG0fybvxMiN2siSOB_98NNa81L3gzuJv_vRNWERrxpI/exec";

const INVITE_CODE = "6626";

let images = [];
let currentIndex = 0;

/* =====================
🔐 LOGIN
===================== */
function checkCode() {
  const input = document.getElementById("accessCode").value;

  if (input === INVITE_CODE) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
    loadGallery();
  } else {
    document.getElementById("loginError").textContent = "Code incorrect ❌";
  }
}

/* =====================
📤 UPLOAD
===================== */
async function uploadPhotos() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  if (!files.length) {
    status.textContent = "Ajoute des photos 📸";
    return;
  }

  status.textContent = "Upload... ⏳";

  for (let file of files) {
    const base64 = await toBase64(file);

    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        image: base64,
        name: file.name,
        code: INVITE_CODE
      })
    });
  }

  status.textContent = "Envoyé 💛";
  document.getElementById("fileInput").value = "";

  loadGallery();
  showPopup();
}

/* =====================
BASE64
===================== */
function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/* =====================
🖼️ GALERIE
===================== */
function loadGallery() {
  fetch(SCRIPT_URL)
    .then(async res => {
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Réponse invalide:", text);
        return { images: [] };
      }
    })
    .then(data => {
      const grid = document.getElementById("galleryGrid");
      grid.innerHTML = "";

      if (!data.images || !data.images.length) {
        grid.innerHTML = "<p style='text-align:center'>Aucune photo pour le moment 💛</p>";
        return;
      }

      data.images.forEach(url => {
        const img = document.createElement("img");
        img.src = url;

        // 🔥 IMPORTANT: fallback si image cassée
        img.onerror = () => {
          img.style.display = "none";
        };

        grid.appendChild(img);
      });
    })
    .catch(err => {
      console.error("Erreur galerie:", err);
    });
}

/* =====================
🔍 VIEWER
===================== */
function openViewer(index) {
  currentIndex = index;
  document.getElementById("viewerImg").src = images[currentIndex];
  document.getElementById("viewer").classList.remove("hidden");
}

function closeViewer() {
  document.getElementById("viewer").classList.add("hidden");
}

function nextImg() {
  if (currentIndex < images.length - 1) {
    currentIndex++;
    document.getElementById("viewerImg").src = images[currentIndex];
  }
}

function prevImg() {
  if (currentIndex > 0) {
    currentIndex--;
    document.getElementById("viewerImg").src = images[currentIndex];
  }
}

/* =====================
🎉 POPUP
===================== */
function showPopup() {
  document.getElementById("thankPopup").classList.remove("hidden");

  setTimeout(() => {
    closePopup();
  }, 4000);
}

function closePopup() {
  document.getElementById("thankPopup").classList.add("hidden");
}

/* =====================
📱 SWIPE MOBILE
===================== */
let startX = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;

  if (!document.getElementById("viewer").classList.contains("hidden")) {
    if (startX - endX > 50) nextImg();
    if (endX - startX > 50) prevImg();
  }
});
