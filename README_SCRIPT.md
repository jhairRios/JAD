# 📚 TIENDA JAD - DOCUMENTACIÓN TÉCNICA DEL SCRIPT

## 🎯 Descripción General

La **Tienda JAD** es una aplicación web de comercio electrónico desarrollada con **HTML5**, **Bootstrap 3.4.1**, **jQuery** y **CSS personalizado**. El sistema permite mostrar productos dinámicamente, gestionar un carrito de compras y filtrar productos por categorías.

---

## 📁 Estructura del Proyecto

```
JAD/
├── index.html                          # Página principal
├── styles.css                          # Estilos personalizados
├── README.md                           # Documentación del proyecto
├── README_SCRIPT.md                    # Esta documentación técnica
├── CSS/
│   ├── bootstrap-3.4.1-dist/          # Framework Bootstrap
│   └── fontawesome/                    # Iconos FontAwesome
├── JS/
│   ├── script.js                       # Script principal
│   ├── carrito.js                      # Funciones del carrito
│   └── jquery-3.1.1.min.js           # Librería jQuery
├── json/
│   ├── diccionario.json               # Base de datos de productos
│   └── configuracion_etiquetas.json   # Configuración de etiquetas
├── images/                             # Imágenes de productos
├── iconos/                             # Iconos de marcas
└── imagenesCarrucel/                   # Imágenes del carrusel
```

---

## 🔧 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **HTML5** | - | Estructura de la página |
| **CSS3** | - | Estilos y diseño responsive |
| **Bootstrap** | 3.4.1 | Framework CSS para componentes UI |
| **jQuery** | 3.1.1 | Manipulación del DOM y eventos |
| **FontAwesome** | - | Iconografía |
| **JSON** | - | Almacenamiento de datos |

---

## 📝 ARCHIVO: `script.js`

### 🏗️ Estructura del Script

El script está organizado en secciones bien definidas:

```javascript
$(document).ready(function () {
  // 1. VARIABLES GLOBALES
  // 2. FUNCIONES DE NAVEGACIÓN
  // 3. FUNCIONES DEL CARRITO
  // 4. CARGA INICIAL DE DATOS
  // 5. VISUALIZACIÓN DE PRODUCTOS
  // 6. GESTIÓN DEL CARRITO
  // 7. DETALLES DE PRODUCTOS
  // 8. FILTRADO DE PRODUCTOS
  // 9. NAVEGACIÓN POR CATEGORÍAS
});
```

---

## 🔍 Análisis Detallado por Secciones

### 1️⃣ **VARIABLES GLOBALES**

```javascript
var todosLosProductos = [];    // Array que contiene todos los productos cargados desde JSON
var productoaggCarrito = [];   // Array que contiene los productos agregados al carrito
```

**Propósito**: Almacenar el estado global de la aplicación.

---

### 2️⃣ **FUNCIONES DE NAVEGACIÓN**

#### `actualizarNavegacionActiva(elementoActivo)`

```javascript
function actualizarNavegacionActiva(elementoActivo) {
  $(".nav.navbar-nav li").removeClass("active");
  $(elementoActivo).addClass("active");
}
```

**Funcionalidad**: 
- Remueve la clase `active` de todos los elementos de navegación
- Agrega la clase `active` al elemento seleccionado
- **Uso**: Resaltar la sección actual en la barra de navegación

---

### 3️⃣ **FUNCIONES DEL CARRITO DE COMPRAS**

#### `actualizarContadorCarrito()`

```javascript
function actualizarContadorCarrito() {
  var cantidadTotal = productoaggCarrito.reduce(function (total, producto) {
    return total + (producto.cantidad || 1);
  }, 0);
  
  var contador = $("#carrito-contador");
  contador.text(cantidadTotal);
  
  if (cantidadTotal === 0) {
    contador.addClass("badge-empty");
  } else {
    contador.removeClass("badge-empty");
    contador.addClass("badge-highlight");
    setTimeout(function () {
      contador.removeClass("badge-highlight");
    }, 600);
  }
}
```

