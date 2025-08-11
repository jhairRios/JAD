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
  
  // --- INICIO BLOQUE 1: VARIABLES GLOBALES ---
  var todosLosProductos = [];
  var productoaggCarrito = [];
  // --- FIN BLOQUE 1 ---

  // --- INICIO BLOQUE 2: FUNCIONES DE NAVEGACIÓN ---
  // Función: actualizarNavegacionActiva
  function actualizarNavegacionActiva(elementoActivo) {
    $(".nav.navbar-nav li").removeClass("active");
    $(elementoActivo).addClass("active");
  }
  // --- FIN BLOQUE 2 ---

  // --- INICIO BLOQUE 3: FUNCIONES DEL CARRITO ---
  // Función: actualizarContadorCarrito
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

  // --- INICIO BLOQUE 4: CARGA INICIAL DE DATOS ---
  // Carga los productos desde el archivo JSON
  function cargarProductosIniciales() {
    $.getJSON("json/diccionario.json")
      .done(function (data) {
        if (!data || !data.productos) {
          $("#productos-container").html('<div class="col-md-12"><p class="text-center">No se encontraron productos.</p></div>');
          return;
        }
        todosLosProductos = data.productos;
        filtrarPorVendidos("True");
        $(".productos-seccion h2").text("Mas Vendidos");
        actualizarContadorCarrito();
      })
      .fail(function () {
        $("#productos-container").html('<div class="col-md-12"><p class="text-center text-danger">Error al cargar los productos. Por favor, intente de nuevo más tarde.</p></div>');
      });
  }
  cargarProductosIniciales();

  // --- INICIO BLOQUE 5: FUNCIONES DE VISUALIZACIÓN DE PRODUCTOS ---
  // Función: mostrarProductos
  function mostrarProductos(productos) {
    var productosContainer = $("#productos-container");
    productosContainer.empty();
    if (!productos || productos.length === 0) {
      productosContainer.html('<div class="col-md-12"><p class="text-center">No se encontraron productos en esta categoría.</p></div>');
      return;
    }
    var productosOrdenados = productos.slice().sort(function(a, b) {
      var numA = parseInt(a.codigo.replace(/\D/g, ''));
      var numB = parseInt(b.codigo.replace(/\D/g, ''));
      return numA - numB;
    });
    productosOrdenados.forEach(function(producto) {
      if (!producto.nombre || producto.nombre.trim() === "") return;
      var imagenUrl = producto.imagenTemporal || producto.imagenPersonalizada || ("images/" + producto.nombre.trim() + ".png");
      var etiquetasEspeciales = '';
      if (producto.masvendidos && producto.masvendidos.toLowerCase() === 'true') etiquetasEspeciales += '<div class="etiqueta-especial etiqueta-mas-vendido"><i class="fas fa-fire"></i> Más Vendido</div>';
      if (producto.oferta && producto.oferta.toLowerCase() === 'true') etiquetasEspeciales += '<div class="etiqueta-especial etiqueta-oferta"><i class="fas fa-tag"></i> Oferta</div>';
      var productoHTML = `
        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 producto-col">
          <div class="producto-card">
            ${etiquetasEspeciales}
            <div class="producto-imagen">
              <img src = "${imagenUrl}" alt="${producto.nombre}">
            </div>
            <div class="producto-info">
              <h4 class="producto-nombre">${producto.nombre}</h4>
              <p class="producto-categoria">${producto.categoria || "Sin categoría"}</p>
              <div class="producto-precio">
                <span class="precio">${parseInt(producto.precio)}.00 lps</span>
              </div>
              <div class="producto-botones">
                <a href="#" class="btn btn-detalles"><i class="fas fa-eye"></i>Ver Detalles</a>
                <a href="#" class="btn btn-carrito"><i class="fas fa-shopping-cart"></i>Agregar</a>
              </div>
            </div>
          </div>
        </div>`;
      productosContainer.append(productoHTML);
    });
    productosContainer.find('.producto-col:nth-child(4n)').after('<div class="clearfix visible-lg"></div>');
    productosContainer.find('.producto-col:nth-child(3n)').after('<div class="clearfix visible-md"></div>');
    productosContainer.find('.producto-col:nth-child(2n)').after('<div class="clearfix visible-sm"></div>');
  }

  // --- INICIO BLOQUE 6: EVENTOS DEL CARRITO ---
  // Event listener: agregar productos al carrito
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

  // --- INICIO BLOQUE 7: EVENTOS DE DETALLES DE PRODUCTOS ---
  // Event listener: ver detalles del producto
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

  // --- INICIO BLOQUE 8: MODAL DEL CARRITO ---
  // Event listener: mostrar el contenido del carrito
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

