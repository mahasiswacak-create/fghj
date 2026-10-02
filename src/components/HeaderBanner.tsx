import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, FileText } from 'lucide-react';
import { sound } from '../utils/sound';

// Using generated high fidelity official seal
const SEAL_IMAGE_PATH = '/src/assets/images/official_summons_seal_1790944671005.jpg';

interface HeaderBannerProps {
  onOpenSettings?: () => void;
  onOpenGuide?: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ onOpenSettings, onOpenGuide }) => {
  const [soundOn, setSoundOn] = useState(sound.isEnabled());
  const [imageError, setImageError] = useState(false);

  const toggleSound = () => {
    const newState = sound.toggleSound();
    setSoundOn(newState);
    if (newState) {
      sound.playClick();
    }
  };

  return (
    <header className="relative w-full border-b border-slate-800/80 bg-slate-950/90 pb-6 pt-4">
      {/* Top micro toolbar */}
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 pb-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tracking-widest uppercase text-slate-400">DOKUMEN INTELIJEN // SIFAT: AMAT SEGERA</span>
        </div>
        <div className="flex items-center gap-3">
          {onOpenSettings && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenSettings();
              }}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
              title="Pengaturan Google Sheets"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">Set Google Sheets</span>
            </button>
          )}
          {onOpenGuide && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenGuide();
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              title="Panduan Deploy Next.js ke Vercel"
            >
              <span>📦</span>
              <span className="hidden sm:inline">Kode Next.js & GAS</span>
            </button>
          )}
          <button
            onClick={toggleSound}
            className="flex items-center gap-1 rounded border border-slate-800 bg-slate-900/80 px-2 py-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={soundOn ? 'Matikan Suara SFX' : 'Nyalakan Suara SFX'}
          >
            {soundOn ? <Volume2 className="h-3.5 w-3.5 text-emerald-400" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
            <span className="text-[11px]">{soundOn ? 'SFX ON' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Header */}
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Parody Confidential Stamp Watermark */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 border border-red-500/40 bg-red-950/20 px-3 py-1 rounded text-red-400 text-xs font-mono tracking-widest uppercase">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>KLASIFIKASI: RAHASIA SIRKEL TONGKRONGAN</span>
          </div>
        </div>

        {/* Seal and Garuda/Eagle Parody Crest */}
        <div className="flex items-center justify-center gap-4 mb-3">
          {!imageError ? (
            <img
              src={SEAL_IMAGE_PATH}
              alt="Segel Resmi Intelijen Tongkrongan"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-full shadow-lg border border-amber-500/30 p-0.5 bg-black/40"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-900 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 text-2xl shadow-lg">
              🦅
            </div>
          )}
        </div>

        <p className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400/90 font-semibold">
          KORPS INTELIJEN NONGKRONG REPUBLIK INDONESIA
        </p>

        {/* Big Official Title */}
        <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase text-balance drop-shadow-sm font-sans">
          SURAT PEMANGGILAN RESMI: NONGKRONG DARURAT
        </h1>

        {/* Sub-title requested by user */}
        <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">
          Berdasarkan pasal pertemanan, Anda diwajibkan hadir pada:
        </p>

        {/* Document metadata box */}
        <div className="mt-4 mx-auto max-w-lg border border-dashed border-slate-800 bg-slate-900/40 p-2.5 rounded text-[11px] sm:text-xs font-mono text-slate-400 flex flex-wrap justify-between items-center gap-2">
          <span>NO: 042/SP-NONGKRONG/BIN-SANTUY/2026</span>
          <span className="hidden sm:inline">·</span>
          <span>PERIHAL: OPERASI NGOPI TENG 09.00</span>
          <span className="hidden sm:inline">·</span>
          <span className="text-red-400 font-semibold">HUKUM: KUHP PASAL 33</span>
        </div>
      </div>
    </header>
  );
};
