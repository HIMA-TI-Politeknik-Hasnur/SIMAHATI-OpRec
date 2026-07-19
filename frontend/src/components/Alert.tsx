import './Alert.css';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type: AlertType;
  message: string;
  /** Opsional: daftar error field dari validasi */
  errors?: string[];
  onClose?: () => void;
}

const ICONS: Record<AlertType, string> = {
  info:    'ℹ️',
  success: '✅',
  warning: '⚠️',
  error:   '❌',
};

export const Alert = ({ type, message, errors, onClose }: AlertProps) => (
  <div className={`alert alert--${type}`} role="alert">
    <span className="alert-icon">{ICONS[type]}</span>
    <div className="alert-body">
      <p className="alert-message">{message}</p>
      {errors && errors.length > 0 && (
        <ul className="alert-errors">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}
    </div>
    {onClose && (
      <button className="alert-close" onClick={onClose} aria-label="Tutup notifikasi">
        ×
      </button>
    )}
  </div>
);
