import React, { useState, useEffect } from 'react';
import { HeaderBanner } from './components/HeaderBanner';
import { EventDetailsCard } from './components/EventDetailsCard';
import { SummonsForm } from './components/SummonsForm';
import { SuccessModal } from './components/SuccessModal';
import { AttendanceList } from './components/AttendanceList';
import { DeployGuideModal } from './components/DeployGuideModal';
import { GasSettingsModal } from './components/GasSettingsModal';
import { SubmissionRecord } from './types';

const INITIAL_DEMO_SUBMISSIONS: SubmissionRecord[] = [
  {
    id: 'demo-1',
    name: 'Budi "Si Ahli Wacana"',
    reason: 'Siap, Gasss Ndan!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'SIAP TEMPUR NONGKRONG',
  },
  {
    id: 'demo-2',
    name: 'Doni "Lagi Bokek"',
    reason: 'Gak ada duit',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'DONASI AIR PUTIH',
  },
  {
    id: 'demo-3',
    name: 'Feri "Patuhi Jam Malam"',
    reason: 'Gak bisa, aku takut istri/pacar',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    status: 'TERPANTAU CEMEN',
  },
];

export default function App() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('surat_submissions');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return INITIAL_DEMO_SUBMISSIONS;
  });

  const DEFAULT_USER_GAS_URL = 'https://script.google.com/macros/s/AKfycbzHWdTftVJxH5j71RMr3LOpgK1Ds9LfyF-1KW5BuDkc3gmcf3QxdlrhGbHO0VwJmJsX6Q/exec';

  const [gasUrl, setGasUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('gas_webapp_url');
      if (saved && !saved.includes('AKfycbwLF')) return saved;
    } catch {
      // Ignore
    }
    try {
      localStorage.setItem('gas_webapp_url', DEFAULT_USER_GAS_URL);
    } catch {
      // Ignore
    }
    return DEFAULT_USER_GAS_URL;
  });

  const [activeSuccess, setActiveSuccess] = useState<SubmissionRecord | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Sync submissions from backend if available
  useEffect(() => {
    fetch('/api/submissions')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setSubmissions((prev) => {
            const combined = [...json.data, ...prev.filter((p) => !json.data.some((j: SubmissionRecord) => j.id === p.id))];
            return combined;
          });
        }
      })
      .catch(() => {
        // Fallback silently to localStorage
      });
  }, []);

  const handleFormSuccess = (record: SubmissionRecord) => {
    setSubmissions((prev) => {
      const updated = [record, ...prev];
      try {
        localStorage.setItem('surat_submissions', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
    setActiveSuccess(record);
  };

  const handleSaveGasUrl = (url: string) => {
    setGasUrl(url);
    try {
      localStorage.setItem('gas_webapp_url', url);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Official Header */}
      <HeaderBanner
        onOpenSettings={() => setShowSettings(true)}
        onOpenGuide={() => setShowGuide(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Event Details Card */}
        <section aria-label="Rincian Acara">
          <EventDetailsCard />
        </section>

        {/* Summons Submission Form */}
        <section aria-label="Formulir Pemanggilan">
          <SummonsForm onSuccess={handleFormSuccess} gasUrl={gasUrl} />
        </section>

        {/* Attendance List (Live Log) */}
        <section aria-label="Daftar Tersangka">
          <AttendanceList submissions={submissions} />
        </section>

        {/* Deploy & Integration Callout */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🚀 Ingin Deploy Web Ini ke Vercel untuk Teman-Temanmu?</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Dapatkan kode Next.js (App Router) siap pakai dan script Google Sheets Webhook lengkap.
            </p>
          </div>
          <button
            onClick={() => setShowGuide(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            <span>Buka Kode Next.js & GAS</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BADAN INTELIJEN NONGKRONG (BIN) · MARKAS BESAR WKS</span>
          <span>DILINDUNGI HUKUM PERTEMANAN SEJATI © 2026</span>
        </div>
      </footer>

      {/* Success Modal (SweetAlert style) */}
      {activeSuccess && (
        <SuccessModal
          submission={activeSuccess}
          onClose={() => setActiveSuccess(null)}
        />
      )}

      {/* Deploy Guide & Full Code Modal */}
      {showGuide && <DeployGuideModal onClose={() => setShowGuide(false)} />}

      {/* Google Apps Script Settings Modal */}
      {showSettings && (
        <GasSettingsModal
          gasUrl={gasUrl}
          onSave={handleSaveGasUrl}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
