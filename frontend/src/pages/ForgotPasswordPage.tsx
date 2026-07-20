import { useState } from 'react';
import { apiPost } from '../api';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: apiError } = await apiPost<{ success: boolean; message: string }>(
      '/api/forgot-password',
      { email }
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
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        {success ? (
          <div className="forgot-password-success">
            <div className="forgot-password-success-icon">&#x2709;</div>
            <h2 className="forgot-password-success-title">Cek Email Anda</h2>
            <p className="forgot-password-success-text">
              Tautan reset password telah dikirim ke email Anda. Cek email Anda untuk melanjutkan.
            </p>
            <button className="forgot-password-btn" onClick={onBackToLogin}>
              Kembali ke Login
            </button>
          </div>
        ) : (
          <>
            <h1 className="forgot-password-title">Lupa Password</h1>
            <p className="forgot-password-subtitle">
              Masukkan email Anda dan kami akan mengirimkan tautan reset password.
            </p>

            {error && <div className="forgot-password-error">{error}</div>}

            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div>
                <label className="forgot-password-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="forgot-password-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="forgot-password-btn" disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
              </button>
            </form>

            <button className="forgot-password-back" onClick={onBackToLogin} disabled={loading}>
              Kembali ke Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
