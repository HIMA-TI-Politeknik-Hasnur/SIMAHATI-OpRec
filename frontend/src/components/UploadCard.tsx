import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import './UploadCard.css';

export type JenisDokumen = 'foto' | 'ktm' | 'cv' | 'sertifikat';

interface UploadCardProps {
  jenis: JenisDokumen;
  file: File | null;
  onChange: (jenis: JenisDokumen, file: File | null) => void;
  error?: string;
}

const DOKUMEN_META: Record<JenisDokumen, { title: string; icon: string; accept: string; hint: string }> = {
  foto:       { title: 'Foto Diri',   icon: '🖼️',  accept: 'image/jpeg,image/png,image/webp', hint: 'JPG / PNG / WEBP · Maks. 2 MB' },
  ktm:        { title: 'KTM',         icon: '🪪',  accept: 'image/jpeg,image/png,image/webp', hint: 'JPG / PNG / WEBP · Maks. 2 MB' },
  cv:         { title: 'CV / Resume', icon: '📄',  accept: 'application/pdf,image/jpeg,image/png', hint: 'PDF / JPG / PNG · Maks. 5 MB' },
  sertifikat: { title: 'Sertifikat',  icon: '🏅',  accept: 'application/pdf,image/jpeg,image/png', hint: 'PDF / JPG / PNG · Maks. 5 MB (Opsional)' },
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

export const UploadCard = ({ jenis, file, onChange, error }: UploadCardProps) => {
  const meta    = DOKUMEN_META[jenis];
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = (selected: File) => {
    onChange(jenis, selected);
    if (isImage(selected)) {
      const reader = new FileReader();
      reader.onload = e => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const selected = e.dataTransfer.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleRemove = () => {
    onChange(jenis, null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className={[
        'upload-card',
        file      ? 'upload-card--has-file' : '',
        dragOver  ? 'upload-card--dragover' : '',
      ].join(' ')}
    >
      {/* Header */}
      <div className="upload-card__header">
        <span className="upload-card__icon">{meta.icon}</span>
        <div className="upload-card__info">
          <p className="upload-card__title">{meta.title}</p>
          <p className="upload-card__subtitle">{meta.hint}</p>
        </div>
      </div>

      {/* Konten: preview atau drop zone */}
      {file ? (
        <div className="upload-card__preview">
          {previewUrl
            ? <img src={previewUrl} alt={`Preview ${meta.title}`} className="upload-card__preview-thumb" />
            : <div className="upload-card__preview-icon">📄</div>
          }
          <div className="upload-card__preview-detail">
            <p className="upload-card__preview-name">{file.name}</p>
            <p className="upload-card__preview-size">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            className="upload-card__remove"
            onClick={handleRemove}
            aria-label={`Hapus ${meta.title}`}
          >
            ×
          </button>
        </div>
      ) : (
        <div
          className="upload-card__dropzone"
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label={`Unggah ${meta.title}`}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        >
          <p className="upload-card__dropzone-text">
            <strong>Klik untuk unggah</strong> atau seret file ke sini
          </p>
          <button type="button" className="upload-card__btn">Pilih File</button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={meta.accept}
        className="upload-card__input"
        onChange={handleChange}
        aria-hidden="true"
      />

      {error && <p className="upload-card__error">⚠ {error}</p>}
    </div>
  );
};
