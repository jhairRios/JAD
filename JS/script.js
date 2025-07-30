$(document).ready(function() {
    // Variable global para almacenar todos los productos
    var todosLosProductos = [];
    
    // Cargar productos desde el JSON
    $.getJSON('json/diccionario.json', function(data) {
        var productosContainer = $('#productos-container');
        
        // Verificar si hay datos
        if (!data || !data.productos) {
            productosContainer.html('<div class="col-md-12"><p class="text-center">No se encontraron productos.</p></div>');
            return;
        }
        
        // Guardar todos los productos en la variable global
        todosLosProductos = data.productos;
        
        // Mostrar todos los productos inicialmente
        mostrarProductos(todosLosProductos);
        
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
                      <i class="fas fa-shopping-cart"></i>
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
        e.preventDefault(); // Evitar que el enlace navegue
        filtrarPorCategoria('Audifonos');
        
        // Opcional: Actualizar el título de la sección
        $('.productos-seccion h2').text('Audifonos');
    });

    // Mostrar Pantallas/Monitores
    $('#btn-Pantalla').click(function(e) {
        e.preventDefault(); // Evitar que el enlace navegue
        filtrarPorCategoria('Monitores');
        
        // Opcional: Actualizar el título de la sección
        $('.productos-seccion h2').text('Pantallas');
    });
    
    // Mostrar Computadoras
    $('#btn-Computadoras').click(function(e) {
        e.preventDefault(); // Evitar que el enlace navegue
        filtrarPorCategoria('Computadora');
        
        // Opcional: Actualizar el título de la sección
        $('.productos-seccion h2').text('Computadoras');
    });

    // Mostrar Mas Vendidos
    $('#btn-inicio').click(function(e) {
        e.preventDefault(); // Evitar que el enlace navegue
        filtrarPorVendidos('True');
        
        // Opcional: Actualizar el título de la sección
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
