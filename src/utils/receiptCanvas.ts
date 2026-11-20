import html2canvas from 'html2canvas';

export async function exportReceiptAsImage(element: HTMLElement, filename = 'struk-pln.png'): Promise<string> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

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

export async function shareReceiptImage(element: HTMLElement, filename = 'struk-pln.png'): Promise<boolean> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

    if (navigator.share && navigator.canShare) {
      try {
        if (blob && navigator.canShare({ files: [new File([blob], filename, { type: 'image/png' })] })) {
          const file = new File([blob], filename, { type: 'image/png' });
          await navigator.share({
            title: 'Struk Pembayaran Tagihan Listrik PLN',
            text: 'Berikut adalah bukti pembayaran tagihan listrik PLN.',
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
          text: 'Berikut adalah bukti pembayaran tagihan listrik PLN.',
          url: window.location.href,
        });
        return true;
      } catch (e) {
        // user aborted
      }
    }

    // Fallback: download image directly so user can share via WhatsApp/Gallery
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('Gambar struk berhasil diunduh ke perangkat Anda. Anda dapat langsung membagikannya ke WhatsApp atau media sosial.');
    return true;
  } catch (err) {
    console.error('Share error:', err);
    alert('Gagal membagikan gambar: ' + (err as Error).message);
    return false;
  }
}
