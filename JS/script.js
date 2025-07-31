$(document).ready(function() {
    var todosLosProductos = [];
     var productoaggCarrito = [];

     // Función para actualizar el estado activo de la navbar
    function actualizarNavegacionActiva(elementoActivo) {
        // Remover la clase 'active' de todos los elementos de navegación
        $('.nav.navbar-nav li').removeClass('active');
        
        // Agregar la clase 'active' al elemento seleccionado
        $(elementoActivo).addClass('active');
    }


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
    
    // Mostrar notificación toast en lugar de alert
    mostrarToast(
        `${nombreProducto} ha sido agregado a tu carrito`,
        "¡Producto agregado!",
        "success"
    );

    });

    /* ========================================
       EVENT LISTENER PARA VER DETALLES
       ======================================== */
    // Event listener para ver detalles del producto
    // Se activa cuando se hace clic en el botón "Ver Detalles" de cualquier producto
    $(document).on('click', '.btn-detalles', function(e) {
        e.preventDefault(); // Prevenir comportamiento por defecto del enlace
        
        // Obtener el nombre del producto desde la tarjeta más cercana
        var productoCard = $(this).closest('.producto-card');
        var nombreProducto = productoCard.find('.producto-nombre').text();
        
        // Buscar el producto completo en el array de todos los productos cargados
        // Esto nos permite acceder a toda la información del producto (descripción, código, etc.)
        var productoCompleto = todosLosProductos.find(function(producto) {
            return producto.nombre === nombreProducto;
        });
        
        // Si encontramos el producto, mostrar sus detalles en el modal
        if (productoCompleto) {
            mostrarDetallesProducto(productoCompleto);
        }
    });

    /* ========================================
       FUNCIÓN PARA MOSTRAR DETALLES EN MODAL
       ======================================== */
    // Función para mostrar los detalles del producto en el modal
    // Recibe un objeto producto con toda la información completa
    function mostrarDetallesProducto(producto) {
        // Crear URL de la imagen basada en el nombre del producto
        var nombreImagen = producto.nombre.trim() + '.png';
        var imagenUrl = 'images/' + nombreImagen;
        
        // Llenar los elementos del modal con la información del producto
        $('#detalle-imagen').attr('src', imagenUrl).attr('alt', producto.nombre);
        $('#detalle-nombre').text(producto.nombre);
        $('#detalle-codigo').text('Código: ' + (producto.codigo || 'N/A'));
        $('#detalle-categoria').text(producto.categoria || 'Sin categoría');
        $('#detalle-precio').text(parseInt(producto.precio).toFixed(2) + ' LPS');
        $('#detalle-descripcion').text(producto.descripcion || 'Sin descripción disponible');
        
        // Guardar los datos del producto en el botón para poder agregarlo al carrito
        // Usamos .data() para almacenar el objeto producto completo
        $('.btn-agregar-desde-detalle').data('producto', producto);
        
        // Mostrar el modal de detalles
        $('#modalDetalles').modal('show');
    }

    /* ========================================
       EVENT LISTENER PARA AGREGAR DESDE MODAL
       ======================================== */
    // Event listener para agregar al carrito desde el modal de detalles
    // Este evento es DIFERENTE al del botón de las tarjetas para evitar duplicación
    $(document).on('click', '.btn-agregar-desde-detalle', function(e) {
        e.preventDefault(); // Prevenir comportamiento por defecto
        
        // Recuperar los datos del producto almacenados en el botón
        var producto = $(this).data('producto');
        
        // Verificar que tenemos datos del producto
        if (producto) {
            // Crear objeto producto para el carrito con formato consistente
            var productoCarrito = {
                nombre: producto.nombre,
                precio: parseInt(producto.precio).toFixed(2) + '.00 lps' // Formato consistente con otros productos
            };
            
            // Agregar el producto al array del carrito
            productoaggCarrito.push(productoCarrito);
            

            // Mostrar notificación toast en lugar de alert
            mostrarToast(
                `${producto.nombre} ha sido agregado a tu carrito`,
                "¡Producto agregado!",
                "success"
            );

            // Mostrar confirmación al usuario
            alert('Producto "' + producto.nombre + '" agregado al carrito');

            
            // Cerrar el modal de detalles automáticamente
            $('#modalDetalles').modal('hide');
        }
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

            let subtotal = 
            contenedor.append(`
              <tr>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>
                <td><input type="number" value = "1" style="width: 100%; min="1""> </input></td>
                <td>${producto.precio}</td>
                <td>${producto.precio}</td>
                <td><button class = "btn btn-danger">Eliminar</button></td>
                
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

// ========================================
// FUNCIONES PARA NOTIFICACIONES TOAST
// ========================================

// Función para mostrar notificaciones toast personalizadas
function mostrarToast(mensaje, titulo = "¡Éxito!", tipo = "success") {
  const toastContainer = document.getElementById('toast-container');
  
  // Crear el elemento toast
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${tipo}`;
  
  // Definir iconos según el tipo
  const iconos = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  
  // Contenido del toast
  toast.innerHTML = `
    <button class="toast-close" onclick="cerrarToast(this)">&times;</button>
    <div class="toast-header">
      <i class="toast-icon ${iconos[tipo] || iconos.success}"></i>
      <p class="toast-title">${titulo}</p>
    </div>
    <p class="toast-message">${mensaje}</p>
  `;
  
  // Añadir al contenedor
  toastContainer.appendChild(toast);
  
  // Mostrar con animación
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  // Auto-cerrar después de 4 segundos
  setTimeout(() => {
    cerrarToast(toast.querySelector('.toast-close'));
  }, 4000);
}

// Función para cerrar toast
function cerrarToast(button) {
  const toast = button.closest('.toast-notification');
  toast.classList.add('hide');
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 400);
}
