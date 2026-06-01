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

  if (!files.length) {
    status.textContent = "Ajoute des photos 📸";
    return;
  }

  status.textContent = "Upload en cours... ⏳";

  for (let file of files) {
    const base64 = await toBase64(file);

    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        image: base64,
        name: file.name,
        code: CODE
      })
    });
  }

  status.textContent = "Envoyé 💛 Merci !";
  document.getElementById("fileInput").value = "";
}

// 📦 BASE64
function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
