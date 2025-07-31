$(document).ready(function() {
    var todosLosProductos = [];
     var productoaggCarrito = [];

    $.getJSON('json/diccionario.json', function(data) {
        var productosContainer = $('#productos-container');
        
        if (!data || !data.productos) {
            productosContainer.html('<div class="col-md-12"><p class="text-center">No se encontraron productos.</p></div>');
            return;
        }

        todosLosProductos = data.productos;
        // Mostrar productos más vendidos al cargar la página
        filtrarPorVendidos('True');
        // Actualizar el título de la sección
        $('.productos-seccion h2').text('Mas Vendidos');
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error al cargar productos:', textStatus, errorThrown);
        $('#productos-container').html('<div class="col-md-12"><p class="text-center text-danger">Error al cargar los productos. Por favor, intente de nuevo más tarde.</p></div>');
    });
    
    // Función para mostrar productos
    function mostrarProductos(productos) {
        var productosContainer = $('#productos-container');
        productosContainer.empty(); // Limpiar el contenedor
        
        if (productos.length === 0) {
            productosContainer.html('<div class="col-md-12"><p class="text-center">No se encontraron productos en esta categoría.</p></div>');
            return;
        }
        
        // Iterar sobre cada producto
        $.each(productos, function(index, producto) {
            
            // Solo mostrar productos que tengan nombre y no estén vacíos
            if (producto.nombre && producto.nombre.trim() !== '') {
                // Crear nombre de archivo limpio para la imagen
                var nombreImagen = producto.nombre.trim() + '.png';
                var imagenUrl = 'images/' + nombreImagen;
                
                var productoHTML = `
            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="producto-card">
                <!-- Contenedor de la imagen del producto -->
                <div class="producto-imagen">
                  <img src = "${imagenUrl}" alt="${producto.nombre}">
                </div>
                <!-- Información del producto -->
                <div class="producto-info">
                  <h4 class="producto-nombre">${producto.nombre}</h4>
                  <p class="producto-categoria">${producto.categoria || 'Sin categoría'}</p>
                  <div class="producto-precio">
                    <span class="precio">${parseInt(producto.precio)}.00 lps</span>
                  </div>
                  <!-- Botones de acción -->
                  <div class="producto-botones">
                    <a href="#" class="btn btn-detalles">
                      <i class="fas fa-eye"></i>
                      Ver Detalles
                    </a>
                    <a href="#" class="btn btn-carrito">
                      <i class="fas fa-shopping-cart" ></i>
                      Agregar
                    </a>
                  </div>
                </div>
              </div>
            </div>
                `;
                productosContainer.append(productoHTML);
            }
        });
    }
    
// Event listener para agregar productos al carrito (usando delegación de eventos)
$(document).on('click', '.btn-carrito', function(e) {
    e.preventDefault();
    
    //Aqui es donde estamos seleccionando los productos
    var productoCard = $(this).closest('.producto-card');
    var nombreProducto = productoCard.find('.producto-nombre').text();
    var precioProducto = productoCard.find('.precio').text();
    
    // creamos el arreglo del producto
    var producto = {
        nombre: nombreProducto,
        precio: precioProducto,    
    };
    
    //Push del producto
    productoaggCarrito.push(producto);
    alert('Producto "' + nombreProducto + '" agregado al carrito');

    });

    // Escuchar clic en el botón del carrito
    $('#btn-carrito').on('click', function(e) {
        e.preventDefault();
      
        const contenedor = $('#contenidoCarrito');
        contenedor.empty();
      
        if (!Array.isArray(productoaggCarrito) || productoaggCarrito.length === 0) {
          contenedor.append(`
            <tr>
              <td colspan="4" class="text-center">No hay productos disponibles.</td>
            </tr>
          `);
        } else {
          productoaggCarrito.forEach(function(producto) {
            contenedor.append(`
              <tr>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>
                <td><input type="number" value = "1"> </input></td>
                
              </tr>
            `);
          });
        }
      
        $('#modalCarrito').modal('show');
      });

    //---------------FUNCIONES PARA MOSTRAR CATEGORIAS--------------*/
    function filtrarPorCategoria(categoria) {
        var productosFiltrados = todosLosProductos.filter(function(producto) {
            return producto.categoria && producto.categoria.toLowerCase() === categoria.toLowerCase();
        });
        mostrarProductos(productosFiltrados);
    }
    function filtrarPorVendidos(masvendidos) {
        var productosFiltrados = todosLosProductos.filter(function(producto) {
            return producto.masvendidos && producto.masvendidos.toLowerCase() === masvendidos.toLowerCase();
        });
        mostrarProductos(productosFiltrados);
    }
    
/*-----------------------AREA DE MOSTRAR CATEGORIASSS---------------*/
    // Mostrar Audifonoss
    $('#btn-Audifono').click(function(e) {
        filtrarPorCategoria('Audifonos');
        $('.productos-seccion h2').text('Audifonos');
    });

    // Mostrar Pantallas/Monitores
    $('#btn-Pantalla').click(function(e) {
        filtrarPorCategoria('Monitores');
        $('.productos-seccion h2').text('Pantallas');
    });
    
    // Mostrar Computadoras
    $('#btn-Computadoras').click(function(e) {
        filtrarPorCategoria('Computadora');
        $('.productos-seccion h2').text('Computadoras');
    });

    // Mostrar Teclados
    $('#btn-Teclados').click(function(e) {
        filtrarPorCategoria('Teclados');
        $('.productos-seccion h2').text('Teclados');
    });

    // Mostrar Mouse
    $('#btn-Mouse').click(function(e) {
        filtrarPorCategoria('Mouse');
        $('.productos-seccion h2').text('Mouse');
    });

    // Mostrar Router
    $('#btn-Router').click(function(e) {
        filtrarPorCategoria('Router');
        $('.productos-seccion h2').text('Routers');
    });

    // Mostrar Almacenamiento
    $('#btn-Almacenamiento').click(function(e) {
        filtrarPorCategoria('Almacenamiento');
        $('.productos-seccion h2').text('Almacenamientos');
    });

    // Mostrar Camara
    $('#btn-Camaras').click(function(e) {
        filtrarPorCategoria('Almacenamiento'); 
        $('.productos-seccion h2').text('Almacenamientos');
    });

    // Mostrar Impresoras
    $('#btn-Impresoras').click(function(e) {
        filtrarPorCategoria('Impresoras');
        $('.productos-seccion h2').text('Impresoras');
    });

    // Mostrar Telefonos
    $('#btn-Telefonos').click(function(e) {
        filtrarPorCategoria('Telefonos');
        $('.productos-seccion h2').text('Telefonos');
    });

    // Mostrar Camara
    $('#btn-Camara').click(function(e) {
        filtrarPorCategoria('Camara');
        $('.productos-seccion h2').text('Camara');
    });

    // Mostrar Proyector
    $('#btn-Proyector').click(function(e) {
        filtrarPorCategoria('Proyector');
        $('.productos-seccion h2').text('Proyector');
    });

    // Mostrar Compenentes Internos
    $('#btn-Compenentes').click(function(e) {
        filtrarPorCategoria('Componentes Internos');
        $('.productos-seccion h2').text('Compenente');
    });

    // Mostrar Altavoces
    $('#btn-Altavoces').click(function(e) {
        filtrarPorCategoria('Altavoces');
        $('.productos-seccion h2').text('Altavoces');
    });

    // Mostrar Relojes Inteligentes
    $('#btn-Relojes').click(function(e){
        filtrarPorCategoria('Relojes Inteligentes');
        $('.productos-seccion h2').text('Relojes Inteligentes');
    });

    // Mostrar Consolas
    $('#btn-Consolas').click(function(e) {
        filtrarPorCategoria('Consolas');
        $('.productos-seccion h2').text('Consolas');
    });

    // Mostrar Accesorios
    $('#btn-Accesorios').click(function(e) {
        filtrarPorCategoria('Accesorios');
        $('.productos-seccion h2').text('Accesorios');
    });


    // Mostrar Mas Vendidos
    $('#btn-inicio').click(function(e) {
        filtrarPorVendidos('True');
        $('.productos-seccion h2').text('Mas Vendidos');
    });







    // Función para mostrar todos los productos (botón "Todos")
    function mostrarTodosLosProductos() {
        mostrarProductos(todosLosProductos);
        $('.productos-seccion h2').text('Nuestros Productos');
    }
    
    
    // Event listener para el botón de Productos (mostrar todos)
    $('#btn-productos').click(function(e) {
        e.preventDefault();
        mostrarTodosLosProductos();
    });
    
});
