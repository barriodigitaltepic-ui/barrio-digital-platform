document.addEventListener("DOMContentLoaded", async () => {

const app = document.getElementById("app");

const params = new URLSearchParams(window.location.search);

const categoria = params.get("categoria");

try{

const respuesta = await fetch("data/negocios.json");

const data = await respuesta.json();

if(categoria){

const negociosCategoria = data.negocios.filter(
n => n.categoria === categoria
);

const categoriaInfo = data.categorias.find(
c => c.slug === categoria
);

renderCategoria(categoriaInfo, negociosCategoria);

}else{

renderHome(data);

}

}catch(error){

console.error(error);

app.innerHTML = `
<h1 style="text-align:center;padding:100px;">
Error cargando plataforma
</h1>
`;

}

});

function renderHome(data){

const app = document.getElementById("app");

let html = `

<section class="hero"
style="
background:
linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.60)),
url('https://images.unsplash.com/photo-1519501025264-65ba15a82390');

background-size:cover;
background-position:center;
">

<div>

<h1>Barrio Digital Tepic</h1>

<p>
Tu Directorio Digital de Negocios Locales
</p>

</div>

</section>

<section class="grid">
`;

data.categorias.forEach(c=>{

html += `

<div class="card">

<h2>${c.nombre}</h2>

<p>
Explora negocios registrados en esta categoría
</p>

<a href="?categoria=${c.slug}">

<button style="background:#7928ca;">
Ver Categoría
</button>

</a>

</div>
`;

});

html += `</section>`;

app.innerHTML = html;

}

function renderCategoria(categoria, negocios){

const app = document.getElementById("app");

let html = `

<section class="hero"
style="
background:
linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.65)),
url('https://images.unsplash.com/photo-1497366754035-f200968a6e72');

background-size:cover;
background-position:center;
">

<div>

<h1>${categoria ? categoria.nombre : "Categoría"}</h1>

<p>
Negocios registrados en Barrio Digital Tepic
</p>

</div>

</section>

<section class="grid">
`;

if(negocios.length===0){

html += `

<div class="card">

<h2>Próximamente</h2>

<p>
Aún no hay negocios registrados en esta categoría.
</p>

<a href="./">

<button style="background:#7928ca;">
Volver al inicio
</button>

</a>

</div>
`;

}else{

negocios.forEach(n=>{

html += `

<div class="card">

<img src="${n.imagen}">

<h2>${n.nombre}</h2>

<p>${n.descripcion}</p>

${n.direccion ? `
<p>
<strong>📍 ${n.direccion}</strong>
</p>
` : ""}

<a href="${n.sitio}" target="_blank">

<button style="background:${n.color || '#7928ca'};">
Visitar Página
</button>

</a>

<a href="https://wa.me/${n.whatsapp}" target="_blank">

<button style="background:#25D366;">
WhatsApp
</button>

</a>

</div>
`;

});

}

html += `
</section>
`;

app.innerHTML = html;

}
