document.addEventListener("DOMContentLoaded", async () => {

const app=document.getElementById("app");

try{

const respuesta=await fetch("data/negocios.json");
const data=await respuesta.json();

let html=`
<section class="hero">
<div>
<h1>Barrio Digital Platform</h1>
<p>Plataforma Escalable para Negocios Locales</p>
</div>
</section>

<section class="grid">
`;

data.negocios.forEach(n=>{

html+=`
<div class="card">

<img src="${n.imagen}">

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

}catch(error){

app.innerHTML="<h1>Error cargando plataforma</h1>";

console.error(error);

}

});
