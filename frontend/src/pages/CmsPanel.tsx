import { useState } from 'react';
import './CmsPanel.css';

export const CmsPanel = () => {
  const [activeTab, setActiveTab] = useState('pengumuman');

  return (
    <div className="cms-layout">
      <aside className="cms-sidebar">
        <h2 className="cms-sidebar-title">Content Management</h2>
        <ul className="cms-nav">
          <li className={activeTab === 'pengumuman' ? 'active' : ''} onClick={() => setActiveTab('pengumuman')}>
            Pengumuman
          </li>
          <li className={activeTab === 'timeline' ? 'active' : ''} onClick={() => setActiveTab('timeline')}>
            Timeline
          </li>
          <li className={activeTab === 'faq' ? 'active' : ''} onClick={() => setActiveTab('faq')}>
            FAQ
          </li>
          <li className={activeTab === 'laporan' ? 'active' : ''} onClick={() => setActiveTab('laporan')}>
            Laporan
          </li>
          <li className={activeTab === 'pengaturan' ? 'active' : ''} onClick={() => setActiveTab('pengaturan')}>
            Pengaturan Tampilan
          </li>
        </ul>
      </aside>

      <main className="cms-main">
        <header className="cms-header">
          <h1>
            {activeTab === 'pengumuman' && 'Kelola Pengumuman'}
            {activeTab === 'timeline' && 'Kelola Timeline'}
            {activeTab === 'faq' && 'Kelola FAQ'}
            {activeTab === 'laporan' && 'Unduh Laporan'}
            {activeTab === 'pengaturan' && 'Pengaturan Landing Page'}
          </h1>
        </header>

        <div className="cms-content">
          {activeTab === 'faq' && (
            <div className="cms-form-card">
              <h3>Tambah FAQ Baru</h3>
              <form onSubmit={e => e.preventDefault()}>
                <div className="form-group">
                  <label>Pertanyaan</label>
                  <input type="text" placeholder="Masukkan pertanyaan..." />
                </div>
                <div className="form-group">
                  <label>Jawaban</label>
                  <textarea rows={4} placeholder="Masukkan jawaban..."></textarea>
                </div>
                <button type="submit" className="btn-submit">Simpan FAQ</button>
              </form>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="cms-form-card">
              <h3>Tambah Event Timeline</h3>
              <form onSubmit={e => e.preventDefault()}>
                <div className="form-group">
                  <label>Judul Event</label>
                  <input type="text" placeholder="Tahap Wawancara" />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Tanggal Mulai</label>
                    <input type="date" />
                  </div>
                  <div className="form-group">
                    <label>Tanggal Selesai (Opsional)</label>
                    <input type="date" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Deskripsi Tambahan</label>
                  <textarea rows={2} placeholder="Penjelasan singkat..."></textarea>
                </div>
                <button type="submit" className="btn-submit">Simpan Timeline</button>
              </form>
            </div>
          )}

          {activeTab === 'pengaturan' && (
            <div className="cms-form-card">
              <h3>Pengaturan Banner & Sambutan</h3>
              <form onSubmit={e => e.preventDefault()}>
                <div className="form-group">
                  <label>Teks Sambutan Ketua</label>
                  <textarea rows={4} defaultValue="Selamat datang para calon pengurus..."></textarea>
                </div>
                <div className="form-group">
                  <label>Teks Benefit</label>
                  <textarea rows={2} defaultValue="Relasi luas, upgrade skill, portofolio"></textarea>
                </div>
                <button type="submit" className="btn-submit">Simpan Pengaturan</button>
              </form>
            </div>
          )}

          {activeTab === 'laporan' && (
            <div className="cms-form-card">
              <h3>Eksport Data Pendaftar & Pengumuman</h3>
              <p className="description-text">
                Unduh seluruh data pengumuman sistem dalam format Excel (CSV) atau format cetak halaman (PDF).
              </p>
              <div className="export-actions">
                <a href="/api/report/excel" target="_blank" rel="noreferrer" className="btn-export excel">Unduh Excel</a>
                <a href="/api/report/pdf" target="_blank" rel="noreferrer" className="btn-export pdf">Cetak PDF</a>
              </div>
            </div>
          )}

          {activeTab === 'pengumuman' && (
            <div className="cms-form-card">
              <h3>Target Modul Tersedia di Halaman Terpisah</h3>
              <p>Form Pengumuman sudah dimasukan di flow dashboard umum.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
