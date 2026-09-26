import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { PAGES, type CollectionName, type PageId } from '@/lib/pageContent';
import { COLLECTIONS } from './collections';
import { PAGE_ICONS } from './nav';
import type { AdminContent } from './useAdminData';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

const HIGHLIGHTS: CollectionName[] = ['campaigns', 'caseStudies', 'portfolio', 'blog', 'team', 'creators'];

export default function Dashboard({ content, onOpenPage }: { content: AdminContent | undefined; onOpenPage: (id: PageId) => void }) {
  const counts = (name: CollectionName) => {
    const list = content?.collections?.[name] ?? [];
    return { total: list.length, live: list.filter((x) => !x.isHidden).length };
  };
  const customised = (id: PageId) => Object.keys(content?.blocks?.[`page_${id}`] ?? {}).length > 0;

  return (
    <div className="adm-page">
      <header className="adm-hero is-welcome">
        <div className="adm-hero-glow" aria-hidden="true" />
        <div className="adm-hero-main">
          <span className="adm-hero-icon is-accent">
            <Sparkles size={22} />
          </span>
          <div>
            <p className="adm-eyebrow">CLYX control room</p>
            <h1>{greeting()}, Admin.</h1>
            <p className="adm-hero-text">
              Pick a page from the sidebar to change its text, images and links. Everything you publish goes live on the website instantly.
            </p>
          </div>
        </div>
        <div className="adm-hero-side">
          <a className="adm-btn is-light" href="/" target="_blank" rel="noreferrer">
            Open website <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <div className="adm-stats">
        {HIGHLIGHTS.map((name) => {
          const def = COLLECTIONS[name];
          const Icon = def.icon;
          const { total, live } = counts(name);
          return (
            <div key={name} className="adm-stat">
              <div className="adm-stat-top">
                <span className="adm-stat-icon">
                  <Icon size={17} />
                </span>
                <span className="adm-stat-label">{def.label}</span>
              </div>
              <strong>{content ? total : '—'}</strong>
              <div className="adm-stat-bar">
                <span style={{ width: total ? `${(live / total) * 100}%` : '0%' }} />
              </div>
              <p>
                <span className="adm-dot is-live" /> {live} live
                {total - live > 0 && <span className="adm-muted"> · {total - live} hidden</span>}
              </p>
            </div>
          );
        })}
      </div>

      <div className="adm-block-head">
        <h2>Website pages</h2>
        <p>Every page in the site navigation, plus the header &amp; footer shared by all of them.</p>
      </div>
      <div className="adm-page-grid">
        {PAGES.map((page) => {
          const Icon = PAGE_ICONS[page.id];
          const fields = page.sections.reduce((n, s) => n + s.fields.length, 0);
          return (
            <button key={page.id} type="button" className="adm-page-card" onClick={() => onOpenPage(page.id)}>
              <div className="adm-page-card-top">
                <span className="adm-page-card-icon">
                  <Icon size={19} />
                </span>
                <span className={`adm-tag${customised(page.id) ? ' is-accent' : ''}`}>{customised(page.id) ? 'Customised' : 'Default copy'}</span>
              </div>
              <h3>{page.label}</h3>
              <p>{page.blurb}</p>
              <div className="adm-page-card-foot">
                <span>
                  {page.sections.length} sections · {fields} fields
                  {page.collections.length > 0 && ` · ${page.collections.length} ${page.collections.length === 1 ? 'list' : 'lists'}`}
                </span>
                <ArrowRight size={16} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
