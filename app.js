```javascript
const PASSWORD = "6626";

function login() {

alert("clic détecté");

const value =
document
.getElementById("pwd")
.value
.trim();

if (
value === PASSWORD
) {

document
.getElementById(
"loginBox"
)
.style.display =
"none";

document
.getElementById(
"uploadBox"
)
.style.display =
"block";

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