**Funcionalidad**:
- Calcula la cantidad total de productos en el carrito
- Actualiza el badge visual del contador
- Aplica animaciones para llamar la atención
- **Tecnologías**: jQuery, CSS animations

---

### 4️⃣ **CARGA INICIAL DE DATOS**

```javascript
$.getJSON("json/diccionario.json", function (data) {
  // Validación de datos
  if (!data || !data.productos) {
    productosContainer.html('<div class="col-md-12">Error...</div>');
    return;
  }
  
  // Almacenar productos globalmente
  todosLosProductos = data.productos;
  
  // Mostrar productos más vendidos por defecto
  filtrarPorVendidos("True");
  
  // Actualizar título de la sección
  $(".productos-seccion h2").text("Mas Vendidos");
  
  // Inicializar contador del carrito
  actualizarContadorCarrito();
})
```

**Proceso de carga**:
1. **Petición AJAX**: Carga `diccionario.json` usando `$.getJSON()`
2. **Validación**: Verifica que los datos sean válidos
3. **Almacenamiento**: Guarda productos en variable global
4. **Filtrado inicial**: Muestra productos más vendidos
5. **UI Update**: Actualiza título y contador
6. **Manejo de errores**: Muestra mensaje si falla la carga

---

### 5️⃣ **VISUALIZACIÓN DE PRODUCTOS**

#### `mostrarProductos(productos)`

```javascript
function mostrarProductos(productos) {
  var productosContainer = $("#productos-container");
  productosContainer.empty();
  
  if (productos.length === 0) {
    productosContainer.html('<div class="col-md-12">No se encontraron productos...</div>');
    return;
  }
  
  // Ordenamiento por código
  var productosOrdenados = productos.slice().sort(function(a, b) {
    var numA = parseInt(a.codigo.replace(/\D/g, ''));
    var numB = parseInt(b.codigo.replace(/\D/g, ''));
    return numA - numB;
  });
  
  // Generación de HTML para cada producto
  $.each(productosOrdenados, function (index, producto) {
    // Lógica de imágenes
    var imagenUrl;
    if (producto.imagenTemporal || producto.imagenPersonalizada) {
      imagenUrl = producto.imagenTemporal || producto.imagenPersonalizada;
    } else {
      var nombreImagen = producto.nombre.trim() + ".png";
      imagenUrl = "images/" + nombreImagen;
    }
    
    // Generación de etiquetas especiales
    var etiquetasEspeciales = '';
    if (producto.masvendidos && producto.masvendidos.toLowerCase() === 'true') {
      etiquetasEspeciales += '<div class="etiqueta-especial etiqueta-mas-vendido">...';
    }
    if (producto.oferta && producto.oferta.toLowerCase() === 'true') {
      etiquetasEspeciales += '<div class="etiqueta-especial etiqueta-oferta">...';
    }
    
    // Template HTML del producto
    var productoHTML = `...`;
    productosContainer.append(productoHTML);
  });
  
  // Responsive clearfix
  productosContainer.find('.producto-col:nth-child(4n)').after('<div class="clearfix visible-lg"></div>');
  // ... más clearfix para diferentes pantallas
}
```

**Características principales**:
- **Limpieza del contenedor**: Vacía el contenedor antes de mostrar nuevos productos
- **Validación**: Verifica si hay productos para mostrar
- **Ordenamiento**: Ordena productos por código numérico
- **Imágenes dinámicas**: Soporte para imágenes personalizadas y estándar
- **Etiquetas especiales**: Genera badges para "Más Vendido" y "Oferta"
- **Template HTML**: Crea el HTML de cada producto dinámicamente
- **Responsive Design**: Agrega clearfix para diferentes tamaños de pantalla

---

### 6️⃣ **GESTIÓN DEL CARRITO**

#### Event Listener: Agregar al Carrito

