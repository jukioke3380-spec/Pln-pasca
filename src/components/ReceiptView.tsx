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
      className="w-full max-w-sm mx-auto bg-white text-black p-6 rounded-2xl shadow-2xl border-2 border-slate-300 font-mono text-sm sm:text-base font-bold leading-normal select-none"
      style={{ fontFamily: '"Courier New", Courier, monospace', fontWeight: 700 }}
    >
      {/* Header */}
      <div className="text-center border-b-2 border-dashed border-black pb-3 mb-3">
        <h2 className="text-base sm:text-lg font-black tracking-wider text-black">{settings.loketTitle}</h2>
        <p className="text-xs sm:text-sm text-black font-bold mt-0.5">{settings.loketAddress}</p>
      </div>

      <div className="text-center font-black text-sm sm:text-base tracking-wide py-1.5 mb-3 bg-black text-white rounded">
        STRUK PEMBAYARAN TAGIHAN LISTRIK
      </div>

      {/* Details with Colon separator */}
      <div className="space-y-2 text-sm sm:text-base mb-3 border-b-2 border-dashed border-black pb-3 text-black font-bold">
        <div className="grid grid-cols-[110px_12px_1fr] items-start">
          <span className="text-black font-black">Tgl / Waktu</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-bold">{receipt.tanggal}</span>
        </div>
        <div className="grid grid-cols-[110px_12px_1fr] items-start">
          <span className="text-black font-black">No. Ref</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-bold">{receipt.noRef}</span>
        </div>
        <div className="grid grid-cols-[110px_12px_1fr] items-start">
          <span className="text-black font-black">IDPel</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.idpel}</span>
        </div>
        <div className="grid grid-cols-[110px_12px_1fr] items-start">
          <span className="text-black font-black">Nama</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black uppercase">{receipt.namaPelanggan}</span>
        </div>
        <div className="grid grid-cols-[110px_12px_1fr] items-start">
          <span className="text-black font-black">Tarif / Daya</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-bold">{receipt.tarifDaya}</span>
        </div>
        <div className="grid grid-cols-[110px_12px_1fr] items-start">
          <span className="text-black font-black">BLN / THN</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-bold">{receipt.blnThn}</span>
        </div>
        <div className="grid grid-cols-[110px_12px_1fr] items-start">
          <span className="text-black font-black">Stand Meter</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-bold">{receipt.standMeter}</span>
        </div>
      </div>

      {/* Financials */}
      <div className="space-y-2 text-sm sm:text-base mb-3 border-b-2 border-dashed border-black pb-3 text-black font-bold">
        <div className="grid grid-cols-[110px_12px_1fr] items-start">
          <span className="text-black font-black">Rp Tag PLN</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-bold">{formatCurrency(receipt.rpTagPln)}</span>
        </div>
        <div className="grid grid-cols-[110px_12px_1fr] items-start">
          <span className="text-black font-black">Admin Bank</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-bold">{formatCurrency(receipt.adminBank)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center text-base sm:text-lg font-black bg-black text-white p-3 rounded-xl mb-4">
        <span>TOTAL BAYAR :</span>
        <span className="text-white font-black">{formatCurrency(receipt.totalBayar)}</span>
      </div>

      {/* Footer */}
      <div className="text-center text-xs sm:text-sm text-black font-black space-y-1">
        <p className="uppercase">Simpan struk ini sebagai bukti pembayaran yang sah.</p>
        <p className="font-black text-black">TERIMAKASIH</p>
      </div>
    </div>
  );
};
