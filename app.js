document.addEventListener("DOMContentLoaded", async () => {

  const app = document.getElementById("app");
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  const negocio = params.get("negocio");

  try {

    const respuesta = await fetch("data/negocios.json");
    const data = await respuesta.json(); 

   if(negocio){

  const negocioInfo = data.negocios.find(
    n => n.nombre === negocio
  );

  renderNegocio(negocioInfo);

} else if(categoria){

  const negociosCategoria = data.negocios.filter(
    n => n.categoria === categoria
  );

  const categoriaInfo = data.categorias.find(
    c => c.slug === categoria
  );

  renderCategoria(categoriaInfo, negociosCategoria);

} else {

  renderHome(data);

}

  } catch(error){

    console.error(error);

    app.innerHTML = `
      <h1 style="text-align:center;padding:100px;">
        Error cargando plataforma
      </h1>
    `;

  }

});

function navbar(){

  return `

  <nav class="navbar">

    <div class="logo">
      🏙️ Barrio Digital Tepic
    </div>

    <div class="nav-links">

      <a href="./">Inicio</a>

      <span>|</span>

      <a href="?categoria=esteticas">
        Estéticas
      </a>

      <span>|</span>

      <a href="?categoria=ferreterias">
        Ferreterías
      </a>

      <span>|</span>

      <a href="?categoria=inmobiliarias">
        Inmobiliarias
      </a>

      <span>|</span>

      <a href="./#gps">
        GPS
      </a>

      <span>|</span>

      <a href="https://wa.me/523113392436" target="_blank">
        Publicar Negocio
      </a>

    </div>

  </nav>

  `;

}

function renderHome(data){

  const app = document.getElementById("app");

  const destacados = data.negocios.filter(
    n => n.destacado === true
  );

  let html = `

    ${navbar()}

    <section class="hero">

      <div class="hero-content">

        <h1>
          Barrio Digital Tepic
        </h1>

        <p>
          Tu Directorio Digital de Negocios Locales
        </p>

        <div class="stats-panel">

          <div>
            <h2>${data.negocios.length}</h2>
            <p>Negocios asociados</p>
          </div>

          <div>
            <h2>${data.categorias.length}</h2>
            <p>Categorías activas</p>
          </div>

          <div>
            <h2>${destacados.length}</h2>
            <p>Destacados</p>
          </div>

        </div>

        <div class="buscador-box">

          <input
            type="text"
            id="buscador"
            placeholder="Buscar negocio, categoría o servicio..."
            onkeyup="buscarNegocios()"
          >

        </div>

      </div>

    </section>

    <section id="gps" class="gps-section">

      <div class="gps-card-premium">

        <div class="gps-info">

          <h2>
            📍 Localización Digital Vehicular
          </h2>

          <p>
            GPS, rastreo, monitoreo y soluciones digitales para vehículos particulares, negocios y flotillas.
          </p>

          <a href="https://wa.me/523113392436" target="_blank">

            <button>
              Solicitar Información
            </button>

          </a>

        </div>

      </div>

    </section>

  `;

  if(destacados.length > 0){

    html += `

      <section class="section-block">

        <h2 class="titulo-seccion">
          ⭐ Negocios Destacados
        </h2>

        <div class="grid" id="resultadosBusqueda">

          ${destacados.map(
            n => cardNegocio(n)
          ).join("")}

        </div>

      </section>

    `;

  } else {

    html += `

      <section class="section-block">

        <div class="grid" id="resultadosBusqueda">
        </div>

      </section>

    `;

  }

  html += `

<section class="section-block categorias-premium">

  <h2 class="titulo-seccion">
    Explora Categorías
  </h2>

  <div class="categorias-grid">

    ${data.categorias.map(c => `

      <a href="?categoria=${c.slug}" class="categoria-card">

        <div
          class="categoria-bg"
          style="background-image:url('${c.imagen}')"
        ></div>

        <div class="categoria-overlay"></div>

        <div class="categoria-content">

          <h3>
            ${c.nombre}
          </h3>

          <button>
            Explorar
          </button>

        </div>

      </a>

    `).join("")}

  </div>

</section>

`;

html += `

<footer style="
margin-top:90px;
padding:70px 8% 35px;
background:rgba(0,0,0,.88);
border-top:1px solid rgba(212,175,55,.25);
backdrop-filter:blur(18px);
">

  <div style="
  max-width:1200px;
  margin:0 auto;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
  gap:50px;
  align-items:start;
  ">

    <div>
      <h3 style="font-size:28px;margin-bottom:15px;color:white;">
        🏙️ Barrio Digital Tepic
      </h3>

      <p style="font-size:15px;line-height:1.7;opacity:.82;">
        Directorio digital para negocios, marcas y servicios locales en Tepic.
      </p>
    </div>

    <div>
      <h4 style="font-size:20px;margin-bottom:18px;color:#D4AF37;">
        Contacto
      </h4>

      <p style="font-size:15px;line-height:1.7;opacity:.82;">
        📱 WhatsApp: 311 339 2436
      </p>

      <p style="font-size:15px;line-height:1.7;opacity:.82;">
        📍 Tepic, Nayarit
      </p>
    </div>

    <div>
      <h4 style="font-size:20px;margin-bottom:18px;color:#D4AF37;">
        Negocios
      </h4>

      <a style="display:block;color:white;text-decoration:none;margin-bottom:12px;" href="https://wa.me/523113392436" target="_blank">
        Publicar mi negocio
      </a>

      <a style="display:block;color:white;text-decoration:none;margin-bottom:12px;" href="./#gps">
        GPS Vehicular
      </a>
    </div>

    <div>
      <h4 style="font-size:20px;margin-bottom:18px;color:#D4AF37;">
        Síguenos
      </h4>

     <a style="display:block;color:white;text-decoration:none;margin-bottom:12px;" href="https://www.facebook.com/BARRIODIGITALTEPIC" target="_blank">
  Facebook
</a>

    <a style="display:block;color:white;text-decoration:none;margin-bottom:12px;" href="https://www.instagram.com/barriodigitaltepic/" target="_blank">
  Instagram
</a>
    </div>

  </div>

  <div style="
  max-width:1200px;
  margin:45px auto 0;
  padding-top:25px;
  border-top:1px solid rgba(255,255,255,.10);
  text-align:center;
  font-size:14px;
  opacity:.65;
  ">
    © 2026 Barrio Digital Tepic — Todos los derechos reservados.
  </div>

</footer>

`;

  app.innerHTML = html;

  window.dataGlobal = data;

}

