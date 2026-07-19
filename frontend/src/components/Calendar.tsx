import { useState } from 'react';
import './Calendar.css';

interface CalendarProps {
  value?: string; // format: YYYY-MM-DD
  onChange?: (date: string) => void;
  eventDates?: string[]; // tanggal yang ada jadwal, format YYYY-MM-DD
  readonly?: boolean;
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const Calendar = ({ value, onChange, eventDates = [], readonly = false }: CalendarProps) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(value ? parseInt(value.slice(0, 4)) : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? parseInt(value.slice(5, 7)) - 1 : today.getMonth());

  const selectedDate = value ?? '';

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const formatDate = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => formatDate(day) === selectedDate;
  const hasEvent = (day: number) => eventDates.includes(formatDate(day));

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleSelect = (day: number) => {
    if (readonly) return;
    onChange?.(formatDate(day));
  };

  const formatDisplay = (dateStr: string) => {
    if (!dateStr) return 'Belum dipilih';
    const [y, m, d] = dateStr.split('-');
    return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`;
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        {!readonly && (
          <button className="calendar-nav" onClick={prevMonth} type="button">‹</button>
        )}
        <span className="calendar-month-label">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        {!readonly && (
          <button className="calendar-nav" onClick={nextMonth} type="button">›</button>
        )}
      </div>

      <div className="calendar-grid">
        {DAYS.map(d => (
          <div key={d} className="calendar-day-name">{d}</div>
        ))}
        {cells.map((day, idx) => (
          <div
            key={idx}
            className={[
              'calendar-cell',
              day === null ? 'empty' : '',
              day !== null && isToday(day) ? 'today' : '',
              day !== null && isSelected(day) ? 'selected' : '',
              day !== null && hasEvent(day) ? 'has-event' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => day !== null && handleSelect(day)}
          >
            {day}
          </div>
        ))}
      </div>

      {!readonly && (
        <p className="calendar-selected-label">
          Dipilih: <span>{formatDisplay(selectedDate)}</span>
        </p>
      )}
    </div>
  );
};
