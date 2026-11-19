export interface ReceiptData {
  id: string;
  tanggal: string;
  noRef: string;
  idpel: string;
  namaPelanggan: string;
  tarifDaya: string;
  blnThn: string;
  standMeter: string;
  rpTagPln: number;
  adminBank: number;
  totalBayar: number;
  status: 'SUCCESS' | 'PENDING';
}

export interface AppSettings {
  agentName: string;
  loketTitle: string;
  loketAddress: string;
  adminFee: number;
  printerName?: string;
  printerId?: string;
}
