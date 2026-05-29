const PASSWORD = "6626";

const ENDPOINT = "https://script.google.com/macros/s/AKfycbzj5Kmt5dowK6yho5dspAI6Nm7i4ixPXKifD4bY39YkNf4doSxh-AxpSWWnM3mQCiw/exec";

function login() {
  const pwd = document.getElementById("pwd").value;

  if (pwd === PASSWORD) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("uploadBox").style.display = "block";
  } else {
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
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "https://script.google.com/macros/s/AKfycbzj5Kmt5dowK6yho5dspAI6Nm7i4ixPXKifD4bY39YkNf4doSxh-AxpSWWnM3mQCiw/exec");

  xhr.onload = function () {
    callback();
  };

  xhr.send(JSON.stringify({
    name: name,
    type: type,
    data: data,
    token: "6626"
  }));
}
