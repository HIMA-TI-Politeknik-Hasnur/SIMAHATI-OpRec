import './NotificationCard.css';

interface NotificationProps {
  id: string;
  type: string;
  data: {
    message: string;
    link?: string;
  };
  read_at: string | null;
  created_at: string;
}

export const NotificationCard = ({ data, read_at, created_at }: NotificationProps) => {
  const isUnread = !read_at;

  return (
    <div className={`notification-card ${isUnread ? 'unread' : ''}`}>
      <div className="notification-indicator"></div>
      <div className="notification-content">
        <p className="notification-message">{data.message}</p>
        <span className="notification-time">
          {new Date(created_at).toLocaleDateString('id-ID', {
            hour: '2-digit', minute: '2-digit'
          })}
        </span>
      </div>
      {data.link && (
        <div className="notification-action">
          <a href={data.link} className="notification-link">Lihat Detail →</a>
        </div>
      )}
    </div>
  );
};
