const XLSX = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, 'Resumen_Organizado_Ventas_Banhh_Mi.xlsx');
const workbook = XLSX.readFile(excelPath);

console.log('Sheets in Resumen:', workbook.SheetNames);

workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n--- Sheet: ${sheetName} ---`);
  console.log('Rows count:', data.length);
  console.log('First 10 rows:');
  for (let i = 0; i < Math.min(10, data.length); i++) {
    console.log(`Row ${i}:`, data[i]);
  }
});
