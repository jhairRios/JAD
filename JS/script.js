/* ========================================
   TIENDA JAD - SCRIPT PRINCIPAL
   ========================================
   Archivo: script.js
   Descripción: Script principal para manejo de productos, carrito y navegación
   Funcionalidades:
   - Carga dinámica de productos desde JSON
   - Gestión del carrito de compras
   - Filtrado por categorías
   - Sistema de notificaciones toast
   - Modales de detalles de productos
   ======================================== */

$(document).ready(function () {
  
  /* ========================================
     VARIABLES GLOBALES
     ======================================== */
  var todosLosProductos = [];    // Array que contiene todos los productos cargados desde JSON
  var productoaggCarrito = [];   // Array que contiene los productos agregados al carrito
  var imagenPersonalizadaUrl = null; // URL de la imagen personalizada cargada

  /* ========================================
     FUNCIONES DE CONTROL DE ETIQUETAS
     ======================================== */
  
  /**
   * Función para cambiar el estado de "más vendido" de un producto
   * @param {string} codigo - Código del producto
   * @param {boolean} estado - true para activar, false para desactivar
   */
  window.cambiarMasVendido = function(codigo, estado) {
    var producto = todosLosProductos.find(p => p.codigo === codigo);
    if (producto) {
      producto.masvendidos = estado ? "True" : "False";
      mostrarProductos(todosLosProductos);
      console.log(`✅ Producto ${codigo} - Más vendido: ${estado}`);
    } else {
      console.log(`❌ Producto ${codigo} no encontrado`);
    }
  };

  /**
   * Función para cambiar el estado de "oferta" de un producto
   * @param {string} codigo - Código del producto
   * @param {boolean} estado - true para activar, false para desactivar
   */
  window.cambiarOferta = function(codigo, estado) {
    var producto = todosLosProductos.find(p => p.codigo === codigo);
    if (producto) {
      producto.oferta = estado ? "True" : "False";
      mostrarProductos(todosLosProductos);
      console.log(`✅ Producto ${codigo} - Oferta: ${estado}`);
    } else {
      console.log(`❌ Producto ${codigo} no encontrado`);
    }
  };

  /**
   * Función para cambiar ambos estados de un producto
   * @param {string} codigo - Código del producto
   * @param {boolean} masVendido - Estado de más vendido
   * @param {boolean} oferta - Estado de oferta
   */
  window.cambiarEtiquetas = function(codigo, masVendido, oferta) {
    var producto = todosLosProductos.find(p => p.codigo === codigo);
    if (producto) {
      producto.masvendidos = masVendido ? "True" : "False";
      producto.oferta = oferta ? "True" : "False";
      mostrarProductos(todosLosProductos);
      console.log(`✅ Producto ${codigo} - Más vendido: ${masVendido}, Oferta: ${oferta}`);
    } else {
      console.log(`❌ Producto ${codigo} no encontrado`);
    }
  };

  /**
   * Función para activar múltiples productos como más vendidos
   * @param {Array} codigos - Array de códigos de productos
   */
  window.activarMasVendidos = function(codigos) {
    codigos.forEach(codigo => {
      cambiarMasVendido(codigo, true);
    });
    console.log(`✅ Activados ${codigos.length} productos como más vendidos`);
  };

  /**
   * Función para activar múltiples productos en oferta
   * @param {Array} codigos - Array de códigos de productos
   */
  window.activarOfertas = function(codigos) {
    codigos.forEach(codigo => {
      cambiarOferta(codigo, true);
    });
    console.log(`✅ Activados ${codigos.length} productos en oferta`);
  };

  /**
   * Función para mostrar todos los productos y sus códigos
   */
  window.listarProductos = function() {
    console.log("📋 Lista de todos los productos:");
    todosLosProductos.forEach(producto => {
      var etiquetas = [];
      if (producto.masvendidos === "True") etiquetas.push("MÁS VENDIDO");
      if (producto.oferta === "True") etiquetas.push("OFERTA");
      var estado = etiquetas.length > 0 ? ` [${etiquetas.join(", ")}]` : "";
      console.log(`   ${producto.codigo}: ${producto.nombre}${estado}`);
    });
  };

  /**
   * Función para resetear todas las etiquetas
   */
  window.resetearEtiquetas = function() {
    todosLosProductos.forEach(producto => {
      producto.masvendidos = "False";
      producto.oferta = "False";
    });
    mostrarProductos(todosLosProductos);
    console.log("🔄 Todas las etiquetas han sido reseteadas");
  };

  /**
   * Función para aplicar configuración de etiquetas desde archivo de configuración
   */
  window.aplicarConfiguracionEtiquetas = function() {
    $.getJSON("json/configuracion_etiquetas.json")
      .done(function(config) {
        // Resetear todas las etiquetas primero
        resetearEtiquetas();
        
        // Aplicar productos más vendidos
        if (config.configuracion_etiquetas.productos_mas_vendidos) {
          config.configuracion_etiquetas.productos_mas_vendidos.forEach(codigo => {
            cambiarMasVendido(codigo, true);
          });
        }
        
        // Aplicar productos en oferta
        if (config.configuracion_etiquetas.productos_en_oferta) {
          config.configuracion_etiquetas.productos_en_oferta.forEach(codigo => {
            cambiarOferta(codigo, true);
          });
        }
        
        console.log("✅ Configuración de etiquetas aplicada exitosamente");
        console.log("📋 Para ver la lista de productos, usa: listarProductos()");
      })
      .fail(function() {
        console.log("❌ Error al cargar configuración de etiquetas");
      });
  };

  /**
   * Función de ayuda para mostrar todas las funciones disponibles
   */
  window.ayuda = function() {
    console.log("🔧 FUNCIONES DISPONIBLES PARA GESTIÓN DE ETIQUETAS:");
    console.log("════════════════════════════════════════════════");
    console.log("📋 listarProductos() - Mostrar todos los productos con sus etiquetas");
    console.log("🔍 buscarProducto('nombre') - Buscar producto por nombre");
    console.log("⭐ cambiarMasVendido('codigo', true/false) - Cambiar etiqueta 'Más Vendido'");
    console.log("🏷️ cambiarOferta('codigo', true/false) - Cambiar etiqueta 'Oferta'");
    console.log("🔄 resetearEtiquetas() - Quitar todas las etiquetas");
    console.log("⚙️ aplicarConfiguracionEtiquetas() - Aplicar configuración desde archivo JSON");
    console.log("❓ ayuda() - Mostrar esta ayuda");
    console.log("════════════════════════════════════════════════");
    console.log("📝 EJEMPLOS DE USO:");
    console.log("cambiarMasVendido('P001', true);");
    console.log("cambiarOferta('P002', false);");
    console.log("buscarProducto('iPhone');");
  };

  /* ========================================
     FUNCIONES DE NAVEGACIÓN
     ======================================== */
  
  /**
   * Función para actualizar el estado activo de la navbar
   * @param {Object} elementoActivo - Elemento de navegación que debe marcarse como activo
   */
  function actualizarNavegacionActiva(elementoActivo) {
    // Remover la clase 'active' de todos los elementos de navegación
    $(".nav.navbar-nav li").removeClass("active");

    // Agregar la clase 'active' al elemento seleccionado
    $(elementoActivo).addClass("active");
  }

  /* ========================================
     FUNCIONES DEL CARRITO DE COMPRAS
     ======================================== */
  
  /**
   * Función para actualizar el contador visual del carrito
   * Muestra la cantidad total de productos y anima el badge
   */
  /**
   * Función para actualizar el contador visual del carrito
   * Muestra la cantidad total de productos y anima el badge
   */
  function actualizarContadorCarrito() {
    // Calcular la cantidad total de productos (sumando las cantidades individuales)
    var cantidadTotal = productoaggCarrito.reduce(function (total, producto) {
      return total + (producto.cantidad || 1);
    }, 0);

    // Obtener referencia al elemento contador del carrito
    var contador = $("#carrito-contador");

    // Actualizar el texto del contador
    contador.text(cantidadTotal);

    // Mostrar u ocultar el badge según la cantidad
    if (cantidadTotal === 0) {
      contador.addClass("badge-empty");
    } else {
      contador.removeClass("badge-empty");
      // Agregar animación de pulsación para llamar la atención
      contador.addClass("badge-highlight");
      setTimeout(function () {
        contador.removeClass("badge-highlight");
      }, 600);
    }
  }

  /* ========================================
     CARGA INICIAL DE DATOS
     ======================================== */
  
  /**
   * Carga los productos desde el archivo JSON
   * Se ejecuta al cargar la página
   */

  /**
   * Carga los productos desde el archivo JSON
   * Se ejecuta al cargar la página
   */
  $.getJSON("json/diccionario.json", function (data) {
    var productosContainer = $("#productos-container");

    // Verificar que los datos sean válidos
    if (!data || !data.productos) {
      productosContainer.html(
        '<div class="col-md-12"><p class="text-center">No se encontraron productos.</p></div>'
      );
      return;
    }

    // Guardar todos los productos en la variable global
    todosLosProductos = data.productos;
    
    // Mostrar productos más vendidos al cargar la página por defecto
    filtrarPorVendidos("True");
    
    // Actualizar el título de la sección
    $(".productos-seccion h2").text("Mas Vendidos");
    
    // Aplicar configuración de etiquetas después de cargar productos
    setTimeout(() => {
      aplicarConfiguracionEtiquetas();
    }, 200);
    
    // Inicializar contador del carrito en cero
    actualizarContadorCarrito();
    
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // Manejo de errores al cargar el JSON
    console.error("Error al cargar productos:", textStatus, errorThrown);
    $("#productos-container").html(
      '<div class="col-md-12"><p class="text-center text-danger">Error al cargar los productos. Por favor, intente de nuevo más tarde.</p></div>'
    );
  });

  /* ========================================
     FUNCIONES DE VISUALIZACIÓN DE PRODUCTOS
     ======================================== */
  
  /**
   * Función para mostrar productos en la interfaz
   * @param {Array} productos - Array de productos a mostrar
   */
  /**
   * Función para mostrar productos en la interfaz
   * @param {Array} productos - Array de productos a mostrar
   */
  function mostrarProductos(productos) {
    var productosContainer = $("#productos-container");
    productosContainer.empty(); // Limpiar el contenedor antes de agregar nuevos productos

    // Verificar si hay productos para mostrar
    if (productos.length === 0) {
      productosContainer.html(
        '<div class="col-md-12"><p class="text-center">No se encontraron productos en esta categoría.</p></div>'
      );
      return;
    }

    // Ordenar productos por código antes de mostrarlos
    var productosOrdenados = productos.slice().sort(function(a, b) {
      // Extraer números del código para ordenamiento numérico correcto
      var numA = parseInt(a.codigo.replace(/\D/g, ''));
      var numB = parseInt(b.codigo.replace(/\D/g, ''));
      return numA - numB;
    });

    // Iterar sobre cada producto ordenado y crear su HTML
    $.each(productosOrdenados, function (index, producto) {
      // Solo mostrar productos que tengan nombre válido
      if (producto.nombre && producto.nombre.trim() !== "") {
        
        // Crear nombre de archivo para la imagen del producto
        var imagenUrl;
        if (producto.imagenTemporal || producto.imagenPersonalizada) {
          // Si el producto tiene una imagen temporal (cargada por el usuario)
          imagenUrl = producto.imagenTemporal || producto.imagenPersonalizada;
        } else {
          // Usar la imagen estándar basada en el nombre
          var nombreImagen = producto.nombre.trim() + ".png";
          imagenUrl = "images/" + nombreImagen;
        }

        // Plantilla HTML para cada producto
        var etiquetasEspeciales = '';
        
        // Agregar etiqueta de "Más Vendido" si aplica
        if (producto.masvendidos && producto.masvendidos.toLowerCase() === 'true') {
          etiquetasEspeciales += '<div class="etiqueta-especial etiqueta-mas-vendido"><i class="fas fa-fire"></i> Más Vendido</div>';
        }
        
        // Agregar etiqueta de "Oferta" si aplica
        if (producto.oferta && producto.oferta.toLowerCase() === 'true') {
          etiquetasEspeciales += '<div class="etiqueta-especial etiqueta-oferta"><i class="fas fa-tag"></i> Oferta</div>';
        }
        
        var productoHTML = `
            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 producto-col">
              <div class="producto-card">
                ${etiquetasEspeciales}
                <!-- Contenedor de la imagen del producto -->
                <div class="producto-imagen">
                  <img src = "${imagenUrl}" alt="${producto.nombre}">
                </div>
                
                <!-- Información del producto -->
                <div class="producto-info">
                  <h4 class="producto-nombre">${producto.nombre}</h4>
                  <p class="producto-categoria">${
                    producto.categoria || "Sin categoría"
                  }</p>
                  <div class="producto-precio">
                    <span class="precio">${parseInt(
                      producto.precio
                    )}.00 lps</span>
                  </div>
                  
                  <!-- Botones de acción del producto -->
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
        // Agregar el HTML del producto al contenedor
        productosContainer.append(productoHTML);
      }
    });

    // Agregar clearfix después de cada grupo de 4 productos para pantallas grandes
    // y después de cada grupo de 3 para pantallas medianas
    productosContainer.find('.producto-col:nth-child(4n)').after('<div class="clearfix visible-lg"></div>');
    productosContainer.find('.producto-col:nth-child(3n)').after('<div class="clearfix visible-md"></div>');
    productosContainer.find('.producto-col:nth-child(2n)').after('<div class="clearfix visible-sm"></div>');
  }

  /* ========================================
     EVENT LISTENERS - GESTIÓN DEL CARRITO
     ======================================== */
  
  /**
   * Event listener para agregar productos al carrito
   * Usa delegación de eventos para manejar elementos dinámicos
   */
  /**
   * Event listener para agregar productos al carrito
   * Usa delegación de eventos para manejar elementos dinámicos
   */
  $(document).on("click", ".btn-carrito", function (e) {
    e.preventDefault(); // Prevenir comportamiento por defecto del enlace

    // Obtener información del producto desde la tarjeta
    var productoCard = $(this).closest(".producto-card");
    var nombreProducto = productoCard.find(".producto-nombre").text();
    var precioProducto = productoCard.find(".precio").text();

    // Verificar si el producto ya existe en el carrito
    var productoExistente = productoaggCarrito.find(function (producto) {
      return producto.nombre === nombreProducto;
    });

    if (productoExistente) {
      // Si el producto ya existe, incrementar la cantidad
      productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;

      // Mostrar notificación de actualización
      mostrarToast(
        `Cantidad actualizada: ${productoExistente.cantidad} unidades de ${nombreProducto}`,
        "¡Producto actualizado!",
        "info"
      );
    } else {
      // Si es un producto nuevo, agregarlo al carrito
      var producto = {
        nombre: nombreProducto,
        precio: precioProducto,
        cantidad: 1,
      };

      // Agregar producto al array del carrito
      productoaggCarrito.push(producto);

      // Mostrar notificación de éxito
      mostrarToast(
        `${nombreProducto} ha sido agregado a tu carrito`,
        "¡Producto agregado!",
        "success"
      );
    }

    // Actualizar contador visual del carrito
    actualizarContadorCarrito();
  });

  /**
   * Función auxiliar para agregar productos al carrito
   * @param {string} nombre - Nombre del producto
   * @param {string|number} precio - Precio del producto
   */
  function agregarAlCarrito(nombre, precio) {
    // Limpiar y formatear el precio
    var precioLimpio = typeof precio === 'string' ? 
        precio.replace(/[^0-9.]/g, '') : precio.toString();
    var precioFormateado = parseInt(precioLimpio) + ".00 lps";

    // Verificar si el producto ya existe en el carrito
    var productoExistente = productoaggCarrito.find(function (producto) {
      return producto.nombre === nombre;
    });

    if (productoExistente) {
      // Si el producto ya existe, incrementar la cantidad
      productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;

      // Mostrar notificación de actualización
      mostrarToast(
        `Cantidad actualizada: ${productoExistente.cantidad} unidades de ${nombre}`,
        "¡Producto actualizado!",
        "info"
      );
    } else {
      // Si es un producto nuevo, agregarlo al carrito
      var producto = {
        nombre: nombre,
        precio: precioFormateado,
        cantidad: 1,
      };

      // Agregar producto al array del carrito
      productoaggCarrito.push(producto);

      // Mostrar notificación de éxito
      mostrarToast(
        `${nombre} ha sido agregado a tu carrito`,
        "¡Producto agregado!",
        "success"
      );
    }

    // Actualizar contador visual del carrito
    actualizarContadorCarrito();
  }

  /* ========================================
     EVENT LISTENERS - DETALLES DE PRODUCTO
     ======================================== */

  /* ========================================
     EVENT LISTENERS - DETALLES DE PRODUCTO
     ======================================== */

  /**
   * Event listener para ver detalles del producto
   * Se activa cuando se hace clic en el botón "Ver Detalles"
   */
  $(document).on("click", ".btn-detalles", function (e) {
    e.preventDefault(); // Prevenir comportamiento por defecto del enlace

    // Obtener el nombre del producto desde la tarjeta más cercana
    var productoCard = $(this).closest(".producto-card");
    var nombreProducto = productoCard.find(".producto-nombre").text();

    // Buscar el producto completo en el array global
    // Esto nos permite acceder a toda la información del producto
    var productoCompleto = todosLosProductos.find(function (producto) {
      return producto.nombre === nombreProducto;
    });

    // Si encontramos el producto, mostrar sus detalles en el modal
    if (productoCompleto) {
      mostrarDetallesProducto(productoCompleto);
    }
  });

  /**
   * Función para mostrar los detalles del producto en el modal
   * @param {Object} producto - Objeto producto con información completa
   */
  function mostrarDetallesProducto(producto) {
    // Crear URL de la imagen basada en el nombre del producto
    var nombreImagen = producto.nombre.trim() + ".png";
    var imagenUrl = "images/" + nombreImagen;

    // Llenar los elementos del modal con la información del producto
    $("#detalle-imagen").attr("src", imagenUrl).attr("alt", producto.nombre);
    $("#detalle-nombre").text(producto.nombre);
    $("#detalle-codigo").text("Código: " + (producto.codigo || "N/A"));
    $("#detalle-categoria").text(producto.categoria || "Sin categoría");
    $("#detalle-precio").text(parseInt(producto.precio).toFixed(2) + " LPS");
    $("#detalle-descripcion").text(
      producto.descripcion || "Sin descripción disponible"
    );

    // Guardar los datos del producto en el botón para poder agregarlo al carrito
    $(".btn-agregar-desde-detalle").data("producto", producto);

    // Mostrar el modal de detalles
    $("#modalDetalles").modal("show");
  }

  /**
   * Event listener para agregar al carrito desde el modal de detalles
   * Este evento es diferente al del botón de las tarjetas
   */
  $(document).on("click", ".btn-agregar-desde-detalle", function (e) {
    e.preventDefault(); // Prevenir comportamiento por defecto

    // Recuperar los datos del producto almacenados en el botón
    var producto = $(this).data("producto");

    // Verificar que tenemos datos del producto
    if (producto) {
      // Crear formato consistente del precio
      var precioFormateado = parseInt(producto.precio).toFixed(2) + ".00 lps";

      // Verificar si el producto ya existe en el carrito
      var productoExistente = productoaggCarrito.find(function (item) {
        return item.nombre === producto.nombre;
      });

      if (productoExistente) {
        // Si el producto ya existe, incrementar la cantidad
        productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;

        // Mostrar notificación de actualización
        mostrarToast(
          `Cantidad actualizada: ${productoExistente.cantidad} unidades de ${producto.nombre}`,
          "¡Producto actualizado!",
          "info"
        );
      } else {
        // Si es un producto nuevo, agregarlo al carrito
        var productoCarrito = {
          nombre: producto.nombre,
          precio: precioFormateado,
          cantidad: 1,
        };

        // Agregar el producto al array del carrito
        productoaggCarrito.push(productoCarrito);

        // Mostrar notificación de éxito
        mostrarToast(
          `${producto.nombre} ha sido agregado a tu carrito`,
          "¡Producto agregado!",
          "success"
        );
      }

      // Actualizar contador del carrito
      actualizarContadorCarrito();

      // Cerrar el modal de detalles automáticamente
      $("#modalDetalles").modal("hide");
    }
  });

  /* ========================================
     GESTIÓN DEL MODAL DEL CARRITO
     ======================================== */

  /**
   * Event listener para mostrar el contenido del carrito
   * Se activa cuando se hace clic en el botón del carrito
   */
  /**
   * Event listener para mostrar el contenido del carrito
   * Se activa cuando se hace clic en el botón del carrito
   */
  $("#btn-carrito").on("click", function (e) {
    e.preventDefault();

    // Obtener contenedor donde se mostrará el contenido del carrito
    const contenedor = $("#contenidoCarrito");
    contenedor.empty(); // Limpiar contenido anterior

    // Verificar si hay productos en el carrito
    if (!Array.isArray(productoaggCarrito) || productoaggCarrito.length === 0) {
      // Mostrar mensaje cuando el carrito está vacío
      contenedor.append(`
            <tr>
              <td colspan="6" class="text-center">No hay productos disponibles.</td>
            </tr>
          `);
      $("#fila-total").hide(); // Ocultar fila de total
    } else {
      // Si hay productos, mostrar la tabla con los productos
      let totalGeneral = 0;

      // Iterar sobre cada producto en el carrito
      productoaggCarrito.forEach(function (producto, index) {
        // Determinar qué imagen usar
        var imagenUrl;
        if (producto.imagenPersonalizada) {
          // Usar imagen personalizada si existe
          imagenUrl = producto.imagenPersonalizada;
        } else {
          // Crear URL de la imagen del producto por defecto
          var nombreImagen = producto.nombre.trim() + ".png";
          imagenUrl = "images/" + nombreImagen;
        }

        // Extraer el precio numérico (remover texto y convertir a número)
        var precioNumerico = parseFloat(producto.precio.replace(/[^\d.]/g, ""));
        var cantidad = producto.cantidad || 1;
        var subtotal = precioNumerico * cantidad;
        totalGeneral += subtotal;

        // Crear fila de la tabla para cada producto
        contenedor.append(`
              <tr>
                <td style="width: 80px;">
                  <img src="${imagenUrl}" alt="${producto.nombre}" 
                       style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; border: 1px solid #ddd;"
                       onerror="this.src='images/Laptop Dell.png';">
                </td>
                <td>
                  ${producto.nombre}
                  ${producto.temporal ? '<span class="label label-info" style="margin-left: 5px; font-size: 10px;">TEMPORAL</span>' : ''}
                </td>
                <td>L ${precioNumerico.toFixed(2)}</td>
                <td>
                  <input type="number" value="${cantidad}" min="1" max="10" 
                         class="cantidad-producto" data-index="${index}" data-precio="${precioNumerico}"
                         style="width: 60px; text-align: center; border: 1px solid #ddd; border-radius: 3px;">
                </td>
                <td class="subtotal-producto">L ${subtotal.toFixed(2)}</td>
                <td>
                  <button class="btn btn-danger btn-sm btn-eliminar-producto" data-index="${index}">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `);
      });

      // Mostrar el total general
      $("#total-carrito").text("L " + totalGeneral.toFixed(2));
      $("#fila-total").show();
    }

    // Mostrar el modal del carrito
    $("#modalCarrito").modal("show");
  });

  /**
   * Event listener para eliminar productos del carrito
   * Se ejecuta cuando se hace clic en el botón de eliminar
   */
  $(document).on("click", ".btn-eliminar-producto", function (e) {
    e.preventDefault();
    
    // Obtener índice del producto y su nombre
    var index = $(this).data("index");
    var nombreProducto = productoaggCarrito[index].nombre;

    // Eliminar producto del array del carrito
    productoaggCarrito.splice(index, 1);

    // Actualizar contador visual
    actualizarContadorCarrito();

    // Mostrar notificación de eliminación
    mostrarToast(
      `${nombreProducto} ha sido eliminado del carrito`,
      "¡Producto eliminado!",
      "info"
    );

    // Recargar el contenido del carrito para reflejar los cambios
    $("#btn-carrito").trigger("click");
  });

  /**
   * Event listener para actualizar cantidad de productos en el carrito
   * Se ejecuta cuando cambia el valor del input de cantidad
   */
  $(document).on("change", ".cantidad-producto", function (e) {
    var cantidad = parseInt($(this).val());
    var precio = parseFloat($(this).data("precio"));
    var index = $(this).data("index");

    // Validar que la cantidad sea mayor a 0
    if (cantidad < 1) {
      cantidad = 1;
      $(this).val(1);
    }

    // Actualizar la cantidad en el array del carrito
    if (productoaggCarrito[index]) {
      productoaggCarrito[index].cantidad = cantidad;
    }

    // Actualizar contador del carrito
    actualizarContadorCarrito();

    // Calcular nuevo subtotal para este producto
    var nuevoSubtotal = precio * cantidad;

    // Actualizar subtotal en la interfaz
    $(this)
      .closest("tr")
      .find(".subtotal-producto")
      .text("L " + nuevoSubtotal.toFixed(2));

    // Recalcular total general
    var totalGeneral = 0;
    $(".cantidad-producto").each(function () {
      var cant = parseInt($(this).val());
      var prec = parseFloat($(this).data("precio"));
      totalGeneral += cant * prec;
    });

    // Actualizar total en la interfaz
    $("#total-carrito").text("L " + totalGeneral.toFixed(2));
  });

  /* ========================================
     FUNCIONES DE FILTRADO DE PRODUCTOS
     ======================================== */
  
  /**
   * Función para filtrar productos por categoría
   * @param {string} categoria - Nombre de la categoría a filtrar
   */
  function filtrarPorCategoria(categoria) {
    var productosFiltrados = todosLosProductos.filter(function (producto) {
      return (
        producto.categoria &&
        producto.categoria.toLowerCase() === categoria.toLowerCase()
      );
    });
    mostrarProductos(productosFiltrados);
  }

  /**
   * Función para filtrar productos más vendidos
   * @param {string} masvendidos - Valor del campo masvendidos ("True" o "False")
   */
  function filtrarPorVendidos(masvendidos) {
    var productosFiltrados = todosLosProductos.filter(function (producto) {
      return (
        producto.masvendidos &&
        producto.masvendidos.toLowerCase() === masvendidos.toLowerCase()
      );
    });
    mostrarProductos(productosFiltrados);
  }

  /* ========================================
     EVENT LISTENERS - NAVEGACIÓN POR CATEGORÍAS
     ======================================== */
  /* ========================================
     EVENT LISTENERS - NAVEGACIÓN POR CATEGORÍAS
     ======================================== */

  // Event listeners para cada categoría de productos
  // Cada botón filtra los productos por su categoría específica

  /** Categoría: Audífonos */
  $("#btn-Audifono").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Audifonos");
    $(".productos-seccion h2").text("Audifonos");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Pantallas/Monitores */
  $("#btn-Pantalla").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Monitores");
    $(".productos-seccion h2").text("Pantallas");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Computadoras */
  $("#btn-Computadoras").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Computadora");
    $(".productos-seccion h2").text("Computadoras");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Teclados */
  $("#btn-Teclados").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Teclados");
    $(".productos-seccion h2").text("Teclados");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Mouse */
  $("#btn-Mouse").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Mouse");
    $(".productos-seccion h2").text("Mouse");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Routers */
  $("#btn-Router").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Router");
    $(".productos-seccion h2").text("Routers");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Almacenamiento */
  $("#btn-Almacenamiento").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Almacenamiento");
    $(".productos-seccion h2").text("Almacenamiento");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Cámaras */
  $("#btn-Camaras").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Camara");
    $(".productos-seccion h2").text("Cámaras");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Impresoras */
  $("#btn-Impresoras").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Impresoras");
    $(".productos-seccion h2").text("Impresoras");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Teléfonos */
  $("#btn-Telefonos").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Telefonos");
    $(".productos-seccion h2").text("Teléfonos");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Cámara (individual) */
  $("#btn-Camara").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Camara");
    $(".productos-seccion h2").text("Cámara");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Proyectores */
  $("#btn-Proyector").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Proyector");
    $(".productos-seccion h2").text("Proyector");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Componentes Internos */
  $("#btn-Compenentes").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Componentes Internos");
    $(".productos-seccion h2").text("Componentes Internos");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Altavoces */
  $("#btn-Altavoces").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Altavoces");
    $(".productos-seccion h2").text("Altavoces");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Relojes Inteligentes */
  $("#btn-Relojes").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Relojes Inteligentes");
    $(".productos-seccion h2").text("Relojes Inteligentes");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Consolas */
  $("#btn-Consolas").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Consolas");
    $(".productos-seccion h2").text("Consolas");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Accesorios */
  $("#btn-Accesorios").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Accesorios");
    $(".productos-seccion h2").text("Accesorios");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Electrodomésticos */
  $("#btn-Electrodomesticos").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Electrodomesticos");
    $(".productos-seccion h2").text("Electrodomésticos");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Cuidado Personal */
  $("#btn-CuidadoPersonal").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Cuidado Personal");
    $(".productos-seccion h2").text("Cuidado Personal");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /** Categoría: Televisores */
  $("#btn-Televisores").click(function (e) {
    e.preventDefault();
    filtrarPorCategoria("Televisores");
    $(".productos-seccion h2").text("Televisores");
    actualizarNavegacionActiva($("#nav-categorias"));
  });

  /* ========================================
     EVENT LISTENERS - NAVEGACIÓN ESPECIAL
     ======================================== */

  /** Mostrar productos más vendidos (página de inicio) */
  $("#btn-inicio").click(function (e) {
    e.preventDefault();
    filtrarPorVendidos("True");
    $(".productos-seccion h2").text("Mas Vendidos");
    actualizarNavegacionActiva($("#nav-inicio"));
  });

  /**
   * Función para mostrar todos los productos
   * Se usa cuando se selecciona "Todos los productos"
   */
  function mostrarTodosLosProductos() {
    mostrarProductos(todosLosProductos);
    $(".productos-seccion h2").text("Nuestros Productos");
  }

  /** Event listener para mostrar todos los productos */
  $("#btn-productos").click(function (e) {
    e.preventDefault();
    mostrarTodosLosProductos();
    actualizarNavegacionActiva($("#nav-productos"));
  });

}); // FIN del $(document).ready()

/* ========================================
   SISTEMA DE NOTIFICACIONES TOAST
   ========================================
   Funciones independientes para mostrar notificaciones
   emergentes estilizadas al usuario
   ======================================== */

/**
 * Función principal para mostrar notificaciones toast
 * @param {string} mensaje - Texto del mensaje a mostrar
 * @param {string} titulo - Título de la notificación (opcional)
 * @param {string} tipo - Tipo de notificación: success, error, warning, info
 */
function mostrarToast(mensaje, titulo = "¡Éxito!", tipo = "success") {
  // Obtener contenedor donde se mostrarán las notificaciones
  const toastContainer = document.getElementById("toast-container");

  // Crear el elemento toast
  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${tipo}`;

  // Definir iconos según el tipo de notificación
  const iconos = {
    success: "fas fa-check-circle",      // Ícono de éxito
    error: "fas fa-exclamation-circle",  // Ícono de error
    warning: "fas fa-exclamation-triangle", // Ícono de advertencia
    info: "fas fa-info-circle",          // Ícono de información
  };

  // Crear el contenido HTML del toast
  toast.innerHTML = `
    <button class="toast-close" onclick="cerrarToast(this)">&times;</button>
    <div class="toast-header">
      <i class="toast-icon ${iconos[tipo] || iconos.success}"></i>
      <p class="toast-title">${titulo}</p>
    </div>
    <p class="toast-message">${mensaje}</p>
  `;

  // Añadir el toast al contenedor
  toastContainer.appendChild(toast);

  // Mostrar con animación después de un pequeño delay
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Auto-cerrar la notificación después de 4 segundos
  setTimeout(() => {
    cerrarToast(toast.querySelector(".toast-close"));
  }, 4000);
}

/**
 * Función para cerrar una notificación toast
 * @param {HTMLElement} button - Botón de cerrar que fue clickeado
 */
function cerrarToast(button) {
  // Encontrar el toast padre del botón
  const toast = button.closest(".toast-notification");
  
  // Agregar clase para animación de salida
  toast.classList.add("hide");

  // Remover el elemento del DOM después de la animación
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 400);
}

/* ========================================
   MODAL PRODUCTO TEMPORAL
   ========================================
   Funcionalidad para agregar productos
   temporales personalizados al carrito
   ======================================== */

/**
 * Event listener para abrir el modal de producto temporal
 */
$("#btn-producto-temporal").on("click", function(e) {
  e.preventDefault();
  
  // Limpiar el formulario
  limpiarFormularioTemporal();
  
  // Mostrar el modal
  $("#modalProductoTemporal").modal("show");
});

/**
 * Función para limpiar el formulario del producto temporal
 */
function limpiarFormularioTemporal() {
  $("#form-producto-temporal")[0].reset();
  $("#temp-categoria").val("Producto Personalizado");
  $("#temp-codigo").val("");
  
  // Limpiar checkboxes
  $("#temp-masvendido").prop("checked", false);
  $("#temp-oferta").prop("checked", false);
  
  // Limpiar vista previa de imagen
  $("#imagen-preview-mini").hide();
  $("#mini-preview").attr('src', '');
  
  // Reset imagen personalizada
  imagenPersonalizadaUrl = null;
}

/**
 * Función para obtener imagen por categoría
 */
function obtenerImagenPorCategoria(categoria) {
  var imagenesCategoria = {
    "Audifonos": "images/Auriculares Sony.png",
    "Monitores": "images/Monitor Samsung.png", 
    "Pantallas": "images/Monitor Samsung.png",
    "Computadora": "images/Laptop Dell.png",
    "Computadoras": "images/Laptop Dell.png",
    "Mouse": "images/Mouse Logitech.png",
    "Teclados": "images/Teclado Logitech.png",
    "Router": "images/Router.png",
    "Almacenamiento": "images/Disco SSD Kingston.png",
    "Camara": "images/Cámara Web Logitech.png",
    "Camaras": "images/Cámara Web Logitech.png",
    "Impresoras": "images/Impresora HP.png",
    "Telefonos": "images/iPhone 15 Pro.png",
    "Proyector": "images/Proyector Epson.png",
    "Componentes Internos": "images/Tarjeta Gráfica Nvidia.png",
    "Compenentes": "images/Tarjeta Gráfica Nvidia.png",
    "Altavoces": "images/Altavoces Bose.png",
    "Relojes Inteligentes": "images/Apple Watch Series 9.png",
    "Consolas": "images/Consola Xbox Series S.png",
    "Accesorios": "images/Cable USB-C.png",
    "Electrodomesticos": "images/Estabilizador Forza.png",
    "Cuidado Personal": "images/Smartwatch Huawei.png",
    "Televisores": "images/Monitor Samsung.png",
    "Producto Personalizado": "images/Laptop Dell.png"
  };
  
  return imagenesCategoria[categoria] || "images/Laptop Dell.png";
}

/**
 * Event listener para carga de imagen personalizada
 */
$("#temp-imagen").on("change", function(e) {
  var archivo = e.target.files[0];
  
  if (archivo) {
    // Validar tipo de archivo
    var tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!tiposPermitidos.includes(archivo.type)) {
      mostrarToast(
        "Solo se permiten imágenes JPG, PNG o GIF",
        "Formato no válido",
        "error"
      );
      $(this).val(''); // Limpiar input
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      mostrarToast(
        "La imagen no puede ser mayor a 5MB",
        "Archivo muy grande",
        "error"
      );
      $(this).val(''); // Limpiar input
      return;
    }
    
    // Crear FileReader para leer el archivo
    var reader = new FileReader();
    
    reader.onload = function(e) {
      imagenPersonalizadaUrl = e.target.result;
      
      // Mostrar mini preview
      $("#mini-preview").attr('src', imagenPersonalizadaUrl);
      $("#imagen-preview-mini").show();
      
      mostrarToast(
        "Imagen cargada correctamente",
        "¡Éxito!",
        "success"
      );
    };
    
    reader.onerror = function() {
      mostrarToast(
        "Error al cargar la imagen",
        "Error",
        "error"
      );
    };
    
    reader.readAsDataURL(archivo);
  }
});

/**
 * Event listener para limpiar imagen
 */
$("#btn-limpiar-imagen").on("click", function(e) {
  e.preventDefault();
  
  // Limpiar input de archivo
  $("#temp-imagen").val('');
  
  // Ocultar preview mini
  $("#imagen-preview-mini").hide();
  $("#mini-preview").attr('src', '');
  
  // Reset imagen personalizada
  imagenPersonalizadaUrl = null;
  
  mostrarToast(
    "Imagen removida. Se usará imagen por categoría",
    "Imagen eliminada",
    "info"
  );
});

/**
 * Event listener para generar código automático
 */
$("#temp-nombre").on("input", function() {
  var nombre = $(this).val();
  if (nombre.length > 0 && $("#temp-codigo").val() === "") {
    // Generar código basado en el nombre
    var codigo = "TEMP-" + nombre.substring(0, 6).toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (codigo === "TEMP-") {
      codigo = "TEMP-" + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }
    $("#temp-codigo").val(codigo);
  }
});

/**
 * Validación en tiempo real de los campos
 */
$("#temp-nombre").on("input", function() {
  var nombre = $(this).val();
  var grupo = $(this).closest(".form-group");
  
  if (nombre.length >= 3) {
    grupo.removeClass("has-error").addClass("has-success");
  } else {
    grupo.removeClass("has-success").addClass("has-error");
  }
});

$("#temp-precio").on("input", function() {
  var precio = parseFloat($(this).val());
  var grupo = $(this).closest(".form-group");
  
  if (precio > 0) {
    grupo.removeClass("has-error").addClass("has-success");
  } else {
    grupo.removeClass("has-success").addClass("has-error");
  }
});

/**
 * Event listener para guardar el producto temporal
 */
$("#btn-guardar-temporal").on("click", function(e) {
  e.preventDefault();
  
  // Validar campos obligatorios
  var nombre = $("#temp-nombre").val().trim();
  var precio = parseFloat($("#temp-precio").val());
  
  if (!nombre || nombre.length < 3) {
    mostrarToast(
      "El nombre del producto debe tener al menos 3 caracteres",
      "Error de validación",
      "error"
    );
    $("#temp-nombre").focus();
    return;
  }
  
  if (!precio || precio <= 0) {
    mostrarToast(
      "El precio debe ser mayor a 0",
      "Error de validación", 
      "error"
    );
    $("#temp-precio").focus();
    return;
  }
  
  // Recopilar datos del formulario
  var productoTemporal = {
    nombre: nombre,
    categoria: $("#temp-categoria").val(),
    precio: precio.toFixed(2) + ".00 lps",
    codigo: $("#temp-codigo").val() || "TEMP-" + Date.now(),
    descripcion: $("#temp-descripcion").val().trim() || "Producto temporal agregado manualmente",
    cantidad: 1, // Cantidad fija de 1 para productos temporales
    temporal: true, // Marcar como producto temporal
    imagenPersonalizada: imagenPersonalizadaUrl, // Guardar la imagen personalizada
    masvendidos: $("#temp-masvendido").is(":checked") ? "True" : "False", // Estado de más vendido
    oferta: $("#temp-oferta").is(":checked") ? "True" : "False" // Estado de oferta
  };
  
  // Verificar si el producto ya existe en el carrito
  var productoExistente = productoaggCarrito.find(function(producto) {
    return producto.nombre === productoTemporal.nombre;
  });
  
  if (productoExistente) {
    // Si existe, actualizar cantidad
    productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    
    mostrarToast(
      `Cantidad actualizada: ${productoExistente.cantidad} unidades de ${productoTemporal.nombre}`,
      "¡Producto actualizado!",
      "info"
    );
  } else {
    // Si es nuevo, agregarlo al carrito
    productoaggCarrito.push(productoTemporal);
    
    // Agregar el producto temporal al array de todos los productos para que aparezca en la vista
    todosLosProductos.push(productoTemporal);
    
    // Actualizar la vista de productos para mostrar el nuevo producto
    mostrarProductos(todosLosProductos);
    
    mostrarToast(
      `${productoTemporal.nombre} ha sido agregado al carrito`,
      "¡Producto temporal agregado!",
      "success"
    );
  }
  
  // Actualizar contador del carrito
  actualizarContadorCarrito();
  
  // Cerrar el modal
  $("#modalProductoTemporal").modal("hide");
  
  // Limpiar formulario para próximo uso
  setTimeout(function() {
    limpiarFormularioTemporal();
  }, 500);
});

/**
 * Event listener para limpiar formulario al cerrar modal
 */
$("#modalProductoTemporal").on("hidden.bs.modal", function() {
  limpiarFormularioTemporal();
  // Remover clases de validación
  $(this).find(".form-group").removeClass("has-error has-success");
});

/* ========================================
   FIN DEL SCRIPT PRINCIPAL
   ======================================== */
