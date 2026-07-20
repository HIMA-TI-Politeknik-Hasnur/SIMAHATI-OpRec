import { useState } from 'react';
import { apiPost, setAuthToken, setStoredUser } from '../api';
import { Alert } from '../components/Alert';
import './LoginPage.css';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: { id: number; name: string; email: string; roles?: string[]; peserta_id?: number | null };
    token: string;
  };
}

interface UserData {
  id: number;
  name: string;
  email: string;
  roles: string[];
  peserta_id?: number | null;
}

interface LoginPageProps {
  onLoginSuccess: (user: UserData) => void;
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
}

export function LoginPage({ onLoginSuccess, onSwitchToRegister, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});


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
      setStoredUser(data.data.user);
      onLoginSuccess(data.data.user);
    }
    setLoading(false);
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
