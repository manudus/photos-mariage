const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEujXcCRFt80cAILTlB3HNGG0fybvxMiN2siSOB_98NNa81L3gzuJv_vRNWERrxpI/exec";

const CODE = "6626";

// 🔐 LOGIN
function checkCode() {
  const input = document.getElementById("code").value;

  if (input === CODE) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
  } else {
    document.getElementById("error").textContent = "Code incorrect ❌";
  }
}

// 📤 UPLOAD
async function uploadPhotos() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  const barContainer = document.getElementById("progressContainer");
  const bar = document.getElementById("progressBar");

  if (!files.length) {
    status.textContent = "Ajoute des photos 📸";
    return;
  }

  barContainer.classList.remove("hidden");
  bar.style.width = "0%";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const base64 = await toBase64(file);

    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        image: base64,
        name: file.name,
        code: CODE
      })
    });

    let progress = Math.round(((i + 1) / files.length) * 100);
    bar.style.width = progress + "%";
  }

  status.textContent = "Envoyé 💛";
  document.getElementById("fileInput").value = "";

  setTimeout(() => {
    barContainer.classList.add("hidden");
    showThanks();
    launchConfetti();
  }, 500);
}

// ➕ NOUVEAU : réouvrir sélecteur
function openFilePicker() {
  document.getElementById("fileInput").click();
}

// 📦 BASE64
function toBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// 💛 MESSAGE
function showThanks() {
  document.getElementById("thanks").classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("thanks").classList.add("hidden");
  }, 5000);
}

// 🎊 CONFETTIS
function launchConfetti() {
  for (let i = 0; i < 80; i++) {
    let c = document.createElement("div");

    c.style.position = "fixed";
    c.style.width = "8px";
    c.style.height = "8px";
    c.style.background = ["#c66b3d","#f7c59f","#fff","#e07a5f"][Math.floor(Math.random()*4)];
    c.style.left = Math.random() * 100 + "vw";
    c.style.top = "-10px";
    c.style.borderRadius = "50%";

    document.body.appendChild(c);

    let fall = setInterval(() => {
      c.style.top = (parseFloat(c.style.top) || 0) + 5 + "px";

      if (parseFloat(c.style.top) > window.innerHeight) {
        c.remove();
        clearInterval(fall);
      }
    }, 20);
  }
}
