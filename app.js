document.addEventListener("DOMContentLoaded", () => {

  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="hero">
        <h1>Barrio Digital Platform</h1>
        <p>Plataforma Escalable para Negocios Locales</p>
        <button id="btnDemo">Ver Demos</button>
    </section>
  `;

  document.getElementById("btnDemo").addEventListener("click", () => {
      alert("Aquí iniciaremos el sistema modular de demos");
  });

});
