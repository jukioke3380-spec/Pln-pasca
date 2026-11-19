import { createWorker } from 'tesseract.js';
import { ReceiptData } from '../types';

export async function recognizeReceiptImage(
  imageSource: string | File | Blob,
  defaultCustomerName = 'BATARA BEKASI',
  onProgress?: (progress: number, status: string) => void
): Promise<Partial<ReceiptData>> {
  const worker = await createWorker('ind+eng');

  try {
    if (onProgress) {
      onProgress(0.2, 'Memulai OCR Tesseract...');
    }

    const ret = await worker.recognize(imageSource);
    const text = ret.data.text;

    if (onProgress) {
      onProgress(0.9, 'Mengekstrak data struk PLN...');
    }

    await worker.terminate();

    return parseReceiptText(text, defaultCustomerName);
  } catch (err) {
    await worker.terminate();
    console.error('OCR Error:', err);
    throw err;
  }
}

function parseReceiptText(text: string, defaultCustomerName = 'BATARA BEKASI'): Partial<ReceiptData> {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  
  let idpel = '';
  let namaPelanggan = '';
  let tarifDaya = '';
  let blnThn = '';
  let standMeter = '';
  let rpTagPln = 0;
  let noRef = '';
  let tanggal = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // Regex helpers
  const idpelRegex = /(?:idpel|no\.?\s*pel|pelanggan|meter)\D*(\d{10,12})/i;
  const nameRegex = /(?:nama|nma)\D*[:]\s*([A-Z\s]+)/i;
  const tarifRegex = /(?:tarif|daya)\D*([A-Z0-9\/]+\s*\/\s*\d+VA)/i;
  const blnRegex = /(?:bln|bulan|bln\/thn)\D*([A-Z0-9\/]+)/i;
  const standRegex = /(?:stand|meter)\D*([\d\s-]+)/i;
  const nominalRegex = /(?:rp|jml|tagihan|total)\D*([\d.,]+)/i;
  const refRegex = /(?:ref|nora|no\.?\s*ref|trx)\D*([A-Z0-9]+)/i;

  for (const line of lines) {
    // IDPEL
    if (!idpel) {
      const match = line.match(idpelRegex) || line.match(/\b(5\d{11}|3\d{11}|\d{12})\b/);
      if (match) idpel = match[1] || match[0];
    }

    // Nama
    if (!namaPelanggan) {
      const match = line.match(nameRegex);
      if (match) {
        namaPelanggan = match[1].trim();
      } else if (line.toUpperCase() === line && line.length > 5 && !line.includes('PLN') && !line.includes('LOKET')) {
        if (/^[A-Z\s,.]+$/.test(line) && !line.includes('RP') && !line.includes('TANGGAL')) {
          if (line.split(' ').length >= 2) {
            namaPelanggan = line;
          }
        }
      }
    }

    // Tarif / Daya
    if (!tarifDaya) {
      const match = line.match(tarifRegex) || line.match(/([RL]\d[A-Z]?\s*\/\s*\d+VA)/i);
      if (match) tarifDaya = match[1] || match[0];
    }

    // BLN/THN
    if (!blnThn) {
      const match = line.match(blnRegex) || line.match(/(\d{2}\/\d{2}|\b(?:JAN|FEB|MAR|APR|MEI|JUN|JUL|AGU|SEP|OKT|NOV|DES)\d{2}\b)/i);
      if (match) blnThn = match[1] || match[0];
    }

    // Rp Tag PLN
    if (rpTagPln === 0) {
      const match = line.match( /(?:rp\.?|tag)\D*([\d.,]{4,})/i ) || line.match(/\b([1-9]\d{0,2}(?:\.\d{3})+)\b/);
      if (match) {
        const cleaned = match[1].replace(/\./g, '').replace(/,/g, '');
        const val = parseInt(cleaned, 10);
        if (val > 10000 && val < 50000000) {
          rpTagPln = val;
        }
      }
    }

    // No Ref
    if (!noRef) {
      const match = line.match(refRegex);
      if (match) noRef = match[1];
    }
  }

  // Fallbacks if OCR misses some fields
  if (!idpel) idpel = '54210' + Math.floor(1000000 + Math.random() * 9000000);
  if (!namaPelanggan) namaPelanggan = defaultCustomerName || 'BATARA BEKASI';
  if (!tarifDaya) tarifDaya = 'R1/1300VA';
  if (!blnThn) {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const y = String(d.getFullYear()).substring(2);
    blnThn = `${m}/${y}`;
  }
  if (!standMeter) standMeter = '001245-001389';
  if (rpTagPln === 0) rpTagPln = 95500;
  if (!noRef) noRef = 'REF' + Math.floor(100000000 + Math.random() * 900000000);

  return {
    tanggal,
    noRef,
    idpel,
    namaPelanggan,
    tarifDaya,
    blnThn,
    standMeter,
    rpTagPln,
  };
}

export function generateRandomReceipt(defaultCustomerName = 'BATARA BEKASI'): ReceiptData {
  const d = new Date();
  const tanggal = d.toISOString().replace('T', ' ').substring(0, 19);
  const noRef = 'REF' + Math.floor(100000000 + Math.random() * 900000000);
  const idpel = '54' + Math.floor(1000000000 + Math.random() * 9000000000);
  
  const namaPelanggan = defaultCustomerName || 'BATARA BEKASI';
  
  const tariffs = ['R1/900VA', 'R1M/1300VA', 'R1/2200VA', 'B2/3500VA'];
  const tarifDaya = tariffs[Math.floor(Math.random() * tariffs.length)];
  
  const mNum = String(d.getMonth() + 1).padStart(2, '0');
  const yNum = String(d.getFullYear()).substring(2);
  const blnThn = `${mNum}/${yNum}`;
  
  const stand1 = Math.floor(100000 + Math.random() * 500000);
  const stand2 = stand1 + Math.floor(50 + Math.random() * 300);
  const standMeter = `${String(stand1).padStart(6, '0')}-${String(stand2).padStart(6, '0')}`;
  
  const rpTagPln = Math.floor(75000 + Math.random() * 350000);
  const adminBank = 5000;
  const totalBayar = rpTagPln + adminBank;

  return {
    id: 'RCP-' + Date.now(),
    tanggal,
    noRef,
    idpel,
    namaPelanggan,
    tarifDaya,
    blnThn,
    standMeter,
    rpTagPln,
    adminBank,
    totalBayar,
    status: 'SUCCESS',
  };
}
