import './Timeline.css';

interface TimelineEvent {
  id: number;
  judul: string;
  deskripsi?: string;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  is_active: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline = ({ events }: TimelineProps) => {
  return (
    <div className="timeline-container">
      {events.map((event, _index) => (
        <div key={event.id} className={`timeline-item ${event.is_active ? 'active' : ''}`}>
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <h3 className="timeline-title">{event.judul}</h3>
            <span className="timeline-date">
              {new Date(event.tanggal_mulai).toLocaleDateString()}
              {event.tanggal_selesai && ` - ${new Date(event.tanggal_selesai).toLocaleDateString()}`}
            </span>
            {event.deskripsi && <p className="timeline-description">{event.deskripsi}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