// --- INICIO BLOQUE 9: FILTRADO DE PRODUCTOS ---

/* ========================================
   EVENT LISTENERS - NAVEGACIÓN POR CATEGORÍAS
   ======================================== */

// Mapeo de botones a categorías y títulos
var categoriasMap = {
  "#btn-Audifono": { categoria: "Audifonos", titulo: "Audifonos" },
  "#btn-Pantalla": { categoria: "Monitores", titulo: "Pantallas" },
  "#btn-Computadoras": { categoria: "Computadora", titulo: "Computadoras" },
  "#btn-Teclados": { categoria: "Teclados", titulo: "Teclados" },
  "#btn-Mouse": { categoria: "Mouse", titulo: "Mouse" },
  "#btn-Router": { categoria: "Router", titulo: "Routers" },
  "#btn-Almacenamiento": { categoria: "Almacenamiento", titulo: "Almacenamiento" },
  "#btn-Camaras": { categoria: "Camara", titulo: "Cámaras" },
  "#btn-Impresoras": { categoria: "Impresoras", titulo: "Impresoras" },
  "#btn-Telefonos": { categoria: "Telefonos", titulo: "Teléfonos" },
  "#btn-Camara": { categoria: "Camara", titulo: "Cámara" },
  "#btn-Proyector": { categoria: "Proyector", titulo: "Proyector" },
  "#btn-Compenentes": { categoria: "Componentes Internos", titulo: "Componentes Internos" },
  "#btn-Altavoces": { categoria: "Altavoces", titulo: "Altavoces" },
  "#btn-Relojes": { categoria: "Relojes Inteligentes", titulo: "Relojes Inteligentes" },
  "#btn-Consolas": { categoria: "Consolas", titulo: "Consolas" },
  "#btn-Accesorios": { categoria: "Accesorios", titulo: "Accesorios" },
  "#btn-Electrodomesticos": { categoria: "Electrodomesticos", titulo: "Electrodomésticos" },
  "#btn-CuidadoPersonal": { categoria: "Cuidado Personal", titulo: "Cuidado Personal" },
  "#btn-Televisores": { categoria: "Televisores", titulo: "Televisores" }
};

// Configurar event listeners para cada categoría
Object.keys(categoriasMap).forEach(function(selector) {
  $(selector).click(function(e) {
    e.preventDefault();
    var config = categoriasMap[selector];
    var productosFiltrados = todosLosProductos.filter(function(producto) {
      return producto.categoria && producto.categoria.toLowerCase() === config.categoria.toLowerCase();
    });
    mostrarProductos(productosFiltrados);
    $(".productos-seccion h2").text(config.titulo);
    actualizarNavegacionActiva($("#nav-categorias"));
  });
});

/* ========================================
   EVENT LISTENERS - NAVEGACIÓN ESPECIAL
   ======================================== */

// Mostrar productos más vendidos
$("#btn-inicio").click(function(e) {
  e.preventDefault();
  var productosFiltrados = todosLosProductos.filter(function(producto) {
    return producto.masvendidos && producto.masvendidos.toLowerCase() === "true";
  });
  mostrarProductos(productosFiltrados);
  $(".productos-seccion h2").text("Mas Vendidos");
  actualizarNavegacionActiva($("#nav-inicio"));
});

// Mostrar todos los productos
$("#btn-productos").click(function(e) {
  e.preventDefault();
  mostrarProductos(todosLosProductos);
  $(".productos-seccion h2").text("Nuestros Productos");
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
   FIN DEL SCRIPT PRINCIPAL
   ======================================== */
