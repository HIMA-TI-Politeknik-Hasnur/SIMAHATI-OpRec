import './StatusBadge.css';

export type StatusVerifikasi = 'pending' | 'verified' | 'rejected';
export type StatusSeleksi   = 'draft' | 'submitted' | 'interview' | 'accepted' | 'rejected';
export type StatusPendaftaran = 'draft' | 'submitted' | 'verified' | 'rejected';

type Status = StatusVerifikasi | StatusSeleksi | StatusPendaftaran;

interface StatusBadgeProps {
  status: Status;
  /** Opsional: ganti label default */
  label?: string;
}

const STATUS_CONFIG: Record<string, { label: string; modifier: string }> = {
  // Verifikasi
  pending:   { label: 'Menunggu',             modifier: 'warning' },
  verified:  { label: 'Terverifikasi',        modifier: 'success' },
  // Seleksi / Pendaftaran
  draft:     { label: 'Draft',               modifier: 'neutral' },
  submitted: { label: 'Terkirim',            modifier: 'info'    },
  interview: { label: 'Interview',           modifier: 'info'    },
  accepted:  { label: 'Diterima',            modifier: 'success' },
  rejected:  { label: 'Ditolak',             modifier: 'danger'  },
};

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? { label: status, modifier: 'neutral' };

  return (
    <span className={`status-badge status-badge--${config.modifier}`}>
      {label ?? config.label}
    </span>
  );
};
