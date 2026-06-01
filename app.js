const ENDPOINT =
"COLLE_TON_URL_EXEC";

async function uploadFiles(){

const files =
[
...document
.getElementById("files")
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
`Préparation ${i+1}/${files.length}`;

const base64 =
await compress(
files[i]
);

status.textContent =
`Envoi ${i+1}/${files.length}`;

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

filename:
rename(
files[i].name
),

mimeType:
"image/jpeg",

data:
base64

})

}

);

bar.style.width =
(
(i+1)
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
catch(e){

status.textContent =
"Erreur upload";

console.error(e);

}

}

function compress(
file
){

return new Promise(
(resolve)=>{

const reader =
new FileReader();

reader.onload =
e=>{

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

const max =
1800;

if(
w>h
&&
w>max
){

h=
h
*
max
/
w;

w=max;

}

if(
h>w
&&
h>max
){

w=
w
*
max
/
h;

h=max;

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

resolve(

c
.toDataURL(
"image/jpeg",
0.72
)
.split(",")[1]

);

};

img.src =
e.target.result;

};

reader.readAsDataURL(
file
);

}
);

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
.value="";

document
.getElementById(
"bar"
)
.style.width="0%";

}

function confetti(){

for(
let i=0;
i<80;
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

el.style.animationDelay =
(
Math.random()
*
1.2
)
+
"s";

document
.getElementById(
"confetti"
)
.appendChild(
el
);

setTimeout(
()=>el.remove(),
4000
);

}

}
