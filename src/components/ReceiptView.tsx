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
      className="w-full max-w-lg mx-auto bg-white text-black p-8 rounded-3xl shadow-2xl border-4 border-slate-300 font-mono text-xl sm:text-2xl font-black leading-relaxed select-none"
      style={{ fontFamily: '"Courier New", Courier, monospace', fontWeight: 900 }}
    >
      {/* Header */}
      <div className="text-center border-b-4 border-dashed border-black pb-5 mb-5">
        <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-black">{settings.loketTitle}</h2>
        <p className="text-lg sm:text-xl text-black font-black mt-1.5">{settings.loketAddress}</p>
      </div>

      <div className="text-center font-black text-xl sm:text-2xl tracking-wide py-3 mb-6 bg-black text-white rounded-2xl">
        STRUK PEMBAYARAN TAGIHAN LISTRIK
      </div>

      {/* Details with Colon separator */}
      <div className="space-y-4 text-xl sm:text-2xl mb-4 text-black font-black">
        <div className="grid grid-cols-[160px_20px_1fr] items-start">
          <span className="text-black font-black">Tgl / Waktu</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.tanggal}</span>
        </div>
        <div className="grid grid-cols-[160px_20px_1fr] items-start">
          <span className="text-black font-black">No. Ref</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.noRef}</span>
        </div>
        <div className="grid grid-cols-[160px_20px_1fr] items-start">
          <span className="text-black font-black">IDPel</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.idpel}</span>
        </div>
        <div className="grid grid-cols-[160px_20px_1fr] items-start">
          <span className="text-black font-black">Nama</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black uppercase">{receipt.namaPelanggan}</span>
        </div>
        <div className="grid grid-cols-[160px_20px_1fr] items-start">
          <span className="text-black font-black">Tarif / Daya</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.tarifDaya}</span>
        </div>
        <div className="grid grid-cols-[160px_20px_1fr] items-start">
          <span className="text-black font-black">BLN / THN</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{receipt.blnThn}</span>
        </div>
        <div className="grid grid-cols-[160px_20px_1fr] items-start">
          <span className="text-black font-black">Stand Meter</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black tracking-widest">{receipt.standMeter}</span>
        </div>
      </div>

      {/* Financials without dashed line above total bayar */}
      <div className="space-y-4 text-xl sm:text-2xl mb-4 text-black font-black">
        <div className="grid grid-cols-[160px_20px_1fr] items-start">
          <span className="text-black font-black">Rp Tag PLN</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{formatCurrency(receipt.rpTagPln)}</span>
        </div>
        <div className="grid grid-cols-[160px_20px_1fr] items-start">
          <span className="text-black font-black">Admin Bank</span>
          <span className="text-center font-black">:</span>
          <span className="text-black font-black">{formatCurrency(receipt.adminBank)}</span>
        </div>
      </div>

      {/* Total (Aligned with columns above) */}
      <div className="grid grid-cols-[160px_20px_1fr] items-start text-xl sm:text-2xl font-black text-black mb-6">
        <span className="text-black font-black">TOTAL BAYAR</span>
        <span className="text-center font-black">:</span>
        <span className="text-black font-black">{formatCurrency(receipt.totalBayar)}</span>
      </div>

      {/* Footer with black background block containing only closing text */}
      <div className="bg-black text-white p-4 rounded-2xl text-center text-xl sm:text-2xl font-black mb-2">
        <p className="uppercase tracking-tight">Simpan struk ini sebagai bukti pembayaran</p>
      </div>

      {/* Dashed line above TERIMAKASIH (closer to black block) */}
      <div className="border-t-4 border-dashed border-black pt-2">
        <div className="text-center text-xl sm:text-2xl text-black font-black uppercase">
          TERIMAKASIH
        </div>
      </div>
    </div>
  );
};
