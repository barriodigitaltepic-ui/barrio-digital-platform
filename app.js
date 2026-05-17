document.addEventListener("DOMContentLoaded", async()=>{

const app=document.getElementById("app");

const params=new URLSearchParams(window.location.search);

const slug=params.get("negocio");

try{

const respuesta=await fetch("data/negocios.json");

const data=await respuesta.json();

if(slug){

const negocio=data.negocios.find(n=>n.slug===slug);

if(!negocio){
app.innerHTML="<h1>Negocio no encontrado</h1>";
return;
}

renderNegocio(negocio);

}else{

renderHome(data.negocios);

}

}catch(error){

console.error(error);

app.innerHTML="<h1>Error cargando plataforma</h1>";

}

});

function renderHome(negocios){

const app=document.getElementById("app");

let html=`
<section class="hero">
<div>
<h1>Barrio Digital Platform</h1>
<p>Plataforma Escalable para Negocios Locales</p>
</div>
</section>

<section class="grid">
`;

negocios.forEach(n=>{

html+=`
<div class="card">

<img src="${n.banner}">

<h2>${n.nombre}</h2>

<p>${n.descripcion}</p>

<a href="?negocio=${n.slug}">
<button style="background:${n.color}">
Ver Demo
</button>
</a>

</div>
`;

});

html+=`</section>`;

app.innerHTML=html;

}

function renderNegocio(negocio){

const app=document.getElementById("app");

let html=`
<section class="hero" 
style="
background:
linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,.8)),
url('${negocio.banner}');
background-size:cover;
background-position:center;
">

<div>
<h1>${negocio.nombre}</h1>
<p>${negocio.descripcion}</p>
</div>

</section>

<section class="grid">
`;

negocio.productos.forEach(p=>{

html+=`
<div class="card">

<img src="${p.imagen}">

<h2>${p.nombre}</h2>

<p>$${p.precio}</p>

<button 
style="background:${negocio.color}"
onclick="ordenar('${negocio.whatsapp}','${p.nombre}',${p.precio})">
Pedir
</button>

</div>
`;

});

html+=`</section>`;

app.innerHTML=html;

}

function ordenar(numero,nombre,precio){

const mensaje=
`Hola, quiero ordenar ${nombre} - $${precio}`;

window.open(
`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
"_blank"
);

}
