import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { ReceiptData, AppSettings } from '../types';
import { recognizeReceiptImage, generateRandomReceipt } from '../utils/ocr';

interface ScanTabProps {
  onReceiptScanned: (receipt: ReceiptData) => void;
  settings: AppSettings;
}

export const ScanTab: React.FC<ScanTabProps> = ({ onReceiptScanned, settings }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelected = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setIsScanning(true);
    setProgressText('Memproses gambar dengan OCR Tesseract...');

    try {
      const extracted = await recognizeReceiptImage(file, (prog, status) => {
        setProgressText(`${status} (${Math.round(prog * 100)}%)`);
      });

      const fullReceipt: ReceiptData = {
        id: 'RCP-' + Date.now(),
        tanggal: extracted.tanggal || new Date().toISOString().replace('T', ' ').substring(0, 19),
        noRef: extracted.noRef || 'REF' + Math.floor(100000000 + Math.random() * 900000000),
        idpel: extracted.idpel || '54210' + Math.floor(1000000 + Math.random() * 9000000),
        namaPelanggan: extracted.namaPelanggan || 'PELANGGAN PLN',
        tarifDaya: extracted.tarifDaya || 'R1/1300VA',
        blnThn: extracted.blnThn || '02/26',
        standMeter: extracted.standMeter || '001245-001389',
        rpTagPln: extracted.rpTagPln || 95500,
        adminBank: settings.adminFee,
        totalBayar: (extracted.rpTagPln || 95500) + settings.adminFee,
        status: 'SUCCESS',
      };

      setIsScanning(false);
      onReceiptScanned(fullReceipt);
    } catch (err) {
      console.error('OCR processing failed:', err);
      setIsScanning(false);
      alert('Gagal membaca teks dari gambar. Silakan gunakan data contoh atau masukkan manual.');
      
      // Fallback random
      const fallback = generateRandomReceipt();
      fallback.adminBank = settings.adminFee;
      fallback.totalBayar = fallback.rpTagPln + settings.adminFee;
      onReceiptScanned(fallback);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelected(e.target.files[0]);
    }
  };

  const handleGenerateSample = () => {
    const sample = generateRandomReceipt();
    sample.adminBank = settings.adminFee;
    sample.totalBayar = sample.rpTagPln + settings.adminFee;
    onReceiptScanned(sample);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <FileText className="w-40 h-40" />
        </div>
        <span className="inline-block bg-white/20 text-xs font-semibold px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
          PPOB PLN OCR Scanner
        </span>
        <h1 className="text-2xl font-bold tracking-tight">Scan Struk Pembayaran Listrik</h1>
        <p className="mt-1 text-sm text-sky-100 max-w-md">
          Unggah foto struk, gunakan kamera HP, atau terima kiriman gambar via Share Target Android untuk ekstraksi otomatis data pelanggan.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
          className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-2xl shadow-sm hover:shadow-md transition group text-center"
        >
          <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <Upload className="w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100">Unggah Gambar Struk</span>
          <span className="text-xs text-slate-500 mt-1">Format PNG, JPG, atau WEBP</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Camera Button */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={isScanning}
          className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition group text-center"
        >
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
            <Camera className="w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100">Ambil Foto Kamera</span>
          <span className="text-xs text-slate-500 mt-1">Gunakan kamera HP secara langsung</span>
        </button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Quick Sample Button */}
      <div className="bg-sky-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-sky-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Buat Struk Cepat (Tanpa Foto)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Generate data transaksi PLN secara instan untuk pengujian & cetak.</p>
          </div>
        </div>
        <button
          onClick={handleGenerateSample}
          className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-xl shadow-sm transition whitespace-nowrap"
        >
          Buat Struk Baru
        </button>
      </div>

      {/* Scanning Overlay State */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-4">
            {previewImage && (
              <img
                src={previewImage}
                alt="Scanning preview"
                className="w-32 h-32 object-cover rounded-xl mx-auto border shadow"
              />
            )}
            <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Memindai Bukti Transfer</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">{progressText}</p>
          </div>
        </div>
      )}
    </div>
  );
};
