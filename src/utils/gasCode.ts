export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * ====================================================================
 * SCRIPT GOOGLE APPS SCRIPT (GAS) - PENERIMA FORM SURAT PEMANGGILAN
 * ====================================================================
 * 
 * CARA PASANG:
 * 1. Buka Google Spreadsheet baru (atau yang sudah ada) di drive.google.com
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script"
 * 3. Hapus semua kode default di Code.gs, lalu Paste (tempel) seluruh kode di bawah ini.
 * 4. Klik ikon Disket (Save / Simpan).
 * 5. Klik tombol biru "Terapkan" (Deploy) di kanan atas > "Penerapan Baru" (New deployment).
 * 6. Pilih jenis: "Aplikasi Web" (Web app).
 * 7. Konfigurasi:
 *    - Deskripsi: "Webhook Surat Nongkrong WKS"
 *    - Jalankan sebagai (Execute as): "Saya" (Me / akun email Anda)
 *    - Yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> PENTING! Agar bisa diakses dari web.
 * 8. Klik "Terapkan" (Deploy), lalu izinkan izin akses Google jika diminta.
 * 9. Salin URL Aplikasi Web (Web App URL) yang berakhiran "/exec".
 * 10. Masukkan URL tersebut ke pengaturan di website ini atau di file .env.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Kunci script selama 10 detik agar tidak ada data bertabrakan saat submit bersamaan
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Inisialisasi Header otomatis di Baris 1 jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Submit", 
        "Nama Tersangka", 
        "Alasan Kehadiran", 
        "Status Vonis Intel", 
        "Catatan Intelijen"
      ]);
      // Beri warna latar abu-abu gelap & teks tebal untuk header
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#202124").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Parse data JSON yang dikirimkan oleh web
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        // Fallback jika dikirim via URL encoded form data
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var nama = data.name || data.nama || "Tersangka Anonim";
    var alasan = data.reason || data.alasan || "Siap, Gasss Ndan!";
    var status = data.status || "SIAP TEMPUR NONGKRONG";
    
    // Catatan humor intelijen berdasarkan alasan
    var catatan = "Aman terkendali";
    if (alasan.toLowerCase().indexOf("istri") !== -1 || alasan.toLowerCase().indexOf("pacar") !== -1) {
      catatan = "⚠️ AWAS: Terindikasi cemen, pantau keberadaannya di rumah!";
    } else if (alasan.toLowerCase().indexOf("duit") !== -1) {
      catatan = "💧 Siapkan galon air putih + gratisan es teh manis.";
    }

    var waktuWIB = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB";

    // Masukkan baris baru ke Google Sheet
    sheet.appendRow([
      waktuWIB,
      nama,
      alasan,
      status,
      catatan
    ]);

    // Berikan respons sukses format JSON
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data tersangka berhasil diamankan ke Google Sheets WKS!",
      row: sheet.getLastRow(),
      nama: nama
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Endpoint GET untuk tes koneksi langsung di browser
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "Badan Intelijen Nongkrong (BIN) - Google Sheets Webhook",
    time: new Date().toString()
  })).setMimeType(ContentService.MimeType.JSON);
}
`;

export const NEXTJS_PAGE_CODE = `// ====================================================================
// FILE: app/page.tsx (Next.js 14 / 15 App Router)
// ====================================================================
'use client';

import React, { useState, useRef } from 'react';

