const ENDPOINT =
"https://script.google.com/macros/s/AKfycbzJoN9yZqKov_zbzCZEzx-cKTJrbJC_DfKINX4RXQiA3R370T6ji2M6BQPLfSuL_Ao/exec";

/* =====================
UPLOAD
===================== */

async function uploadFiles(){

const files =
[
...document
.getElementById(
"files"
)
.files
];

const status =
document
.getElementById(
"status"
);

const bar =
document
.getElementById(
"bar"
);

if(
!files.length
){

status.textContent =
"Sélectionne au moins une photo";

return;

}

try{

for(
let i=0;
i<
files.length;
i++
){

status.textContent =
`Optimisation ${i+1}/${files.length}`;

const compressed =
await compressImage(
files[i]
);

status.textContent =
`Envoi ${i+1}/${files.length}`;

await send(
compressed,
rename(
files[i].name
)
);

bar.style.width =
(
(
i+1
)
/
files.length
*
100
)
+
"%";

}

status.textContent="";

showPopup();

}
catch(err){

console.error(
err
);

status.textContent =
"Erreur pendant l'envoi";

}

}

/* =====================
COMPRESSION RAPIDE MOBILE
===================== */

function compressImage(
file
){

return new Promise(
(resolve)=>{

const reader =
new FileReader();

reader.onload =
ev=>{

const img =
new Image();

img.onload =
()=>{

const canvas =
document
.createElement(
"canvas"
);

let w =
img.width;

let h =
img.height;

/* plus petit → plus rapide */

const MAX =
1280;

if(
w>h
){

if(
w>MAX
){

h=
Math.round(
h
*
MAX
/
w
);

w=
MAX;

}

}
else{

if(
h>MAX
){

w=
Math.round(
w
*
MAX
/
h
);

h=
MAX;

}

}

canvas.width=w;

canvas.height=h;

const ctx =
canvas.getContext(
"2d"
);

/* accélération */

ctx.imageSmoothingEnabled =
true;

ctx.drawImage(
img,
0,
0,
w,
h
);

/* qualité mobile */

const jpeg =
canvas
.toDataURL(
"image/jpeg",
0.60
);

resolve(
jpeg
.split(",")[1]
);

};

img.src =
ev.target.result;

};

reader.readAsDataURL(
file
);

}
);

}

/* =====================
UPLOAD
===================== */

async function send(
data,
filename
){

const res =
await fetch(
ENDPOINT,
{

method:
"POST",

headers:{
"Content-Type":
"text/plain"
},

body:
JSON.stringify({

filename,

mimeType:
"image/jpeg",

data

})

}

);

if(
!res.ok
){

throw new Error(
"Upload refusé"
);

}

}

/* ===================== */

function rename(
name
){

return name
.replace(
/\..+$/,
""
)
+
".jpg";

}

/* ===================== */

function showPopup(){

document
.getElementById(
"popup"
)
.classList
.remove(
"hidden"
);

confetti();

}

function resetUpload(){

document
.getElementById(
"popup"
)
.classList
.add(
"hidden"
);

document
.getElementById(
"files"
)
.value =
"";

document
.getElementById(
"bar"
)
.style.width =
"0%";

}

/* =====================
CONFETTIS
===================== */

function confetti(){

const area =
document
.getElementById(
"confetti"
);

for(
let i=0;
i<40;
i++
){

const el =
document
.createElement(
"div"
);

el.className =
"confetti";

el.innerHTML =
[
"🎉",
"✨",
"🤎"
][
Math.floor(
Math.random()*3
)
];

el.style.left =
Math.random()
*
100
+
"%";

area.appendChild(
el
);

setTimeout(
()=>el.remove(),
3000
);

}

}
