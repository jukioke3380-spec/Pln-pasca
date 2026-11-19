import React from 'react';
import { History, FileText, ChevronRight, Trash2 } from 'lucide-react';
import { ReceiptData } from '../types';

interface HistoryTabProps {
  history: ReceiptData[];
  onSelectReceipt: (receipt: ReceiptData) => void;
  onClearHistory: () => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ history, onSelectReceipt, onClearHistory }) => {
  const formatCurrency = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-16 px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <History className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Belum Ada Riwayat Struk</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Setiap struk yang Anda buat atau scan akan tersimpan otomatis di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Transaksi Struk</h1>
          <p className="text-xs text-slate-500">Daftar struk pembayaran listrik yang tersimpan di perangkat.</p>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 rounded-xl transition border border-rose-200"
        >
          <Trash2 className="w-3.5 h-3.5" /> Hapus Riwayat
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectReceipt(item)}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-sky-300 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition">
                  {item.namaPelanggan}
                </h4>
                <p className="text-xs text-slate-500 font-mono">IDPEL: {item.idpel} · {item.tanggal}</p>
                <p className="text-xs font-semibold text-sky-700 mt-0.5">{formatCurrency(item.totalBayar)}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
          </div>
        ))}
      </div>
    </div>
  );
};
