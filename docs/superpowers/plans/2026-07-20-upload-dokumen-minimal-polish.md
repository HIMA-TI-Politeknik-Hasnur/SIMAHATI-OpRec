# Upload Dokumen — Minimal Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade UploadDokumen with replace-on-reupload, per-jenis loading, delete button, and dokumen-warning in Preview.

**Architecture:** Three independent frontend changes: (1) UploadCard gets `onDelete` + `uploading` props, (2) UploadDokumen switches POST/PUT based on existing uploads, (3) PreviewPendaftaran shows warning for missing wajib dokumen. Backend unchanged — all required endpoints already exist.

**Tech Stack:** React + TypeScript + CSS, Laravel API (unchanged).

## Global Constraints

- Setiap `peserta_id + jenis_dokumen` maksimal 1 record → POST if new, PUT if existing
- Upload wajib hanya foto/ktm/cv — sertifikat opsional
- Alert warning di Preview tidak blocking — user tetap bisa submit
- Ganti file lama → timpa (hapus file lama di storage, simpan baru)
- Hapus file → DELETE endpoint + hapus dari state lokal

---

### Task 1: UploadCard — tambah `onDelete` + `uploading` props

**Files:**
- Modify: `frontend/src/components/UploadCard.tsx`

**Interfaces:**
- Consumes: `JenisDokumen` type (already defined in file)
- Produces: `UploadCardProps` with new optional fields `onDelete?: (jenis: JenisDokumen) => void`, `uploading?: boolean`

- [ ] **Step 1: Update UploadCardProps interface**

```typescript
interface UploadCardProps {
  jenis: JenisDokumen;
  file: File | null;
  onChange: (jenis: JenisDokumen, file: File | null) => void;
  error?: string;
  existingUrl?: string;
  uploading?: boolean;
  onDelete?: (jenis: JenisDokumen) => void;
}
```

- [ ] **Step 2: Update component destructuring**

Change line 31 from:
```typescript
export const UploadCard = ({ jenis, file, onChange, error, existingUrl }: UploadCardProps) => {
```
to:
```typescript
export const UploadCard = ({ jenis, file, onChange, error, existingUrl, uploading, onDelete }: UploadCardProps) => {
```

- [ ] **Step 3: Add delete button next to existing remove button**

In the preview section (around line 99), change the button block to conditionally show onDelete button when `existingUrl` exists and no new file selected:

```tsx
          <div className="upload-card__preview-detail">
            <p className="upload-card__preview-name">{file?.name ?? `(${meta.title} terunggah)`}</p>
            {file && <p className="upload-card__preview-size">{formatSize(file.size)}</p>}
            {existingPreview && !file && <p className="upload-card__preview-size">Sudah diunggah</p>}
          </div>
          <div className="upload-card__actions">
            {existingPreview && !file && onDelete && (
              <button
                type="button"
                className="upload-card__delete"
                onClick={() => onDelete(jenis)}
                aria-label={`Hapus ${meta.title} dari server`}
                title="Hapus dari server"
              >
                🗑️
              </button>
            )}
            <button
              type="button"
              className="upload-card__remove"
              onClick={handleRemove}
              aria-label={`Hapus ${meta.title}`}
            >
              ×
            </button>
          </div>
```

- [ ] **Step 4: Add loading overlay to dropzone/preview area**

Wrap the content area with a loading overlay. Inside the card div, after the header and before the content, add:

```tsx
      {uploading && (
        <div className="upload-card__loading">
          <div className="upload-card__loading-spinner" />
          <span>Mengunggah...</span>
        </div>
      )}
```

- [ ] **Step 5: Add CSS for new elements**

Read and append to `frontend/src/components/UploadCard.css`:

```css
.upload-card__actions {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.upload-card__delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.upload-card__delete:hover {
  opacity: 1;
}

.upload-card__loading {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  z-index: 2;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #4b5563;
}

.upload-card__loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: upload-card-spin 0.6s linear infinite;
}

@keyframes upload-card-spin {
  to { transform: rotate(360deg); }
}
```

Also add `position: relative;` to `.upload-card` (find existing `.upload-card` rule and add it).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/UploadCard.tsx frontend/src/components/UploadCard.css
git commit -m "feat(upload-card): add onDelete and uploading props with delete button and loading overlay"
```

---

### Task 2: UploadDokumen — POST/PUT logic + loading per jenis + delete

**Files:**
- Modify: `frontend/src/pages/UploadDokumen.tsx`

**Interfaces:**
- Consumes: `UploadCard` with new `onDelete`/`uploading` props (Task 1)
- Produces: Updated UploadDokumen that sends POST (new) or PUT (existing) per file, shows per-jenis loading, supports delete

- [ ] **Step 1: Add `uploadingMap` state and `handleDelete` function**

Replace the state declarations (lines 16-29) with:

```typescript
type FileMap = Record<JenisDokumen, File | null>;
type ErrorMap = Record<JenisDokumen, string>;

