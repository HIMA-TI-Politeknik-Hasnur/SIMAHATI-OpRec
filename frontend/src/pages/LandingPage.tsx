import { useState, useEffect } from 'react';
import './LandingPage.css';
import { Timeline } from '../components/Timeline';
import { Accordion } from '../components/Accordion';
import { AnnouncementCard } from '../components/AnnouncementCard';
import {
  BACKUP_HERO_TITLE,
  BACKUP_HERO_SUBTITLE,
  BACKUP_HERO_CTA,
  BACKUP_SECTION_TITLE_BENEFIT,
  BACKUP_SECTION_TITLE_TIMELINE,
  BACKUP_SECTION_TITLE_PENGUMUMAN,
  BACKUP_SECTION_TITLE_FAQ,
  BACKUP_FOOTER_COPYRIGHT,
  BACKUP_BENEFITS,
  BACKUP_FOOTER_NAME,
} from '../data/_backupLandingData';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  tipe: 'info' | 'warning' | 'success' | 'danger';
  published_at: string;
}

interface TimelineEvent {
  id: number;
  judul: string;
  deskripsi?: string;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  is_active: boolean;
}

interface FaqItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
  is_active: boolean;
}

interface AppSettings {
  hero_subtitle?: string;
  hero_title?: string;
  hero_cta_text?: string;
  section_title_benefit?: string;
  section_title_timeline?: string;
  section_title_pengumuman?: string;
  section_title_faq?: string;
  footer_copyright?: string;
  benefit_text?: string;
  app_name?: string;
}

export const LandingPage = ({ onNavigate }: LandingPageProps) => {
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [benefits, setBenefits] = useState<{ icon: string; title: string; desc: string }[]>([]);
  const [settings, setSettings] = useState<AppSettings>({});
  const [appName, setAppName] = useState(BACKUP_FOOTER_NAME);

  useEffect(() => {
    fetch('/api/pengumuman/publik', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(json => { if (json.success) setPengumumanList(json.data ?? []); })
      .catch(() => {});

    fetch('/api/timeline/publik', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(json => { if (json.success) setTimelineEvents(json.data ?? []); })
      .catch(() => {});

    fetch('/api/faq/publik', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(json => { if (json.success) setFaqItems(json.data ?? []); })
      .catch(() => {});

    fetch('/api/benefit/publik', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(json => { if (json.success && json.data?.length) setBenefits(json.data); })
      .catch(() => {});

    fetch('/api/settings/publik', { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) {
          setSettings(json.data);
          if (json.data.app_name) setAppName(json.data.app_name);
        }
      })
      .catch(() => {});
  }, []);

  const heroTitle = settings.hero_title || BACKUP_HERO_TITLE;
  const heroSubtitle = settings.hero_subtitle || BACKUP_HERO_SUBTITLE;
  const heroCta = settings.hero_cta_text || BACKUP_HERO_CTA;
  const benefitList = benefits.length > 0 ? benefits : BACKUP_BENEFITS;
  const benefitText = settings.benefit_text || BACKUP_BENEFITS.map(b => b.desc).join(' ');
  const sectionTitleBenefit = settings.section_title_benefit || BACKUP_SECTION_TITLE_BENEFIT;
  const sectionTitleTimeline = settings.section_title_timeline || BACKUP_SECTION_TITLE_TIMELINE;
  const sectionTitlePengumuman = settings.section_title_pengumuman || BACKUP_SECTION_TITLE_PENGUMUMAN;
  const sectionTitleFaq = settings.section_title_faq || BACKUP_SECTION_TITLE_FAQ;
  const footerCopyright = settings.footer_copyright || BACKUP_FOOTER_COPYRIGHT;

  return (
    <div className="landing-wrapper">
      <section id="landing" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{heroTitle}</h1>
          <p className="hero-subtitle">{heroSubtitle}</p>
          <button className="hero-cta" onClick={() => onNavigate('register')}>{heroCta}</button>
        </div>
        <div className="hero-glowing-blob"></div>
      </section>

      <section id="about" className="benefit-section">
        <h2 className="section-title">{sectionTitleBenefit}</h2>
        {benefitText && benefitText !== BACKUP_BENEFITS.map(b => b.desc).join(' ') && (
          <p className="benefit-description" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 2rem', color: '#94a3b8' }}>{benefitText}</p>
        )}
        <div className="benefit-grid">
          {benefitList.map((b, i) => (
            <div className="benefit-card" key={i}>
              <h3>{b.icon} {b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="timeline" className="timeline-section">
        <h2 className="section-title">{sectionTitleTimeline}</h2>
        <div className="timeline-container-wrapper">
          <Timeline events={timelineEvents} />
        </div>
      </section>

      {pengumumanList.length > 0 && (
        <section id="pengumuman" className="pengumuman-section">
          <h2 className="section-title">{sectionTitlePengumuman}</h2>
          <div className="pengumuman-container-wrapper">
            {pengumumanList.map(p => (
              <AnnouncementCard
                key={p.id}
                id={p.id}
                judul={p.judul}
                isi={p.isi}
                tipe={p.tipe}
                published_at={p.published_at}
              />
            ))}
          </div>
        </section>
      )}

      <section id="faq" className="faq-section">
        <h2 className="section-title">{sectionTitleFaq}</h2>
        <div className="faq-container-wrapper">
          <Accordion items={faqItems} />
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <h2>{appName}</h2>
          <p>{footerCopyright}</p>
        </div>
      </footer>
    </div>
  );
};
