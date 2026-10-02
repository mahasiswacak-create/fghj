import React, { useEffect, useState } from 'react';
import { CheckCircle2, Share2, Printer, X, Sparkles, Coffee } from 'lucide-react';
import { SubmissionRecord } from '../types';
import { sound } from '../utils/sound';

interface SuccessModalProps {
  submission: SubmissionRecord;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ submission, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Play stamp sound effect when modal opens
    sound.playStamp();
  }, []);

  const shareText = `🚨 *SURAT PEMANGGILAN RESMI: NONGKRONG DARURAT* 🚨\n\n` +
    `Saya atas nama: *${submission.name}*\n` +
    `Menyatakan: *${submission.reason}*\n` +
    `Status: *${submission.status}*\n\n` +
    `📍 Lokasi: WKS (Wajib Kumpul Sini)\n` +
    `⏰ Waktu: Jam 09.00 Teng!\n` +
    `👗 Dresscode: Bebas asal pakai baju.\n\n` +
    `*Catatan:* Jangan lupa mandi sebelum ke WKS! Telat = Bayarin Kopi seisi meja! ☕💨`;

  const handleShareWhatsApp = () => {
    sound.playClick();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = async () => {
    sound.playClick();
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border-2 border-emerald-500/60 bg-slate-950 p-6 sm:p-8 text-center shadow-2xl overflow-hidden font-sans">
        {/* Glow ambient */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* SweetAlert icon style */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 shadow-inner">
          <Coffee className="h-10 w-10 text-emerald-400 animate-pulse" />
        </div>

        {/* Big Official Stamp Banner */}
        <div className="inline-block mb-3 px-3 py-1 rounded border-2 border-emerald-500/80 bg-emerald-950/40 text-emerald-400 font-mono text-xs font-black uppercase tracking-widest rotate-[-1deg] shadow-lg">
          ✓ TERDAFTAR DI INTELIJEN WKS
        </div>

        {/* The Exact Message Requested by User */}
        <h3 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
          BERKAS RESMI TEREKAM!
        </h3>

        <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-emerald-200 text-sm sm:text-base font-semibold leading-relaxed">
          &ldquo;Data terekam! Jangan lupa mandi sebelum ke WKS. Sampai jumpa jam 09.00!&rdquo;
        </div>

        {/* Dossier Summary Card */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-left font-mono text-xs text-slate-300 space-y-2">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Nama Tersangka:</span>
            <span className="font-bold text-white text-right">{submission.name}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Alasan Kehadiran:</span>
            <span className="font-bold text-emerald-400 text-right">{submission.reason}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-500">Jadwal Nongkrong:</span>
            <span className="font-bold text-amber-400">Jam 09.00 WIB (WKS)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Vonis Hakim:</span>
            <span className="font-bold text-red-400 uppercase">Wajib Hadir (Telat = Bayar Kopi)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>Bagikan Bukti ke WhatsApp Grup</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyText}
              className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{copied ? 'Tersalin!' : 'Salin Teks BAP'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span>Cetak Bukti</span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Tutup & Siap-siap Mandi 🚿
          </button>
        </div>
      </div>
    </div>
  );
};
