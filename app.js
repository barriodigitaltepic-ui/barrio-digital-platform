document.addEventListener("DOMContentLoaded", async () => {

  registrarVisita();

  const app = document.getElementById("app");
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  const negocio = params.get("negocio");

  try {
    const respuesta = await fetch("data/negocios.json");
    const data = await respuesta.json();

    if(negocio){
      const negocioInfo = data.negocios.find(n => n.nombre === negocio);

      if(!negocioInfo){
        app.innerHTML = `<h1 style="text-align:center;padding:100px;">Negocio no encontrado</h1>`;
        return;
      }

      renderNegocio(negocioInfo);

    } else if(categoria){
      const negociosCategoria = data.negocios.filter(n => n.categoria === categoria);
      const categoriaInfo = data.categorias.find(c => c.slug === categoria);

      renderCategoria(categoriaInfo, negociosCategoria);

    } else {
      renderHome(data);
    }

  } catch(error){
    console.error(error);
    app.innerHTML = `<h1 style="text-align:center;padding:100px;">Error cargando plataforma</h1>`;
  }

});

function navbar(){
  return `
    <nav class="navbar">
      <div class="logo">🏙️ Barrio Digital Tepic</div>

      <div class="nav-links">
        <a href="./">Inicio</a>
        <span>|</span>
        <a href="?categoria=esteticas">Estéticas</a>
        <span>|</span>
        <a href="?categoria=ferreterias">Ferreterías</a>
        <span>|</span>
        <a href="?categoria=inmobiliarias">Inmobiliarias</a>
        <span>|</span>
        <a href="./#gps">GPS</a>
        <span>|</span>
        <a href="https://wa.me/523113392436" target="_blank">Publicar Negocio</a>
      </div>
    </nav>
  `;
}

function renderHome(data){
  const app = document.getElementById("app");
  const destacados = data.negocios.filter(n => n.destacado === true);

  let html = `
    ${navbar()}

    <section class="hero">
      <div class="hero-content">
        <h1>Barrio Digital Tepic</h1>
        <p>Negocios, servicios, inmobiliarias y empresas locales en Tepic, Nayarit.</p>

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

          <div>
            <h2>${obtenerVisitas()}</h2>
            <p>Visitas locales</p>
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

        <div class="hero-cta">
          <a href="https://wa.me/523113392436?text=Hola,%20quiero%20anunciar%20mi%20negocio%20en%20Barrio%20Digital" target="_blank">
            <button>🚀 Anuncia tu negocio</button>
          </a>
        </div>

      </div>
    </section>

    <section id="gps" class="gps-section">
      <div class="gps-card-premium">
        <div class="gps-info">
          <h2>📍 Localización Digital Vehicular</h2>
          <p>GPS, rastreo, monitoreo y soluciones digitales para vehículos particulares, negocios y flotillas.</p>

          <a href="https://wa.me/523113392436" target="_blank">
            <button>Solicitar Información</button>
          </a>
        </div>
      </div>
    </section>
  `;

  if(destacados.length > 0){
    html += `
      <section class="section-block">
        <h2 class="titulo-seccion">⭐ Negocios Destacados</h2>

        <div class="grid" id="resultadosBusqueda">
          ${destacados.map(n => cardNegocio(n)).join("")}
        </div>
      </section>
    `;
  } else {
    html += `
      <section class="section-block">
        <div class="grid" id="resultadosBusqueda"></div>
      </section>
    `;
  }

  html += `
    <section class="section-block categorias-premium">
      <h2 class="titulo-seccion">Explora Categorías</h2>

      <div class="categorias-grid">
        ${data.categorias.map(c => `
          <a href="?categoria=${c.slug}" class="categoria-card">
            <div class="categoria-bg" style="background-image:url('${c.imagen}')"></div>
            <div class="categoria-overlay"></div>

            <div class="categoria-content">
              <h3>${c.nombre}</h3>
              <button>Explorar</button>
            </div>
          </a>
        `).join("")}
      </div>
    </section>
  `;
  html += `

<section class="mapa-section">

  <h2 class="titulo-seccion">Mapa de Negocios Afiliados</h2>

  <p class="mapa-subtitulo">
    Explora negocios registrados en Barrio Digital Tepic por ubicación y categoría.
  </p>

  <div class="mapa-filtros">
    <button onclick="filtrarMapa('todos')">Todos</button>
    ${data.categorias.map(c => `
      <button onclick="filtrarMapa('${c.slug}')">${c.nombre}</button>
    `).join("")}
  </div>

  <div id="mapaBarrio"></div>

</section>

`;

  html += `
    <footer style="margin-top:90px;padding:70px 8% 35px;background:rgba(0,0,0,.88);border-top:1px solid rgba(212,175,55,.25);backdrop-filter:blur(18px);">
      <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:50px;align-items:start;">
        <div>
          <h3 style="font-size:28px;margin-bottom:15px;color:white;">🏙️ Barrio Digital Tepic</h3>
          <p style="font-size:15px;line-height:1.7;opacity:.82;">Plataforma digital de negocios, inmobiliarias, GPS, belleza y servicios locales en Tepic, Nayarit.</p>
        </div>

        <div>
          <h4 style="font-size:20px;margin-bottom:18px;color:#D4AF37;">Contacto</h4>
          <p style="font-size:15px;line-height:1.7;opacity:.82;">📱 WhatsApp: 311 339 2436</p>
          <p style="font-size:15px;line-height:1.7;opacity:.82;">📍 Tepic, Nayarit</p>
        </div>

        <div>
          <h4 style="font-size:20px;margin-bottom:18px;color:#D4AF37;">Negocios</h4>
          <a style="display:block;color:white;text-decoration:none;margin-bottom:12px;" href="https://wa.me/523113392436" target="_blank">Publicar mi negocio</a>
          <a style="display:block;color:white;text-decoration:none;margin-bottom:12px;" href="./#gps">GPS Vehicular</a>
        </div>

        <div>
          <h4 style="font-size:20px;margin-bottom:18px;color:#D4AF37;">Síguenos</h4>
          <a style="display:block;color:white;text-decoration:none;margin-bottom:12px;" href="https://www.facebook.com/BARRIODIGITALTEPIC" target="_blank">Facebook</a>
          <a style="display:block;color:white;text-decoration:none;margin-bottom:12px;" href="https://www.instagram.com/barriodigitaltepic/" target="_blank">Instagram</a>
        </div>
      </div>

      <div style="max-width:1200px;margin:45px auto 0;padding-top:25px;border-top:1px solid rgba(255,255,255,.10);text-align:center;font-size:14px;opacity:.65;">
        © 2026 Barrio Digital Tepic — Todos los derechos reservados.
      </div>
    </footer>
  `;

  app.innerHTML = html;
  window.dataGlobal = data;
  setTimeout(() => iniciarMapa(data.negocios), 300);
  
}

