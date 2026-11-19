import React from 'react';
import { ReceiptData, AppSettings } from '../types';

interface ReceiptViewProps {
  receipt: ReceiptData;
  settings: AppSettings;
  innerRef?: React.RefObject<HTMLDivElement | null>;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({ receipt, settings, innerRef }) => {
  const formatCurrency = (amount: number) => {
    return 'Rp ' + amount.toLocaleString('id-ID');
  };

  return (
    <div
      ref={innerRef}
      id="receipt-print-area"
      className="w-full max-w-sm mx-auto bg-white text-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 font-mono text-xs leading-relaxed select-none"
      style={{ fontFamily: '"Courier New", Courier, monospace' }}
    >
      {/* Header */}
      <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
        <h2 className="text-sm font-bold tracking-wider text-sky-900">{settings.loketTitle}</h2>
        <p className="text-[10px] text-slate-600 mt-0.5">{settings.loketAddress}</p>
        {settings.agentName && (
          <p className="text-[10px] text-slate-700 font-bold mt-1">AGEN: {settings.agentName}</p>
        )}
      </div>

      <div className="text-center font-bold text-xs tracking-wide py-1 mb-2 bg-sky-50 text-sky-900 rounded">
        STRUK PEMBAYARAN TAGIHAN LISTRIK
      </div>

      {/* Details */}
      <div className="space-y-1 text-xs mb-3 border-b border-dashed border-slate-300 pb-3">
        <div className="flex justify-between">
          <span className="text-slate-600">Tgl / Waktu</span>
          <span className="font-semibold">{receipt.tanggal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">No. Ref</span>
          <span className="font-semibold">{receipt.noRef}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">IDPel</span>
          <span className="font-bold text-sky-700">{receipt.idpel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Nama</span>
          <span className="font-bold text-right truncate max-w-[180px]">{receipt.namaPelanggan}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Tarif / Daya</span>
          <span>{receipt.tarifDaya}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">BLN / THN</span>
          <span>{receipt.blnThn}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Stand Meter</span>
          <span>{receipt.standMeter}</span>
        </div>
      </div>

      {/* Financials */}
      <div className="space-y-1 text-xs mb-3 border-b border-dashed border-slate-300 pb-3">
        <div className="flex justify-between">
          <span className="text-slate-600">Rp Tag PLN</span>
          <span>{formatCurrency(receipt.rpTagPln)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Admin Bank</span>
          <span>{formatCurrency(receipt.adminBank)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center text-sm font-bold bg-sky-100 text-sky-950 p-2.5 rounded-lg mb-4">
        <span>TOTAL BAYAR</span>
        <span className="text-base text-sky-700">{formatCurrency(receipt.totalBayar)}</span>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-500 space-y-1">
        <p className="uppercase">Simpan struk ini sebagai bukti pembayaran yang sah.</p>
        <p className="font-bold text-slate-700">TERIMAKASIH</p>
      </div>
    </div>
  );
};
