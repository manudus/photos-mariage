const SCRIPT_URL = "TON_URL_APPS_SCRIPT";

async function uploadPhotos() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  if (!files.length) {
    status.textContent = "Ajoute des photos 📸";
    return;
  }

  for (let file of files) {
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
  }

  status.textContent = "💛 Photos envoyées !";
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}