function renderCategoria(categoria, negocios){
  const app = document.getElementById("app");

  let html = `
    ${navbar()}

    <section class="hero categoria-hero">
      <div class="hero-content">
        <h1>${categoria ? categoria.nombre : "Categoría"}</h1>
        <p>Negocios registrados en Barrio Digital Tepic</p>

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
        <h2>Próximamente</h2>
        <p>Aún no hay negocios registrados en esta categoría.</p>

        <a href="./">
          <button style="background:#7928ca;">Volver al inicio</button>
        </a>
      </div>
    `;
  } else {
    html += negocios.map(n => cardNegocio(n)).join("");
  }

  html += `</section>`;

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
        <h1>${n.nombre}</h1>
        <p>${n.descripcion}</p>

        <div class="negocio-buttons">
          <a href="${n.sitio}" target="_blank" onclick="registrarClick('sitio','${n.nombre}')">
            <button style="background:${n.color || '#7928ca'};">Sitio Web</button>
          </a>

          <a href="https://wa.me/${n.whatsapp}" target="_blank" onclick="registrarClick('whatsapp','${n.nombre}')">
            <button style="background:#25D366;">WhatsApp</button>
          </a>
        </div>

        ${n.direccion ? `<div class="negocio-direccion">📍 ${n.direccion}</div>` : ""}
      </div>
    </section>

    ${n.galeria ? `
      <section class="galeria-premium">
        <h2>Galería</h2>

        <div class="galeria-grid">
          ${n.galeria.map(img => `<img src="${img}">`).join("")}
        </div>
      </section>
    ` : ""}
  `;
}

function cardNegocio(n){
  return `
    <div class="card negocio-card negocio-card-interno">

      ${n.badge ? `
        <div class="badge badge-${n.badge}">
          ${obtenerTextoBadge(n.badge)}
        </div>
      ` : ""}

      <img src="${n.imagen}">
      <h2>${n.nombre}</h2>
      <p>${n.descripcion}</p>

      ${n.direccion ? `<p><strong>📍 ${n.direccion}</strong></p>` : ""}

      <a href="?negocio=${encodeURIComponent(n.nombre)}">
        <button style="background:${n.color || '#7928ca'};">Visitar Página</button>
      </a>

      <a href="https://wa.me/${n.whatsapp}" target="_blank" onclick="registrarClick('whatsapp','${n.nombre}')">
        <button style="background:#25D366;">WhatsApp</button>
      </a>
    </div>
  `;
}

function buscarNegocios(){
  const input = document.getElementById("buscador");
  const contenedor = document.getElementById("resultadosBusqueda");
  const data = window.dataGlobal;

  if(!input || !contenedor || !data) return;

  const texto = input.value.toLowerCase().trim();

  if(texto === ""){
    const destacados = data.negocios.filter(n => n.destacado === true);
    contenedor.innerHTML = destacados.map(n => cardNegocio(n)).join("");
    return;
  }

  const resultados = data.negocios.filter(n =>
    n.nombre.toLowerCase().includes(texto) ||
    n.descripcion.toLowerCase().includes(texto) ||
    n.categoria.toLowerCase().includes(texto) ||
    (n.direccion && n.direccion.toLowerCase().includes(texto))
  );

  contenedor.innerHTML = resultados.length
    ? resultados.map(n => cardNegocio(n)).join("")
    : `
      <div class="card">
        <h2>Sin resultados</h2>
        <p>No encontramos negocios relacionados con tu búsqueda.</p>
      </div>
    `;

  contenedor.scrollIntoView({
    behavior:"smooth",
    block:"start"
  });
}

function buscarEnCategoria(){
  const texto = document.getElementById("buscadorCategoria").value.toLowerCase();
  const contenedor = document.getElementById("resultadosCategoria");
  const negocios = window.negociosCategoriaActual;

  const resultados = negocios.filter(n =>
    n.nombre.toLowerCase().includes(texto) ||
    n.descripcion.toLowerCase().includes(texto)
  );

  contenedor.innerHTML = resultados.length
    ? resultados.map(n => cardNegocio(n)).join("")
    : `
      <div class="card">
        <h2>Sin resultados</h2>
        <p>No encontramos negocios relacionados.</p>
      </div>
    `;
}

/* ANALYTICS LOCAL */

function registrarVisita(){
  let visitas = Number(localStorage.getItem("visitasBarrioDigital")) || 0;
  visitas++;
  localStorage.setItem("visitasBarrioDigital", visitas);
}

function registrarClick(tipo, negocio){
  const key = `click_${tipo}_${negocio}`;
  let clicks = Number(localStorage.getItem(key)) || 0;
  clicks++;
  localStorage.setItem(key, clicks);
}

function obtenerVisitas(){
  return Number(localStorage.getItem("visitasBarrioDigital")) || 0;
}

function obtenerTextoBadge(tipo){
  switch(tipo){
    case "premium":
      return "💎 PREMIUM";
    case "verificado":
      return "✔️ VERIFICADO";
    case "destacado":
      return "⭐ DESTACADO";
    case "nuevo":
      return "🆕 NUEVO";
    default:
      return "⭐ NEGOCIO";
   }

  }

 let mapaBarrio;
let marcadoresMapa = [];

function iniciarMapa(negocios){
  const mapaDiv = document.getElementById("mapaBarrio");
  if(!mapaDiv) return;

  mapaBarrio = L.map("mapaBarrio").setView([21.5042, -104.8946], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapaBarrio);

  pintarMarcadores(negocios);
}

function pintarMarcadores(negocios){
  marcadoresMapa.forEach(m => mapaBarrio.removeLayer(m));
  marcadoresMapa = [];

  negocios
    .filter(n => n.lat && n.lng)
    .forEach(n => {
      const marker = L.marker([n.lat, n.lng]).addTo(mapaBarrio);

marker.bindTooltip(
  n.nombre,
  {
    permanent:true,
    direction:"right",
    offset:[12,0],
    className:"mapa-tooltip"
  }
);

      marker.bindPopup(`
        <strong>${n.nombre}</strong><br>
        ${n.descripcion}<br><br>
        <a href="?negocio=${encodeURIComponent(n.nombre)}">Ver perfil</a>
      `);

      marcadoresMapa.push(marker);      

    });
}

function filtrarMapa(categoria){
  if(!window.dataGlobal || !mapaBarrio) return;

  const negocios = categoria === "todos"
    ? window.dataGlobal.negocios
    : window.dataGlobal.negocios.filter(n => n.categoria === categoria);

  pintarMarcadores(negocios);
} 
