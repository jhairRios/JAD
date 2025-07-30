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
                var placeholderUrl = 'https://via.placeholder.com/350x200?text=' + encodeURIComponent(producto.nombre);
                
                var productoHTML = `
                    <div class="col-md-4 col-sm-6">
                        <div class="producto-card">
                            <img src="${imagenUrl}" alt="${producto.nombre}" onerror="this.src='${placeholderUrl}'"> 
                            <div class="producto-codigo">Código: ${producto.codigo || 'N/A'}</div>
                            <div class="producto-titulo">${producto.nombre || 'No se ha actualizado el nombre'}</div>
                            <div class="producto-precio">L. ${producto.precio ? parseFloat(producto.precio).toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}</div>
                            <div class="producto-detalles">
                                ${producto.descripcion || 'Sin descripción disponible'}
                            </div>
                            <a href="#"  style="background-color: var(--color-primario);" class="btn btn-primary btn-block">Ver más detalles</a>  <a href="#" class="btn btn-success btn-block">Agregar a Carrito</a>  
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
