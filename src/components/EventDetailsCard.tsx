import React, { useState } from 'react';
import { MapPin, Clock, Shirt, AlertTriangle, CalendarPlus, ExternalLink } from 'lucide-react';
import { sound } from '../utils/sound';

export const EventDetailsCard: React.FC = () => {
  const [calendarSaved, setCalendarSaved] = useState(false);

  const handleAddToCalendar = () => {
    sound.playClick();
    // Generate .ics calendar event for Jam 09:00 WIB
    const now = new Date();
    // Target next 09:00 AM
    const target = new Date();
    target.setHours(9, 0, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    const formatDateForIcs = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const startTime = formatDateForIcs(target);
    const endTime = formatDateForIcs(new Date(target.getTime() + 3 * 60 * 60 * 1000)); // 3 hours

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BIN Santuy//Nongkrong Darurat//ID',
      'BEGIN:VEVENT',
      `SUMMARY:🚨 NONGKRONG DARURAT: WKS (Wajib Kumpul Sini)`,
      `DESCRIPTION:Panggilan Resmi: Telat = Bayarin Kopi seisi meja! Dresscode: Bebas asal pakai baju.`,
      `LOCATION:WKS (Wajib Kumpul Sini)`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Panggilan_Nongkrong_WKS_0900.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCalendarSaved(true);
    setTimeout(() => setCalendarSaved(false), 3000);
  };

  const handleOpenMaps = () => {
    sound.playClick();
    window.open('https://www.google.com/maps/search/Warung+Kopi+Terdekat', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-xl backdrop-blur-sm">
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-red-500" />

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            RINCIAN SURAT TUNTUTAN NONGKRONG
          </span>
          <span className="text-[11px] font-mono text-slate-500">KODE TEMPAT: WKS-01</span>
        </div>

        {/* 3 Main Items Required by Prompt */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 📍 Lokasi: WKS (Wajib Kumpul Sini) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-emerald-500/40 hover:bg-slate-950">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-xs font-mono uppercase text-slate-400">Lokasi Penahanan</span>
            </div>
            <h3 className="text-base font-bold text-emerald-400">
              WKS (Wajib Kumpul Sini)
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Tempat biasa, jangan pura-pura lupa alamat tongkrongan.
            </p>
            <button
              onClick={handleOpenMaps}
              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400/90 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <span>Lihat Petunjuk Arah</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          {/* ⏰ Waktu: Jam 09.00 (Teng! Telat = Bayarin Kopi) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-amber-500/40 hover:bg-slate-950">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-xs font-mono uppercase text-slate-400">Waktu Eksekusi</span>
            </div>
            <h3 className="text-base font-bold text-amber-400">
              Jam 09.00 Teng!
            </h3>
            <p className="mt-1 text-xs font-semibold text-red-400">
              ⚠️ Telat = Bayarin Kopi seisi meja!
            </p>
            <button
              onClick={handleAddToCalendar}
              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <CalendarPlus className="h-3 w-3" />
              <span>{calendarSaved ? '✓ Tersimpan di Kalender' : 'Simpan Alarm Kalender'}</span>
            </button>
          </div>

          {/* 👗 Dresscode: Bebas asal pakai baju. */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-cyan-500/40 hover:bg-slate-950">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Shirt className="h-4 w-4" />
              </div>
              <span className="text-xs font-mono uppercase text-slate-400">Ketentuan Busana</span>
            </div>
            <h3 className="text-base font-bold text-slate-100">
              Bebas asal pakai baju
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Celana pendek, kaos oblong santai diperbolehkan. Dilarang telanjang dada.
            </p>
          </div>
        </div>

        {/* Humorous Pasal Box */}
        <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/20 p-3.5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed font-sans">
            <span className="font-bold text-red-400 font-mono">PASAL 33 AYAT 4 KUHP (KITAB UNDANG-UNDANG HUKUM PERTEMANAN):</span>{' '}
            Setiap rekan yang diundang nongkrong dan melakukan manuver wacana seperti &quot;ngabarin nanti ya&quot; atau &quot;masih ada urusan mendadak&quot;, secara sah dan meyakinkan dapat dijatuhi vonis membayar gorengan serta dicap sebagai &quot;Raja Wacana Abadi&quot;.
          </div>
        </div>
      </div>
    </div>
  );
};
