import React, { useState } from 'react';
import { Copy, Check, X, FileCode, ExternalLink, Sheet } from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_TEMPLATE, NEXTJS_PAGE_CODE, NEXTJS_API_ROUTE_CODE } from '../utils/gasCode';
import { sound } from '../utils/sound';

interface DeployGuideModalProps {
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'gas' | 'nextjs_page' | 'nextjs_api' | 'guide'>('gas');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    sound.playClick();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md">
      <div className="relative flex flex-col h-[90vh] max-w-4xl w-full rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-sans">
                Kode Lengkap Next.js & Google Apps Script
              </h3>
              <p className="text-xs text-slate-400">
                Siap copy-paste untuk di-deploy ke Vercel dan Google Spreadsheet.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-900/40 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('gas');
            }}
            className={`px-3 py-2 border-b-2 font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'gas'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Google Apps Script (Spreadsheet)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('nextjs_page');
            }}
            className={`px-3 py-2 border-b-2 font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'nextjs_page'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. app/page.tsx (Next.js)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('nextjs_api');
            }}
            className={`px-3 py-2 border-b-2 font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'nextjs_api'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. app/api/submit/route.ts
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('guide');
            }}
            className={`px-3 py-2 border-b-2 font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Panduan Deploy Vercel
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 font-mono text-xs">
          {activeTab === 'gas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div>
                  <h4 className="font-bold text-white text-sm">Google Apps Script (Spreadsheet Webhook)</h4>
                  <p className="text-slate-400 text-[11px]">
                    Letakkan di: Google Spreadsheet &gt; Ekstensi &gt; Apps Script &gt; Terapkan sebagai Web App.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(GOOGLE_APPS_SCRIPT_TEMPLATE, 'gas')}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'gas' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedKey === 'gas' ? 'Tersalin!' : 'Salin Kode GAS'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
                <code>{GOOGLE_APPS_SCRIPT_TEMPLATE}</code>
              </pre>
            </div>
          )}

          {activeTab === 'nextjs_page' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div>
                  <h4 className="font-bold text-white text-sm">File: app/page.tsx</h4>
                  <p className="text-slate-400 text-[11px]">
                    Halaman utama Next.js 14/15 dengan form, tombol menghindar, dan dark mode.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(NEXTJS_PAGE_CODE, 'page')}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'page' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedKey === 'page' ? 'Tersalin!' : 'Salin page.tsx'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
                <code>{NEXTJS_PAGE_CODE}</code>
              </pre>
            </div>
          )}

          {activeTab === 'nextjs_api' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <div>
                  <h4 className="font-bold text-white text-sm">File: app/api/submit/route.ts</h4>
                  <p className="text-slate-400 text-[11px]">
                    Route API Next.js App Router untuk memproses data & meneruskan ke Google Sheets.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(NEXTJS_API_ROUTE_CODE, 'api')}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'api' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedKey === 'api' ? 'Tersalin!' : 'Salin route.ts'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
                <code>{NEXTJS_API_ROUTE_CODE}</code>
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-5 font-sans text-sm text-slate-300">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <Sheet className="h-5 w-5 text-emerald-400" />
                  <span>Langkah 1: Setup Google Spreadsheet & Apps Script</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li>Buat Spreadsheet baru di <strong>Google Drive</strong> (beri nama misalnya &quot;Data Nongkrong WKS&quot;).</li>
                  <li>Klik menu <strong>Ekstensi &gt; Apps Script</strong>.</li>
                  <li>Hapus kode bawaan, lalu paste kode dari tab <strong>Google Apps Script</strong> di atas.</li>
                  <li>Simpan (Ctrl+S / Cmd+S).</li>
                  <li>Klik tombol biru <strong>Terapkan (Deploy) &gt; Penerapan Baru (New deployment)</strong>.</li>
                  <li>Pilih jenis <strong>Aplikasi Web (Web App)</strong>.</li>
                  <li>Set <strong>Jalankan sebagai: Saya</strong> dan <strong>Akses: Siapa saja (Anyone)</strong>.</li>
                  <li>Klik Terapkan dan salin URL Web App yang berakhiran <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400">/exec</code>.</li>
                </ol>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-cyan-400" />
                  <span>Langkah 2: Deploy ke Vercel</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                  <li>Inisialisasi project Next.js baru dengan perintah: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">npx create-next-app@latest surat-nongkrong --typescript --tailwind --app</code>.</li>
                  <li>Ganti isi file <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-200 font-mono">app/page.tsx</code> dan buat file <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-200 font-mono">app/api/submit/route.ts</code> menggunakan kode dari tab di atas.</li>
                  <li>Push repository Anda ke GitHub.</li>
                  <li>Buka <strong>vercel.com</strong>, pilih <strong>Import Project</strong> dari GitHub.</li>
                  <li>Di bagian <strong>Environment Variables</strong> di Vercel, tambahkan key:
                    <div className="my-1.5 bg-slate-950 border border-slate-800 p-2 rounded text-xs font-mono text-emerald-400">
                      GOOGLE_SHEETS_WEBAPP_URL = [URL Apps Script /exec Anda]
                    </div>
                  </li>
                  <li>Klik <strong>Deploy</strong>. Selesai! Web resmi nongkrong siap disebarkan ke WhatsApp teman-teman Anda!</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
