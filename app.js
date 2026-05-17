document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("negocio");

  try {
    const respuesta = await fetch("data/negocios.json");
    const data = await respuesta.json();

    if (slug) {
      const negocio = data.negocios.find(n => n.slug === slug);

      if (!negocio) {
        app.innerHTML = "<h1>Negocio no encontrado</h1>";
        return;
      }

      window.negocioActual = negocio;
      window.carrito = JSON.parse(localStorage.getItem("carrito_" + negocio.slug)) || [];

      renderNegocio(negocio);
      actualizarCarrito();

    } else {
      renderHome(data.negocios);
    }

  } catch (error) {
    console.error(error);
    app.innerHTML = "<h1>Error cargando plataforma</h1>";
  }
});

function renderHome(negocios) {
  const app = document.getElementById("app");

  let html = `
 <section class="hero"
style="
background:
linear-gradient(rgba(0,0,0,.75),rgba(0,0,0,.88)),
url('https://images.unsplash.com/photo-1519501025264-65ba15a82390');

background-size:cover;
background-position:center;
">
      <div>
        <h1>Barrio Digital Platform</h1>
        <p>Plataforma Escalable para Negocios Locales</p>
      </div>
    </section>

    <section class="grid">
  `;

  negocios.forEach(n => {
    html += `
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

  html += `</section>`;
  app.innerHTML = html;
}

function renderNegocio(negocio) {
  const app = document.getElementById("app");

  let html = `
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

  negocio.productos.forEach((p, index) => {
    html += `
      <div class="card">
        <img src="${p.imagen}">
        <h2>${p.nombre}</h2>
        <p>$${p.precio}</p>

        <input 
          type="number" 
          min="1" 
          value="1" 
          id="cantidad_${index}" 
          style="width:70px;padding:8px;border-radius:8px;border:none;margin-top:10px;"
        >

        <button 
          style="background:${negocio.color}"
          onclick="agregarCarrito(${index})">
          Agregar
        </button>
      </div>
    `;
  });

  html += `
    </section>

    <div class="carrito" id="carrito">
      <h2>Resumen de Pedido</h2>
      <div id="listaCarrito"></div>
      <h3>Total: $<span id="totalCarrito">0</span></h3>

      <button onclick="enviarWhatsApp()" style="background:${negocio.color}">
        Enviar por WhatsApp
      </button>

      <button onclick="generarTicket()" style="background:#444;color:white;">
        Generar Ticket
      </button>

      <button onclick="vaciarCarrito()" style="background:#222;color:white;">
        Vaciar Carrito
      </button>
    </div>

    <div class="boton-carrito" onclick="toggleCarrito()">
      🛒
    </div>
  `;

  app.innerHTML = html;
}

function agregarCarrito(index) {
  const negocio = window.negocioActual;
  const producto = negocio.productos[index];
  const cantidad = parseInt(document.getElementById("cantidad_" + index).value);

  const existe = window.carrito.find(p => p.nombre === producto.nombre);

  if (existe) {
    existe.cantidad += cantidad;
  } else {
    window.carrito.push({
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad
    });
  }

  guardarCarrito();
  actualizarCarrito();
  document.getElementById("carrito").classList.add("activo");
}

function actualizarCarrito() {
  if (!window.negocioActual) return;

  const lista = document.getElementById("listaCarrito");
  const totalSpan = document.getElementById("totalCarrito");

  if (!lista || !totalSpan) return;

  let total = 0;
  let html = "";

  window.carrito.forEach((p, index) => {
    total += p.precio * p.cantidad;

    html += `
      <div class="item-carrito">
        <span>${p.nombre} x${p.cantidad}</span>
        <button onclick="eliminarProducto(${index})">X</button>
      </div>
    `;
  });

  lista.innerHTML = html || "<p>No hay productos seleccionados.</p>";
  totalSpan.innerText = total;
}

function eliminarProducto(index) {
  window.carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
}

function vaciarCarrito() {
  window.carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem(
    "carrito_" + window.negocioActual.slug,
    JSON.stringify(window.carrito)
  );
}

function toggleCarrito() {
  document.getElementById("carrito").classList.toggle("activo");
}

function enviarWhatsApp() {
  const negocio = window.negocioActual;

  if (window.carrito.length === 0) {
    alert("Agrega productos primero");
    return;
  }

  let total = 0;
  let mensaje = `Pedido para ${negocio.nombre}\n\n`;

  window.carrito.forEach(p => {
    mensaje += `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}\n`;
    total += p.precio * p.cantidad;
  });

  mensaje += `\nTotal: $${total}`;

  window.open(
    `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje)}`,
    "_blank"
  );
}

function generarTicket() {
  if (window.carrito.length === 0) {
    alert("No hay productos en el carrito");
    return;
  }

  let total = 0;
  let contenido = `
    <h2>${window.negocioActual.nombre}</h2>
    <h3>Ticket de Pedido</h3>
    <hr>
  `;

  window.carrito.forEach(p => {
    contenido += `<p>${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}</p>`;
    total += p.precio * p.cantidad;
  });

  contenido += `<hr><h3>Total: $${total}</h3>`;

  const ventana = window.open("", "_blank");
  ventana.document.write(contenido);
  ventana.print();
}
