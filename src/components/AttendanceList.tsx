import React from 'react';
import { Users, Clock, ShieldAlert, Award, Droplets } from 'lucide-react';
import { SubmissionRecord } from '../types';

interface AttendanceListProps {
  submissions: SubmissionRecord[];
}

export const AttendanceList: React.FC<AttendanceListProps> = ({ submissions }) => {
  const getBadge = (reason: string) => {
    if (reason.toLowerCase().includes('istri') || reason.toLowerCase().includes('pacar')) {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-red-950/60 border border-red-800/80 px-2 py-0.5 text-[10px] font-mono font-bold text-red-400">
          <ShieldAlert className="h-3 w-3" />
          <span>TERPANTAU CEMEN</span>
        </span>
      );
    }
    if (reason.toLowerCase().includes('duit')) {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-400">
          <Droplets className="h-3 w-3" />
          <span>TIM AIR PUTIH</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
        <Award className="h-3 w-3" />
        <span>PASUKAN GAS</span>
      </span>
    );
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold text-white font-sans">
            DAFTAR TERSANGKA YANG SUDAH MENYERAHKAN DIRI
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Total: <span className="text-emerald-400 font-bold">{submissions.length}</span> orang
        </span>
      </div>

      <div className="mt-4 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {submissions.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-slate-500">
            Belum ada tersangka yang mengaku. Jadilah yang pertama menyerahkan diri!
          </div>
        ) : (
          submissions.map((sub, idx) => (
            <div
              key={sub.id || idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-950 transition-colors gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-lg bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{sub.name}</h4>
                  <p className="text-xs text-slate-400 italic">&ldquo;{sub.reason}&rdquo;</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center">
                {getBadge(sub.reason)}
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(sub.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
