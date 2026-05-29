const PASSWORD = "6626";

const ENDPOINT = "https://script.google.com/macros/s/AKfycbzj5Kmt5dowK6yho5dspAI6Nm7i4ixPXKifD4bY39YkNf4doSxh-AxpSWWnM3mQCiw/exec";

function login() {

 
  const pwd = document.getElementById("pwd").value;

  if (pwd === PASSWORD) {
    alert("mot de passe OK");

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("uploadBox").style.display = "block";

  } else {

    alert("mauvais mot de passe");

    document.getElementById("error").textContent = "Mot de passe incorrect";
  }
}

function uploadFiles() {
  const files = document.getElementById("files").files;
  const status = document.getElementById("status");

  if (!files.length) {
    status.textContent = "Aucun fichier sélectionné";
    return;
  }

  let uploaded = 0;

  for (let file of files) {
    const reader = new FileReader();

    reader.onload = function () {
      sendFile(file.name, file.type, reader.result, () => {
        uploaded++;
        let percent = Math.round((uploaded / files.length) * 100);
        document.getElementById("progressBar").style.width = percent + "%";

        if (uploaded === files.length) {
          setTimeout(() => {
            window.location.href = "thanks.html";
          }, 600);
        }
      });
    };

    reader.readAsDataURL(file);
  }
}

function sendFile(name, type, data, callback) {

  // retire "data:image/jpeg;base64,"
  const base64 = data.split(",")[1];

  fetch("https://script.google.com/macros/s/AKfycbzj5Kmt5dowK6yho5dspAI6Nm7i4ixPXKifD4bY39YkNf4doSxh-AxpSWWnM3mQCiw/exec", {
    method: "POST",
    body: JSON.stringify({
      filename: name,
      mimeType: type,
      data: base64,
      token: "6626"
    })
  })
  .then(res => res.text())
  .then(txt => {
    console.log(txt);
    callback();
  })
  .catch(err => {
    console.error(err);
    document.getElementById("status").textContent = "Erreur upload";
  });

}
