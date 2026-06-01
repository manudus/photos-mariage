const SCRIPT_URL = "https://script.google.com/macros/s/TON_SCRIPT_ID/exec";

async function uploadPhotos() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  const bar = document.getElementById("progressBar");
  const container = document.getElementById("progressContainer");

  if (!files.length) {
    status.textContent = "Ajoute des photos 📸";
    return;
  }

  container.classList.remove("hidden");
  bar.style.width = "0%";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const base64 = await toBase64(file);

    await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: base64,
        name: file.name,
        code: "6626"
      })
    });

    bar.style.width = Math.round(((i + 1) / files.length) * 100) + "%";
  }

  status.textContent = "💛 Photos envoyées !";

  setTimeout(() => {
    container.classList.add("hidden");
    document.getElementById("fileInput").value = "";
  }, 1000);
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
