/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ReceiptData, AppSettings } from './types';
import { Navbar } from './components/Navbar';
import { ScanTab } from './components/ScanTab';
import { PreviewTab } from './components/PreviewTab';
import { PrinterTab } from './components/PrinterTab';
import { SettingsTab } from './components/SettingsTab';
import { HistoryTab } from './components/HistoryTab';
import { generateRandomReceipt } from './utils/ocr';

const DEFAULT_SETTINGS: AppSettings = {
  defaultCustomerName: 'ERFAI',
  loketTitle: 'LOKET PPOB ATHAR DIGITAL PAYMENT',
  loketAddress: 'JL Raya Bapuhbandung glagah',
  adminFee: 0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'preview' | 'printer' | 'settings' | 'history'>('scan');
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('pln_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_SETTINGS;
  });

  const [history, setHistory] = useState<ReceiptData[]>(() => {
    const saved = localStorage.getItem('pln_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default initial sample
    const sample = generateRandomReceipt(settings.defaultCustomerName);
    return [sample];
  });

  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData | null>(() => {
    return history[0] || null;
  });

  // Save settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pln_settings', JSON.stringify(newSettings));
  };

  // Save history
  useEffect(() => {
    localStorage.setItem('pln_history', JSON.stringify(history));
  }, [history]);

  // Handle new receipt scanned or generated
  const handleReceiptScanned = (receipt: ReceiptData) => {
    setCurrentReceipt(receipt);
    setHistory((prev) => [receipt, ...prev.filter((h) => h.id !== receipt.id)]);
    setActiveTab('preview');
  };

  const handleUpdateCurrentReceipt = (updated: ReceiptData) => {
    setCurrentReceipt(updated);
    setHistory((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleClearHistory = () => {
    if (confirm('Hapus seluruh riwayat struk?')) {
      setHistory([]);
      setCurrentReceipt(null);
    }
  };

  // Web Share Target handler check on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedText = params.get('text') || params.get('title');
    if (sharedText) {
      // If shared from another app, create a receipt with the text
      const sample = generateRandomReceipt(settings.defaultCustomerName);
      sample.namaPelanggan = `SHARED: ${sharedText.substring(0, 30)}`;
      handleReceiptScanned(sample);
    }
  }, []);

  return (
    <div className="min-h-screen bg-sky-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {activeTab === 'scan' && (
          <ScanTab onReceiptScanned={handleReceiptScanned} settings={settings} />
        )}

        {activeTab === 'preview' && (
          <PreviewTab
            receipt={currentReceipt}
            onUpdateReceipt={handleUpdateCurrentReceipt}
            settings={settings}
            onNewScan={() => setActiveTab('scan')}
          />
        )}

        {activeTab === 'printer' && (
          <PrinterTab settings={settings} onUpdateSettings={handleUpdateSettings} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab settings={settings} onUpdateSettings={handleUpdateSettings} />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            history={history}
            onSelectReceipt={(receipt) => {
              setCurrentReceipt(receipt);
              setActiveTab('preview');
            }}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>
    </div>
  );
}
