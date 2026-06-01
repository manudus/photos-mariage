const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEujXcCRFt80cAILTlB3HNGG0fybvxMiN2siSOB_98NNa81L3gzuJv_vRNWERrxpI/exec";

// 🔐 CODE INVITÉ (CHANGE ICI)
const INVITE_CODE = "mariage2026";

// LOGIN
function checkCode() {
  const input = document.getElementById("accessCode").value;
  const error = document.getElementById("loginError");

  if (input === INVITE_CODE) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
    generateQR();
    loadGallery();
  } else {
    error.textContent = "Code incorrect ❌";
  }
}

// UPLOAD
async function uploadPhotos() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  if (!files.length) {
    status.textContent = "Choisis des photos";
    return;
  }

  status.textContent = "Upload...";

  for (let file of files) {
    const base64 = await toBase64(file);

    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        image: base64,
        name: file.name
      })
    });
  }

  status.textContent = "Envoyé 💛";
  document.getElementById("fileInput").value = "";

  loadGallery();
  showPopup();
}

// BASE64
function toBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// GALERIE
function loadGallery() {
  fetch(SCRIPT_URL)
    .then(r => r.json())
    .then(data => {
      const grid = document.getElementById("galleryGrid");
      grid.innerHTML = "";

      data.images.forEach(img => {
        const el = document.createElement("img");
        el.src = img;
        grid.appendChild(el);
      });
    });
}

// POPUP
function showPopup() {
  document.getElementById("thankPopup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("thankPopup").classList.add("hidden");
}

// QR CODE
function generateQR() {
  new QRCode(document.getElementById("qrcode"), {
    text: window.location.href,
    width: 160,
    height: 160
  });
}