```javascript
$(document).on("click", ".btn-carrito", function (e) {
  e.preventDefault();
  
  var productoCard = $(this).closest(".producto-card");
  var nombreProducto = productoCard.find(".producto-nombre").text();
  var precioProducto = productoCard.find(".precio").text();
  
  var productoExistente = productoaggCarrito.find(function (producto) {
    return producto.nombre === nombreProducto;
  });
  
  if (productoExistente) {
    productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    mostrarToast(`Cantidad actualizada: ${productoExistente.cantidad} unidades...`, "¡Producto actualizado!", "info");
  } else {
    var producto = {
      nombre: nombreProducto,
      precio: precioProducto,
      cantidad: 1,
    };
    productoaggCarrito.push(producto);
    mostrarToast(`${nombreProducto} ha sido agregado a tu carrito`, "¡Producto agregado!", "success");
  }
  
  actualizarContadorCarrito();
});
```

**Flujo de agregado**:
1. **Prevención**: `e.preventDefault()` evita comportamiento por defecto
2. **Extracción**: Obtiene datos del producto desde el HTML
3. **Verificación**: Busca si el producto ya existe en el carrito
4. **Actualización**: Si existe, incrementa cantidad; si no, lo agrega
5. **Notificación**: Muestra toast de confirmación
6. **UI Update**: Actualiza contador del carrito

---

#### Modal del Carrito

```javascript
$("#btn-carrito").on("click", function (e) {
  e.preventDefault();
  
  const contenedor = $("#contenidoCarrito");
  contenedor.empty();
  
  if (!Array.isArray(productoaggCarrito) || productoaggCarrito.length === 0) {
    contenedor.append(`<tr><td colspan="6" class="text-center">No hay productos disponibles.</td></tr>`);
    $("#fila-total").hide();
  } else {
    let totalGeneral = 0;
    
    productoaggCarrito.forEach(function (producto, index) {
      // Lógica de imágenes
      var imagenUrl = producto.imagenPersonalizada ? 
          producto.imagenPersonalizada : 
          "images/" + producto.nombre.trim() + ".png";
      
      // Cálculos
      var precioNumerico = parseFloat(producto.precio.replace(/[^\d.]/g, ""));
      var cantidad = producto.cantidad || 1;
      var subtotal = precioNumerico * cantidad;
      totalGeneral += subtotal;
      
      // Generación de fila de tabla
      contenedor.append(`<tr>...</tr>`);
    });
    
    $("#total-carrito").text("L " + totalGeneral.toFixed(2));
    $("#fila-total").show();
  }
  
  $("#modalCarrito").modal("show");
});
```

**Funcionalidades del modal**:
- **Limpieza**: Vacía contenido anterior
- **Validación**: Verifica si hay productos
- **Cálculos**: Precio, cantidad, subtotales y total general
- **Generación**: Crea filas de tabla dinámicamente
- **Controles**: Inputs para cantidad y botones de eliminación

---

### 7️⃣ **DETALLES DE PRODUCTOS**

#### Modal de Detalles

```javascript
$(document).on("click", ".btn-detalles", function (e) {
  e.preventDefault();
  
  var productoCard = $(this).closest(".producto-card");
  var nombreProducto = productoCard.find(".producto-nombre").text();
  
  var productoCompleto = todosLosProductos.find(function (producto) {
    return producto.nombre === nombreProducto;
  });
  
  if (productoCompleto) {
    mostrarDetallesProducto(productoCompleto);
  }
});

function mostrarDetallesProducto(producto) {
  var nombreImagen = producto.nombre.trim() + ".png";
  var imagenUrl = "images/" + nombreImagen;
  
  $("#detalle-imagen").attr("src", imagenUrl).attr("alt", producto.nombre);
  $("#detalle-nombre").text(producto.nombre);
  $("#detalle-codigo").text("Código: " + (producto.codigo || "N/A"));
  $("#detalle-categoria").text(producto.categoria || "Sin categoría");
  $("#detalle-precio").text(parseInt(producto.precio).toFixed(2) + " LPS");
  $("#detalle-descripcion").text(producto.descripcion || "Sin descripción disponible");
  
  $(".btn-agregar-desde-detalle").data("producto", producto);
  $("#modalDetalles").modal("show");
}
```

