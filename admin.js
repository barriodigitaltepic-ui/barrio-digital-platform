let negocios=JSON.parse(localStorage.getItem("negocios")) || [];

function render(){

const lista=document.getElementById("listaNegocios");

lista.innerHTML="";

negocios.forEach(n=>{

lista.innerHTML+=`
<div class="negocio-item">

<h2>${n.nombre}</h2>

<p>${n.descripcion}</p>

<p>${n.whatsapp}</p>

</div>
`;

});

}

function guardarNegocio(){

const negocio={

nombre:document.getElementById("nombre").value,

slug:document.getElementById("slug").value,

descripcion:document.getElementById("descripcion").value,

color:document.getElementById("color").value,

whatsapp:document.getElementById("whatsapp").value,

banner:document.getElementById("banner").value,

productos:[]

};

negocios.push(negocio);

localStorage.setItem(
"negocios",
JSON.stringify(negocios)
);

render();

alert("Negocio guardado");

}

render();
