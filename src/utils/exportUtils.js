import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

// Export to Excel function
export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
  // Generate Excel file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Export to PDF function
export const exportToPDF = (data, title) => {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data to export");
    return;
  }

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  const startX = 14;
  let startY = 30;
  const rowHeight = 10;

  const keys = Object.keys(data[0]);
  const columnWidth = 180 / keys.length;

  // Draw headers
  doc.setFontSize(12);
  keys.forEach((key, i) => {
    doc.text(key, startX + i * columnWidth, startY);
  });

  startY += rowHeight;

  // Draw rows
  data.forEach((row) => {
    keys.forEach((key, i) => {
      const text = String(row[key]);
      doc.text(text, startX + i * columnWidth, startY);
    });
    startY += rowHeight;
  });

  doc.save(`${title}.pdf`);
};