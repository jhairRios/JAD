$(document).ready(function() {
    // Cargar productos desde el JSON
    
    $.getJSON('json/diccionario.json', function(data) {
        var productosContainer = $('#productos-container');
        
        // Verificar si hay datos
        if (!data || !data.productos) {
            productosContainer.html('<div class="col-md-12"><p class="text-center">No se encontraron productos.</p></div>');
            return;
        }
        
        // mostrar imagen poner encima de producto codigo
        // Iterar sobre cada producto
        $.each(data.productos, function(index, producto) {
            
            // Solo mostrar productos que tengan nombre y no estén vacíos
            if (producto.nombre && producto.nombre.trim() !== '') {
                // Crear nombre de archivo limpio para la imagen
                var nombreImagen = producto.nombre.trim() + '.png';
                var imagenUrl = 'images/' + nombreImagen;
                
               encodeURIComponent(producto.nombre);
                
                var productoHTML = `
            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="producto-card">
                <!-- Contenedor de la imagen del producto -->
                <div class="producto-imagen">
                  <img src = "${imagenUrl}" alt="${producto.nombre}">
                </div>
                <!-- Información del producto -->
                <div class="producto-info">
                  <h4 <" class="producto-nombre">${producto.nombre}</h4>
                  <p class="producto-categoria">${producto.categoria}</p>
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
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error al cargar productos:', textStatus, errorThrown);
        $('#productos-container').html('<div class="col-md-12"><p class="text-center text-danger">Error al cargar los productos. Por favor, intente de nuevo más tarde.</p></div>');
    });
});
