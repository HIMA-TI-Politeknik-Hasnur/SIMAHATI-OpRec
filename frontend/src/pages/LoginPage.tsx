import { useState } from 'react';
import { apiPost, setAuthToken, fetchCsrfCookie, sessionPost, setSessionAuth, getAuthToken, refreshAuthToken } from '../api';
import { Alert } from '../components/Alert';
import './LoginPage.css';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: { id: number; name: string; email: string; roles?: string[] };
    token: string;
  };
}

interface LoginPageProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
}

export function LoginPage({ onLoginSuccess, onSwitchToRegister, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [sessionMode, setSessionMode] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const { data, error: apiError } = await apiPost<LoginResponse>('/api/login', {
      email,
      password,
    });

    if (apiError) {
      setError(apiError.message);
      if (apiError.errors) setFieldErrors(apiError.errors);
      setLoading(false);
      return;
    }

    if (data) {
      setAuthToken(data.data.token);
      onLoginSuccess();
    }
    setLoading(false);
  };

  const handleSessionLogin = async () => {
    setLoading(true);
    setError('');
    await fetchCsrfCookie();
    const res = await sessionPost<{ success: boolean; data: { user: { id: number; name: string; email: string; roles: string[] } } }>('/api/session/login', { email, password });
    if (res.data?.success) {
      setSessionAuth();
      onLoginSuccess();
    } else {
      setError(res.error?.message || 'Login gagal.');
    }
    setLoading(false);
  };

  const handleRefreshToken = async () => {
    const token = getAuthToken();
    if (!token) { setRefreshMsg('Tidak ada token.'); return; }
    const newToken = await refreshAuthToken();
    setRefreshMsg(newToken ? 'Token berhasil diperbarui!' : 'Gagal memperbarui token.');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Masuk</h1>
        <p className="auth-subtitle">Selamat datang kembali di SIMAHATI OpRec</p>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className={`auth-field ${fieldErrors.email ? 'auth-field--error' : ''}`}>
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
              disabled={loading}
            />
            {fieldErrors.email?.map((msg, i) => (
              <span key={i} className="auth-field-error">{msg}</span>
            ))}
          </div>

          <div className={`auth-field ${fieldErrors.password ? 'auth-field--error' : ''}`}>
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              disabled={loading}
            />
            {fieldErrors.password?.map((msg, i) => (
              <span key={i} className="auth-field-error">{msg}</span>
            ))}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <button
              type="button"
              className="auth-link"
              onClick={onForgotPassword}
              disabled={loading}
              style={{ fontSize: '0.8125rem' }}
            >
              Lupa Password?
            </button>
          </div>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button onClick={handleSessionLogin} disabled={loading} style={{ padding: '8px 16px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
            {loading ? 'Memproses...' : 'Login dengan Session'}
          </button>
        </div>

        <hr style={{ borderColor: '#334155', margin: '20px 0' }} />

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 8px' }}>Token: {getAuthToken() ? `${getAuthToken()!.substring(0, 20)}...` : '(kosong)'}</p>
          <button onClick={handleRefreshToken} style={{ padding: '6px 12px', background: '#14b8a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Refresh Token</button>
          {refreshMsg && <p style={{ color: '#22c55e', fontSize: '0.75rem', margin: '4px 0 0' }}>{refreshMsg}</p>}
        </div>

        <p className="auth-footer">
          Belum punya akun?{' '}
          <button className="auth-link" onClick={onSwitchToRegister} disabled={loading}>
            Daftar
          </button>
        </p>
      </div>
    </div>
  );
}
