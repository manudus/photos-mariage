const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEujXcCRFt80cAILTlB3HNGG0fybvxMiN2siSOB_98NNa81L3gzuJv_vRNWERrxpI/exec";

const INVITE_CODE = "6626";

// =====================
// 🔐 LOGIN
// =====================
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

// =====================
// 📤 UPLOAD ULTRA SIMPLE
// =====================
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

// =====================
// 🔄 BASE64
// =====================
function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// =====================
// 🖼️ GALERIE ULTRA FIABLE
// =====================
function loadGallery() {
  fetch(SCRIPT_URL)
    .then(r => r.json())
    .then(data => {
      const grid = document.getElementById("galleryGrid");
      grid.innerHTML = "";

      (data.images || []).forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.loading = "lazy";
        grid.appendChild(img);
      });
    });
}

// =====================
// 🎉 POPUP
// =====================
function showPopup() {
  const p = document.getElementById("thankPopup");
  p.classList.remove("hidden");

  setTimeout(() => p.classList.add("hidden"), 4500);
}
