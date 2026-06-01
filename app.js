const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEujXcCRFt80cAILTlB3HNGG0fybvxMiN2siSOB_98NNa81L3gzuJv_vRNWERrxpI/exec";

// 🔐 CODE INVITÉ (doit matcher Google Apps Script)
const INVITE_CODE = "mariage2026";

// =====================
// 🔐 LOGIN INVITÉ
// =====================
function checkCode() {
  const input = document.getElementById("accessCode").value;
  const error = document.getElementById("loginError");

  if (input === INVITE_CODE) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").classList.remove("hidden");

    initApp();
  } else {
    error.textContent = "Code incorrect ❌";
  }
}

// =====================
// 🚀 INIT APP
// =====================
function initApp() {
  generateQR();
  loadGallery();
}

// =====================
// 📤 UPLOAD PHOTOS
// =====================
async function uploadPhotos() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  if (!files.length) {
    status.textContent = "Choisis au moins une photo 📸";
    return;
  }

  status.textContent = "Envoi en cours... ⏳";

  try {
    for (let file of files) {
      const base64 = await toBase64(file);

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          image: base64,
          name: file.name,
          code: INVITE_CODE // 🔐 sécurité côté serveur
        })
      });

      const result = await response.json();

      if (!result.success) {
        console.error("Erreur upload:", result);
      }
    }

    status.textContent = "Photos envoyées 💛";
    document.getElementById("fileInput").value = "";

    loadGallery();
    showPopup();

  } catch (err) {
    console.error(err);
    status.textContent = "Erreur d’envoi ❌";
  }
}

// =====================
// 🔄 BASE64 CONVERSION
// =====================
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// =====================
// 🖼️ GALERIE
// =====================
function loadGallery() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("galleryGrid");
      grid.innerHTML = "";

      if (!data.images) return;

      data.images.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.loading = "lazy";
        grid.appendChild(img);
      });
    })
    .catch(err => {
      console.error("Erreur galerie:", err);
    });
}

// =====================
// 🎉 POPUP REMERCIEMENT
// =====================
function showPopup() {
  document.getElementById("thankPopup").classList.remove("hidden");

  // auto-fermeture douce après 5s
  setTimeout(() => {
    closePopup();
  }, 5000);
}

function closePopup() {
  document.getElementById("thankPopup").classList.add("hidden");
}

// =====================
// 📱 QR CODE
// =====================
function generateQR() {
  const qrContainer = document.getElementById("qrcode");
  if (!qrContainer) return;

  qrContainer.innerHTML = "";

  new QRCode(qrContainer, {
    text: window.location.href,
    width: 160,
    height: 160
  });
}
