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

function getAutoShiftName() {
  const hour = new Date().getHours();
  if (hour >= 16 && hour < 22) {
    return "Vespertino";
  }
  return "Matutino";
}

// Cargar estado inicial desde database.json
let db = { 
  settings: { masterPin: "19042609", taxRate: 0.16, serviceRate: 0.15, defaultInitialCash: 1000 }, 
  menu: [], 
  tables: [], 
  sales: [],
  expenses: [],
  activeShift: null,
  closedShifts: []
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
      console.log('Base de datos cargada correctamente.');
      
      // Inicializar campos si no existen
      if (!db.settings.defaultInitialCash) db.settings.defaultInitialCash = 1000;
      if (!db.expenses) db.expenses = [];
      if (!db.closedShifts) db.closedShifts = [];
      if (!db.categories) {
        db.categories = [
          { id: "banhmi", name: "Bánh Mì" },
          { id: "pho", name: "Phở" },
          { id: "entradas", name: "Khai Vị (Entradas)" },
          { id: "bebidas", name: "Bebidas" }
        ];
      }
      if (!db.activeShift) {
        db.activeShift = {
          name: getAutoShiftName(),
          startedAt: new Date().toISOString(),
          initialCash: db.settings.defaultInitialCash
        };
        saveDatabase();
      }
    } else {
      db.categories = [
        { id: "banhmi", name: "Bánh Mì" },
        { id: "pho", name: "Phở" },
        { id: "entradas", name: "Khai Vị (Entradas)" },
        { id: "bebidas", name: "Bebidas" }
      ];
      db.activeShift = {
        name: getAutoShiftName(),
        startedAt: new Date().toISOString(),
        initialCash: 1000
      };
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
      categories: db.categories,
      tables: db.tables,
      settings: {
        taxRate: db.settings.taxRate,
        serviceRate: db.settings.serviceRate,
        defaultInitialCash: db.settings.defaultInitialCash
      },
      activeShift: db.activeShift,
      expenses: db.expenses || [],
      closedShifts: db.closedShifts || [],
      salesCount: db.sales.length,
      salesToday: calculateSalesToday()
    }
  }));

  ws.on('message', (message) => {
    try {
      const { type, payload, pin } = JSON.parse(message);
      console.log(`Evento recibido: ${type}`);

      // Para acciones administrativas se requiere validar el PIN
      const isAdminAction = ['MENU_UPDATE', 'GET_SALES_REPORT', 'UPDATE_SETTINGS', 'CLOSE_SHIFT', 'CATEGORIES_UPDATE', 'UPDATE_HISTORICAL_DATA', 'DELETE_HISTORICAL_DATA', 'ADD_HISTORICAL_RECORD'].includes(type);
      if (isAdminAction && pin !== db.settings.masterPin) {
        ws.send(JSON.stringify({ type: 'ERROR', payload: 'No autorizado. PIN inválido.' }));
        return;
      }

      switch (type) {
        case 'ORDER_UPDATE':
          // payload: { tableId, currentOrder, status }
          const tableIndex = db.tables.findIndex(t => t.id === payload.tableId);
          if (tableIndex !== -1) {
            const oldOrder = db.tables[tableIndex].currentOrder;
            if (payload.currentOrder && (!oldOrder || !oldOrder.items || oldOrder.items.length === 0)) {
              payload.currentOrder.shiftOpened = db.activeShift.name;
            } else if (payload.currentOrder) {
              payload.currentOrder.shiftOpened = (oldOrder && oldOrder.shiftOpened) || db.activeShift.name;
            }
            db.tables[tableIndex].currentOrder = payload.currentOrder;
            db.tables[tableIndex].status = payload.status; // 'free' | 'occupied' | 'billing'
            saveDatabase();
            // Broadcast a todos
            broadcast({ type: 'TABLE_STATUS_UPDATE', payload: db.tables });
          }
          break;

        case 'PAY_ORDER':
          // payload: { tableId, paymentMethod, discount, tip, tipPaymentMethod }
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
              tip: Number(payload.tip || 0),
              tipPaymentMethod: payload.tipPaymentMethod || 'cash', // 'cash' | 'card'
              shift: db.activeShift.name,
              shiftStartedAt: db.activeShift.startedAt,
              openedInShift: table.currentOrder.shiftOpened || db.activeShift.name,
              closed: false,
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
            // Enviar el nuevo estado de ventas y propinas
            broadcast({ type: 'SALES_LIST_UPDATE', payload: db.sales });
            // Si el cliente que pagó espera una confirmación, le mandamos el recibo registrado
            ws.send(JSON.stringify({ type: 'PAY_SUCCESS', payload: newSale }));
          }
          break;

        case 'ADD_EXPENSE':
          // payload: { description, amount }
          const newExpense = {
            id: 'expense-' + Date.now(),
            description: payload.description,
            amount: Number(payload.amount),
            shift: db.activeShift.name,
            shiftStartedAt: db.activeShift.startedAt,
            closed: false,
            date: new Date().toISOString()
          };
          db.expenses.push(newExpense);
          saveDatabase();
          broadcast({ type: 'EXPENSES_UPDATE', payload: db.expenses });
          break;

        case 'DELETE_EXPENSE':
          // payload: { id }
          db.expenses = db.expenses.filter(e => e.id !== payload.id);
          saveDatabase();
          broadcast({ type: 'EXPENSES_UPDATE', payload: db.expenses });
          break;

        case 'CLOSE_SHIFT':
          // payload: { nextInitialCash }
          // Recopilar ventas y gastos no cerrados del turno actual
          const currentSales = db.sales.filter(s => !s.closed && s.shift === db.activeShift.name);
          const currentExpenses = db.expenses.filter(e => !e.closed && e.shift === db.activeShift.name);

          const cashSales = currentSales.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.total, 0);
          const cardSales = currentSales.filter(s => s.paymentMethod === 'card').reduce((sum, s) => sum + s.total, 0);
          const qrSales = currentSales.filter(s => s.paymentMethod === 'qr').reduce((sum, s) => sum + s.total, 0);
          
          const cashTips = currentSales.filter(s => s.tipPaymentMethod === 'cash').reduce((sum, s) => sum + s.tip, 0);
          const cardTips = currentSales.filter(s => s.tipPaymentMethod === 'card').reduce((sum, s) => sum + s.tip, 0);
          
          const totalExpenses = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
          const totalSales = cashSales + cardSales + qrSales;
          const totalTips = cashTips + cardTips;
          
          // Calcular propina cruzada a entregar a personal del turno anterior (50%)
          const crossShiftTipsOut = currentSales.filter(s => s.openedInShift && s.openedInShift !== db.activeShift.name).reduce((sum, s) => sum + s.tip * 0.5, 0);
          const activeShiftTips = Math.max(0, totalTips - crossShiftTipsOut);

          // Total caja: Caja Inicial + Efectivo Ventas + Efectivo Propinas - Gastos
          const expectedCash = db.activeShift.initialCash + cashSales + cashTips - totalExpenses;

          const shiftReport = {
            id: 'shift-' + Date.now(),
            name: db.activeShift.name,
            startedAt: db.activeShift.startedAt,
            closedAt: new Date().toISOString(),
            initialCash: db.activeShift.initialCash,
            cashSales,
            cardSales,
            qrSales,
            totalSales,
            cashTips,
            cardTips,
            totalTips,
            crossShiftTipsOut,
            tipCocina: activeShiftTips * 0.5,
            tipMeseros: activeShiftTips * 0.5,
            totalExpenses,
            expectedCash,
            salesCount: currentSales.length,
            expenses: currentExpenses,
            sales: currentSales
          };

          // Registrar turno cerrado
          db.closedShifts.push(shiftReport);

          // Marcar ventas y gastos como cerrados
          db.sales.forEach(s => {
            if (!s.closed && s.shift === db.activeShift.name) s.closed = true;
          });
          db.expenses.forEach(e => {
            if (!e.closed && e.shift === db.activeShift.name) e.closed = true;
          });

          // Determinar nuevo turno
          const nextShiftName = getAutoShiftName();
          db.activeShift = {
            name: nextShiftName,
            startedAt: new Date().toISOString(),
            initialCash: expectedCash // El fondo inicial siempre es el final del turno anterior
          };

          saveDatabase();

          // Broadcast actualización de turno y base de datos a todos
          broadcast({
            type: 'SHIFT_STATE_UPDATE',
            payload: {
              activeShift: db.activeShift,
              expenses: db.expenses,
              closedShifts: db.closedShifts,
              sales: db.sales
            }
          });
          break;

        case 'MENU_UPDATE':
          // payload: completo array de menú modificado
          db.menu = payload;
          saveDatabase();
          broadcast({ type: 'MENU_UPDATE', payload: db.menu });
          break;

        case 'CATEGORIES_UPDATE':
          // payload: completo array de categorías modificado
          db.categories = payload;
          saveDatabase();
          broadcast({ type: 'CATEGORIES_UPDATE', payload: db.categories });
          break;

        case 'UPDATE_HISTORICAL_DATA': {
          const { target, id, updatedRecord } = payload;
          if (target === 'sales') {
            const idx = db.sales.findIndex(s => s.id === id);
            if (idx !== -1) {
              db.sales[idx] = { ...db.sales[idx], ...updatedRecord };
            }
          } else if (target === 'expenses') {
            const idx = db.expenses.findIndex(e => e.id === id);
            if (idx !== -1) {
              db.expenses[idx] = { ...db.expenses[idx], ...updatedRecord };
            }
          } else if (target === 'closedShifts') {
            const idx = db.closedShifts.findIndex(c => c.id === id);
            if (idx !== -1) {
              db.closedShifts[idx] = { ...db.closedShifts[idx], ...updatedRecord };
            }
          }
          saveDatabase();
          // Broadcast full updated sales report to all Maestros
          broadcast({
            type: 'SALES_REPORT',
            payload: {
              sales: db.sales,
              expenses: db.expenses,
              closedShifts: db.closedShifts
            }
          });
          break;
        }
        case 'DELETE_HISTORICAL_DATA': {
          const { target, id } = payload;
          if (target === 'sales') {
            db.sales = db.sales.filter(s => s.id !== id);
          } else if (target === 'expenses') {
            db.expenses = db.expenses.filter(e => e.id !== id);
          } else if (target === 'closedShifts') {
            db.closedShifts = db.closedShifts.filter(c => c.id !== id);
          }
          saveDatabase();
          broadcast({
            type: 'SALES_REPORT',
            payload: {
              sales: db.sales,
              expenses: db.expenses,
              closedShifts: db.closedShifts
            }
          });
          break;
        }

        case 'ADD_HISTORICAL_RECORD': {
          const { target, record } = payload;
          if (target === 'closedShifts') {
            db.closedShifts.push(record);
          }
          saveDatabase();
          broadcast({
            type: 'SALES_REPORT',
            payload: {
              sales: db.sales,
              expenses: db.expenses,
              closedShifts: db.closedShifts
            }
          });
          break;
        }

        case 'UPDATE_SETTINGS':
          // payload: { defaultInitialCash }
          if (payload.defaultInitialCash !== undefined) {
            db.settings.defaultInitialCash = Number(payload.defaultInitialCash);
            // Siempre actualizar la caja inicial del turno activo actual para reflejar el cambio de inmediato
            db.activeShift.initialCash = db.settings.defaultInitialCash;
          }
          saveDatabase();
          // Broadcast la actualización a todos
          broadcast({
            type: 'SETTINGS_UPDATE',
            payload: {
              settings: db.settings,
              activeShift: db.activeShift
            }
          });
          break;

        case 'GET_SALES_REPORT':
          // Enviar reporte completo al Maestro
          ws.send(JSON.stringify({ 
            type: 'SALES_REPORT', 
            payload: {
              sales: db.sales,
              expenses: db.expenses,
              closedShifts: db.closedShifts
            }
          }));
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
