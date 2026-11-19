import { ReceiptData, AppSettings } from '../types';

export async function connectBluetoothPrinter(): Promise<{ deviceName: string; deviceId: string } | null> {
  if (!navigator.bluetooth) {
    alert('Web Bluetooth API tidak didukung di browser ini. Gunakan Google Chrome di Android atau Desktop.');
    return null;
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        '000018f0-0000-1000-8000-00805f9b34fb',
        '0000ff00-0000-1000-8000-00805f9b34fb',
        '49535343-fe7d-4ae5-8fa9-9fafd205e455',
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2'
      ],
    });

    const deviceName = device.name || 'Thermal Printer 58mm';
    const deviceId = device.id;

    localStorage.setItem('pln_saved_printer_id', deviceId);
    localStorage.setItem('pln_saved_printer_name', deviceName);

    return { deviceName, deviceId };
  } catch (err) {
    console.error('Bluetooth connection error:', err);
    throw err;
  }
}

export async function printReceiptThermal(receipt: ReceiptData, settings: AppSettings): Promise<boolean> {
  if (!navigator.bluetooth) {
    throw new Error('Web Bluetooth tidak didukung.');
  }

  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        '000018f0-0000-1000-8000-00805f9b34fb',
        '0000ff00-0000-1000-8000-00805f9b34fb',
        '49535343-fe7d-4ae5-8fa9-9fafd205e455',
      ],
    });

    if (!device.gatt) {
      throw new Error('GATT server tidak tersedia pada perangkat.');
    }

    const server = await device.gatt.connect();
    
    let characteristic: BluetoothRemoteGATTCharacteristic | null = null;
    const services = await server.getPrimaryServices();

    for (const service of services) {
      try {
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            characteristic = char;
            break;
          }
        }
      } catch (e) {
        console.warn('Could not get characteristics for service', e);
      }
      if (characteristic) break;
    }

    if (!characteristic) {
      throw new Error('Tidak ditemukan karakteristik printer ESC/POS yang dapat ditulis.');
    }

    const encoder = new TextEncoder();
    const INIT = '\x1B\x40';
    const BOLD_ON = '\x1B\x45\x01';
    const BOLD_OFF = '\x1B\x45\x00';
    const ALIGN_CENTER = '\x1B\x61\x01';
    const ALIGN_LEFT = '\x1B\x61\x00';
    const CUT = '\x1D\x56\x41\x10';

    const formatCurrency = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

    let printText = '';
    printText += INIT;
    printText += ALIGN_CENTER;
    printText += BOLD_ON + `${settings.loketTitle}\n` + BOLD_OFF;
    printText += `${settings.loketAddress}\n`;
    printText += '--------------------------------\n';
    printText += BOLD_ON + 'STRUK PEMBAYARAN TAGIHAN LISTRIK\n' + BOLD_OFF;
    printText += '--------------------------------\n';
    printText += ALIGN_LEFT;
    printText += `Tgl      : ${receipt.tanggal}\n`;
    printText += `No Ref   : ${receipt.noRef}\n`;
    printText += `IDPEL    : ${receipt.idpel}\n`;
    printText += `Nama     : ${receipt.namaPelanggan}\n`;
    printText += `Tarif/Daya: ${receipt.tarifDaya}\n`;
    printText += `BLN/THN  : ${receipt.blnThn}\n`;
    printText += `Stand Mtr: ${receipt.standMeter}\n`;
    printText += '--------------------------------\n';
    printText += `Rp Tag PLN : ${formatCurrency(receipt.rpTagPln)}\n`;
    printText += `Admin Bank : ${formatCurrency(receipt.adminBank)}\n`;
    printText += '--------------------------------\n';
    printText += BOLD_ON + `TOTAL BAYAR: ${formatCurrency(receipt.totalBayar)}\n` + BOLD_OFF;
    printText += '--------------------------------\n';
    printText += ALIGN_CENTER;
    printText += 'Simpan struk ini sebagai\nbukti pembayaran yang sah.\nTERIMAKASIH\n\n\n';
    printText += CUT;

    const data = encoder.encode(printText);

    const chunkSize = 100;
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      await characteristic.writeValue(chunk);
    }

    device.gatt.disconnect();
    return true;
  } catch (err) {
    console.error('Printing error:', err);
    throw err;
  }
}
