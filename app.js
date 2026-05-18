document.addEventListener("DOMContentLoaded", async () => {

const app = document.getElementById("app");
const params = new URLSearchParams(window.location.search);
const categoria = params.get("categoria");

try{

const respuesta = await fetch("data/negocios.json");
const data = await respuesta.json();

if(categoria){
const negociosCategoria = data.negocios.filter(n => n.categoria === categoria);
const categoriaInfo = data.categorias.find(c => c.slug === categoria);
renderCategoria(categoriaInfo, negociosCategoria);
}else{
renderHome(data);
}

}catch(error){
console.error(error);
app.innerHTML = `<h1 style="text-align:center;padding:100px;">Error cargando plataforma</h1>`;
}

});

function renderHome(data){

const app = document.getElementById("app");
const destacados = data.negocios.filter(n => n.destacado === true);

let html = `
<section class="hero">
<div>
<h1>Barrio Digital Tepic</h1>
<p>Tu Directorio Digital de Negocios Locales</p>

<div class="buscador-box">
<input type="text" id="buscador" placeholder="Buscar negocio, categoría o servicio..." onkeyup="buscarNegocios()">
</div>

</div>
</section>
`;

if(destacados.length > 0){
html += `
<section style="padding:60px 8% 20px;">
<h2 class="titulo-seccion">⭐ Negocios Destacados</h2>
<div class="grid" id="resultadosBusqueda">
`;

destacados.forEach(n=>{
html += cardNegocio(n);
});

html += `
</div>
</section>
`;
}else{
html += `
<section style="padding:60px 8% 20px;">
<div class="grid" id="resultadosBusqueda"></div>
</section>
`;
}

html += `
<section style="padding:40px 8% 20px;">
<h2 class="titulo-seccion">Categorías</h2>
<div class="grid">
`;

data.categorias.forEach(c=>{
html += `
<div class="card">
<h2>${c.nombre}</h2>
<p>Explora negocios registrados en esta categoría</p>
<a href="?categoria=${c.slug}">
<button style="background:#7928ca;">Ver Categoría</button>
</a>
</div>
`;
});

html += `
</div>
</section>
`;

app.innerHTML = html;
window.dataGlobal = data;
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
<p>Negocios registrados en Barrio Digital Tepic</p>

<div class="buscador-box">
<input type="text" id="buscadorCategoria" placeholder="Buscar dentro de esta categoría..." onkeyup="buscarEnCategoria()">
</div>

</div>
</section>

<section class="grid" id="resultadosCategoria">
`;

if(negocios.length === 0){
html += `
<div class="card">
<h2>Próximamente</h2>
<p>Aún no hay negocios registrados en esta categoría.</p>
<a href="./">
<button style="background:#7928ca;">Volver al inicio</button>
</a>
</div>
`;
}else{
negocios.forEach(n=>{
html += cardNegocio(n);
});
}

html += `</section>`;

app.innerHTML = html;
window.negociosCategoriaActual = negocios;
}

function cardNegocio(n){
return `
<div class="card negocio-card">
<img src="${n.imagen}">
<h2>${n.nombre}</h2>
<p>${n.descripcion}</p>
${n.direccion ? `<p><strong>📍 ${n.direccion}</strong></p>` : ""}

<a href="${n.sitio}" target="_blank">
<button style="background:${n.color || '#7928ca'};">Visitar Página</button>
</a>

<a href="https://wa.me/${n.whatsapp}" target="_blank">
<button style="background:#25D366;">WhatsApp</button>
</a>
</div>
`;
}

function buscarNegocios(){
const texto = document.getElementById("buscador").value.toLowerCase();
const contenedor = document.getElementById("resultadosBusqueda");
const data = window.dataGlobal;

if(texto.trim() === ""){
const destacados = data.negocios.filter(n => n.destacado === true);
contenedor.innerHTML = destacados.map(n => cardNegocio(n)).join("");
return;
}

const resultados = data.negocios.filter(n =>
n.nombre.toLowerCase().includes(texto) ||
n.descripcion.toLowerCase().includes(texto) ||
n.categoria.toLowerCase().includes(texto)
);

if(resultados.length === 0){
contenedor.innerHTML = `
<div class="card">
<h2>Sin resultados</h2>
<p>No encontramos negocios relacionados con tu búsqueda.</p>
</div>
`;
}else{
contenedor.innerHTML = resultados.map(n => cardNegocio(n)).join("");
}
}

function buscarEnCategoria(){
const texto = document.getElementById("buscadorCategoria").value.toLowerCase();
const contenedor = document.getElementById("resultadosCategoria");
const negocios = window.negociosCategoriaActual;

const resultados = negocios.filter(n =>
n.nombre.toLowerCase().includes(texto) ||
n.descripcion.toLowerCase().includes(texto)
);

if(resultados.length === 0){
contenedor.innerHTML = `
<div class="card">
<h2>Sin resultados</h2>
<p>No encontramos negocios relacionados con tu búsqueda.</p>
</div>
`;
}else{
contenedor.innerHTML = resultados.map(n => cardNegocio(n)).join("");
}
}
