import html2canvas from 'html2canvas';

export async function exportReceiptAsImage(element: HTMLElement, filename = 'struk-pln.png'): Promise<string> {
  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High resolution
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return dataUrl;
  } catch (err) {
    console.error('Export image error:', err);
    throw err;
  }
}

export async function shareReceiptImage(element: HTMLElement, filename = 'struk-pln.png'): Promise<boolean> {
  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Gagal membuat blob gambar.');

    const file = new File([blob], filename, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Struk Pembayaran Tagihan Listrik PLN',
        text: 'Berikut adalah bukti pembayaran tagihan listrik PLN Anda.',
        files: [file],
      });
      return true;
    } else if (navigator.share) {
      await navigator.share({
        title: 'Struk Pembayaran Tagihan Listrik PLN',
        text: 'Berikut adalah bukti pembayaran tagihan listrik PLN.',
        url: window.location.href,
      });
      return true;
    } else {
      // Fallback download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('Fitur Web Share tidak didukung langsung di browser ini. Gambar telah didownload.');
      return false;
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.error('Share error:', err);
      throw err;
    }
    return false;
  }
}
