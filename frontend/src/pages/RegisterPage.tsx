import { useState } from 'react';
import { apiPost, setAuthToken, setStoredUser } from '../api';
import { Alert } from '../components/Alert';
import './RegisterPage.css';

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
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

interface RegisterPageProps {
  onRegisterSuccess: (user: UserData) => void;
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onRegisterSuccess, onSwitchToLogin }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const { data, error: apiError } = await apiPost<RegisterResponse>('/api/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
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
      onRegisterSuccess(data.data.user);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Daftar</h1>
        <p className="auth-subtitle">Buat akun baru SIMAHATI OpRec</p>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className={`auth-field ${fieldErrors.name ? 'auth-field--error' : ''}`}>
            <label className="auth-label" htmlFor="name">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
              disabled={loading}
            />
            {fieldErrors.name?.map((msg, i) => (
              <span key={i} className="auth-field-error">{msg}</span>
            ))}
          </div>

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

          <div className={`auth-field ${fieldErrors.password_confirmation ? 'auth-field--error' : ''}`}>
            <label className="auth-label" htmlFor="password_confirmation">Konfirmasi Password</label>
            <input
              id="password_confirmation"
              type="password"
              className="auth-input"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Ulangi password"
              required
              disabled={loading}
            />
            {fieldErrors.password_confirmation?.map((msg, i) => (
              <span key={i} className="auth-field-error">{msg}</span>
            ))}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-footer">
          Sudah punya akun?{' '}
          <button className="auth-link" onClick={onSwitchToLogin} disabled={loading}>
            Masuk
          </button>
        </p>
      </div>
    </div>
  );
}
