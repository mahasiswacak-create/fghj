import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Send, AlertOctagon, HelpCircle, Loader2 } from 'lucide-react';
import { sound } from '../utils/sound';
import { ReasonOptionId, SubmissionRecord, SubmitResponse } from '../types';

interface SummonsFormProps {
  onSuccess: (data: SubmissionRecord) => void;
  gasUrl: string;
}

export const SummonsForm: React.FC<SummonsFormProps> = ({ onSuccess, gasUrl }) => {
  const [nama, setNama] = useState('');
  const [selectedReason, setSelectedReason] = useState<ReasonOptionId>('siap');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Dodge button state
  const [dodgePos, setDodgePos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [tauntIndex, setTauntIndex] = useState(0);
  const [showTaunt, setShowTaunt] = useState(false);
  const [deniedModal, setDeniedModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dodgeBtnRef = useRef<HTMLButtonElement>(null);

  const taunts = [
    'Eits, gak kena! 😜',
    'Mau kabur kemana lu?! 🏃‍♂️',
    'Wajib ikut, jangan bikin alasan! ☕',
    'Tombol ini cuma pajangan bro!',
    'Alibi ditolak hakim tongkrongan! ⚖️',
    'Mending klik yang ijo aja ndan! 👉',
    'Lu kira gampang lari dari WKS? 😂',
    'Kursor lu terlalu lambat bos! ⚡',
  ];

  const loadingMessages = [
    '🔍 Memvalidasi identitas tersangka...',
    '🛰️ Memeriksa keabsahan alibi ke satelit...',
    '📋 Mengirim berkas perkara ke Google Spreadsheet...',
    '☕ Menyegel meja & memesan kursi di WKS...',
  ];

  // Logic to dodge when mouse enters or moves near
  const handleDodge = (e?: React.MouseEvent | React.TouchEvent) => {
    sound.playDodge();
    setDodgeCount((prev) => prev + 1);
    setTauntIndex((prev) => (prev + 1) % taunts.length);
    setShowTaunt(true);

    // Calculate boundary within parent container or viewport
    const container = containerRef.current;
    const maxX = container ? Math.min(container.clientWidth / 2 - 60, 180) : 120;
    const maxY = 65;

    // Pick a new position that is substantially different from current
    let newX = (Math.random() * 2 - 1) * maxX;
    let newY = (Math.random() * 2 - 1) * maxY;

    // Keep distance
    if (Math.abs(newX - dodgePos.x) < 40) {
      newX = newX > 0 ? newX + 50 : newX - 50;
    }

    setDodgePos({ x: newX, y: newY });
  };

  // If someone manages to click "Gak Ikut" (via Tab or ultra-fast touch)
  const handleForceClickGakIkut = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playDenied();
    handleDodge();
    setDeniedModal(true);
  };

  // Cycle loading messages when submitting
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nama.trim()) {
      sound.playDenied();
      setErrorMsg('Nama Tersangka wajib diisi! Jangan anonim kayak hacker.');
      return;
    }

    sound.playClick();
    setIsLoading(true);

    const reasonLabels: Record<ReasonOptionId, string> = {
      siap: 'Siap, Gasss Ndan!',
      takut_pasangan: 'Gak bisa, aku takut istri/pacar',
      gak_ada_duit: 'Gak ada duit',
    };

    const chosenReasonText = reasonLabels[selectedReason];

    try {
      // First attempt: call local /api/submit
      const payload = {
        name: nama.trim(),
        reason: chosenReasonText,
        gasUrl: gasUrl || undefined,
      };

      let response: Response | null = null;
      let resultData: SubmitResponse | null = null;

      try {
        response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          resultData = await response.json();
        }
      } catch (backendErr) {
        console.warn('Backend /api/submit fetch error, falling back:', backendErr);
      }

      // If user has directly configured a Google Apps Script Web App URL and client wants direct post:
      if (gasUrl && (!response || !response.ok)) {
        try {
          await fetch(gasUrl, {
            method: 'POST',
            mode: 'no-cors', // Standard Google Apps Script cross-origin submission
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: nama.trim(),
              reason: chosenReasonText,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (gasErr) {
          console.warn('Direct GAS post warning:', gasErr);
        }
      }

      // Formulate successful record
      const finalRecord: SubmissionRecord = resultData?.data || {
        id: `sub-${Date.now()}`,
        name: nama.trim(),
        reason: chosenReasonText,
        reasonId: selectedReason,
        timestamp: new Date().toISOString(),
        status:
          selectedReason === 'takut_pasangan'
            ? 'TERPANTAU CEMEN'
            : selectedReason === 'gak_ada_duit'
            ? 'DONASI AIR PUTIH'
            : 'SIAP TEMPUR NONGKRONG',
      };

      // Play victory sound & invoke success
      sound.playSuccess();
      onSuccess(finalRecord);
    } catch (err: unknown) {
      console.error(err);
      sound.playDenied();
      setErrorMsg('Gagal mengirim alibi. Coba periksa koneksi internet atau coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Dossier Watermark */}
      <div className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-widest text-slate-500/40 border border-slate-700/30 px-2 py-0.5 rounded select-none pointer-events-none">
        FORM-BAP-0900
      </div>

      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span>BERITA ACARA PENGAKUAN TERSANGKA</span>
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Silakan isi pengakuan Anda di bawah sumpah pertemanan yang sah.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Nama Tersangka */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Nama Tersangka (Nama Kamu): <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => {
                setNama(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Contoh: Budi 'Si Ahli Bikin Janji Palsu'"
              maxLength={60}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-sans"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 font-mono">
            Gunakan nama asli atau nama panggilan yang diakui oleh sirkel.
          </p>
        </div>

        {/* Radio Button: Alasan Kehadiran */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Alasan Kehadiran:
          </label>

          <div className="space-y-3">
            {/* Opsi A: Siap, Gasss Ndan! (Opsi normal) */}
            <label
              className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                selectedReason === 'siap'
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-950/40'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
              }`}
              onClick={() => {
                sound.playClick();
                setSelectedReason('siap');
              }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="alasan"
                  value="siap"
                  checked={selectedReason === 'siap'}
                  onChange={() => setSelectedReason('siap')}
                  className="h-4 w-4 text-emerald-500 accent-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-sm sm:text-base font-semibold text-slate-100">
                  Siap, Gasss Ndan!
                </span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Pria Sejati
              </span>
            </label>

            {/* Opsi B: Gak bisa, aku takut istri/pacar */}
            <div className="space-y-2">
              <label
                className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedReason === 'takut_pasangan'
                    ? 'border-red-500 bg-red-950/20 shadow-md shadow-red-950/40'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
                onClick={() => {
                  sound.playClick();
                  setSelectedReason('takut_pasangan');
                }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="alasan"
                    value="takut_pasangan"
                    checked={selectedReason === 'takut_pasangan'}
                    onChange={() => setSelectedReason('takut_pasangan')}
                    className="h-4 w-4 text-red-500 accent-red-500 focus:ring-red-500 cursor-pointer"
                  />
                  <span className="text-sm sm:text-base font-semibold text-slate-100">
                    Gak bisa, aku takut istri/pacar
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  Bucin Akut
                </span>
              </label>

              {/* Required Sarkas Red Text under option B */}
              {selectedReason === 'takut_pasangan' && (
                <div className="rounded-lg border border-red-800/80 bg-red-950/60 p-3 text-red-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
                  <AlertOctagon className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Cemen banget, mending pake daster aja! 👗😭</span>
                </div>
              )}
            </div>

            {/* Opsi C: Gak ada duit */}
            <div className="space-y-2">
              <label
                className={`relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedReason === 'gak_ada_duit'
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-950/40'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
                onClick={() => {
                  sound.playClick();
                  setSelectedReason('gak_ada_duit');
                }}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="alasan"
                    value="gak_ada_duit"
                    checked={selectedReason === 'gak_ada_duit'}
                    onChange={() => setSelectedReason('gak_ada_duit')}
                    className="h-4 w-4 text-cyan-500 accent-cyan-500 focus:ring-cyan-500 cursor-pointer"
                  />
                  <span className="text-sm sm:text-base font-semibold text-slate-100">
                    Gak ada duit
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Kanker (Kantong Kering)
                </span>
              </label>

              {/* Required Sarkas Text under option C */}
              {selectedReason === 'gak_ada_duit' && (
                <div className="rounded-lg border border-cyan-800/80 bg-cyan-950/60 p-3 text-cyan-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Tenang, air putih gratis kok di sana. 💧☕</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="rounded-lg border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300 font-mono">
            {errorMsg}
          </div>
        )}

        {/* ACTION BUTTONS AREA (Button 1: GAS BERANGKAT!, Button 2: Gak Ikut - DODGING) */}
        <div
          ref={containerRef}
          className="relative pt-4 min-h-[140px] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80"
        >
          {/* Tombol 1: GAS BERANGKAT! (Besar, Hijau Terang, Loading State) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:flex-1 py-4 px-8 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-base sm:text-lg tracking-wider rounded-xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-slate-950" />
                <span className="font-mono text-sm sm:text-base">
                  {loadingMessages[loadingStep]}
                </span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>GAS BERANGKAT!</span>
              </>
            )}
          </button>

          {/* Tombol 2: Gak Ikut (Warna abu-abu kusam. LARI/MENGHINDAR kalau kursor mendekat!) */}
          <div className="relative w-full sm:w-auto flex justify-center items-center py-2 sm:py-0">
            <button
              ref={dodgeBtnRef}
              type="button"
              onMouseEnter={() => handleDodge()}
              onMouseMove={() => handleDodge()}
              onTouchStart={(e) => {
                e.preventDefault();
                handleDodge(e);
              }}
              onClick={handleForceClickGakIkut}
              style={{
                transform: `translate3d(${dodgePos.x}px, ${dodgePos.y}px, 0)`,
                transition: 'transform 0.14s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
                willChange: 'transform',
              }}
              className="py-3.5 px-6 bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-slate-300 font-semibold text-sm rounded-xl border border-slate-700/80 cursor-not-allowed select-none whitespace-nowrap shadow-md"
            >
              Gak Ikut
            </button>
          </div>
        </div>

        {/* Taunt Speech Bubble / Counter when the button runs away */}
        {showTaunt && dodgeCount > 0 && (
          <div className="text-center font-mono text-xs text-amber-400 bg-amber-950/30 border border-amber-800/40 rounded-lg p-2.5 transition-all">
            <span className="font-bold text-amber-300">{taunts[tauntIndex]}</span>{' '}
            <span className="text-slate-400">
              (Status kabur: {dodgeCount}x gagal. Opsi ini terkunci otomatis!)
            </span>
          </div>
        )}
      </form>

      {/* Denied modal if user managed to trigger Gak Ikut */}
      {deniedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl border-2 border-red-600 bg-slate-950 p-6 text-center shadow-2xl animate-shake">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center text-red-500 text-3xl font-mono font-bold">
              ✕
            </div>
            <h3 className="text-xl font-black text-red-500 tracking-wide uppercase font-mono">
              AKSES DITOLAK KERAS!
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed font-sans">
              Berdasarkan Pasal 1 Ayat 1 KUHP Tongkrongan, tombol <span className="text-red-400 font-bold">&quot;Gak Ikut&quot;</span> dinyatakan ilegal dan melanggar ketertiban umum.
            </p>
            <p className="mt-3 text-xs text-amber-400 font-mono">
              Sanksi: Anda dipaksa mengklik tombol hijau &quot;GAS BERANGKAT!&quot;
            </p>
            <button
              onClick={() => {
                sound.playClick();
                setDeniedModal(false);
              }}
              className="mt-5 w-full rounded-xl bg-emerald-500 py-3 font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Baiklah, Saya Insaf & Siap Hadir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
