$.ajax({
  url: "http://localhost:4000/registro",
  type: "GET",
  success: function (res) {
   alert("paso")
  },
  error: function () {
    console.error("No es posible completar la operación");
  },
});
