import React, { useEffect, useState } from 'react';
import { Camera, Edit3, Printer, Settings as SettingsIcon, History as HistoryIcon, Download, Smartphone, X, ExternalLink } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
    }
    return false;
  };

  return { isInstallable: !!deferredPrompt, isInstalled, isIOS, install };
}

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowInstallModal(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition animate-pulse"
      >
        <Smartphone className="w-3.5 h-3.5" />
        Install PWA
      </button>

      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl text-left relative space-y-4 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Cara Install Aplikasi di HP</h3>
                <p className="text-xs text-slate-500">Buka di tab baru browser untuk instalasi instan.</p>
              </div>
            </div>

            {/* Quick Open in New Tab Button */}
            <button
              onClick={handleOpenNewTab}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md transition"
            >
              <ExternalLink className="w-4 h-4" />
              Buka di Tab Baru (Agar Tombol Install Muncul)
            </button>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
              <div className="p-3 bg-sky-50 dark:bg-slate-800 rounded-2xl space-y-1">
                <p className="font-bold text-sky-900 dark:text-sky-200">📱 Pengguna Android (Google Chrome):</p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Klik tombol <strong className="text-emerald-700">"Buka di Tab Baru"</strong> di atas.</li>
                  <li>Ketuk menu titik tiga (<span className="font-bold">︙</span>) di sudut kanan atas browser Chrome.</li>
                  <li>Pilih <strong className="text-sky-700">"Install app"</strong> atau <strong className="text-sky-700">"Add to Home screen"</strong>.</li>
                </ol>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-2xl space-y-1">
                <p className="font-bold text-blue-900 dark:text-blue-200">🍏 Pengguna iPhone / iPad (Safari):</p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Ketuk tombol <strong className="text-blue-700">Share</strong> (ikon kotak panah ke atas) di bilah bawah Safari.</li>
                  <li>Pilih <strong className="text-blue-700">"Add to Home Screen"</strong> (Tambah ke Layar Utama).</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowInstallModal(false)}
              className="mt-1 w-full rounded-xl bg-slate-200 dark:bg-slate-800 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

interface NavbarProps {
  activeTab: 'scan' | 'preview' | 'printer' | 'settings' | 'history';
  onTabChange: (tab: 'scan' | 'preview' | 'printer' | 'settings' | 'history') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center font-bold shadow-sm">
            ⚡
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Struk Listrik PLN</h1>
            <p className="text-[10px] text-slate-500">PPOB Thermal PWA</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton />
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav aria-label="Bottom Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onTabChange('scan')}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition ${
            activeTab === 'scan' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Camera className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Scan</span>
        </button>

        <button
          onClick={() => onTabChange('preview')}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition ${
            activeTab === 'preview' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Struk</span>
        </button>

        <button
          onClick={() => onTabChange('printer')}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition ${
            activeTab === 'printer' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Printer className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Printer</span>
        </button>

        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition ${
            activeTab === 'history' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <HistoryIcon className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Riwayat</span>
        </button>

        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition ${
            activeTab === 'settings' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <SettingsIcon className="w-5 h-5 mb-1" />
          <span className="text-[10px]">Atur</span>
        </button>
      </nav>
    </>
  );
};
