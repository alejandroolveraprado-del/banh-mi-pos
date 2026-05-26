const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');
const exactExcelPath = path.join(__dirname, 'BANHH MI VENTAS 2026.xlsx');
const resumenExcelPath = path.join(__dirname, 'Resumen_Organizado_Ventas_Banhh_Mi.xlsx');

if (!fs.existsSync(dbPath)) {
  console.error('database.json not found!');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Helper to parse dates
function parseSpanishDate(dateStr) {
  if (!dateStr) return null;
  let cleanStr = String(dateStr).trim().toLowerCase();
  if (cleanStr.includes('total')) return null;

  // Remove day names
  cleanStr = cleanStr.replace(/^(lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)\s+/i, '');

  // Handle "19de" or "20de"
  cleanStr = cleanStr.replace(/(\d+)de/g, '$1 de ');

  // Standardize spaces
  cleanStr = cleanStr.replace(/\s+/g, ' ');

  const regex = /^(\d+)\s*(?:de\s*)?([a-zñáéíóú]+)(?:\s*(?:de\s*)?(\d{4}))?$/i;
  const match = cleanStr.match(regex);
  if (!match) return null;

  const day = parseInt(match[1]);
  const monthName = match[2];
  let year = match[3] ? parseInt(match[3]) : 2026;

  if (year === 2025) {
    year = 2026;
  }

  const months = {
    'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
    'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
  };

  const month = months[monthName];
  if (month === undefined) return null;

  return new Date(year, month, day, 12, 0, 0);
}

// 1. Parse BANHH MI VENTAS 2026.xlsx to get exact maps
const exactMap = {};
if (fs.existsSync(exactExcelPath)) {
  const workbook = XLSX.readFile(exactExcelPath);
  const sheet = workbook.Sheets['CORTES'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  for (let m = 0; m < 12; m++) {
    const colOffset = m * 13;
    let currentDate = null;

    for (let r = 0; r < data.length; r++) {
      const row = data[r];
      if (!row) continue;

      const cellVal = row[colOffset];
      if (cellVal) {
        const parsedDate = parseSpanishDate(cellVal);
        if (parsedDate) {
          currentDate = parsedDate;
          continue;
        }
      }

      const totalsIndicator = row[colOffset + 6];
      if (totalsIndicator && String(totalsIndicator).trim() === 'Totales' && currentDate) {
        const initialCash = Number(row[colOffset + 0] || 0);
        const cashSales = Number(row[colOffset + 1] || 0);
        const cashTips = Number(row[colOffset + 2] || 0);
        const cardSales = Number(row[colOffset + 3] || 0);
        const cardTips = Number(row[colOffset + 4] || 0);
        const totalExpenses = Number(row[colOffset + 5] || 0);

        if (cashSales > 0 || cardSales > 0 || totalExpenses > 0) {
          const totalSales = cashSales + cardSales;
          const totalTips = cashTips + cardTips;
          const expectedCash = initialCash + cashSales + cashTips - totalExpenses;
          const tipCocina = totalTips * 0.5;
          const tipMeseros = totalTips * 0.5;
          const dateStr = currentDate.toISOString().split('T')[0];

          exactMap[dateStr] = {
            initialCash,
            cashSales,
            cardSales,
            qrSales: 0,
            totalSales,
            cashTips,
            cardTips,
            totalTips,
            crossShiftTipsOut: 0,
            tipCocina,
            tipMeseros,
            totalExpenses,
            expectedCash
          };
        }
        currentDate = null;
      }
    }
  }
}

console.log(`Loaded ${Object.keys(exactMap).length} exact days from BANHH MI VENTAS 2026.xlsx`);

// 2. Parse Resumen_Organizado_Ventas_Banhh_Mi.xlsx (contains all 145 rows)
const resumenWorkbook = XLSX.readFile(resumenExcelPath);
const resumenSheet = resumenWorkbook.Sheets['Detalle de Ventas'];
const resumenData = XLSX.utils.sheet_to_json(resumenSheet, { header: 1 });

const finalClosedShifts = [];
let exactCount = 0;
let approxCount = 0;

// Row 0 is headers
for (let r = 1; r < resumenData.length; r++) {
  const row = resumenData[r];
  if (!row || row.length === 0) continue;

  const dateText = row[0];
  const parsedDate = parseSpanishDate(dateText);
  if (!parsedDate) {
    console.warn(`Could not parse date on row ${r}: ${dateText}`);
    continue;
  }

  const dateStr = parsedDate.toISOString().split('T')[0];

  // If we have exact data, use it!
  if (exactMap[dateStr]) {
    const exact = exactMap[dateStr];
    finalClosedShifts.push({
      id: 'imported-exact-' + dateStr + '-' + Date.now(),
      name: 'Día Completo',
      startedAt: new Date(parsedDate.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      closedAt: parsedDate.toISOString(),
      ...exact,
      closed: true,
      imported: true
    });
    exactCount++;
  } else {
    // Reconstruct with 40/60 approximation
    const totalSales = Number(row[2] || 0);
    const totalTips = Number(row[3] || 0);
    const totalExpenses = Number(row[4] || 0);
    const expectedCash = Number(row[5] || 0);

    const cashSales = totalSales * 0.4;
    const cardSales = totalSales * 0.6;
    const cashTips = totalTips * 0.4;
    const cardTips = totalTips * 0.6;
    const initialCash = expectedCash - cashSales - cashTips + totalExpenses;

    const tipCocina = totalTips * 0.5;
    const tipMeseros = totalTips * 0.5;

    finalClosedShifts.push({
      id: 'imported-approx-' + dateStr + '-' + Date.now(),
      name: 'Día Completo',
      startedAt: new Date(parsedDate.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      closedAt: parsedDate.toISOString(),
      initialCash,
      cashSales,
      cardSales,
      qrSales: 0,
      totalSales,
      cashTips,
      cardTips,
      totalTips,
      crossShiftTipsOut: 0,
      tipCocina,
      tipMeseros,
      totalExpenses,
      expectedCash,
      closed: true,
      imported: true
    });
    approxCount++;
  }
}

// Overwrite closedShifts in db
db.closedShifts = finalClosedShifts;

// Write back to database.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

console.log(`Database updated! Exact days: ${exactCount}, Approximated days: ${approxCount}, Total: ${finalClosedShifts.length}`);
