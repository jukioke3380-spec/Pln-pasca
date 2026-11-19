import React, { useState, useEffect } from 'react';
import { Printer, Bluetooth, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { AppSettings } from '../types';
import { connectBluetoothPrinter } from '../utils/bluetooth';

interface PrinterTabProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const PrinterTab: React.FC<PrinterTabProps> = ({ settings, onUpdateSettings }) => {
  const [connecting, setConnecting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('pln_saved_printer_name');
    const savedId = localStorage.getItem('pln_saved_printer_id');
    if (savedName && savedId) {
      onUpdateSettings({ ...settings, printerName: savedName, printerId: savedId });
    }
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    setStatusMsg('Mencari perangkat Bluetooth thermal printer...');
    try {
      const res = await connectBluetoothPrinter();
      if (res) {
        onUpdateSettings({
          ...settings,
          printerName: res.deviceName,
          printerId: res.deviceId,
        });
        setStatusMsg(`Berhasil terhubung ke ${res.deviceName}!`);
      } else {
        setStatusMsg('Koneksi dibatalkan.');
      }
    } catch (err) {
      setStatusMsg('Gagal terhubung: ' + (err as Error).message);
    } finally {
      setConnecting(false);
    }
  };

  const handleForget = () => {
    localStorage.removeItem('pln_saved_printer_name');
    localStorage.removeItem('pln_saved_printer_id');
    onUpdateSettings({ ...settings, printerName: undefined, printerId: undefined });
    setStatusMsg('Printer terhubung telah dilepaskan.');
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-700 text-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Bluetooth className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Pengaturan Printer Thermal Bluetooth</h1>
        </div>
        <p className="text-xs text-blue-100">
          Hubungkan printer thermal 58mm atau 80mm via Web Bluetooth API. Pilihan printer akan tersimpan otomatis di perangkat Anda.
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${settings.printerName ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {settings.printerName ? settings.printerName : 'Belum Ada Printer Terhubung'}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {settings.printerId ? `ID: ${settings.printerId}` : 'Status: Siap pairing Bluetooth'}
              </p>
            </div>
          </div>
          {settings.printerName && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Terhubung
            </span>
          )}
        </div>

        {statusMsg && (
          <div className="p-3 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-200 text-xs rounded-xl border border-sky-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
          >
            {connecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bluetooth className="w-4 h-4" />}
            {connecting ? 'Menghubungkan...' : 'Cari & Hubungkan Printer'}
          </button>

          {settings.printerName && (
            <button
              onClick={handleForget}
              className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold rounded-xl transition border border-rose-200"
            >
              Lupakan Printer
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="border-t pt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <h4 className="font-semibold text-slate-900 dark:text-white">Panduan Koneksi Printer Thermal:</h4>
          <ol className="list-decimal list-inside space-y-1 pl-1">
            <li>Nyalakan printer thermal Bluetooth Anda.</li>
            <li>Pastikan Bluetooth HP / Laptop Anda dalam keadaan aktif.</li>
            <li>Klik tombol "Cari & Hubungkan Printer" di atas.</li>
            <li>Pilih perangkat printer thermal Anda pada dialog browser yang muncul (contoh: MTP-II, PT-210, RPP02).</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
