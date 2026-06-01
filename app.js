alert("app.js chargé");

const PASSWORD = "6626";

function login() {

alert("login exécuté");

const pwd =
document
.getElementById("pwd")
.value
.trim();

if (pwd === PASSWORD) {

document
.getElementById(
"loginBox"
)
.classList
.add(
"hidden"
);

document
.getElementById(
"uploadBox"
)
.classList
.remove(
"hidden"
);

} else {

document
.getElementById(
"error"
)
.textContent =
"Mot de passe incorrect";

}

}
```
