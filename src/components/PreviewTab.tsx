import React, { useState, useRef } from 'react';
import { Printer, Download, Share2, Edit3, Check, RefreshCw } from 'lucide-react';
import { ReceiptData, AppSettings } from '../types';
import { ReceiptView } from './ReceiptView';
import { printReceiptThermal } from '../utils/bluetooth';
import { exportReceiptAsImage, shareReceiptImage } from '../utils/receiptCanvas';

interface PreviewTabProps {
  receipt: ReceiptData | null;
  onUpdateReceipt: (updated: ReceiptData) => void;
  settings: AppSettings;
  onNewScan: () => void;
}

export const PreviewTab: React.FC<PreviewTabProps> = ({
  receipt,
  onUpdateReceipt,
  settings,
  onNewScan,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!receipt) {
    return (
      <div className="text-center py-16 px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
          <Edit3 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Belum Ada Data Struk</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          Silakan lakukan scan OCR terlebih dahulu atau buat struk baru dari menu Beranda.
        </p>
        <button
          onClick={onNewScan}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
        >
          Mulai Scan / Buat Struk
        </button>
      </div>
    );
  }

  const handleChange = (field: keyof ReceiptData, value: string | number) => {
    const updated = { ...receipt, [field]: value };
    if (field === 'rpTagPln') {
      const tag = Number(value) || 0;
      updated.rpTagPln = tag;
      updated.totalBayar = tag + updated.adminBank;
    }
    if (field === 'adminBank') {
      const admin = Number(value) || 0;
      updated.adminBank = admin;
      updated.totalBayar = updated.rpTagPln + admin;
    }
    onUpdateReceipt(updated);
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await printReceiptThermal(receipt, settings);
      alert('Berhasil mencetak ke printer Bluetooth thermal!');
    } catch (err) {
      console.error('Print error:', err);
      alert('Gagal mencetak: ' + (err as Error).message);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownloadImage = async () => {
    try {
      await exportReceiptAsImage(receipt, settings, `struk-pln-${receipt.idpel}.png`);
      alert('Gambar struk berhasil disimpan ke perangkat/galeri!');
    } catch (err) {
      alert('Gagal menyimpan gambar.');
    }
  };

  const handleShareImage = async () => {
    setIsSharing(true);
    try {
      await shareReceiptImage(receipt, settings, `struk-pln-${receipt.idpel}.png`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Bar Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Preview & Tap-to-Edit Struk</h2>
          <p className="text-xs text-slate-500">Ketuk tombol edit untuk menyesuaikan data OCR jika diperlukan.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition ${
            isEditing
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200'
          }`}
        >
          {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditing ? 'Selesai Edit' : 'Edit Data Struk'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Receipt Visual Preview (Center) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="sticky top-4 w-full">
            <ReceiptView receipt={receipt} settings={settings} innerRef={receiptRef} />

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-4 max-w-sm mx-auto">
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="flex flex-col items-center justify-center p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-sm transition text-xs font-medium"
              >
                <Printer className="w-5 h-5 mb-1" />
                {isPrinting ? 'Mencetak...' : 'Cetak Thermal'}
              </button>
              <button
                onClick={handleDownloadImage}
                className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-sm transition text-xs font-medium"
              >
                <Download className="w-5 h-5 mb-1" />
                Simpan PNG
              </button>
              <button
                onClick={handleShareImage}
                disabled={isSharing}
                className="flex flex-col items-center justify-center p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition text-xs font-medium"
              >
                <Share2 className="w-5 h-5 mb-1" />
                {isSharing ? 'Memproses...' : 'Bagikan'}
              </button>
            </div>
          </div>
        </div>

        {/* Tap-to-Edit Form (Right or Bottom) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2 flex items-center justify-between">
            <span>Formulir Data Struk</span>
            <span className="text-xs text-sky-600 font-normal">Tap field untuk mengubah</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tanggal / Waktu</label>
              <input
                type="text"
                value={receipt.tanggal}
                onChange={(e) => handleChange('tanggal', e.target.value)}
                disabled={!isEditing}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-80"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">No. Referensi</label>
                <input
                  type="text"
                  value={receipt.noRef}
                  onChange={(e) => handleChange('noRef', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-80 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">IDPEL (No Pelanggan)</label>
                <input
                  type="text"
                  value={receipt.idpel}
                  onChange={(e) => handleChange('idpel', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-80 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nama Pelanggan</label>
              <input
                type="text"
                value={receipt.namaPelanggan}
                onChange={(e) => handleChange('namaPelanggan', e.target.value)}
                disabled={!isEditing}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-80 font-bold uppercase"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tarif / Daya</label>
                <input
                  type="text"
                  value={receipt.tarifDaya}
                  onChange={(e) => handleChange('tarifDaya', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-80"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">BLN / THN</label>
                <input
                  type="text"
                  value={receipt.blnThn}
                  onChange={(e) => handleChange('blnThn', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-80"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Stand Meter</label>
                <input
                  type="text"
                  value={receipt.standMeter}
                  onChange={(e) => handleChange('standMeter', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-80 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Rp Tag PLN (Rp)</label>
                <input
                  type="number"
                  value={receipt.rpTagPln}
                  onChange={(e) => handleChange('rpTagPln', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-80 font-mono font-bold text-sky-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Admin Bank (Rp)</label>
                <input
                  type="number"
                  value={receipt.adminBank}
                  onChange={(e) => handleChange('adminBank', Number(e.target.value))}
                  disabled={!isEditing}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-80 font-mono"
                />
              </div>
            </div>

            <div className="bg-sky-50 dark:bg-slate-800/80 p-3 rounded-xl flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
              <span>Total Bayar:</span>
              <span className="text-sky-700 font-mono text-base">Rp {receipt.totalBayar.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
