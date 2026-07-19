import './Rating.css';

interface RatingProps {
  value: number;       // 0–100
  onChange?: (val: number) => void;
  readonly?: boolean;
  showBar?: boolean;
  label?: string;
}

export const Rating = ({ value, onChange, readonly = false, showBar = true, label }: RatingProps) => {
  // Konversi nilai 0-100 ke bintang 0-5 (untuk tampilan)
  const stars = Math.round(value / 20);

  const handleStarClick = (star: number) => {
    if (readonly) return;
    onChange?.(star * 20);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readonly) return;
    let v = parseInt(e.target.value);
    if (isNaN(v)) v = 0;
    if (v < 0) v = 0;
    if (v > 100) v = 100;
    onChange?.(v);
  };

  return (
    <div className="rating-wrapper">
      {label && <span className="rating-label">{label}</span>}

      {/* Bintang visual */}
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={['rating-star', star <= stars ? 'active' : '', readonly ? 'readonly' : ''].filter(Boolean).join(' ')}
            onClick={() => handleStarClick(star)}
            title={`${star * 20} / 100`}
          >
            ★
          </span>
        ))}
        <span className="rating-value-label">
          <span>{value}</span> / 100
        </span>
      </div>

      {/* Input numerik + bar (hanya kalau bukan readonly) */}
      {!readonly && (
        <div className="rating-numeric">
          <input
            type="number"
            min={0}
            max={100}
            value={value}
            onChange={handleInputChange}
            className="rating-numeric-input"
          />
          {showBar && (
            <div className="rating-bar-bg">
              <div
                className="rating-bar-fill"
                style={{ width: `${value}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Bar readonly */}
      {readonly && showBar && (
        <div className="rating-bar-bg" style={{ marginTop: '0.25rem' }}>
          <div className="rating-bar-fill" style={{ width: `${value}%` }} />
        </div>
      )}
    </div>
  );
};
