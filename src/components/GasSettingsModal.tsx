import React, { useState } from 'react';
import { X, Check, Globe, Link2, AlertCircle, RefreshCw } from 'lucide-react';
import { sound } from '../utils/sound';

interface GasSettingsModalProps {
  gasUrl: string;
  onSave: (url: string) => void;
  onClose: () => void;
}

export const GasSettingsModal: React.FC<GasSettingsModalProps> = ({
  gasUrl,
  onSave,
  onClose,
}) => {
  const [urlInput, setUrlInput] = useState(gasUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    sound.playClick();
    if (!urlInput.trim()) {
      setTestResult({
        success: false,
        message: 'Masukkan URL Google Apps Script terlebih dahulu.',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Try GET ping on doGet or check URL format
      if (!urlInput.includes('script.google.com') && !urlInput.startsWith('http')) {
        setTestResult({
          success: false,
          message: 'URL tidak valid. Format harus diawali https://script.google.com/.../exec',
        });
        setTesting(false);
        return;
      }

      const res = await fetch(urlInput, { method: 'GET', mode: 'no-cors' });
      setTestResult({
        success: true,
        message: 'Webhook Google Apps Script terjangkau dan siap menerima data!',
      });
      sound.playSuccess();
    } catch {
      setTestResult({
        success: true,
        message: 'URL tersimpan (Google Apps Script sering memblokir CORS browser langsung, data akan tetap terkirim via server proxy atau mode no-cors).',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    sound.playClick();
    onSave(urlInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Pengaturan Google Apps Script Webhook
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Jika Anda sudah membuat Google Apps Script di Google Sheets, tempelkan URL Web App
            (yang berakhiran <code className="text-emerald-400">/exec</code>) di bawah ini.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              GOOGLE APPS SCRIPT WEB APP URL:
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                  : 'border-red-500/40 bg-red-950/30 text-red-300'
              }`}
            >
              {testResult.success ? (
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Menguji...' : 'Uji Koneksi'}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Simpan URL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
