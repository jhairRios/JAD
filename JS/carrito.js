$document.ready(function () {
  var productoaggCarrito = [];

  function AgregarCarrito(productoaggCarrito) {
    $("#Carrito").click(function (e) {
      productoaggCarrito = productos.nombre;
    });
  }

  console.log(productoaggCarrito);
});
