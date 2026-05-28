import React, { useState, useMemo, useEffect, useRef } from 'react';
import './App.css';

const API_URL = '/api';

// ─── DATA (dihapus, sekarang dari database) ────────────────────────────────
// Data diambil dari server SQLite

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
function AnimatedCounter({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count}</span>;
}

// ─── LOGO ────────────────────────────────────────────────────────────────────
function SkillShiftLogo({ onClick, small }) {
  return (
    <div
      className={`flex items-center ${small ? 'gap-2.5' : 'gap-3'} cursor-pointer group`}
      onClick={onClick}
    >
      {/* Icon */}
      <div className={`${small ? 'w-10 h-10' : 'w-12 h-12'} relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a0a15"/>
              <stop offset="100%" stopColor="#6b1020"/>
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8c97a"/>
              <stop offset="100%" stopColor="#c99042"/>
            </linearGradient>
          </defs>
          {/* Base */}
          <rect width="48" height="48" rx="13" fill="url(#bgGrad)"/>
          {/* Gold border tipis */}
          <rect x="1.5" y="1.5" width="45" height="45" rx="12" stroke="url(#goldGrad)" strokeWidth="0.8" strokeOpacity="0.5"/>
          {/* Diagonal accent line kiri */}
          <line x1="8" y1="40" x2="20" y2="8" stroke="#c99042" strokeWidth="0.6" strokeOpacity="0.25"/>
          {/* Huruf S elegan */}
          <path
            d="M15.5 18.5C15.5 15.5 17.8 13.5 21 13.5H27.5C30.2 13.5 32.5 15.5 32.5 18C32.5 20.8 30.2 22.5 27 22.5H21C17.8 22.5 15.5 24.8 15.5 27.5C15.5 30.5 17.8 32.5 21 32.5H28C30.8 32.5 33 30.5 33 27.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Gold dot aksen pojok kanan atas */}
          <circle cx="37" cy="11" r="2.5" fill="url(#goldGrad)"/>
          {/* Gold line bawah kecil */}
          <line x1="16" y1="38" x2="32" y2="38" stroke="url(#goldGrad)" strokeWidth="0.8" strokeOpacity="0.4"/>
        </svg>
      </div>

      {/* Text */}
      <div className="group-hover:translate-x-0.5 transition-transform duration-300">
        <div className={`${small ? 'text-[15px]' : 'text-[21px]'} leading-none tracking-tight flex items-baseline gap-[1px]`}>
          <span className="font-black" style={{ color: '#6b1020' }}>Skill</span>
          <span className="font-black text-gray-900">Shift</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="h-[1px] w-3 bg-gradient-to-r from-[#c99042] to-transparent"/>
          <span className="text-[6.5px] uppercase tracking-[.4em] font-black" style={{ color: '#c99042' }}>
            career portal
          </span>
          <div className="h-[1px] w-3 bg-gradient-to-l from-[#c99042] to-transparent"/>
        </div>
      </div>
    </div>
  );
}

// ─── DROPDOWN FILTER ─────────────────────────────────────────────────────────
function DropdownFilter({ label, options, selected, onSelect, multi = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  const isActive = multi
    ? selected.length > 0 && !(selected.length === 1 && selected[0] === 'Semua')
    : selected !== 'Semua';

  const handleSelect = (opt) => {
    if (!multi) {
      onSelect(opt);
      setOpen(false);
    } else {
      if (opt === 'Semua') {
        onSelect(['Semua']);
        return;
      }
      const current = selected.filter((s) => s !== 'Semua');
      if (current.includes(opt)) {
        const next = current.filter((s) => s !== opt);
        onSelect(next.length === 0 ? ['Semua'] : next);
      } else onSelect([...current, opt]);
    }
  };

  const displayLabel = multi
    ? selected[0] === 'Semua' || selected.length === 0
      ? label
      : selected.join(', ')
    : selected === 'Semua'
      ? label
      : selected;

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-bold text-gray-800 transition-all whitespace-nowrap min-w-[130px] justify-between hover:text-maroon rounded-xl hover:bg-maroon/5 ${isActive ? 'text-maroon bg-maroon/5' : ''}`}
      >
        <span className="truncate max-w-[110px]">{displayLabel}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? 'rotate-180 text-maroon' : 'text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-3 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-2xl py-3 min-w-[180px] max-h-56 overflow-y-auto"
          style={{ zIndex: 99999 }}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((opt) => {
            const isSel = multi ? selected.includes(opt) : selected === opt;
            return (
              <button
                key={opt}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt);
                }}
                className={`w-full text-left px-5 py-2.5 text-[12px] font-bold transition-all flex items-center gap-3 ${isSel ? 'text-maroon bg-maroon/5' : 'text-gray-600 hover:bg-gray-50 hover:text-maroon'}`}
              >
                {multi && (
                  <span
                    className={`w-4 h-4 border rounded-md flex-shrink-0 flex items-center justify-center transition-all ${isSel ? 'bg-maroon border-maroon' : 'border-gray-300'}`}
                  >
                    {isSel && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={4}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                )}
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ADMIN PASSWORD MODAL ────────────────────────────────────────────────────
function AdminPasswordModal({ onSuccess, onClose }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState(false);
  const handle = () => {
    if (pwd === 'WebAdor') onSuccess();
    else {
      setErr(true);
      setPwd('');
    }
  };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-10 max-w-sm w-full mx-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)] rounded-[32px] border border-white">
        <div className="w-16 h-16 bg-maroon/10 rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-inner">
          🔐
        </div>
        <h3 className="text-3xl font-black serif mb-2 text-gray-900">Admin Access</h3>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-8 font-semibold">
          Masukkan password admin
        </p>
        <input
          type="password"
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value);
            setErr(false);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handle()}
          placeholder="••••••••"
          autoFocus
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none p-4 text-center text-xl tracking-widest mb-4 transition-all shadow-inner"
        />
        {err && (
          <p className="text-red-500 text-xs text-center mb-4 font-bold bg-red-50 py-3 rounded-xl border border-red-100">
            Password salah. Coba lagi.
          </p>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handle}
            className="flex-1 bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white py-4 text-xs font-black uppercase tracking-widest hover:shadow-[0_8px_20px_rgba(61,10,20,0.4)] hover:-translate-y-1 transition-all rounded-xl"
          >
            Masuk
          </button>
          <button
            onClick={onClose}
            className="px-6 border-2 border-gray-200 text-xs font-bold uppercase hover:bg-gray-50 transition-all rounded-xl text-gray-600 hover:border-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── JOB DETAIL MODAL (REVISI ELEGAN) ────────────────────────────────────────
function JobDetailModal({
  job,
  profile,
  savedJobs,
  onToggleSave,
  onClose,
  onMarkAccepted,
  acceptedJobs,
}) {
  if (!job) return null;
  const isSaved = savedJobs.some((s) => s.id === job.id);
  const isAccepted = acceptedJobs.some((a) => a.id === job.id);

  const handleWhatsApp = () => {
    const text = `Halo Tim ${job.company}, saya berminat melamar posisi ${job.title} yang saya lihat di SkillShift. Mohon informasinya, terima kasih.`;
    window.open(`https://wa.me/${job.contactPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };
  const handleEmail = () => {
    const sub = encodeURIComponent(`Lamaran: ${job.title} — via SkillShift`);
    const body = encodeURIComponent(
      `Halo Tim ${job.company},\n\nSaya berminat melamar posisi ${job.title} yang saya temukan di platform SkillShift.\n\nTerima kasih.`
    );
    window.open(`mailto:${job.contactEmail}?subject=${sub}&body=${body}`, '_blank');
  };

  const typeColor = {
    Remote: 'bg-emerald-500/90 text-white border-emerald-400',
    Onsite: 'bg-maroon/90 text-white border-maroon-light',
    Hybrid: 'bg-[#c99042]/90 text-white border-[#d7bc9d]',
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center backdrop-blur-md p-0 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-slide-up shadow-[0_20px_60px_rgba(0,0,0,0.2)] rounded-t-[32px] md:rounded-[32px] border border-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        {job.image ? (
          <div className="h-64 overflow-hidden relative flex-shrink-0 rounded-t-[32px]">
            <img src={job.image} alt={job.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 hover:scale-110 transition-all text-lg border border-white/30"
            >
              ✕
            </button>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex gap-2 mb-4 flex-wrap">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border rounded-full backdrop-blur-md shadow-sm ${typeColor[job.type] || 'bg-gray-800/90 text-white border-gray-700'}`}
                >
                  {job.type}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/90 text-gray-900 border border-white rounded-full shadow-sm">
                  {job.category}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white serif leading-tight drop-shadow-md">
                {job.title}
              </h2>
              <p className="text-gray-300 text-sm font-semibold mt-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  🏢
                </span>
                {job.company}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#8b182a] to-[#5a0d1a] px-8 pt-12 pb-10 relative rounded-t-[32px] shadow-inner">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all text-lg border border-white/20"
            >
              ✕
            </button>
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/20 text-white border border-white/30 rounded-full">
                {job.type}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/20 text-white border border-white/30 rounded-full">
                {job.category}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white serif leading-tight drop-shadow-md">
              {job.title}
            </h2>
            <p className="text-[#d7bc9d] text-sm font-bold mt-3 flex items-center gap-2">
              🏢 {job.company}
            </p>
          </div>
        )}

        {/* Body Modal */}
        <div className="p-8 space-y-8">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Lokasi', value: job.location, icon: '📍' },
              { label: 'Gaji / Bulan', value: job.salary, icon: '💰' },
              { label: 'Jam Kerja', value: job.hours, icon: '⏰' },
              { label: 'Min. Usia', value: `${job.minAge} Tahun`, icon: '👤' },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-white border border-gray-100/80 rounded-2xl px-5 py-5 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 flex items-center gap-1.5">
                  <span className="text-sm">{icon}</span> {label}
                </p>
                <p className="font-black text-gray-900 text-[16px]">{value}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-maroon/10 text-maroon flex items-center justify-center text-sm">
                🎯
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                Skills Dibutuhkan
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {(Array.isArray(job.skills) ? job.skills : job.skills.split(',')).map((s) => (
                <span
                  key={s}
                  className="bg-white text-maroon text-xs font-black uppercase tracking-wider px-5 py-2 border border-maroon/10 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-maroon/10 text-maroon flex items-center justify-center text-sm">
                📋
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                Deskripsi Pekerjaan
              </p>
            </div>
            <p className="text-gray-600 text-[14px] leading-relaxed bg-white border border-gray-100/80 rounded-3xl p-6 font-medium shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              {job.description}
            </p>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-maroon/10 text-maroon flex items-center justify-center text-sm">
                📞
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
                Hubungi Rekruter
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {job.contactPhone && (
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-6 py-4 text-xs font-black uppercase tracking-widest hover:shadow-lg hover:-translate-y-1 transition-all rounded-2xl"
                >
                  <span className="text-lg">💬</span> WhatsApp
                </button>
              )}
              {job.contactEmail && (
                <button
                  onClick={handleEmail}
                  className="flex items-center justify-center gap-3 bg-white border-2 border-maroon text-maroon px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-maroon hover:text-white transition-all rounded-2xl shadow-sm hover:shadow-lg"
                >
                  <span className="text-lg">✉️</span> Email
                </button>
              )}
            </div>
          </div>

          {/* Accept/Tracking Banner */}
{!isAccepted ? (
  <div className="relative overflow-hidden rounded-3xl border border-[#e8d5b0]/60 bg-[#fdf8f0] p-6">
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c99042] via-[#e8d5b0] to-[#c99042]" />
    <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#c99042]/5" />
    <div className="flex items-center gap-4 relative z-10">
      <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8d5b0] flex items-center justify-center text-lg shadow-sm flex-shrink-0">
        🏆
      </div>
      <div className="flex-1">
        <p className="font-black text-[#7a5c2e] text-[13px] uppercase tracking-widest mb-0.5">
          Sudah Diterima?
        </p>
        <p className="text-[12px] text-[#a0845c] font-medium leading-relaxed">
          Tandai untuk melacak progres karirmu.
        </p>
      </div>
      <button
        onClick={() => { onMarkAccepted(job); onClose(); }}
        className="flex-shrink-0 bg-[#7a5c2e] text-white px-5 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#5c4020] hover:shadow-md transition-all"
      >
        Tandai ✓
      </button>
    </div>
  </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/60 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-black text-emerald-900 text-lg">Sudah Ditandai Diterima!</p>
                <p className="text-sm text-emerald-700/80 font-medium mt-0.5">
                  Cek progres lamaranmu di tab <strong>Diterima</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2">
            <button
              onClick={() => onToggleSave(job)}
              className={`w-full py-4 text-xs font-black uppercase tracking-widest border-2 transition-all rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 ${isSaved ? 'bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white border-maroon' : 'bg-white text-maroon border-maroon hover:bg-maroon hover:text-white'}`}
            >
              {isSaved ? '🔖 Lowongan Tersimpan' : '🔖 Simpan Lowongan Ini'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ACCEPTED CARD ────────────────────────────────────────────────────────────
function AcceptedCard({ job, onRemove }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-maroon/30 transition-all group overflow-hidden rounded-3xl">
      <div className="flex">
        <div className="w-2.5 bg-gradient-to-b from-emerald-400 to-emerald-600 flex-shrink-0" />
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1 rounded-full">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Accepted
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {job.acceptedDate}
                </span>
              </div>
              <h3 className="font-black text-gray-900 text-lg leading-tight truncate">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                {job.company} · <span className="text-maroon font-black">{job.salary}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-gray-50 px-2 py-1 rounded-md text-gray-500 font-semibold border border-gray-100">
                  📍 {job.location}
                </span>
                <span className="text-xs bg-gray-50 px-2 py-1 rounded-md text-gray-500 font-semibold border border-gray-100">
                  {job.type}
                </span>
              </div>
            </div>
            <button
              onClick={onRemove}
              title="Hapus dari riwayat"
              className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-3 hover:bg-red-50 rounded-2xl border border-transparent hover:border-red-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── JOB CARD ──────────────────────────────────────────────────────────────
function JobCard({ job, savedJobs, onSave, onSelect }) {
  const isSaved = savedJobs.some((s) => s.id === job.id);
  const catIcon = {
    Kreatif: '💼',
    IT: '💻',
    'F&B': '☕',
    Pendidikan: '📚',
    Logistik: '📦',
    Kesehatan: '🏥',
    Lainnya: '💼',
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-[32px] overflow-hidden hover:shadow-[0_16px_40px_rgba(139,24,42,0.08)] hover:-translate-y-1 transition-all group border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col pb-3 relative">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-maroon-light to-[#d7bc9d] opacity-0 group-hover:opacity-100 transition-opacity z-10" />

      <div className="relative h-40 overflow-hidden p-3">
        <div className="relative w-full h-full rounded-[24px] overflow-hidden shadow-inner">
          <img
            src={job.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400'}
            alt={job.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-maroon shadow-sm">
            {job.type}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(job);
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all text-sm backdrop-blur-md border ${isSaved ? 'bg-maroon text-white border-maroon' : 'bg-white/90 text-gray-400 hover:text-maroon border-white hover:bg-white'}`}
          >
            🔖
          </button>
        </div>
      </div>
      <div className="px-6 py-3 flex flex-col flex-1">
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#fcf4e8] to-white border border-[#f0e4d2] text-[#c99042] px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider mb-3 w-fit shadow-sm">
          <span className="text-[12px]">{catIcon[job.category] || '💼'}</span> {job.category}
        </div>
        <h3 className="font-black text-gray-900 text-[18px] leading-tight mb-1.5 line-clamp-2">
          {job.title}
        </h3>
        <p className="text-gray-500 text-[13px] font-semibold mb-4">{job.company}</p>

        <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-5 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            <span className="text-maroon">📍</span> {job.location}
          </span>
          <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
            <span className="text-maroon">⏰</span> {job.hours}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(Array.isArray(job.skills) ? job.skills : job.skills.split(',')).slice(0, 2).map((s) => (
            <span
              key={s}
              className="bg-white text-gray-600 border border-gray-200 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm"
            >
              {s.trim()}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between mt-auto pt-5 border-t border-gray-100/80">
          <div>
            <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">
              Gaji mulai dari
            </div>
            <div className="font-black text-maroon text-[15px]">
              {job.salary}{' '}
              <span className="text-[9px] text-gray-400 font-bold ml-1 border-l border-gray-200 pl-2 uppercase">
                Min. {job.minAge} thn
              </span>
            </div>
          </div>
          <button
            onClick={() => onSelect(job)}
            className="w-11 h-11 bg-gradient-to-br from-[#6b1020] to-[#8b1a2e] text-white rounded-2xl flex items-center justify-center hover:shadow-[0_8px_16px_rgba(61,10,20,0.4)] hover:-translate-y-1 transition-all shadow-md text-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HERO DECORATION ─────────────────────────────────────────────────────────
function HeroDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#8b182a]/5 to-transparent" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#c99042]/5 to-transparent" />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  // Fetch jobs from API on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/jobs`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState('home');
  const jobsRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterType, setFilterType] = useState('Semua');
  const [filterHours, setFilterHours] = useState('Semua');
  const [filterCategory, setFilterCategory] = useState(['Semua']);
  const [filterLocation, setFilterLocation] = useState(['Semua']);
  const [filterSkill, setFilterSkill] = useState(['Semua']);
  const [filterPosition, setFilterPosition] = useState(['Semua']);

  const [selectedJob, setSelectedJob] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [showAdminPwd, setShowAdminPwd] = useState(false);

  const [adminImagePreview, setAdminImagePreview] = useState(null);
  const adminImageInputRef = useRef(null);
  const [adminForm, setAdminForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Onsite',
    category: 'F&B',
    skills: '',
    hours: '',
    minAge: 18,
    salary: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    image: '',
  });

  // Profile state kept purely for backend/modal data needs, UI for CV Builder is removed.
  const [profile, setProfile] = useState({
    name: 'Pelamar',
    nim: '',
    jurusan: '',
    email: '',
    phone: '',
    skills: '',
    pengalaman: '',
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
const [searchInputVal, setSearchInputVal] = useState('');

  const allTypes = useMemo(
    () => ['Semua', ...new Set(jobs.map((j) => j.type).filter(Boolean))],
    [jobs]
  );
  const allHours = useMemo(
    () => ['Semua', ...new Set(jobs.map((j) => j.hours).filter(Boolean))],
    [jobs]
  );
  const allCategories = useMemo(
    () => ['Semua', ...new Set(jobs.map((j) => j.category).filter(Boolean))],
    [jobs]
  );
  const allLocations = useMemo(
    () => ['Semua', ...new Set(jobs.map((j) => j.location).filter(Boolean))],
    [jobs]
  );
  const allSkills = useMemo(
    () => [
      'Semua',
      ...new Set(
        jobs.flatMap((j) =>
          (Array.isArray(j.skills) ? j.skills : j.skills.split(',').map((s) => s.trim())).filter(
            Boolean
          )
        )
      ),
    ],
    [jobs]
  );
  const allPositions = useMemo(
    () => ['Semua', ...new Set(jobs.map((j) => j.title).filter(Boolean))],
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    let list = jobs.filter((j) => {
      const skillArr = Array.isArray(j.skills)
        ? j.skills
        : j.skills.split(',').map((s) => s.trim());
      return (
        (j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterType === 'Semua' || j.type === filterType) &&
        (filterHours === 'Semua' || j.hours === filterHours) &&
        (filterCategory[0] === 'Semua' || filterCategory.includes(j.category)) &&
        (filterLocation[0] === 'Semua' || filterLocation.includes(j.location)) &&
        (filterSkill[0] === 'Semua' || filterSkill.some((fs) => skillArr.includes(fs))) &&
        (filterPosition[0] === 'Semua' || filterPosition.includes(j.title))
      );
    });
    if (sortBy === 'newest')
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest')
      list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [
    jobs,
    searchTerm,
    filterType,
    filterHours,
    filterCategory,
    filterLocation,
    filterSkill,
    filterPosition,
    sortBy,
  ]);

  const handleAdminImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAdminImagePreview(ev.target.result);
      setAdminForm((f) => ({ ...f, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAdminJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...adminForm,
          image: adminForm.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        }),
      });
      if (!res.ok) throw new Error('Failed to save job');
      const newJob = await res.json();
      setJobs([newJob, ...jobs]);
      setIsAdminModalOpen(false);
      setAdminImagePreview(null);
      setAdminForm({
        title: '',
        company: '',
        location: '',
        type: 'Onsite',
        category: 'F&B',
        skills: '',
        hours: '',
        minAge: 18,
        salary: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        image: '',
      });
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Gagal menyimpan lowongan: ' + err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete job');
      setJobs(jobs.filter((j) => j.id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Gagal menghapus lowongan: ' + err.message);
    }
  };

  const toggleSave = (job) =>
    setSavedJobs((prev) =>
      prev.find((s) => s.id === job.id) ? prev.filter((s) => s.id !== job.id) : [...prev, job]
    );

  const handleMarkAccepted = (job) => {
    if (!acceptedJobs.find((a) => a.id === job.id))
      setAcceptedJobs([
        ...acceptedJobs,
        { ...job, acceptedDate: new Date().toLocaleDateString('id-ID'), currentStep: 0 },
      ]);
    setActiveTab('history');
  };

  const handleNavClick = (key) => {
    if (key === 'jobs') {
  setActiveTab('jobs');
  setSearchOpen(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
    else if (key === 'admin') {
      if (isAdminAuth) setActiveTab('admin');
      else setShowAdminPwd(true);
    } else {
      setActiveTab(key);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const typeColor = {
    Remote: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Onsite: 'bg-sky-50 text-sky-700 border-sky-200',
    Hybrid: 'bg-violet-50 text-violet-700 border-violet-200',
  };
  const hasActiveFilter =
    filterType !== 'Semua' ||
    filterHours !== 'Semua' ||
    filterCategory[0] !== 'Semua' ||
    filterLocation[0] !== 'Semua' ||
    filterSkill[0] !== 'Semua' ||
    filterPosition[0] !== 'Semua';

  return (
    <div className="min-h-screen flex flex-col app-root relative">
      {/* ── NAVBAR (Enhanced Aesthetic) ── */}
      <nav className="nav-bar py-3 px-6 md:px-10 flex justify-between items-center sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-white">
        <SkillShiftLogo onClick={() => setActiveTab('home')} small />

        <div className="hidden md:flex items-center gap-9">
          {[
            { key: 'home', label: 'Beranda' },
            { key: 'jobs', label: 'Lowongan' },
            // Menu CV Builder Dihapus sepenuhnya
            { key: 'saved', label: 'Tersimpan' },
            { key: 'history', label: `Diterima (${acceptedJobs.length})` },
            { key: 'admin', label: 'Admin Panel' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`pb-1.5 pt-1.5 transition-all relative hover:text-maroon ${activeTab === item.key ? 'nav-active text-maroon' : 'nav-inactive text-gray-500'}`}
            >
              {item.label}
              {activeTab === item.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-maroon to-maroon-light rounded-full shadow-[0_2px_8px_rgba(61,10,20,0.5)]" />
              )}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => {
              alert(
                'Notifikasi berhasil diaktifkan! ✅ Kami akan mengabari Anda jika ada lowongan baru.'
              );
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-maroon/30 text-gray-400 hover:text-maroon"
            title="Aktifkan Notifikasi"
          >
            🔔
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className="bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_14px_rgba(61,10,20,0.4)] hover:shadow-[0_6px_20px_rgba(61,10,20,0.5)] hover:-translate-y-0.5 transition-all"
          >
            + Post Lowongan
          </button>
        </div>

        <button
          className="md:hidden text-2xl text-gray-700 bg-white shadow-sm w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex flex-col gap-2 z-40 shadow-xl absolute w-full left-0 top-[72px]">
          {[
            { key: 'home', label: 'Beranda' },
            { key: 'jobs', label: 'Lowongan' },
            { key: 'saved', label: 'Tersimpan' },
            { key: 'history', label: 'Diterima' },
            { key: 'admin', label: 'Admin Panel' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`text-left text-xs font-black uppercase tracking-widest py-3.5 border-b border-gray-50/50 ${activeTab === item.key ? 'text-maroon' : 'text-gray-500'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {showAdminPwd && (
        <AdminPasswordModal
          onSuccess={() => {
            setIsAdminAuth(true);
            setShowAdminPwd(false);
            setActiveTab('admin');
          }}
          onClose={() => setShowAdminPwd(false)}
        />
      )}

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          profile={profile}
          savedJobs={savedJobs}
          acceptedJobs={acceptedJobs}
          onToggleSave={toggleSave}
          onClose={() => setSelectedJob(null)}
          onMarkAccepted={handleMarkAccepted}
        />
      )}

      {/* ADMIN ADD MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-lg overflow-y-auto py-10 p-4">
          <div className="bg-white p-8 md:p-10 max-w-2xl w-full mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-slide-up max-h-[90vh] overflow-y-auto rounded-[32px] border border-white">
            <h3 className="text-3xl font-black serif mb-8 text-gray-900 border-b border-gray-100 pb-4">
              Tambah Lowongan Baru
            </h3>
            <form onSubmit={handleSaveAdminJob} className="grid grid-cols-2 gap-5">
              <div className="col-span-2 mb-2">
                <label className="text-[10px] font-black text-gray-500 mb-2 block uppercase tracking-widest">
                  Foto Lowongan
                </label>
                <div
                  onClick={() => adminImageInputRef.current?.click()}
                  className="bg-gray-50 border-2 border-dashed border-gray-200 hover:border-maroon hover:bg-maroon/5 transition-all cursor-pointer rounded-2xl overflow-hidden flex items-center justify-center shadow-inner"
                  style={{ minHeight: 140 }}
                >
                  {adminImagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={adminImagePreview}
                        alt="preview"
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                        <span className="text-white text-xs font-black uppercase tracking-widest bg-black/50 px-5 py-2.5 rounded-xl backdrop-blur-sm">
                          Ganti Foto
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400 py-8">
                      <svg
                        className="w-10 h-10 text-gray-300 drop-shadow-sm"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Klik untuk upload foto
                      </span>
                    </div>
                  )}
                </div>
                <input
                  ref={adminImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAdminImageUpload}
                />
              </div>

              {[
                {
                  key: 'title',
                  label: 'Judul Posisi',
                  full: true,
                  place: 'Contoh: UI/UX Designer',
                },
                { key: 'company', label: 'Nama Perusahaan', place: 'Contoh: TechNova' },
                { key: 'location', label: 'Lokasi', place: 'Contoh: Jakarta Pusat' },
                { key: 'hours', label: 'Jam Kerja', place: 'Contoh: 20 Jam / Minggu' },
                { key: 'salary', label: 'Gaji', place: 'Contoh: Rp 3.000.000' },
                { key: 'contactEmail', label: 'Email Kontak', place: 'hr@perusahaan.com' },
                { key: 'contactPhone', label: 'WhatsApp', place: '628123...' },
              ].map(({ key, label, full, place }) => (
                <div key={key} className={full ? 'col-span-2' : ''}>
                  <label className="text-[10px] font-black text-gray-500 mb-2 block uppercase tracking-widest">
                    {label}
                  </label>
                  <input
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none transition-all font-bold text-gray-800 shadow-sm"
                    placeholder={place}
                    value={adminForm[key]}
                    onChange={(e) => setAdminForm({ ...adminForm, [key]: e.target.value })}
                    required={['title', 'company', 'location'].includes(key)}
                  />
                </div>
              ))}

              {[
                { key: 'type', label: 'Tipe Kerja', opts: ['Onsite', 'Remote', 'Hybrid'] },
                {
                  key: 'category',
                  label: 'Kategori',
                  opts: ['F&B', 'IT', 'Kreatif', 'Pendidikan', 'Logistik', 'Kesehatan', 'Lainnya'],
                },
              ].map(({ key, label, opts }) => (
                <div key={key}>
                  <label className="text-[10px] font-black text-gray-500 mb-2 block uppercase tracking-widest">
                    {label}
                  </label>
                  <select
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none transition-all font-bold text-gray-800 appearance-none shadow-sm"
                    value={adminForm[key]}
                    onChange={(e) => setAdminForm({ ...adminForm, [key]: e.target.value })}
                  >
                    {opts.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 block uppercase tracking-widest">
                  Min. Usia
                </label>
                <input
                  type="number"
                  className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none transition-all font-bold text-gray-800 shadow-sm"
                  value={adminForm.minAge}
                  onChange={(e) => setAdminForm({ ...adminForm, minAge: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 mb-2 block uppercase tracking-widest">
                  Skills (pisah koma)
                </label>
                <input
                  className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none transition-all font-bold text-gray-800 shadow-sm"
                  value={adminForm.skills}
                  onChange={(e) => setAdminForm({ ...adminForm, skills: e.target.value })}
                  placeholder="Figma, Canva, dll"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-500 mb-2 block uppercase tracking-widest">
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-sm focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none transition-all resize-none font-medium text-gray-800 shadow-sm"
                  rows={4}
                  value={adminForm.description}
                  onChange={(e) => setAdminForm({ ...adminForm, description: e.target.value })}
                  placeholder="Deskripsikan pekerjaan secara detail..."
                />
              </div>
              <div className="col-span-2 flex gap-4 pt-6 border-t border-gray-100 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white py-4 text-xs font-black uppercase tracking-widest hover:shadow-[0_8px_20px_rgba(61,10,20,0.4)] hover:-translate-y-1 transition-all rounded-xl"
                >
                  + Simpan Lowongan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminModalOpen(false);
                    setAdminImagePreview(null);
                  }}
                  className="px-10 border-2 border-gray-200 text-xs font-bold uppercase hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600 rounded-xl"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ HOME (GABUNGAN BERANDA & LOKER) ═══════════════════════════ */}
      {activeTab === 'home' && (
        <main className="animate-fade-in flex-1">
          {/* Hero Section (Aesthetic Makeover) */}
          <section className="hero-section relative overflow-visible pt-16 pb-8 px-6 md:px-10">
            <HeroDecoration />
            <div className="max-w-7xl mx-auto relative z-10">
              {/* Top Row: Text & Image */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
                {/* Left Side (Aesthetic Text) */}
                <div className="w-full lg:w-1/2 relative z-20">
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md shadow-sm border border-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#c99042] mb-8">
                    <span>✦</span> Temukan peluang terbaik untuk karirmu
                  </div>
                  <h1 className="hero-title font-black leading-[1.1] mb-6 text-gray-900 drop-shadow-sm">
                    Temukan Lowongan
                    <br />
                    Kerja yang <em className="hero-italic text-maroon drop-shadow-md">Tepat</em>
                  </h1>
                  <p className="text-gray-600 text-[16px] leading-relaxed max-w-lg mb-10 font-medium drop-shadow-sm">
                    Platform terpercaya untuk mahasiswa menemukan peluang kerja, magang, dan
                    part-time terbaik guna membangun karir cemerlang.
                  </p>
                  <button
                    onClick={() => handleNavClick('jobs')}
                    className="cta-btn inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white px-9 py-4 rounded-2xl font-black text-[14px] shadow-[0_12px_30px_rgba(61,10,20,0.45)] hover:shadow-[0_16px_40px_rgba(139,24,42,0.45)] hover:translate-y-[-3px] transition-all duration-300"
                  >
                    Cari Lowongan Sekarang
                    <span className="text-xl">›</span>
                  </button>
                </div>

                {/* Right Side - Floating Aesthetic Image */}
                <div className="w-full lg:w-1/2 flex flex-col items-center">
                  <div
                    className="
relative
rounded-[34px]
overflow-hidden

border-[6px]
border-white

shadow-[0_20px_50px_rgba(0,0,0,.12)]

w-full
max-w-[520px]
"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200"
                      className="
w-full
h-[360px]
object-cover
"
                    />
                  </div>

                  <div
                    className="
w-full
max-w-[520px]

bg-white/80
backdrop-blur-xl

border
border-white

shadow-[0_10px_40px_rgba(0,0,0,.06)]

rounded-[28px]

grid
grid-cols-3

mt-5

relative
z-20

overflow-hidden
"
                  >
                    {[
                      {
                        icon: '💼',
                        v: jobs.length,
                        t: 'Lowongan Aktif',
                      },

                      {
                        icon: '🔖',
                        v: savedJobs.length,
                        t: 'Loker Disimpan',
                      },

                      {
                        icon: '📍',
                        v: allLocations.length - 1,
                        t: 'Kota Tersedia',
                      },
                    ].map((i) => (
                      <div
                        key={i.t}
                        className="
py-4
px-3

text-center

border-r
last:border-r-0

border-gray-100
"
                      >
                        <div className="text-[24px] mb-2">{i.icon}</div>

                        <div
                          className="
text-[42px]
font-black
text-maroon
leading-none
"
                        >
                          <AnimatedCounter target={i.v} />
                        </div>

                        <div
                          className="
text-[10px]
uppercase
tracking-[.18em]
text-gray-400
font-bold
mt-2
"
                        >
                          {i.t}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Filter Bar */}
          {/* Tambahin id="jobs-section" biar scroll-nya pas ke sini */}
          <section
            id="jobs-section"
            ref={jobsRef}
            className="px-6 md:px-10 mt-6 pb-12 relative z-20"
          >
            <div className="max-w-6xl mx-auto scroll-mt-28">
              <div className="bg-white/90 rounded-[32px] shadow-[0_16px_50px_rgba(0,0,0,0.06)] p-3.5 flex flex-wrap lg:flex-nowrap items-center gap-3 border border-white">
                {[
                  {
                    label: 'Tipe Pekerjaan',
                    options: allTypes,
                    value: filterType,
                    onChange: setFilterType,
                  },
                  {
                    label: 'Kategori',
                    options: allCategories,
                    value: filterCategory[0] === 'Semua' ? 'Semua' : filterCategory[0],
                    onChange: (v) => setFilterCategory([v]),
                  },
                  {
                    label: 'Lokasi',
                    options: allLocations,
                    value: filterLocation[0] === 'Semua' ? 'Semua' : filterLocation[0],
                    onChange: (v) => setFilterLocation([v]),
                  },
                  {
                    label: 'Skill',
                    options: allSkills,
                    value: filterSkill[0] === 'Semua' ? 'Semua' : filterSkill[0],
                    onChange: (v) => setFilterSkill([v]),
                  },
                ].map(({ label, options, value, onChange }, i) => (
                  <React.Fragment key={label}>
                    <div className="flex-1 min-w-[140px] px-3 py-1.5">
                      <p className="text-[10px] font-black text-gray-400 mb-1 px-4 uppercase tracking-widest">
                        {label}
                      </p>
                      <DropdownFilter
                        label="Semua"
                        options={options}
                        selected={value}
                        onSelect={onChange}
                      />
                    </div>
                    {i < 3 && (
                      <div className="hidden lg:block w-px h-12 bg-gray-200 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}

                <div className="w-full mt-3 lg:mt-0 px-2 lg:min-w-[280px]">
                  <button
                    onClick={() => handleNavClick('jobs')}
                    className="w-full bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white px-9 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_8px_25px_rgba(61,10,20,0.4)] hover:-translate-y-1 transition-all shadow-mdtext-white px-9 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_8px_25px_rgba(61,10,20,0.5)] hover:-translate-y-1 transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Cari Lowongan
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Job Directory */}
          <section className="px-6 md:px-10 pb-20 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gray-200/50 pb-6 gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl border border-gray-100">
                    💼
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900 text-3xl drop-shadow-sm serif">
                      Lowongan Terbaru
                    </h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      Menampilkan {filteredJobs.length} lowongan yang sesuai dengan kriteria.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {hasActiveFilter && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterType('Semua');
                        setFilterHours('Semua');
                        setFilterCategory(['Semua']);
                        setFilterLocation(['Semua']);
                        setFilterSkill(['Semua']);
                        setFilterPosition(['Semua']);
                      }}
                      className="text-[11px] font-black uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-500 bg-red-50 px-5 py-3 rounded-xl transition-all shadow-sm"
                    >
                      Reset Filter ✕
                    </button>
                  )}
                 <button
  onClick={() => handleNavClick('jobs')}
  className="text-sm font-black text-maroon border-2 border-maroon px-5 py-2.5 rounded-xl hover:bg-maroon hover:text-white transition-all"
>
  Lihat Semua →
</button>
                </div>
              </div>

              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      savedJobs={savedJobs}
                      onSave={toggleSave}
                      onSelect={setSelectedJob}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white/60 rounded-[32px] border border-white shadow-inner backdrop-blur-md">
                  <p className="text-7xl mb-6 drop-shadow-md">🔍</p>
                  <p className="text-gray-800 text-xl font-black mb-2">
                    Tidak ada lowongan yang ditemukan.
                  </p>
                  <p className="text-gray-500 text-sm font-medium">
                    Coba ubah kriteria filter kamu untuk melihat hasil lain.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

{/* ═══════════════════════════ JOBS PAGE ═══════════════════════════ */}
{activeTab === 'jobs' && (
  <main className="animate-fade-in flex-1">
    <section className="px-6 md:px-10 pt-10 pb-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-maroon">
            Direktori
          </span>
          <h2 className="text-4xl md:text-5xl font-black serif text-gray-900 mt-1 drop-shadow-sm">
            Semua Lowongan
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Menampilkan {filteredJobs.length} lowongan yang sesuai dengan kriteria.
          </p>
        </div>

        {/* Filter Bar dengan Search */}
        <div className="bg-white rounded-[32px] shadow-[0_16px_50px_rgba(0,0,0,0.06)] p-3.5 flex flex-wrap lg:flex-nowrap items-center gap-3 border border-white mb-10 overflow-visible">
          {[
            {
              label: 'Tipe Pekerjaan',
              options: allTypes,
              value: filterType,
              onChange: setFilterType,
            },
            {
              label: 'Kategori',
              options: allCategories,
              value: filterCategory[0] === 'Semua' ? 'Semua' : filterCategory[0],
              onChange: (v) => setFilterCategory([v]),
            },
            {
              label: 'Lokasi',
              options: allLocations,
              value: filterLocation[0] === 'Semua' ? 'Semua' : filterLocation[0],
              onChange: (v) => setFilterLocation([v]),
            },
            {
              label: 'Skill',
              options: allSkills,
              value: filterSkill[0] === 'Semua' ? 'Semua' : filterSkill[0],
              onChange: (v) => setFilterSkill([v]),
            },
          ].map(({ label, options, value, onChange }, i) => (
            <React.Fragment key={label}>
              <div className="flex-1 min-w-[140px] px-3 py-1.5 whitespace-nowrap">
                <p className="text-[10px] font-black text-gray-400 mb-1 px-4 uppercase tracking-[0.15em] whitespace-nowrap">
  {label}
</p>
                <DropdownFilter
                  label="Semua"
                  options={options}
                  selected={value}
                  onSelect={onChange}
                />
              </div>
              {i < 3 && (
                <div className="hidden lg:block w-px h-12 bg-gray-200 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}

         {/* Tombol / Input Search */}
          <div className="w-full mt-3 lg:mt-0 px-2">
            {!searchOpen ? (
              /* Tombol Cari — klik buka input */
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setSearchInputVal(searchTerm);
                }}
                className="w-full bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white px-9 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_8px_25px_rgba(61,10,20,0.5)] hover:-translate-y-1 transition-all shadow-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Cari Lowongan
              </button>
            ) : (
              /* Input search muncul */
              <form
  className="flex items-center gap-2 w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchTerm(searchInputVal);
                  setSearchOpen(false);
                }}
              >
                <div className="flex items-center gap-2 bg-gray-50 border-2 border-maroon rounded-2xl px-4 py-3 flex-1">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Cari posisi, perusahaan..."
                    value={searchInputVal}
                    onChange={(e) => {
  setSearchInputVal(e.target.value);
  setSearchTerm(e.target.value);
}}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearchOpen(false);
                        setSearchInputVal(searchTerm);
                      }
                    }}
                    className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-800 placeholder-gray-400"
                  />
                  {searchInputVal && (
                    <button
                      type="button"
                      onClick={() => setSearchInputVal('')}
                      className="text-gray-400 hover:text-gray-600 transition-colors text-xs font-black"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white px-6 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md flex-shrink-0"
                >
                  Cari
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Active filter info */}
        {(searchTerm || hasActiveFilter) && (
          <div className="flex items-center justify-between mb-6 bg-white/70 rounded-2xl px-5 py-3 border border-white shadow-sm backdrop-blur-md">
            <p className="text-sm text-gray-600 font-bold">
              {filteredJobs.length} hasil ditemukan
              {searchTerm && (
                <> untuk <span className="text-maroon font-black">"{searchTerm}"</span></>
              )}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchInputVal('');
                setFilterType('Semua');
                setFilterHours('Semua');
                setFilterCategory(['Semua']);
                setFilterLocation(['Semua']);
                setFilterSkill(['Semua']);
                setFilterPosition(['Semua']);
                setSearchOpen(false);
              }}
              className="text-[11px] font-black uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-500 bg-red-50 px-4 py-2 rounded-xl transition-all"
            >
              Reset ✕
            </button>
          </div>
        )}

        {/* Job Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedJobs={savedJobs}
                onSave={toggleSave}
                onSelect={setSelectedJob}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/60 rounded-[32px] border border-white shadow-inner backdrop-blur-md">
            <p className="text-7xl mb-6 drop-shadow-md">🔍</p>
            <p className="text-gray-800 text-xl font-black mb-2">
              Tidak ada lowongan yang ditemukan.
            </p>
            <p className="text-gray-500 text-sm font-medium mb-8">
              Coba ubah keyword atau filter untuk melihat hasil lain.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchInputVal('');
                setFilterType('Semua');
                setFilterCategory(['Semua']);
                setFilterLocation(['Semua']);
                setFilterSkill(['Semua']);
                setSearchOpen(false);
              }}
              className="bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white px-8 py-4 text-xs font-black uppercase tracking-widest rounded-xl shadow-md hover:-translate-y-0.5 transition-all"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </section>
  </main>
)}

      {/* ═══════════════════════════ SAVED ═══════════════════════════ */}
      {activeTab === 'saved' && (
        <div className="animate-fade-in p-6 md:p-10 max-w-5xl mx-auto w-full">
          <div className="flex items-end justify-between mb-10 border-b border-gray-200/50 pb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-maroon">
                Bookmark
              </span>
              <h2 className="text-4xl md:text-5xl font-black serif text-gray-900 mt-2 drop-shadow-sm">
                Loker Disimpan
              </h2>
              <p className="text-gray-500 text-sm mt-3 font-medium">
                Kamu memiliki {savedJobs.length} lowongan tersimpan menunggu untuk dilamar.
              </p>
            </div>
          </div>
          {savedJobs.length === 0 ? (
            <div className="text-center py-28 bg-white/60 rounded-[24px] border border-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-sm">
              <p className="text-7xl mb-6 drop-shadow-sm">🔖</p>
              <p className="text-gray-800 text-xl font-black mb-2">
                Belum ada loker yang disimpan.
              </p>
              <p className="text-gray-500 text-sm font-medium mb-8">
                Eksplorasi direktori untuk menemukan pekerjaan impianmu.
              </p>
              <button
                onClick={() => handleNavClick('jobs')}
                className="bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white px-10 py-4 text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_8px_20px_rgba(61,10,20,0.4)] hover:-translate-y-1 transition-all"
              >
                Jelajahi Lowongan
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {savedJobs.map((j) => (
                <div
                  key={j.id}
                  className="bg-white/80 backdrop-blur-md p-6 border border-gray-100 hover:shadow-[0_16px_40px_rgba(139,24,42,0.08)] hover:border-maroon/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[24px] shadow-sm group"
                >
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 hidden sm:block relative">
                      <img
                        src={
                          j.image ||
                          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400'
                        }
                        alt="img"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                          {j.type}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-maroon bg-maroon/5 px-3 py-1 rounded-md border border-maroon/10">
                          📍 {j.location}
                        </span>
                      </div>
                      <h3 className="font-black text-xl truncate text-gray-900 leading-tight mb-1">
                        {j.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {j.company} · <span className="text-gray-900 font-black">{j.salary}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => setSelectedJob(j)}
                      className="flex-1 md:flex-none text-xs font-black uppercase tracking-widest px-8 py-4 border-2 border-gray-200 text-gray-600 hover:border-maroon hover:text-maroon transition-all rounded-xl"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => toggleSave(j)}
                      className="flex-1 md:flex-none text-xs font-black uppercase tracking-widest px-8 py-4 bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all rounded-xl shadow-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════ HISTORY ═══════════════════════════ */}
      {activeTab === 'history' && (
        <div className="animate-fade-in p-6 md:p-10 max-w-5xl mx-auto w-full">
          <div className="border-b border-gray-200/50 pb-6 mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#c99042]">
              Riwayat Karir
            </span>
            <h2 className="text-4xl md:text-5xl font-black serif text-gray-900 mt-2 drop-shadow-sm">
              Diterima
            </h2>
            <p className="text-gray-500 text-sm mt-3 font-medium">
              Selamat! {acceptedJobs.length} perusahaan telah menerima kamu.
            </p>
          </div>
          {acceptedJobs.length === 0 ? (
            <div className="relative overflow-hidden rounded-[32px] border border-[#e8d5b0]/40 bg-white py-20 px-10 text-center shadow-sm">
  {/* Gold top line */}
  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c99042] to-transparent" />
  {/* Subtle background ornament */}
  <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#c99042]/5" />
  <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-[#6b1020]/5" />

  {/* Icon */}
  <div className="relative z-10 mx-auto mb-8 w-20 h-20">
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5e0a0"/>
          <stop offset="100%" stopColor="#c99042"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="38" stroke="url(#trophyGold)" strokeWidth="0.8" strokeOpacity="0.4"/>
      <circle cx="40" cy="40" r="32" fill="#fdf8f0"/>
      <path d="M28 24h24v16c0 8.8-5.4 13-12 13s-12-4.2-12-13V24z" stroke="#c99042" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M28 30c-4 0-6 2-6 6s2 6 6 6M52 30c4 0 6 2 6 6s-2 6-6 6" stroke="#c99042" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M34 53h12M40 53v6" stroke="#c99042" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M32 59h16" stroke="#c99042" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  </div>

  {/* Text */}
  <div className="relative z-10">
    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#c99042] mb-3">
      Riwayat Karir
    </p>
    <h3 className="font-black text-gray-900 text-2xl serif mb-3">
      Belum Ada Pencapaian
    </h3>
    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#c99042] to-transparent mx-auto mb-4"/>
    <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed font-medium mb-8">
      Lamar lowongan impianmu, lalu tandai sebagai <span className="text-[#7a5c2e] font-black">Diterima</span> untuk mencatat perjalanan karirmu di sini.
    </p>
    <button
      onClick={() => handleNavClick('jobs')}
      className="bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white px-8 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      Jelajahi Lowongan →
    </button>
  </div>
</div>
          ) : (
            <div className="flex flex-col gap-5">
              {acceptedJobs.map((j) => (
                <AcceptedCard
                  key={j.id}
                  job={j}
                  onRemove={() => setAcceptedJobs((prev) => prev.filter((a) => a.id !== j.id))}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════ ADMIN ═══════════════════════════ */}
      {activeTab === 'admin' && isAdminAuth && (
        <div className="animate-fade-in p-6 md:p-10 max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200/60 pb-6 mb-10 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-maroon">
                🔐 Mode Administrator
              </span>
              <h2 className="text-4xl md:text-5xl font-black serif text-gray-900 mt-2 drop-shadow-sm">
                Dashboard
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="bg-gradient-to-r from-[#6b1020] to-[#8b1a2e] text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:shadow-[0_8px_20px_rgba(61,10,20,0.4)] hover:-translate-y-1 transition-all rounded-xl shadow-md"
              >
                + Tambah Lowongan
              </button>
              <button
                onClick={() => {
                  setIsAdminAuth(false);
                  setActiveTab('home');
                }}
                className="border-2 border-gray-200 bg-white px-8 py-4 text-xs font-bold uppercase hover:bg-gray-50 transition-all text-gray-600 rounded-xl shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
          {/* Admin Stats with Shadows */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Lowongan', value: jobs.length, accent: '#8b182a', icon: '📋' },
              { label: 'Disimpan User', value: savedJobs.length, accent: '#1e293b', icon: '🔖' },
              {
                label: 'Kota Jangkauan',
                value: allLocations.length - 1,
                accent: '#c99042',
                icon: '📍',
              },
              {
                label: 'Kategori Aktif',
                value: allCategories.length - 1,
                accent: '#059669',
                icon: '🏷️',
              },
            ].map(({ label, value, accent, icon }, idx) => (
              <div
                key={label}
                className="bg-white/90 backdrop-blur-md border border-white p-3 relative overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all rounded-[32px] shadow-lg hover:-translate-y-1"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-2 rounded-t-[32px] opacity-80"
                  style={{ backgroundColor: accent, boxShadow: `0 2px 10px ${accent}60` }}
                />
                <div className="flex flex-col items-center justify-center text-center gap-1">
  <p className="text-2xl drop-shadow-sm">{icon}</p>
  <p
    className="text-2xl font-black serif tabular-nums text-transparent bg-clip-text"
    style={{
      backgroundImage: `linear-gradient(to bottom right, ${accent}, ${accent}90)`,
    }}
  >
    {value}
  </p>
 <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">
    {label}
  </p>
</div>
              </div>
            ))}
          </div>
          <h3 className="text-2xl font-black serif mb-6 text-gray-900 flex items-center gap-3 drop-shadow-sm">
            <span className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-xl text-lg">
              📋
            </span>{' '}
            Manajemen Lowongan
          </h3>
          <div className="flex flex-col gap-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white/80 backdrop-blur-md p-6 md:p-8 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-[0_12px_30px_rgba(139,24,42,0.06)] hover:border-maroon/20 transition-all rounded-[24px] shadow-sm group"
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  {job.image && (
                    <img
                      src={job.image}
                      alt={job.title}
                      className="w-20 h-20 object-cover flex-shrink-0 rounded-2xl shadow-inner hidden sm:block group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 border rounded-md shadow-sm ${typeColor[job.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                      >
                        {job.type}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 bg-white border border-gray-100 px-3 py-1 rounded-md">
                        {job.category}
                      </span>
                    </div>
                    <h4 className="font-black text-xl text-gray-900 truncate leading-tight mb-1">
                      {job.title}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium">
                      {job.company} ·{' '}
                      <span className="font-bold text-gray-800">📍 {job.location}</span> ·{' '}
                      <span className="text-maroon font-black">{job.salary}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="flex-1 md:flex-none text-xs font-black uppercase tracking-widest px-6 py-4 border-2 border-gray-200 text-gray-600 hover:border-maroon hover:text-maroon transition-all rounded-xl bg-white shadow-sm"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="flex-1 md:flex-none text-xs font-black uppercase tracking-widest px-6 py-4 bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all rounded-xl shadow-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="mt-auto py-12 text-center border-t border-gray-200/30 bg-white/40 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-2 mb-5">
          <SkillShiftLogo onClick={() => {}} small />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-2">
          © 2026 SkillShift — Official Platform Mahasiswa
        </p>
      </footer>
    </div>
  );
}
