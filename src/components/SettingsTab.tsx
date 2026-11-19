import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Store, DollarSign } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsTabProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Pengaturan Agen & Loket PPOB</h1>
        </div>
        <p className="text-xs text-sky-100">
          Atur identitas agen, kepala struk, alamat loket, dan besaran biaya admin bank default.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-sky-600" /> Nama Agen (Default)
          </label>
          <input
            type="text"
            value={formData.agentName}
            onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> Kepala Struk / Judul Loket PPOB
          </label>
          <input
            type="text"
            value={formData.loketTitle}
            onChange={(e) => setFormData({ ...formData, loketTitle: e.target.value })}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-bold"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Alamat Loket / Keterangan</label>
          <input
            type="text"
            value={formData.loketAddress}
            onChange={(e) => setFormData({ ...formData, loketAddress: e.target.value })}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-sky-600" /> Biaya Admin Bank Default (Rp)
          </label>
          <input
            type="number"
            value={formData.adminFee}
            onChange={(e) => setFormData({ ...formData, adminFee: Number(e.target.value) })}
            className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
        >
          <Save className="w-4 h-4" /> Simpan Pengaturan
        </button>
      </form>
    </div>
  );
};
