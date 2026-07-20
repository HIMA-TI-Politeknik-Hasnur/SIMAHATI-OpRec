import './EmailTerverifikasiPage.css';

interface EmailTerverifikasiPageProps {
  onLogin: () => void;
}

export const EmailTerverifikasiPage = ({ onLogin }: EmailTerverifikasiPageProps) => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="email-verified-icon">✅</div>
        <h1 className="auth-title">Email Berhasil Diverifikasi!</h1>
        <p className="auth-subtitle">
          Akun kamu sudah aktif. Silakan masuk untuk melanjutkan.
        </p>
        <button className="auth-btn" onClick={onLogin}>
          Masuk Sekarang
        </button>
      </div>
    </div>
  );
};
