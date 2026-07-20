import { useState, useEffect } from 'react';
import './UploadDokumen.css';
import { UploadCard, type JenisDokumen } from '../components/UploadCard';
import { Alert } from '../components/Alert';
import { getAuthToken } from '../api';
import type { UploadRecord } from '../types/pendaftaran';

interface UploadDokumenProps {
  pesertaId: number;
  onBack: () => void;
  onSuccess: () => void;
  inline?: boolean;
  existingUploads?: UploadRecord[];
}

type FileMap = Record<JenisDokumen, File | null>;
type ErrorMap = Record<JenisDokumen, string>;

const JENIS_LIST: JenisDokumen[] = ['foto', 'ktm', 'cv', 'sertifikat'];
const WAJIB: JenisDokumen[] = ['foto', 'ktm', 'cv'];

export const UploadDokumen = ({ pesertaId, onBack, onSuccess, inline, existingUploads }: UploadDokumenProps) => {
  const [files, setFiles] = useState<FileMap>({
    foto: null, ktm: null, cv: null, sertifikat: null,
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<ErrorMap>>({});
  const [apiError, setApiError]   = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
  const [localUploads, setLocalUploads] = useState<UploadRecord[]>(existingUploads || []);

  useEffect(() => {
    if (existingUploads?.length) {
      setLocalUploads(existingUploads);
      setApiSuccess('Dokumen sudah pernah diunggah.');
    }
  }, [existingUploads]);

  const handleChange = (jenis: JenisDokumen, file: File | null) => {
    setFiles(prev => ({ ...prev, [jenis]: file }));
    if (file) setFieldErrors(prev => ({ ...prev, [jenis]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<ErrorMap> = {};
    const sudahUpload = new Set(localUploads.map(u => u.jenis_dokumen));
    WAJIB.forEach(j => {
      if (!files[j] && !sudahUpload.has(j)) errs[j] = 'Dokumen ini wajib diunggah.';
    });
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const uploadSingle = async (jenis: JenisDokumen, file: File): Promise<void> => {
    setUploadingMap(prev => ({ ...prev, [jenis]: true }));
    try {
      const existing = localUploads.find(u => u.jenis_dokumen === jenis);
      const token = getAuthToken();
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const fd = new FormData();
      fd.append('peserta_id',    String(pesertaId));
      fd.append('jenis_dokumen', jenis);
      fd.append('file',          file);

      const url = existing ? `/api/upload/${existing.id}` : '/api/upload';

      if (existing) {
        fd.append('_method', 'PUT');
      }

      const res = await fetch(url, {
        method: existing ? 'POST' : 'POST',
        headers,
        body: fd,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? `Gagal mengunggah ${jenis}.`);
      }

      const json = await res.json();
      setLocalUploads(prev => {
        const filtered = prev.filter(u => u.jenis_dokumen !== jenis);
        return [...filtered, json.data];
      });
    } finally {
      setUploadingMap(prev => ({ ...prev, [jenis]: false }));
    }
  };

  const handleDelete = async (jenis: JenisDokumen) => {
    const existing = localUploads.find(u => u.jenis_dokumen === jenis);
    if (!existing) return;

    setUploadingMap(prev => ({ ...prev, [jenis]: true }));
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/upload/${existing.id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? `Gagal menghapus ${jenis}.`);
      }

      setLocalUploads(prev => prev.filter(u => u.id !== existing.id));
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Gagal menghapus file.');
    } finally {
      setUploadingMap(prev => ({ ...prev, [jenis]: false }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      for (const jenis of JENIS_LIST) {
        const file = files[jenis];
        if (file) await uploadSingle(jenis, file);
      }

      setApiSuccess('Semua dokumen berhasil diunggah!');
      setTimeout(() => onSuccess(), 1200);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengunggah.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => onSuccess();

  const getExistingUrl = (jenis: JenisDokumen): string | undefined => {
    const found = localUploads.find(u => u.jenis_dokumen === jenis);
    return found?.file_url;
  };

  const content = (
    <div className="upload-dok-body">
      {apiError   && <Alert type="error"   message={apiError}   onClose={() => setApiError(null)} />}
      {apiSuccess && <Alert type="success" message={apiSuccess} />}

      <p className="upload-dok-desc">
        Unggah dokumen persyaratan di bawah ini. <strong>Foto, KTM, dan CV wajib</strong> diunggah sebelum melanjutkan.
        Sertifikat bersifat opsional namun akan memperkuat berkas pendaftaranmu.
      </p>

      <div className="upload-dok-grid">
        {JENIS_LIST.map(jenis => (
          <UploadCard
            key={jenis}
            jenis={jenis}
            file={files[jenis]}
            onChange={handleChange}
            error={fieldErrors[jenis]}
            existingUrl={getExistingUrl(jenis)}
            uploading={uploadingMap[jenis]}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="upload-dok-footer">
        <button className="btn-upload-skip" onClick={handleSkip}>
          Lewati untuk sekarang
        </button>
        <button className="btn-upload-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Mengunggah...' : 'Unggah & Lanjutkan →'}
        </button>
      </div>
    </div>
  );

  if (inline) return content;
  return (
    <div className="upload-dok-layout">
      <header className="upload-dok-header">
        <button className="upload-dok-header__back" onClick={onBack} aria-label="Kembali">←</button>
        <h1 className="upload-dok-header__title">Upload Dokumen Persyaratan</h1>
      </header>
      {content}
    </div>
  );
};