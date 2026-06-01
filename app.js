const ENDPOINT =
"https://script.google.com/macros/s/AKfycbwp4VNEAerqX0I-Fbh5X7s_BkrYWnjABSBltxN113nuIikCl6-6pxVMG_rj70b4z-w/exec";

/* ================= */

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
"Sélectionne des photos";

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
`Optimisation ${
i+1
}/${files.length}`;

const blob =
await compress(
files[i]
);

status.textContent =
`Envoi ${
i+1
}/${files.length}`;

await send(
blob,
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

status.textContent =
"";

showPopup();

}
catch(err){

console.error(
err
);

status.textContent =
"Erreur upload";

}

}

/* ================= */

function compress(
file
){

return new Promise(
resolve=>{

const reader =
new FileReader();

reader.onload =
ev=>{

const img =
new Image();

img.onload =
()=>{

const c =
document
.createElement(
"canvas"
);

let w =
img.width;

let h =
img.height;

const MAX =
1400;

if(
w>MAX
){

h=
h
*
MAX
/
w;

w=
MAX;

}

c.width=w;

c.height=h;

c
.getContext(
"2d"
)
.drawImage(
img,
0,
0,
w,
h
);

c.toBlob(

blob=>
resolve(
blob
),

"image/jpeg",

0.70

);

};

img.src =
ev.target.result;

};

reader.readAsDataURL(
file
);

});

}

/* ================= */

async function send(
blob,
filename
){

const form =
new FormData();

form.append(
"filename",
filename
);

form.append(
"photo",
await blobToBase64(
blob
)
);

const res =
await fetch(
ENDPOINT,
{

method:
"POST",

body:
form

}

);

if(
!res.ok
){

throw new Error();

}

}

function blobToBase64(
blob
){

return new Promise(
resolve=>{

const reader =
new FileReader();

reader.onload =
()=>
resolve(

reader.result
.split(",")[1]

);

reader.readAsDataURL(
blob
);

});

}

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

function confetti(){

const area =
document
.getElementById(
"confetti"
);

for(
let i=0;
i<50;
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
["🎉","✨","🤎"][
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