**Proceso de visualización**:
1. **Identificación**: Encuentra el producto en el array global
2. **Población**: Llena elementos del modal con datos del producto
3. **Datos**: Almacena información del producto en el botón
4. **Visualización**: Muestra el modal

---

### 8️⃣ **FUNCIONES DE FILTRADO**

#### `filtrarPorCategoria(categoria)`

```javascript
function filtrarPorCategoria(categoria) {
  var productosFiltrados = todosLosProductos.filter(function (producto) {
    return (
      producto.categoria &&
      producto.categoria.toLowerCase() === categoria.toLowerCase()
    );
  });
  mostrarProductos(productosFiltrados);
}
```

#### `filtrarPorVendidos(masvendidos)`

```javascript
function filtrarPorVendidos(masvendidos) {
  var productosFiltrados = todosLosProductos.filter(function (producto) {
    return (
      producto.masvendidos &&
      producto.masvendidos.toLowerCase() === masvendidos.toLowerCase()
    );
  });
  mostrarProductos(productosFiltrados);
}
```

**Características del filtrado**:
- **Case-insensitive**: Comparaciones en minúsculas
- **Flexibilidad**: Filtra por cualquier categoría o estado
- **Reutilización**: Usa `mostrarProductos()` para visualización

---

### 9️⃣ **NAVEGACIÓN POR CATEGORÍAS**

Cada categoría tiene su propio event listener:

```javascript
$("#btn-Audifono").click(function (e) {
  e.preventDefault();
  filtrarPorCategoria("Audifonos");
  $(".productos-seccion h2").text("Audifonos");
  actualizarNavegacionActiva($("#nav-categorias"));
});

$("#btn-Pantalla").click(function (e) {
  e.preventDefault();
  filtrarPorCategoria("Monitores");
  $(".productos-seccion h2").text("Pantallas");
  actualizarNavegacionActiva($("#nav-categorias"));
});

// ... más categorías
```

**Patrón común**:
1. **Prevención**: Evita comportamiento por defecto
2. **Filtrado**: Llama a `filtrarPorCategoria()`
3. **UI Update**: Actualiza título de la sección
4. **Navegación**: Marca elemento como activo

---

## 🍞 SISTEMA DE NOTIFICACIONES TOAST

### `mostrarToast(mensaje, titulo, tipo)`

```javascript
function mostrarToast(mensaje, titulo = "¡Éxito!", tipo = "success") {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${tipo}`;
  
  const iconos = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle", 
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  };
  
  toast.innerHTML = `
    <button class="toast-close" onclick="cerrarToast(this)">&times;</button>
    <div class="toast-header">
      <i class="toast-icon ${iconos[tipo] || iconos.success}"></i>
      <p class="toast-title">${titulo}</p>
    </div>
    <p class="toast-message">${mensaje}</p>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => { toast.classList.add("show"); }, 100);
  setTimeout(() => { cerrarToast(toast.querySelector(".toast-close")); }, 4000);
}
```

**Características**:
- **Tipos**: success, error, warning, info
- **Iconos dinámicos**: FontAwesome icons según el tipo
- **Auto-close**: Se cierra automáticamente después de 4 segundos
- **Animaciones**: CSS transitions para suavidad
- **Stacking**: Múltiples toasts se apilan verticalmente

---

## 📊 ARCHIVOS JSON

### `diccionario.json` - Base de Datos de Productos

```json
{
  "productos": [
    {
      "codigo": "P001",
      "nombre": "iPhone 15 Pro",
      "descripcion": "El último iPhone con tecnología Pro",
      "precio": "50000",
      "categoria": "Telefonos",
      "masvendidos": "True",
      "oferta": "True"
    }
  ]
}
```

