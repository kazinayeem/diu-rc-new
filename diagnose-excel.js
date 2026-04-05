const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Find Excel files in common locations
const searchPaths = [
  './',
  './public/templates/',
  './uploads/',
  require('os').homedir() + '/Downloads/'
];

let excelFile = null;

for (const searchPath of searchPaths) {
  if (fs.existsSync(searchPath)) {
    const files = fs.readdirSync(searchPath);
    const excel = files.find(f => f.endsWith('.xlsx') || f.endsWith('.xls'));
    if (excel) {
      excelFile = path.join(searchPath, excel);
      break;
    }
  }
}

if (!excelFile) {
  console.log('❌ No Excel file found in:', searchPaths);
  process.exit(1);
}

console.log(`\n📄 Found Excel file: ${excelFile}\n`);

try {
  const workbook = XLSX.readFile(excelFile, {
    cellDates: false,
    raw: false,
  });
  
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  
  console.log(`📊 Total rows: ${rows.length}`);
  console.log(`📝 Column names: ${Object.keys(rows[0] || {}).join(', ')}\n`);
  
  // Show first 3 rows
  console.log('📌 First 3 data rows:');
  rows.slice(0, 3).forEach((row, idx) => {
    console.log(`\nRow ${idx + 1}:`);
    Object.entries(row).forEach(([key, val]) => {
      console.log(`  ${key}: "${val}"`);
    });
  });
  
  // Check for empty values
  console.log('\n\n🔍 Data Completeness Analysis:');
  const cols = Object.keys(rows[0] || {});
  cols.forEach(col => {
    const empty = rows.filter(r => !r[col] || String(r[col]).trim() === '').length;
    const filled = rows.length - empty;
    console.log(`  ${col}: ${filled}/${rows.length} filled (${(filled/rows.length*100).toFixed(1)}%)`);
  });
  
} catch (error) {
  console.error('Error reading Excel:', error.message);
}
