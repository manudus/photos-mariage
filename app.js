const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEujXcCRFt80cAILTlB3HNGG0fybvxMiN2siSOB_98NNa81L3gzuJv_vRNWERrxpI/exec";
const INVITE_CODE = "6626";

// =====================
// STATE GLOBAL (CACHE)
// =====================
let images = [];
let currentIndex = 0;

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
// 📤 UPLOAD
// =====================
async function uploadPhotos() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  if (!files.length) return;

  status.textContent = "Upload...";

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

  document.getElementById("fileInput").value = "";
  status.textContent = "Envoyé 💛";

  loadGallery(true); // force refresh
  showPopup();
}

// =====================
// BASE64
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
// 🖼️ GALERIE ULTRA OPTIMISÉE
// =====================
function loadGallery(force = false) {
  if (!force && images.length) {
    renderGallery();
    return;
  }

  fetch(SCRIPT_URL)
    .then(r => r.json())
    .then(data => {
      images = data.images || [];

      preloadImages(images);
      renderGallery();
    });
}

// =====================
// 🧠 PRELOAD (ANTI ÉCRAN NOIR)
// =====================
function preloadImages(list) {
  list.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// =====================
// 🖼️ RENDER GRID
// =====================
function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = "";

  images.forEach((url, i) => {
    const img = document.createElement("img");
    img.src = url;
    img.loading = "lazy";
    img.decoding = "async";

    img.onclick = () => openViewer(i);

    grid.appendChild(img);
  });
}

// =====================
// 🔍 VIEWER (IPHONE STYLE)
// =====================
function openViewer(index) {
  currentIndex = index;

  const viewer = document.getElementById("viewer");
  const img = document.getElementById("viewerImg");

  img.src = images[currentIndex];

  viewer.classList.remove("hidden");
}

function closeViewer() {
  document.getElementById("viewer").classList.add("hidden");
}

// =====================
// ➡️ NAVIGATION
// =====================
function nextImg() {
  if (currentIndex < images.length - 1) {
    currentIndex++;
    updateViewer();
  }
}

function prevImg() {
  if (currentIndex > 0) {
    currentIndex--;
    updateViewer();
  }
}

function updateViewer() {
  const img = document.getElementById("viewerImg");
  img.src = images[currentIndex];
}

// =====================
// 👆 SWIPE MOBILE
// =====================
let startX = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;

  if (document.getElementById("viewer").classList.contains("hidden")) return;

  if (startX - endX > 50) nextImg();
  if (endX - startX > 50) prevImg();
});

// =====================
// 🎉 POPUP
// =====================
function showPopup() {
  document.getElementById("thankPopup").classList.remove("hidden");

  setTimeout(() => {
    closePopup();
  }, 4000);
}

function closePopup() {
  document.getElementById("thankPopup").classList.add("hidden");
}