export default function SuratPemanggilanPage() {
  const [nama, setNama] = useState('');
  const [alasan, setAlasan] = useState('Siap, Gasss Ndan!');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [taunt, setTaunt] = useState('');
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });

  const taunts = [
    'Eits, gak kena! 😜',
    'Mau kabur kemana lu?! 🏃‍♂️',
    'Wajib ikut pokoknya!',
    'Tombol ini cuma pajangan bro!',
    'Alibi ditolak hakim tongkrongan! ⚖️',
    'Mending klik yang ijo aja! 👉',
  ];

  const handleDodge = () => {
    // Generate random offset within container bounds
    const randomX = (Math.random() - 0.5) * 260;
    const randomY = (Math.random() - 0.5) * 140;
    setButtonPos({ x: randomX, y: randomY });
    setDodgeCount((prev) => prev + 1);
    setTaunt(taunts[Math.floor(Math.random() * taunts.length)]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      alert('Nama Tersangka wajib diisi ndan!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nama, reason: alasan }),
      });

      if (res.ok) {
        setModalOpen(true);
      } else {
        alert('Gagal mengirim data. Coba lagi!');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Classified Watermark */}
        <div className="absolute top-4 right-4 border-2 border-red-500/30 text-red-500/40 font-mono text-xs px-2 py-0.5 rounded rotate-6 select-none">
          RAHASIA NEGARA // TOP SECRET
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
            KORPS TONGKRONGAN SANTUY INDONESIA
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            SURAT PEMANGGILAN RESMI: NONGKRONG DARURAT
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Berdasarkan pasal pertemanan, Anda diwajibkan hadir pada:
          </p>
        </div>

        {/* Detail Acara Card */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 sm:p-5 mb-6 space-y-3 font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span className="text-slate-400">Lokasi:</span>
            <span className="text-emerald-400 font-bold">WKS (Wajib Kumpul Sini)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⏰</span>
            <span className="text-slate-400">Waktu:</span>
            <span className="text-amber-400 font-bold">Jam 09.00 (Teng! Telat = Bayarin Kopi)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👗</span>
            <span className="text-slate-400">Dresscode:</span>
            <span className="text-slate-200">Bebas asal pakai baju.</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Nama Tersangka (Nama Kamu): <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Budi 'Si Banyak Alasan'"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Radio Alasan Kehadiran */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Alasan Kehadiran:
            </label>
            <div className="space-y-3">
              {/* Opsi 1 */}
              <label className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition">
                <input
                  type="radio"
                  name="alasan"
                  value="Siap, Gasss Ndan!"
                  checked={alasan === 'Siap, Gasss Ndan!'}
                  onChange={(e) => setAlasan(e.target.value)}
                  className="w-4 h-4 text-emerald-500 accent-emerald-500"
                />
                <span className="text-sm font-medium text-slate-200">Siap, Gasss Ndan!</span>
              </label>

              {/* Opsi 2 */}
              <div>
                <label className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="radio"
                    name="alasan"
                    value="Gak bisa, aku takut istri/pacar"
                    checked={alasan === 'Gak bisa, aku takut istri/pacar'}
                    onChange={(e) => setAlasan(e.target.value)}
                    className="w-4 h-4 text-red-500 accent-red-500"
                  />
                  <span className="text-sm font-medium text-slate-200">
                    Gak bisa, aku takut istri/pacar
                  </span>
                </label>
                {alasan === 'Gak bisa, aku takut istri/pacar' && (
                  <p className="mt-2 text-xs font-semibold text-red-400 bg-red-950/40 border border-red-900/50 px-3 py-2 rounded-md animate-pulse">
                    ⚠️ Cemen banget, mending pake daster aja!
                  </p>
                )}
              </div>

              {/* Opsi 3 */}
              <div>
                <label className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="radio"
                    name="alasan"
                    value="Gak ada duit"
                    checked={alasan === 'Gak ada duit'}
                    onChange={(e) => setAlasan(e.target.value)}
                    className="w-4 h-4 text-cyan-500 accent-cyan-500"
                  />
                  <span className="text-sm font-medium text-slate-200">Gak ada duit</span>
                </label>
                {alasan === 'Gak ada duit' && (
                  <p className="mt-2 text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-900/50 px-3 py-2 rounded-md">
                    💡 Tenang, air putih gratis kok di sana.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-2 relative min-h-[90px] flex flex-col sm:flex-row items-center gap-4">
            {/* Tombol GAS BERANGKAT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 py-4 px-6 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-base tracking-wide rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-lg">⏳</span> Memvalidasi Alibi...
                </>
              ) : (
                'GAS BERANGKAT!'
              )}
            </button>

            {/* Tombol Gak Ikut (LARI / MENGHINDAR) */}
            <div className="relative w-full sm:w-auto flex justify-center">
              <button
                type="button"
                onMouseEnter={handleDodge}
                onTouchStart={handleDodge}
                onClick={handleDodge}
                style={{
                  transform: \`translate(\${buttonPos.x}px, \${buttonPos.y}px)\`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="py-4 px-6 bg-slate-800 text-slate-400 hover:text-slate-300 font-semibold text-sm rounded-xl border border-slate-700 cursor-not-allowed select-none whitespace-nowrap shadow"
              >
                Gak Ikut
              </button>
            </div>
          </div>

          {/* Taunt text saat tombol lari */}
          {dodgeCount > 0 && (
            <p className="text-center text-xs font-mono text-amber-400 italic">
              {taunt} (Percobaan kabur: {dodgeCount}x gagal)
            </p>
          )}
        </form>

        {/* Modal Sukses SweetAlert Style */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                ☕
              </div>
              <h3 className="text-xl font-bold text-white mb-2">PANGGILAN DITERIMA!</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Data terekam! Jangan lupa mandi sebelum ke WKS. Sampai jumpa jam 09.00!
              </p>
              <button
                onClick={() => setModalOpen(false)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition"
              >
                Siap, Laksanakan!
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
`;

export const NEXTJS_API_ROUTE_CODE = `// ====================================================================
// FILE: app/api/submit/route.ts (Next.js 14 / 15 Route Handler)
// ====================================================================
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, reason } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nama Tersangka wajib diisi' },
        { status: 400 }
      );
    }

    // URL Google Apps Script Web App Anda (Simpan di .env.local: GOOGLE_SHEETS_WEBAPP_URL)
    const gasUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL || 'https://script.google.com/macros/s/AKfycbzHWdTftVJxH5j71RMr3LOpgK1Ds9LfyF-1KW5BuDkc3gmcf3QxdlrhGbHO0VwJmJsX6Q/exec';

    if (gasUrl) {
      try {
        await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            reason,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (gasError) {
        console.warn('Gagal meneruskan ke Google Sheets:', gasError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data terekam! Jangan lupa mandi sebelum ke WKS. Sampai jumpa jam 09.00!',
      data: { name, reason, timestamp: new Date().toISOString() },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
`;
