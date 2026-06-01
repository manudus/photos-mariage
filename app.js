const SCRIPT_URL = "TON_URL_APPS_SCRIPT";

async function upload() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");

  if (!files.length) {
    status.textContent = "Ajoute des photos 📸";
    return;
  }

  let success = 0;

  for (let file of files) {
    const base64 = await toBase64(file);

    try {
      const res = await fetch(SCRIPT_URL, {
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

      const data = await res.json();

      if (data.success) {
        success++;
      }

    } catch (e) {
      console.log("Erreur upload", e);
    }
  }

  status.textContent = `💛 ${success}/${files.length} photos envoyées`;
  document.getElementById("fileInput").value = "";
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