const JENIS_LIST: JenisDokumen[] = ['foto', 'ktm', 'cv', 'sertifikat'];
const WAJIB: JenisDokumen[] = ['foto', 'ktm', 'cv'];

export const UploadDokumen = ({ pesertaId, onBack, onSuccess, inline, existingUploads }: UploadDokumenProps) => {
  const [files, setFiles] = useState<FileMap>({
    foto: null, ktm: null, cv: null, sertifikat: null,
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<ErrorMap>>({});
  const [apiError, setApiError]       = useState<string | null>(null);
  const [apiSuccess, setApiSuccess]   = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [uploadingMap, setUploadingMap] = useState<Record<string, boolean>>({});
  const [localUploads, setLocalUploads] = useState<UploadRecord[]>(existingUploads || []);
```

- [ ] **Step 2: Change `uploadSingle` to handle POST vs PUT**

Replace the `uploadSingle` function (lines 52-71) with:

```typescript
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

      const url  = existing ? `/api/upload/${existing.id}` : '/api/upload';
      const method = existing ? 'PUT' : 'POST';

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
```

Note: Laravel uses `_method: PUT` trick when FormData doesn't support PUT. So we send POST with `_method=PUT`.

- [ ] **Step 3: Add `handleDelete` function**

Add after `uploadSingle`:

```typescript
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
```

- [ ] **Step 4: Update `getExistingUrl` and pass new props to UploadCard**

Change `getExistingUrl` to use `localUploads`:

```typescript
  const getExistingUrl = (jenis: JenisDokumen): string | undefined => {
    const found = localUploads.find(u => u.jenis_dokumen === jenis);
    return found?.file_url;
  };
```

Update the UploadCard JSX to pass new props:

```tsx
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
```

- [ ] **Step 5: Update `useEffect` for existing uploads**

Replace the existing useEffect (lines 31-35) with:

```typescript
  useEffect(() => {
    if (existingUploads?.length) {
      setLocalUploads(existingUploads);
      setApiSuccess('Dokumen sudah pernah diunggah.');
    }
  }, [existingUploads]);
```

- [ ] **Step 6: Update the success (perbarui) message instead of "diunggah"**

Change `apiSuccess` message after submit to reflect replace semantics:

In `handleSubmit`, change line 85:
```typescript
      setApiSuccess('Semua dokumen berhasil diunggah!');
```

Nothing to change here — this is still accurate since we submit all selected files.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/pages/UploadDokumen.tsx
git commit -m "feat(upload-dokumen): POST/PUT logic, per-jenis loading, delete, local state"
```

---

### Task 3: PreviewPendaftaran — peringatan dokumen belum lengkap

**Files:**
- Modify: `frontend/src/pages/PreviewPendaftaran.tsx`

**Interfaces:**
- Consumes: `PesertaRecord` with `uploads` array (from API)
- Produces: Warning alert above submit button if wajib dokumen (foto/ktm/cv) missing

- [ ] **Step 1: Add dokumen warning state and logic**

After the `docs` variable (line 118), add:

```typescript
  const WAJIB_DOKUMEN = ['foto', 'ktm', 'cv'];
  const dokumenTerkirim = new Set((peserta.uploads || []).map(u => u.jenis_dokumen));
  const dokumenKurang = WAJIB_DOKUMEN.filter(j => !dokumenTerkirim.has(j));
  const [dismissWarning, setDismissWarning] = useState(false);
```

- [ ] **Step 2: Add useState import**

The `useState` import is already there at line 1: `import { useState, useEffect } from 'react';`.

- [ ] **Step 3: Add warning alert in the content, before the footer**

After the dokumen section (closing `</div>` at line 202), add:

```tsx
      {/* Peringatan dokumen */}
      {dokumenKurang.length > 0 && !dismissWarning && (
        <Alert
          type="warning"
          message={
            <>
              <strong>Peringatan:</strong> Dokumen berikut belum diunggah:{' '}
              {dokumenKurang.map(j => j.toUpperCase()).join(', ')}.
              Anda tetap bisa submit, tapi proses verifikasi mungkin tertunda.
            </>
          }
          onClose={() => setDismissWarning(true)}
        />
      )}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/PreviewPendaftaran.tsx
git commit -m "feat(preview): add warning alert for missing wajib dokumen"
```