**Campos obligatorios**:
- `codigo`: Identificador único (P001, P002, etc.)
- `nombre`: Nombre del producto (debe coincidir con imagen en `/images/`)
- `descripcion`: Descripción detallada
- `precio`: Precio en lempiras
- `categoria`: Categoría para filtrado
- `masvendidos`: "True"/"False" para etiqueta de más vendido
- `oferta`: "True"/"False" para etiqueta de oferta

### `configuracion_etiquetas.json` - Configuración de Etiquetas

```json
{
  "configuracion_etiquetas": {
    "productos_mas_vendidos": ["P001", "P003", "P005"],
    "productos_en_oferta": ["P001", "P005", "P010"],
    "productos_destacados": {
      "descripcion": "Productos con ambas etiquetas",
      "codigos": ["P001", "P005", "P010"]
    }
  }
}
```

**⚠️ Nota importante**: Este archivo ya no tiene funcionalidad activa en el código actual, pero se mantiene para referencia futura.

---

## 🎨 SISTEMA DE ETIQUETAS

### Etiquetas Visuales

Las etiquetas se generan dinámicamente en `mostrarProductos()`:

```javascript
var etiquetasEspeciales = '';

// Etiqueta "Más Vendido"
if (producto.masvendidos && producto.masvendidos.toLowerCase() === 'true') {
  etiquetasEspeciales += '<div class="etiqueta-especial etiqueta-mas-vendido"><i class="fas fa-fire"></i> Más Vendido</div>';
}

// Etiqueta "Oferta"
if (producto.oferta && producto.oferta.toLowerCase() === 'true') {
  etiquetasEspeciales += '<div class="etiqueta-especial etiqueta-oferta"><i class="fas fa-tag"></i> Oferta</div>';
}
```

**Características**:
- **Iconos**: FontAwesome para visual appeal
- **CSS Classes**: `.etiqueta-mas-vendido`, `.etiqueta-oferta`
- **Posicionamiento**: Absolute positioning sobre la imagen
- **Responsive**: Se adaptan a diferentes tamaños de pantalla

---

## 🔧 FUNCIONES AUXILIARES

### `agregarAlCarrito(nombre, precio)`

```javascript
function agregarAlCarrito(nombre, precio) {
  var precioLimpio = typeof precio === 'string' ? 
      precio.replace(/[^0-9.]/g, '') : precio.toString();
  var precioFormateado = parseInt(precioLimpio) + ".00 lps";
  
  var productoExistente = productoaggCarrito.find(function (producto) {
    return producto.nombre === nombre;
  });
  
  if (productoExistente) {
    productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    mostrarToast(`Cantidad actualizada: ${productoExistente.cantidad} unidades de ${nombre}`, "¡Producto actualizado!", "info");
  } else {
    var producto = { nombre: nombre, precio: precioFormateado, cantidad: 1 };
    productoaggCarrito.push(producto);
    mostrarToast(`${nombre} ha sido agregado a tu carrito`, "¡Producto agregado!", "success");
  }
  
  actualizarContadorCarrito();
}
```

**Uso**: Función reutilizable para agregar productos desde cualquier parte de la aplicación.

---

## 📱 RESPONSIVE DESIGN

### Clearfix para Grid System

```javascript
// Bootstrap responsive clearfix
productosContainer.find('.producto-col:nth-child(4n)').after('<div class="clearfix visible-lg"></div>');
productosContainer.find('.producto-col:nth-child(3n)').after('<div class="clearfix visible-md"></div>');
productosContainer.find('.producto-col:nth-child(2n)').after('<div class="clearfix visible-sm"></div>');
```

**Breakpoints**:
- **Large (lg)**: 4 productos por fila
- **Medium (md)**: 3 productos por fila  
- **Small (sm)**: 2 productos por fila
- **Extra Small (xs)**: 1 producto por fila

