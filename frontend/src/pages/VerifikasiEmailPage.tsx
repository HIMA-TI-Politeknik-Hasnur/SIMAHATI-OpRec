import { useState } from 'react';
import { apiPost } from '../api';
import { Alert } from '../components/Alert';
import './VerifikasiEmailPage.css';

interface VerifikasiEmailPageProps {
  email: string;
  onLogin: () => void;
}

export const VerifikasiEmailPage = ({ email, onLogin }: VerifikasiEmailPageProps) => {
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    setResending(true);
    setError(null);
    setMessage(null);

    const { data, error: err } = await apiPost<{ success: boolean; message: string }>(
      '/api/email/resend-verification', { email }
    );

    if (err) {
      setError(err.message || 'Gagal mengirim ulang.');
    } else if (data) {
      setMessage(data.message);
    }
    setResending(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card verifikasi-email-page">
        <h1 className="auth-title">Cek Email Kamu</h1>
        <p className="auth-subtitle">
          Kami sudah mengirim link verifikasi ke <strong>{email}</strong>
        </p>

        {message && <Alert type="success" message={message} />}
        {error && <Alert type="error" message={error} />}

        <div className="verifikasi-info">
          <p>Klik link yang dikirim ke email kamu untuk memverifikasi akun.</p>
          <p>Tidak menerima email?</p>
        </div>

        <button
          className="auth-btn"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? 'Mengirim...' : 'Kirim Ulang Email'}
        </button>

        <p className="auth-footer">
          Sudah verifikasi?{' '}
          <button className="auth-link" onClick={onLogin}>
            Masuk
          </button>
        </p>
      </div>
    </div>
  );
};
