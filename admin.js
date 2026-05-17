let negocios = JSON.parse(localStorage.getItem("negocios")) || [];

function render(){
  const lista = document.getElementById("listaNegocios");
  lista.innerHTML = "";

  negocios.forEach((n, index)=>{
    lista.innerHTML += `
      <div class="negocio-item">
        <h2>${n.nombre}</h2>
        <p>${n.descripcion}</p>
        <p><strong>WhatsApp:</strong> ${n.whatsapp}</p>

        <h4>Productos:</h4>
        <div>
          ${
            n.productos && n.productos.length > 0
            ? n.productos.map(p => `<p>• ${p.nombre} - $${p.precio}</p>`).join("")
            : "<p>Sin productos aún</p>"
          }
        </div>

        <hr style="margin:15px 0;">

        <input type="text" id="prodNombre${index}" placeholder="Nombre del producto">
        <input type="number" id="prodPrecio${index}" placeholder="Precio">
        <input type="text" id="prodImagen${index}" placeholder="URL de imagen del producto">

        <button onclick="agregarProducto(${index})">Agregar Producto</button>
        <button onclick="eliminarNegocio(${index})" style="background:red;margin-left:10px;">Eliminar Negocio</button>
      </div>
    `;
  });
}

function guardarNegocio(){
  const negocio = {
    nombre: document.getElementById("nombre").value,
    slug: document.getElementById("slug").value,
    descripcion: document.getElementById("descripcion").value,
    color: document.getElementById("color").value,
    whatsapp: document.getElementById("whatsapp").value,
    banner: document.getElementById("banner").value,
    productos: []
  };

  if(
    negocio.nombre === "" ||
    negocio.slug === "" ||
    negocio.descripcion === "" ||
    negocio.color === "" ||
    negocio.whatsapp === "" ||
    negocio.banner === ""
  ){
    alert("Completa todos los datos del negocio");
    return;
  }

  negocios.push(negocio);
  guardar();
  limpiarFormulario();
  render();

  alert("Negocio guardado");
}

function agregarProducto(index){
  const nombre = document.getElementById("prodNombre"+index).value;
  const precio = document.getElementById("prodPrecio"+index).value;
  const imagen = document.getElementById("prodImagen"+index).value;

  if(nombre === "" || precio === "" || imagen === ""){
    alert("Completa todos los datos del producto");
    return;
  }

  negocios[index].productos.push({
    nombre: nombre,
    precio: Number(precio),
    imagen: imagen
  });

  guardar();
  render();

  alert("Producto agregado");
}

function eliminarNegocio(index){
  if(confirm("¿Seguro que quieres eliminar este negocio?")){
    negocios.splice(index,1);
    guardar();
    render();
  }
}

function guardar(){
  localStorage.setItem("negocios", JSON.stringify(negocios));
}

function limpiarFormulario(){
  document.getElementById("nombre").value = "";
  document.getElementById("slug").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("color").value = "";
  document.getElementById("whatsapp").value = "";
  document.getElementById("banner").value = "";
}

render();