function renderCategoria(categoria, negocios){

  const app = document.getElementById("app");

  let html = `

    ${navbar()}

    <section class="hero categoria-hero">

      <div class="hero-content">

        <h1>
          ${categoria ? categoria.nombre : "Categoría"}
        </h1>

        <p>
          Negocios registrados en Barrio Digital Tepic
        </p>

        <div class="buscador-box">

          <input
            type="text"
            id="buscadorCategoria"
            placeholder="Buscar dentro de esta categoría..."
            onkeyup="buscarEnCategoria()"
          >

        </div>

      </div>

    </section>

    <section class="grid" id="resultadosCategoria">

  `;

  if(negocios.length === 0){

    html += `

      <div class="card">

        <h2>
          Próximamente
        </h2>

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

  } else {

    html += negocios.map(
      n => cardNegocio(n)
    ).join("");

  }

  html += `
    </section>
  `;

  app.innerHTML = html;

  window.negociosCategoriaActual = negocios;

}

function renderNegocio(n){

  const app = document.getElementById("app");

  app.innerHTML = `

    ${navbar()}

    <section class="negocio-hero">

      <img src="${n.imagen}" class="negocio-banner">

      <div class="negocio-overlay"></div>

      <div class="negocio-info">

        <h1>
          ${n.nombre}
        </h1>

        <p>
          ${n.descripcion}
        </p>

        <div class="negocio-buttons">

          <a href="${n.sitio}" target="_blank">

            <button style="background:${n.color || '#7928ca'};">

              Sitio Web

            </button>

          </a>

          <a href="https://wa.me/${n.whatsapp}" target="_blank">

            <button style="background:#25D366;">

              WhatsApp

            </button>

          </a>

        </div>

        ${n.direccion ? `
          <div class="negocio-direccion">
            📍 ${n.direccion}
          </div>
        ` : ""}

      </div>

    </section>

  ${n.galeria ? `
<section class="galeria-premium">

  <h2>Galería</h2>

  <div class="galeria-grid">
    ${n.galeria.map(img => `
      <img src="${img}">
    `).join("")}
  </div>

</section>
` : ""}  

  `;

}

function cardNegocio(n){

  return `

    <div class="card negocio-card negocio-card-interno">

      <img src="${n.imagen}">

      <h2>
        ${n.nombre}
      </h2>

      <p>
        ${n.descripcion}
      </p>

      ${n.direccion ? `
        <p>
          <strong>
            📍 ${n.direccion}
          </strong>
        </p>
      ` : ""}

     <a href="?negocio=${encodeURIComponent(n.nombre)}">

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

}

function buscarNegocios(){

  const texto = document
    .getElementById("buscador")
    .value
    .toLowerCase();

  const contenedor = document.getElementById(
    "resultadosBusqueda"
  );

  const data = window.dataGlobal;

  if(texto.trim() === ""){

    const destacados = data.negocios.filter(
      n => n.destacado === true
    );

    contenedor.innerHTML = destacados.map(
      n => cardNegocio(n)
    ).join("");

    return;

  }

  const resultados = data.negocios.filter(n =>

    n.nombre.toLowerCase().includes(texto) ||

    n.descripcion.toLowerCase().includes(texto) ||

    n.categoria.toLowerCase().includes(texto)

  );

  contenedor.innerHTML = resultados.length

    ? resultados.map(
        n => cardNegocio(n)
      ).join("")

    : `
      <div class="card">

        <h2>
          Sin resultados
        </h2>

        <p>
          No encontramos negocios relacionados.
        </p>

      </div>
    `;

}

function buscarEnCategoria(){

  const texto = document
    .getElementById("buscadorCategoria")
    .value
    .toLowerCase();

  const contenedor = document.getElementById(
    "resultadosCategoria"
  );

  const negocios = window.negociosCategoriaActual;

  const resultados = negocios.filter(n =>

    n.nombre.toLowerCase().includes(texto) ||

    n.descripcion.toLowerCase().includes(texto)

  );

  contenedor.innerHTML = resultados.length

    ? resultados.map(
        n => cardNegocio(n)
      ).join("")

    : `
      <div class="card">

        <h2>
          Sin resultados
        </h2>

        <p>
          No encontramos negocios relacionados.
        </p>

      </div>
    `;

}
