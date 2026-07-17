import './LandingPage.css';
import { Timeline } from '../components/Timeline';
import { Accordion } from '../components/Accordion';

export const LandingPage = () => {
  // Dummy data for preview
  const timelineEvents = [
    { id: 1, judul: 'Pendaftaran Buka', tanggal_mulai: '2026-08-01', is_active: true },
    { id: 2, judul: 'Seleksi Berkas', tanggal_mulai: '2026-08-15', deskripsi: 'Pengumuman lolos administrasi', is_active: false },
    { id: 3, judul: 'Wawancara', tanggal_mulai: '2026-08-20', is_active: false },
  ];

  const faqItems = [
    { id: 1, pertanyaan: 'Siapa saja yang bisa mendaftar?', jawaban: 'Seluruh mahasiswa aktif Teknik Informatika.', is_active: true },
    { id: 2, pertanyaan: 'Apakah bayar?', jawaban: 'Gratis, tidak dipungut biaya apapun.', is_active: true },
  ];

  return (
    <div className="landing-wrapper">
      <nav className="navbar">
        <div className="nav-logo">SIMAHATI OPREC</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#timeline">Timeline</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><button className="nav-btn">Login</button></li>
        </ul>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Waktunya Berkontribusi untuk HIMATI</h1>
          <p className="hero-subtitle">Open Recruitment Pengurus Himpunan Mahasiswa Teknik Informatika 2026</p>
          <button className="hero-cta">Daftar Sekarang</button>
        </div>
        <div className="hero-glowing-blob"></div>
      </section>

      <section id="about" className="benefit-section">
        <h2 className="section-title">Kenapa Harus Bergabung?</h2>
        <div className="benefit-grid">
          <div className="benefit-card">
            <h3>🤝 Relasi Bertambah</h3>
            <p>Perluas jaringan pertemananmu di lingkup mahasiswa hingga alumni.</p>
          </div>
          <div className="benefit-card">
            <h3>📈 Upgrade Skill</h3>
            <p>Latih kemampuan hardskill & softskill langsung di lapangan.</p>
          </div>
          <div className="benefit-card">
            <h3>💡 Portofolio</h3>
            <p>Pengalaman organisasi berharga untuk bekal karir masa depan.</p>
          </div>
        </div>
      </section>

      <section id="timeline" className="timeline-section">
        <h2 className="section-title">Timeline Kegiatan</h2>
        <div className="timeline-container-wrapper">
          <Timeline events={timelineEvents} />
        </div>
      </section>

      <section id="faq" className="faq-section">
        <h2 className="section-title">Pertanyaan Sering Ditanyakan</h2>
        <div className="faq-container-wrapper">
          <Accordion items={faqItems} />
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <h2>SIMAHATI</h2>
          <p>© 2026 Himpunan Mahasiswa Teknik Informatika. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
