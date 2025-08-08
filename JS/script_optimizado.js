$(document).ready(function() {
    // Variables globales
    var todosLosProductos = [];
    var productoaggCarrito = [];

    // Configuración de categorías
    var categorias = {
        'btn-Audifono': { categoria: 'Audifonos', titulo: 'Audifonos' },
        'btn-Pantalla': { categoria: 'Monitores', titulo: 'Pantallas' },
        'btn-Computadoras': { categoria: 'Computadora', titulo: 'Computadoras' },
        'btn-Teclados': { categoria: 'Teclados', titulo: 'Teclados' },
        'btn-Mouse': { categoria: 'Mouse', titulo: 'Mouse' },
        'btn-Router': { categoria: 'Router', titulo: 'Routers' },
        'btn-Almacenamiento': { categoria: 'Almacenamiento', titulo: 'Almacenamiento' },
        'btn-Camaras': { categoria: 'Camara', titulo: 'Cámaras' },
        'btn-Impresoras': { categoria: 'Impresoras', titulo: 'Impresoras' },
        'btn-Telefonos': { categoria: 'Telefonos', titulo: 'Teléfonos' },
        'btn-Camara': { categoria: 'Camara', titulo: 'Cámara' },
        'btn-Proyector': { categoria: 'Proyector', titulo: 'Proyector' },
        'btn-Compenentes': { categoria: 'Componentes Internos', titulo: 'Componentes Internos' },
        'btn-Altavoces': { categoria: 'Altavoces', titulo: 'Altavoces' },
        'btn-Relojes': { categoria: 'Relojes Inteligentes', titulo: 'Relojes Inteligentes' },
        'btn-Consolas': { categoria: 'Consolas', titulo: 'Consolas' },
        'btn-Accesorios': { categoria: 'Accesorios', titulo: 'Accesorios' }
    };

    // Cargar productos desde JSON
    $.getJSON('json/diccionario.json', function(data) {
        if (data && data.productos) {
            todosLosProductos = data.productos;
            filtrarPorVendidos('True');
            $('.productos-seccion h2').text('Mas Vendidos');
        }
    })

    // Función para mostrar productos
    function mostrarProductos(productos) {
        var container = $('#productos-container');
        container.empty();
        
        if (productos.length === 0) {
            container.html('<div class="col-md-12"><p class="text-center">No se encontraron productos.</p></div>');
            return;
        }
        
        $.each(productos, function(index, producto) {
            if (producto.nombre && producto.nombre.trim() !== '') {
                var html = `
                    <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="producto-card">
                            <div class="producto-imagen">
                                <img src="images/${producto.nombre.trim()}.png" alt="${producto.nombre}">
                            </div>
                            <div class="producto-info">
                                <h4 class="producto-nombre">${producto.nombre}</h4>
                                <p class="producto-categoria">${producto.categoria || 'Sin categoría'}</p>
                                <div class="producto-precio">
                                    <span class="precio">${parseInt(producto.precio)}.00 lps</span>
                                </div>
                                <div class="producto-botones">
                                    <a href="#" class="btn btn-detalles">
                                        <i class="fas fa-eye"></i> Ver Detalles
                                    </a>
                                    <a href="#" class="btn btn-carrito">
                                        <i class="fas fa-shopping-cart"></i> Agregar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                container.append(html);
            }
        });
    }

    // Función para filtrar por categoría
    function filtrarPorCategoria(categoria) {
        var filtrados = todosLosProductos.filter(function(producto) {
            return producto.categoria && producto.categoria.toLowerCase() === categoria.toLowerCase();
        });
        mostrarProductos(filtrados);
    }

    // Función para filtrar por más vendidos
    function filtrarPorVendidos(valor) {
        var filtrados = todosLosProductos.filter(function(producto) {
            return producto.masvendidos && producto.masvendidos.toLowerCase() === valor.toLowerCase();
        });
        mostrarProductos(filtrados);
    }

    // Event listener genérico para todas las categorías
    Object.keys(categorias).forEach(function(btnId) {
        $('#' + btnId).click(function(e) {
            e.preventDefault();
            var config = categorias[btnId];
            filtrarPorCategoria(config.categoria);
            $('.productos-seccion h2').text(config.titulo);
        });
    });

    // Agregar productos al carrito
    $(document).on('click', '.btn-carrito', function(e) {
        e.preventDefault();
        var card = $(this).closest('.producto-card');
        var producto = {
            nombre: card.find('.producto-nombre').text(),
            precio: card.find('.precio').text(),
            cantidad: 1
        };
        productoaggCarrito.push(producto);
        alert('Producto "' + producto.nombre + '" agregado al carrito');
    });

    // Ver detalles del producto
    $(document).on('click', '.btn-detalles', function(e) {
        e.preventDefault();
        var nombre = $(this).closest('.producto-card').find('.producto-nombre').text();
        var producto = todosLosProductos.find(function(p) { return p.nombre === nombre; });
        if (producto) mostrarDetalles(producto);
    });

    // Función para mostrar detalles
    function mostrarDetalles(producto) {
        $('#detalle-imagen').attr('src', 'images/' + producto.nombre.trim() + '.png');
        $('#detalle-nombre').text(producto.nombre);
        $('#detalle-categoria').text(producto.categoria || 'Sin categoría');
        $('#detalle-precio').text(parseInt(producto.precio) + ' LPS');
        $('#detalle-descripcion').text(producto.descripcion || 'Sin descripción');
        $('.btn-agregar-desde-detalle').data('producto', producto);
        $('#modalDetalles').modal('show');
    }

    // Agregar desde modal de detalles
    $(document).on('click', '.btn-agregar-desde-detalle', function(e) {
        e.preventDefault();
        var producto = $(this).data('producto');
        if (producto) {
            productoaggCarrito.push({
                nombre: producto.nombre,
                precio: parseInt(producto.precio) + '.00 lps',
                cantidad: 1
            });
            alert('Producto "' + producto.nombre + '" agregado al carrito');
            $('#modalDetalles').modal('hide');
        }
    });

    // Actualizar cantidad en carrito
    $(document).on('change', '#contenidoCarrito input[type="number"]', function() {
        var cantidad = parseInt($(this).val());
        var fila = $(this).closest('tr');
        var nombre = fila.find('td:first').text();
        
        productoaggCarrito.forEach(function(producto) {
            if (producto.nombre === nombre) {
                producto.cantidad = cantidad;
            }
        });
        actualizarFila(fila, nombre, cantidad);
    });

    // Función para actualizar fila del carrito
    function actualizarFila(fila, nombre, cantidad) {
        var producto = productoaggCarrito.find(function(p) { return p.nombre === nombre; });
        if (producto) {
            var precio = parseInt(producto.precio);
            var subtotal = cantidad * precio;
            var total = subtotal * 1.15; // Con ISV del 15%
            fila.find('td:eq(3)').text(subtotal.toFixed(2));
            fila.find('td:eq(4)').text(total.toFixed(2));
        }
    }

    // Mostrar carrito
    $('#btn-carrito').on('click', function(e) {
        e.preventDefault();
        var contenedor = $('#contenidoCarrito');
        contenedor.empty();
        
        if (productoaggCarrito.length === 0) {
            contenedor.append('<tr><td colspan="6" class="text-center">No hay productos en el carrito.</td></tr>');
        } else {
            productoaggCarrito.forEach(function(producto) {
                var precio = parseInt(producto.precio);
                var cantidad = producto.cantidad || 1;
                var subtotal = cantidad * precio;
                var total = subtotal * 1.15;
                
                contenedor.append(`
                    <tr>
                        <td>${producto.nombre}</td>
                        <td>${producto.precio}</td>
                        <td><input type="number" value="${cantidad}" style="width: 100%;" min="1"></td>
                        <td>${subtotal.toFixed(2)}</td>
                        <td>${total.toFixed(2)}</td>
                        <td><button class="btn btn-danger btn-eliminar">Eliminar</button></td>
                    </tr>`);
            });
        }
        $('#modalCarrito').modal('show');
    });

    // Eliminar producto del carrito
    $(document).on('click', '.btn-eliminar', function() {
        var fila = $(this).closest('tr');
        var nombre = fila.find('td:first').text();
        var index = productoaggCarrito.findIndex(function(p) { return p.nombre === nombre; });
        if (index > -1) {
            productoaggCarrito.splice(index, 1);
            fila.remove();
            if (productoaggCarrito.length === 0) {
                $('#contenidoCarrito').append('<tr><td colspan="6" class="text-center">No hay productos en el carrito.</td></tr>');
            }
        }
    });

    // Botones de navegación
    $('#btn-inicio').click(function(e) {
        e.preventDefault();
        filtrarPorVendidos('True');
        $('.productos-seccion h2').text('Mas Vendidos');
    });

    $('#btn-productos').click(function(e) {
        e.preventDefault();
        mostrarProductos(todosLosProductos);
        $('.productos-seccion h2').text('Nuestros Productos');
    });
});
