const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Cargar estado inicial desde database.json
let db = { settings: { masterPin: "1234", taxRate: 0.16, serviceRate: 0.10 }, menu: [], tables: [], sales: [] };

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
      console.log('Base de datos cargada correctamente.');
    } else {
      saveDatabase();
      console.log('Base de datos creada por defecto.');
    }
  } catch (error) {
    console.error('Error al cargar la base de datos:', error);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al guardar la base de datos:', error);
  }
}

loadDatabase();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API simple para verificar el PIN del Maestro
app.post('/api/auth', (req, res) => {
  const { pin } = req.body;
  if (pin === db.settings.masterPin) {
    return res.json({ success: true, token: "master-session-token-1234" }); // Token simple simulado
  }
  return res.status(401).json({ success: false, message: "PIN incorrecto" });
});

// WebSocket Handler
wss.on('connection', (ws) => {
  console.log('Cliente conectado por WebSocket');

  // Enviar estado inicial al conectar
  ws.send(JSON.stringify({
    type: 'INITIAL_STATE',
    payload: {
      menu: db.menu,
      tables: db.tables,
      settings: {
        taxRate: db.settings.taxRate,
        serviceRate: db.settings.serviceRate
      },
      // Solo enviamos un resumen de ventas para no saturar al cliente
      salesCount: db.sales.length,
      salesToday: calculateSalesToday()
    }
  }));

  ws.on('message', (message) => {
    try {
      const { type, payload, pin } = JSON.parse(message);
      console.log(`Evento recibido: ${type}`);

      // Para acciones administrativas se requiere validar el PIN
      const isAdminAction = ['MENU_UPDATE', 'GET_SALES_REPORT', 'UPDATE_SETTINGS'].includes(type);
      if (isAdminAction && pin !== db.settings.masterPin) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: 'No autorizado. PIN inválido.' }));
        return;
      }

      switch (type) {
        case 'ORDER_UPDATE':
          // payload: { tableId, currentOrder, status }
          const tableIndex = db.tables.findIndex(t => t.id === payload.tableId);
          if (tableIndex !== -1) {
            db.tables[tableIndex].currentOrder = payload.currentOrder;
            db.tables[tableIndex].status = payload.status; // 'free' | 'occupied' | 'billing'
            saveDatabase();
            // Broadcast a todos
            broadcast({ type: 'TABLE_STATUS_UPDATE', payload: db.tables });
          }
          break;

        case 'PAY_ORDER':
          // payload: { tableId, paymentMethod, discount }
          const table = db.tables.find(t => t.id === payload.tableId);
          if (table && table.currentOrder) {
            // Registrar venta
            const orderTotal = calculateOrderTotal(table.currentOrder, payload.discount || 0);
            const newSale = {
              id: 'sale-' + Date.now(),
              tableId: table.id,
              tableName: table.name,
              items: table.currentOrder.items,
              subtotal: orderTotal.subtotal,
              tax: orderTotal.tax,
              service: orderTotal.service,
              discount: payload.discount || 0,
              total: orderTotal.total,
              paymentMethod: payload.paymentMethod, // 'cash' | 'card' | 'qr'
              date: new Date().toISOString()
            };

            db.sales.push(newSale);

            // Liberar mesa
            table.currentOrder = null;
            table.status = 'free';
            saveDatabase();

            // Enviar actualizaciones a todos
            broadcast({ type: 'TABLE_STATUS_UPDATE', payload: db.tables });
            broadcast({
              type: 'SALES_UPDATE',
              payload: {
                salesCount: db.sales.length,
                salesToday: calculateSalesToday()
              }
            });
            // Si el cliente que pagó espera una confirmación, le mandamos el recibo registrado
            ws.send(JSON.stringify({ type: 'PAY_SUCCESS', payload: newSale }));
          }
          break;

        case 'MENU_UPDATE':
          // payload: completo array de menú modificado
          db.menu = payload;
          saveDatabase();
          broadcast({ type: 'MENU_UPDATE', payload: db.menu });
          break;

        case 'GET_SALES_REPORT':
          // Enviar reporte completo al Maestro
          ws.send(JSON.stringify({ type: 'SALES_REPORT', payload: db.sales }));
          break;

        case 'PING':
          ws.send(JSON.stringify({ type: 'PONG' }));
          break;

        default:
          console.warn(`Tipo de evento no manejado: ${type}`);
      }
    } catch (err) {
      console.error('Error procesando mensaje WS:', err);
      ws.send(JSON.stringify({ type: 'ERROR', payload: 'Error de formato de mensaje.' }));
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Helpers
function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function calculateOrderTotal(order, discount = 0) {
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal - (subtotal / (1 + db.settings.taxRate)); // IVA ya incluido en el precio
  const service = subtotal * db.settings.serviceRate; // Servicio sugerido (informativo)
  const total = Math.max(0, subtotal - discount); // El total no suma el servicio por ser sugerido
  return { subtotal, tax, service, total };
}

function calculateSalesToday() {
  const today = new Date().toISOString().split('T')[0];
  return db.sales
    .filter(sale => sale.date.startsWith(today))
    .reduce((sum, sale) => sum + sale.total, 0);
}

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor POS "Banh Mi" corriendo en http://localhost:${PORT}`);
});
