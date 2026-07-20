import { useState } from 'react';
import { apiPost } from '../api';
import './ResetPasswordPage.css';

interface ResetPasswordPageProps {
  onBackToLogin: () => void;
}

export function ResetPasswordPage({ onBackToLogin }: ResetPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }

    const { error: apiError } = await apiPost<{ success: boolean; message: string }>(
      '/api/reset-password',
      { email, token, password, password_confirmation: passwordConfirmation }
    );

    if (apiError) {
      setError(apiError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        {success ? (
          <div className="reset-password-success">
            <div className="reset-password-success-icon">&#x2705;</div>
            <h2 className="reset-password-success-title">Password Berhasil Direset</h2>
            <p className="reset-password-success-text">
              Password berhasil direset. Silakan login dengan password baru.
            </p>
            <button className="reset-password-btn" onClick={onBackToLogin}>
              Kembali ke Login
            </button>
          </div>
        ) : (
          <>
            <h1 className="reset-password-title">Reset Password</h1>
            <p className="reset-password-subtitle">
              Masukkan token yang dikirim ke email Anda beserta password baru.
            </p>

            {error && <div className="reset-password-error">{error}</div>}

            <form onSubmit={handleSubmit} className="reset-password-form">
              <div>
                <label className="reset-password-label" htmlFor="reset-email">Email</label>
                <input
                  id="reset-email"
                  type="email"
                  className="reset-password-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="reset-password-label" htmlFor="token">Token</label>
                <input
                  id="token"
                  type="text"
                  className="reset-password-input"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Masukkan token dari email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="reset-password-label" htmlFor="new-password">Password Baru</label>
                <input
                  id="new-password"
                  type="password"
                  className="reset-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="reset-password-label" htmlFor="confirm-password">Konfirmasi Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  className="reset-password-input"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Konfirmasi password baru"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="reset-password-btn" disabled={loading}>
                {loading ? 'Memproses...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
