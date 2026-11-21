import { ReceiptData, AppSettings } from '../types';

export async function exportReceiptAsImage(receipt: ReceiptData, settings: AppSettings, filename = 'struk-pln.png'): Promise<string> {
  try {
    const canvas = generateReceiptCanvas(receipt, settings);
    const dataUrl = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return dataUrl;
  } catch (err) {
    console.error('Export image error:', err);
    alert('Gagal mengekspor gambar: ' + (err as Error).message);
    throw err;
  }
}

export async function shareReceiptImage(receipt: ReceiptData, settings: AppSettings, filename = 'struk-pln.png'): Promise<boolean> {
  try {
    const canvas = generateReceiptCanvas(receipt, settings);
    const dataUrl = canvas.toDataURL('image/png');

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

    if (navigator.share && navigator.canShare) {
      try {
        if (blob && navigator.canShare({ files: [new File([blob], filename, { type: 'image/png' })] })) {
          const file = new File([blob], filename, { type: 'image/png' });
          await navigator.share({
            title: 'Struk Pembayaran Tagihan Listrik PLN',
            text: `Struk PLN - ${receipt.namaPelanggan} (${receipt.idpel})`,
            files: [file],
          });
          return true;
        }
      } catch (shareErr) {
        console.warn('File share failed, trying fallback share:', shareErr);
      }

      try {
        await navigator.share({
          title: 'Struk Pembayaran Tagihan Listrik PLN',
          text: `Struk PLN - ${receipt.namaPelanggan} (${receipt.idpel})`,
          url: window.location.href,
        });
        return true;
      } catch (e) {
        // user aborted
      }
    }

    // Fallback download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Gambar struk berhasil diunduh ke perangkat Anda. Silakan bagikan dari galeri.');
    return true;
  } catch (err) {
    console.error('Share error:', err);
    alert('Gagal membagikan gambar: ' + (err as Error).message);
    return false;
  }
}

function generateReceiptCanvas(receipt: ReceiptData, settings: AppSettings): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 1750;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Background white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#000000';
  ctx.font = '900 48px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';

  let y = 90;

  // Header Title
  ctx.fillText(settings.loketTitle.toUpperCase(), canvas.width / 2, y);
  y += 60;

  ctx.font = '900 34px "Courier New", Courier, monospace';
  ctx.fillStyle = '#000000';
  ctx.fillText(settings.loketAddress, canvas.width / 2, y);
  y += 55;

  // Dashed separator line
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(70, y);
  ctx.lineTo(canvas.width - 70, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += 65;

  // Receipt Banner Title
  ctx.fillStyle = '#000000';
  ctx.fillRect(70, y - 44, canvas.width - 140, 76);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px "Courier New", Courier, monospace';
  ctx.fillText('STRUK PEMBAYARAN TAGIHAN LISTRIK', canvas.width / 2, y + 8);
  y += 95;

  // Details
  ctx.font = '900 36px "Courier New", Courier, monospace';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';

  const leftX = 90;
  const colonX = 390;
  const rightX = 440;

  const drawRow = (label: string, value: string) => {
    ctx.fillStyle = '#000000';
    ctx.fillText(label, leftX, y);
    ctx.fillText(':', colonX, y);
    ctx.fillText(value, rightX, y);
    y += 60;
  };

  const formatCurrency = (amount: number) => 'Rp ' + amount.toLocaleString('id-ID');

  drawRow('Tgl / Waktu', receipt.tanggal);
  drawRow('No. Ref', receipt.noRef);
  drawRow('IDPel', receipt.idpel);
  drawRow('Nama', receipt.namaPelanggan);
  drawRow('Tarif / Daya', receipt.tarifDaya);
  drawRow('BLN / THN', receipt.blnThn);
  drawRow('Stand Meter', receipt.standMeter);

  // Dashed separator line
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(70, y);
  ctx.lineTo(canvas.width - 70, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += 65;

  drawRow('Rp Tag PLN', formatCurrency(receipt.rpTagPln));
  drawRow('Admin Bank', formatCurrency(receipt.adminBank));

  // Dashed separator line
  ctx.strokeStyle = '#000000';
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(70, y);
  ctx.lineTo(canvas.width - 70, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += 65;

  // Total Bayar Box
  ctx.fillStyle = '#000000';
  ctx.fillRect(70, y - 48, canvas.width - 140, 86);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 44px "Courier New", Courier, monospace';
  ctx.fillText('TOTAL BAYAR :', leftX + 10, y + 10);
  ctx.textAlign = 'right';
  ctx.fillText(formatCurrency(receipt.totalBayar), canvas.width - 95, y + 10);
  y += 120;

  // Footer
  ctx.textAlign = 'center';
  ctx.font = '900 28px "Courier New", Courier, monospace';
  ctx.fillStyle = '#000000';
  ctx.fillText('SIMPAN STRUK INI SEBAGAI BUKTI PEMBAYARAN YANG SAH.', canvas.width / 2, y);
  y += 50;
  ctx.font = '900 38px "Courier New", Courier, monospace';
  ctx.fillText('TERIMAKASIH', canvas.width / 2, y);

  return canvas;
}
