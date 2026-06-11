import { useState, useEffect, useCallback } from 'react';
import './LoginPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://skillshift-backend-production.up.railway.app/api';

// ─── TOAST NOTIFICATION ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: 'login-toast-success', icon: '✔️' },
    error: { bg: 'login-toast-error', icon: '❌' },
    info: { bg: 'login-toast-info', icon: 'ℹ️' },
  };

  const { bg, icon } = config[type] || config.info;

  return (
    <div className={`login-toast ${bg}`}>
      <span style={{ marginRight: '12px', fontSize: '18px' }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
export default function LoginPage({ onLoginSuccess }) {
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [toast, setToast] = useState(null);

  // Loading states
  const [adminLoading, setAdminLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Admin form
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // User form
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Handle Admin Login
  const handleAdminLogin = useCallback(
    async (e) => {
      e.preventDefault();

      // Validation
      if (!adminEmail || !adminPassword) {
        setToast({ message: 'Email dan password harus diisi!', type: 'error' });
        return;
      }

      if (!adminEmail.includes('@')) {
        setToast({ message: 'Format email tidak valid!', type: 'error' });
        return;
      }

      if (adminPassword.length < 6) {
        setToast({ message: 'Password minimal 6 karakter!', type: 'error' });
        return;
      }

      setAdminLoading(true);

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Email atau Password Salah');
        }

        // Validate response data
        if (!data.user || !data.user.role) {
          throw new Error('Data login tidak valid');
        }

        localStorage.setItem('skillshift_user', JSON.stringify(data.user));

        setToast({
          message: `Berhasil masuk ke Dashboard Admin (${data.user.email})!`,
          type: 'success',
        });

        setTimeout(() => onLoginSuccess('admin'), 500);
      } catch (err) {
        localStorage.removeItem('skillshift_user');
        setToast({ message: err.message, type: 'error' });
      } finally {
        setAdminLoading(false);
      }
    },
    [adminEmail, adminPassword, onLoginSuccess]
  );

  // Handle User Login
  const handleUserLogin = useCallback(
    async (e) => {
      e.preventDefault();

      // Validation
      if (!userEmail || !userPassword) {
        setToast({ message: 'Email dan password harus diisi!', type: 'error' });
        return;
      }

      if (!userEmail.includes('@')) {
        setToast({ message: 'Format email tidak valid!', type: 'error' });
        return;
      }

      if (userPassword.length < 6) {
        setToast({ message: 'Password minimal 6 karakter!', type: 'error' });
        return;
      }

      setUserLoading(true);

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            password: userPassword,
            role: 'mahasiswa',
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Email atau Password Salah');
        }

        // Validate response data
        if (!data.user || !data.user.role) {
          throw new Error('Data login tidak valid');
        }

        localStorage.setItem('skillshift_user', JSON.stringify(data.user));

        setToast({
          message: `Berhasil masuk ke Portal Karir (${data.user.email})!`,
          type: 'success',
        });

        setTimeout(() => onLoginSuccess('user'), 500);
      } catch (err) {
        localStorage.removeItem('skillshift_user');
        setToast({ message: err.message, type: 'error' });
      } finally {
        setUserLoading(false);
      }
    },
    [userEmail, userPassword, onLoginSuccess]
  );

  // Handle User Register
  const handleUserRegister = useCallback(
    async (e) => {
      e.preventDefault();

      // Validation
      if (!userName || !userEmail || !userPassword) {
        setToast({ message: 'Nama, email, dan password harus diisi!', type: 'error' });
        return;
      }

      if (!userEmail.includes('@')) {
        setToast({ message: 'Format email tidak valid!', type: 'error' });
        return;
      }

      if (userPassword.length < 6) {
        setToast({ message: 'Password minimal 6 karakter!', type: 'error' });
        return;
      }

      if (userName.length < 2) {
        setToast({ message: 'Nama minimal 2 karakter!', type: 'error' });
        return;
      }

      setRegisterLoading(true);

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: userName,
            email: userEmail,
            password: userPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Gagal membuat akun');
        }

        setToast({
          message: 'Akun berhasil dibuat! Silakan login.',
          type: 'success',
        });

        setIsRegisterMode(false);
        setUserName('');
        setUserEmail('');
        setUserPassword('');
      } catch (err) {
        setToast({ message: err.message, type: 'error' });
      } finally {
        setRegisterLoading(false);
      }
    },
    [userName, userEmail, userPassword]
  );

  // Toggle panel
  const togglePanel = (isAdmin) => setIsAdminActive(isAdmin);

  // Info notification
  const showInfo = (msg) => setToast({ message: msg, type: 'info' });

  return (
    <div className="login-page-bg">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Container - di tengah layar */}
      <div
        className={`login-container ${isAdminActive ? 'admin-panel-active' : ''} ${isRegisterMode ? 'register-mode' : ''}`}
      >
        {/* ── FORM ADMIN (KIRI) ── */}
        <div className="login-form-container admin-container">
          <form onSubmit={handleAdminLogin}>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-[#901d31] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                S
              </div>
              <span className="font-extrabold text-[#901d31] tracking-wide text-lg">
                Skill<span className="text-[#f5a623]">Shift</span>
              </span>
              <span className="text-[10px] bg-red-100 text-[#901d31] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Admin
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#2d1b1f] mb-1">Akses Administrator</h1>
            <p className="text-gray-400 text-xs mb-6">
              Masuk untuk mengelola lowongan dan meninjau pelamar kerja.
            </p>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Email Admin
              </label>
              <input
                type="email"
                placeholder="admin@skillshift.com"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#faf8f6] border-2 border-gray-100 focus:border-[#901d31] focus:ring-4 focus:ring-[#901d31]/10 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#faf8f6] border-2 border-gray-100 focus:border-[#901d31] focus:ring-4 focus:ring-[#901d31]/10 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            {/* Lupa Password */}
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={() => showInfo('Portal pemulihan admin sedang disiapkan.')}
                className="text-xs text-gray-400 hover:text-[#901d31] transition-colors cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={adminLoading}
              className="w-full py-3.5 bg-[#4c0519] hover:bg-[#901d31] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {adminLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                'Masuk Dasbor Admin'
              )}
            </button>

            {/* Link Mobile */}
            <p className="text-center text-xs text-gray-500 mt-6 md:hidden">
              Bukan administrator?
              <button
                type="button"
                onClick={() => togglePanel(false)}
                className="text-[#901d31] font-semibold underline ml-1"
              >
                Portal User
              </button>
            </p>
          </form>
        </div>

        {/* ── FORM USER (KANAN) ── */}
        <div className="login-form-container user-container">
          <form onSubmit={isRegisterMode ? handleUserRegister : handleUserLogin}>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-[#901d31] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                S
              </div>
              <span className="font-extrabold text-[#901d31] tracking-wide text-lg">
                Skill<span className="text-[#f5a623]">Shift</span>
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Talent
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#2d1b1f] mb-1">Cari Kerja Impianmu</h1>
            <p className="text-gray-400 text-xs mb-6">
              Masuk untuk melamar pekerjaan kreatif dan magang terbaik.
            </p>

            {isRegisterMode && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#faf8f6] border-2 border-gray-100 focus:border-[#901d31] focus:ring-4 focus:ring-[#901d31]/10 rounded-xl text-sm focus:outline-none transition-all"
                />
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Email Pengguna
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#faf8f6] border-2 border-gray-100 focus:border-[#901d31] focus:ring-4 focus:ring-[#901d31]/10 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#faf8f6] border-2 border-gray-100 focus:border-[#901d31] focus:ring-4 focus:ring-[#901d31]/10 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            {/* Aksi akun */}
            <div className="flex justify-start items-center mb-6">
              <button
                type="button"
                onClick={() => showInfo('Portal pemulihan akun user akan segera hadir.')}
                className="text-xs text-gray-400 hover:text-[#901d31] transition-colors cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={userLoading || registerLoading}
              className="w-full py-3.5 bg-[#901d31] hover:bg-[#b0273f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {(userLoading || registerLoading) ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                isRegisterMode ? 'Daftar Akun' : 'Masuk Sekarang'
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              {isRegisterMode ? 'Sudah punya akun?' : 'Belum punya akun?'}
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode((prev) => !prev);
                  setToast(null);
                }}
                className="text-[#901d31] font-semibold underline ml-1"
              >
                {isRegisterMode ? 'Login' : 'Daftar'}
              </button>
            </p>

            {/* Link Mobile */}
            <p className="text-center text-xs text-gray-500 mt-6 md:hidden">
              Memiliki akun Admin?
              <button
                type="button"
                onClick={() => togglePanel(true)}
                className="text-[#901d31] font-semibold underline ml-1"
              >
                Portal Admin
              </button>
            </p>
          </form>
        </div>

        {/* ── OVERLAY (SLIDING PANEL) ── */}
        <div className="overlay-container">
          <div className="overlay">
            {/* Panel Kiri */}
            <div className="overlay-panel overlay-left">
              <h1 className="text-3xl font-extrabold mb-3">Kembali ke User</h1>
              <p className="text-sm text-red-100 font-light mb-8 max-w-[280px]">
                Ingin melamar pekerjaan terbaru atau mengelola resume pribadi Anda?
              </p>
              <button
                onClick={() => togglePanel(false)}
                className="px-10 py-3 border-2 border-white text-white font-bold rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-[#901d31] transition-all duration-300 shadow-md"
              >
                Portal User
              </button>
            </div>

            {/* Panel Kanan */}
            <div className="overlay-panel overlay-right">
              <h1 className="text-3xl font-extrabold mb-3">Portal Admin</h1>
              <p className="text-sm text-red-100 font-light mb-8 max-w-[280px]">
                Gunakan dashboard admin khusus untuk mempublikasikan dan menyaring lowongan kerja.
              </p>
              <button
                onClick={() => togglePanel(true)}
                className="px-10 py-3 border-2 border-white text-white font-bold rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-[#901d31] transition-all duration-300 shadow-md"
              >
                Portal Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
