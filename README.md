# Punto de Venta "Banh Mi" 🥖

¡Bienvenido al sistema POS para **Banh Mi**! Este software te permite gestionar tu restaurante con sincronización en tiempo real entre tu casa (Rol Maestro) y el local (Rol Cajero).

---

## ⚡ 1. Pruébalo de Inmediato (Modo Local / Sin Conexión)

No necesitas instalar absolutamente nada en tu computadora para probar la interfaz y el funcionamiento general:

1. Ve a la carpeta `public` dentro de este proyecto:
   `C:\Users\Alejandro\.gemini\antigravity\scratch\vietnamese-pos\public\`
2. Da **doble clic** en el archivo **`index.html`** para abrirlo en tu navegador web (Google Chrome, Edge, Safari, etc.).
3. El sistema detectará automáticamente que estás en modo local y se iniciará en **"Modo Local (Archivo)"** (verás un indicador de color naranja en la parte superior).
4. **¡Pruébalo!**
   * **Cajero**: Selecciona una mesa, ve a la pestaña "Agregar Platillos", selecciona un Bánh Mì o Phở, personalízalo y agrégalo. Realiza el cobro, selecciona efectivo/tarjeta y al dar clic en "Confirmar" verás cómo se abre el diálogo de impresión con el diseño para tu ticket de **80mm**.
   * **Maestro**: Regresa al login, selecciona "Maestro", ingresa el PIN por defecto **`1234`**, y podrás ver las analíticas, el historial de las ventas que acabas de simular, y editar los precios de los productos.

*Nota: En el modo local sin servidor, todos tus datos (mesas, órdenes, ventas e historial de menú) se guardarán de forma segura en la memoria de tu propio navegador (`localStorage`).*

---

## ☁️ 2. Despliegue en la Nube Gratis (Para sincronizar Casa y Local)

Para que la computadora de tu casa (Maestro) y la del restaurante (Cajero) compartan la misma información en tiempo real, el sistema debe correr en internet. La forma más sencilla y gratis de hacerlo es con **Render**:

### Paso 1: Subir el código a GitHub
1. Crea una cuenta gratuita en [GitHub](https://github.com/) si aún no la tienes.
2. Crea un repositorio privado o público con el nombre `banh-mi-pos`.
3. Sube todos los archivos de esta carpeta (`vietnamese-pos/`) a tu repositorio.

### Paso 2: Crear el servicio en Render
1. Ve a [Render.com](https://render.com/) y regístrate gratis (puedes iniciar sesión con tu cuenta de GitHub).
2. En tu panel de Render, da clic en el botón **"New"** (Nuevo) y selecciona **"Web Service"** (Servicio Web).
3. Conecta tu cuenta de GitHub y selecciona tu repositorio `banh-mi-pos`.
4. Rellena los datos de configuración:
   * **Name**: `banh-mi-pos`
   * **Region**: Selecciona la más cercana a ti.
   * **Branch**: `main` (o la rama donde esté tu código).
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
   * **Instance Type**: Selecciona **"Free"** ($0 USD/mes).
5. Da clic en **"Create Web Service"**.

### Paso 3: ¡Listo!
Render comenzará a construir y desplegar tu servidor. En unos minutos te dará un enlace público (por ejemplo: `https://banh-mi-pos.onrender.com`).

* **En el Restaurante**: Abre ese enlace en el navegador de la computadora de la caja e inicia sesión como **Cajero**.
* **En Casa**: Abre el mismo enlace en tu computadora e ingresa como **Maestro** (con tu PIN `1234`).

¡A partir de ese momento, cualquier orden tomada en el local se verá reflejada al instante en tu panel de casa, y cualquier cambio de precios que hagas en casa actualizará la caja en tiempo real!
