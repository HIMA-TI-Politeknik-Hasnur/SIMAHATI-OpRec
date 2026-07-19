import './AnnouncementCard.css';

interface AnnouncementProps {
  id: number;
  judul: string;
  isi: string;
  tipe: 'info' | 'warning' | 'success' | 'danger';
  published_at: string;
}

export const AnnouncementCard = ({ judul, isi, tipe, published_at }: AnnouncementProps) => {
  const getIcon = () => {
    switch(tipe) {
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'danger': return '🚨';
      default: return '📢';
    }
  };

  return (
    <div className={`announcement-card type-${tipe}`}>
      <div className="announcement-header">
        <span className="announcement-icon">{getIcon()}</span>
        <h3 className="announcement-title">{judul}</h3>
      </div>
      <div className="announcement-body">
        <p>{isi}</p>
      </div>
      <div className="announcement-footer">
        <span className="announcement-date">
          {new Date(published_at).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
};
