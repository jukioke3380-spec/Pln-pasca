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
      className="w-full max-w-md mx-auto bg-white text-black p-8 rounded-2xl shadow-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl font-black leading-relaxed select-none"
      style={{ fontFamily: '"Courier New", Courier, monospace', fontWeight: 900 }}
    >
      {/* Header */}
      <div className="text-center border-b-4 border-dashed border-black pb-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-black tracking-wider text-black">{settings.loketTitle}</h2>
        <p className="text-base sm:text-lg text-black font-black mt-1">{settings.loketAddress}</p>
      </div>

      <div className="text-center font-black text-lg sm:text-xl tracking-wide py-2.5 mb-5 bg-black text-white rounded-xl">
        STRUK PEMBAYARAN TAGIHAN LISTRIK
      </div>

      {/* Details with Colon separator */}
      <div className="space-y-3 text-lg sm:text-xl mb-5 border-b-4 border-dashed border-black pb-5 text-black font-black">
        <div className="grid grid-cols-[140px_16px_1fr] items-start">
          <span className="text-black font-black">Tgl / Waktu</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.tanggal}</span>
        </div>
        <div className="grid grid-cols-[140px_16px_1fr] items-start">
          <span className="text-black font-black">No. Ref</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.noRef}</span>
        </div>
        <div className="grid grid-cols-[140px_16px_1fr] items-start">
          <span className="text-black font-black">IDPel</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.idpel}</span>
        </div>
        <div className="grid grid-cols-[140px_16px_1fr] items-start">
          <span className="text-black font-black">Nama</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black uppercase">{receipt.namaPelanggan}</span>
        </div>
        <div className="grid grid-cols-[140px_16px_1fr] items-start">
          <span className="text-black font-black">Tarif / Daya</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.tarifDaya}</span>
        </div>
        <div className="grid grid-cols-[140px_16px_1fr] items-start">
          <span className="text-black font-black">BLN / THN</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.blnThn}</span>
        </div>
        <div className="grid grid-cols-[140px_16px_1fr] items-start">
          <span className="text-black font-black">Stand Meter</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.standMeter}</span>
        </div>
      </div>

      {/* Financials */}
      <div className="space-y-3 text-lg sm:text-xl mb-5 border-b-4 border-dashed border-black pb-5 text-black font-black">
        <div className="grid grid-cols-[140px_16px_1fr] items-start">
          <span className="text-black font-black">Rp Tag PLN</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{formatCurrency(receipt.rpTagPln)}</span>
        </div>
        <div className="grid grid-cols-[140px_16px_1fr] items-start">
          <span className="text-black font-black">Admin Bank</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{formatCurrency(receipt.adminBank)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center text-xl sm:text-2xl font-black bg-black text-white p-4 rounded-xl mb-5">
        <span>TOTAL BAYAR :</span>
        <span className="text-white font-black">{formatCurrency(receipt.totalBayar)}</span>
      </div>

      {/* Footer */}
      <div className="text-center text-base sm:text-lg text-black font-black space-y-2">
        <p className="uppercase">Simpan struk ini sebagai bukti pembayaran yang sah.</p>
        <p className="font-black text-black">TERIMAKASIH</p>
      </div>
    </div>
  );
};