---

## 🛠️ MANEJO DE ERRORES

### Carga de JSON

```javascript
.fail(function (jqXHR, textStatus, errorThrown) {
  console.error("Error al cargar productos:", textStatus, errorThrown);
  $("#productos-container").html(
    '<div class="col-md-12"><p class="text-center text-danger">Error al cargar los productos. Por favor, intente de nuevo más tarde.</p></div>'
  );
});
```

### Imágenes con Fallback

```html
<img src="${imagenUrl}" alt="${producto.nombre}" onerror="this.src='images/Laptop Dell.png';">
```

**Estrategias**:
- **Logging**: Console.error para debugging
- **UI Feedback**: Mensajes de error visibles al usuario
- **Fallback Images**: Imagen por defecto si falla la carga
- **Graceful Degradation**: La app sigue funcionando aunque fallen algunos componentes

---

## 🔍 DEBUGGING Y MONITORING

### Console Logging

El script incluye varios `console.log()` para debugging:

```javascript
console.error("Error al cargar productos:", textStatus, errorThrown);
```

### Recomendaciones para Debugging

1. **Abrir DevTools**: F12 en el navegador
2. **Console Tab**: Ver errores y logs
3. **Network Tab**: Verificar carga de archivos JSON e imágenes
4. **Elements Tab**: Inspeccionar DOM generado dinámicamente

---

## 📋 MANTENIMIENTO Y ACTUALIZACIONES

### Agregar Nuevos Productos

1. **Agregar imagen**: Subir `Nombre del Producto.png` a `/images/`
2. **Actualizar JSON**: Agregar entrada en `diccionario.json`
3. **Formato de código**: Seguir patrón P001, P002, etc.

### Agregar Nueva Categoría

1. **Crear botón**: Agregar botón en HTML con ID único
2. **Event listener**: Agregar en script.js siguiendo el patrón existente
3. **Actualizar productos**: Asegurar que productos tengan la nueva categoría

### Modificar Etiquetas

Editar directamente en `diccionario.json`:
- `"masvendidos": "True"/"False"`
- `"oferta": "True"/"False"`

---

## 🚀 OPTIMIZACIONES IMPLEMENTADAS

### Performance

- **Event Delegation**: `$(document).on()` para elementos dinámicos
- **Minimal DOM Manipulation**: Batch updates cuando es posible
- **Image Optimization**: Lazy loading implícito con onerror

### UX/UI

- **Loading States**: Mensajes durante carga de datos
- **Smooth Animations**: CSS transitions y jQuery animations
- **Toast Notifications**: Feedback inmediato para acciones del usuario
- **Responsive Design**: Funciona en todos los dispositivos

### Code Quality

- **Modular Structure**: Funciones bien separadas por responsabilidad
- **Consistent Naming**: Convenciones claras para variables y funciones
- **Error Handling**: Manejo robusto de errores
- **Documentation**: Comentarios detallados en el código

---

## 🔐 SEGURIDAD

### Validaciones Implementadas

- **Input Sanitization**: Prevención de XSS en datos de entrada
- **Type Checking**: Validación de tipos de datos
- **Error Boundaries**: Prevención de crashes por datos inválidos

### Recomendaciones Adicionales

- **HTTPS**: Usar protocolo seguro en producción
- **Content Security Policy**: Implementar CSP headers
- **Input Validation**: Validar datos del lado del servidor

---

## 📞 SOPORTE Y CONTACTO

Para dudas técnicas o issues:
1. Revisar este README
2. Verificar console del navegador para errores
3. Validar estructura de archivos JSON
4. Comprobar rutas de imágenes

---

## 📄 LICENCIA

Este proyecto es de uso interno para **Tienda JAD**. Todos los derechos reservados.

---

**Última actualización**: 4 de agosto de 2025  
**Versión del script**: 2.1.0  
**Compatibilidad**: Navegadores modernos (IE11+, Chrome, Firefox, Safari, Edge)
