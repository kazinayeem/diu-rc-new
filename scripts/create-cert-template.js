const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create a sample workbook
const wb = XLSX.utils.book_new();

// Sample data for certificates
const data = [
  {
    'Certificate ID': 'CERT-2026-001',
    'Name': 'John Doe',
    'Email': 'john@example.com',
    'Event': 'Workshop on Electronics',
    'Issue Date': '2026-04-05',
    'Name Filled Up': 'Mr. John Doe'
  },
  {
    'Certificate ID': 'CERT-2026-002',
    'Name': 'Jane Smith',
    'Email': 'jane@example.com',
    'Event': 'Robotics Bootcamp',
    'Issue Date': '2026-04-05',
    'Name Filled Up': 'Ms. Jane Smith'
  },
  {
    'Certificate ID': 'CERT-2026-003',
    'Name': 'Ahmed Hassan',
    'Email': 'ahmed@example.com',
    'Event': 'Seminar on AI',
    'Issue Date': '2026-04-05',
    'Name Filled Up': 'Mr. Ahmed Hassan'
  }
];

// Add the data to the workbook
const ws = XLSX.utils.json_to_sheet(data);

// Set column widths
ws['!cols'] = [
  { wch: 18 },  // Certificate ID
  { wch: 20 },  // Name
  { wch: 25 },  // Email
  { wch: 25 },  // Event
  { wch: 15 },  // Issue Date
  { wch: 20 },  // Name Filled Up
];

XLSX.utils.book_append_sheet(wb, ws, 'Certificates');

// Save the file
const outputPath = path.join(__dirname, '..', 'public', 'templates', 'certificate-import-template.xlsx');

// Create directory if it doesn't exist
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

XLSX.writeFile(wb, outputPath);
console.log(`✓ Certificate template created at: ${outputPath}`);
