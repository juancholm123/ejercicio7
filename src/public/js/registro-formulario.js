const registro = document.getElementById("registrar");

registro.addEventListener("click", () => {
  const persona = document.getElementById("persona").value;
  const pais = document.getElementById("pais").value;
  const poblacion = document.getElementById("poblacion").value;
  const geometria = document.getElementById("geometria").value;

  $.ajax({
    url: "/registro",
    type: "POST",
    data: {
      persona,
      pais,
      poblacion,
      geometria,
    },
    success: function (data) {
      console.log("Datos enviados");
    },
    error: function (e) {
      alert("Error " + JSON.stringify(e));
    },
  });
});
