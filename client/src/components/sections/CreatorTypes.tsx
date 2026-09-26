import { HeartHandshake, Sparkles, Zap, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/ui/ScrollMotion';
import { pageDefaults } from '@/lib/pageContent';
import '@/styles/creator-types.css';

// Card icons stay fixed; the copy on each card comes from the Creators page content.
const ICONS: LucideIcon[] = [Zap, HeartHandshake, Sparkles];

// The blue "creator types" band on the Creators page. It stays blue in both themes.
export default function CreatorTypes({ content: c = pageDefaults('creators') }: { content?: Record<string, string> }) {
  const types = ICONS.map((Icon, i) => ({
    Icon,
    tag: c[`type${i + 1}Tag`],
    title: c[`type${i + 1}Title`],
    text: c[`type${i + 1}Text`],
  }));
  return (
    <section className="ct-band bg-blue text-white">
      {/* Polished-gold gradient shared by the card icons. userSpaceOnUse (the 24px icon grid) so straight strokes still render. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="ct-gold" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="22" y2="22">
            <stop offset="0%" stopColor="#FFF6C9" />
            <stop offset="35%" stopColor="#FFDE59" />
            <stop offset="70%" stopColor="#D99A00" />
            <stop offset="100%" stopColor="#FFE680" />
          </linearGradient>
        </defs>
      </svg>
      <div className="container ct-inner">
        <Reveal className="ct-head">
          <div>
            <p className="ct-eyebrow"><span className="ct-eyebrow-dot" />{c.typesEyebrow}</p>
            <h2 className="display ct-title">
              {c.typesTitle}{' '}
              <span className="ct-highlight text-yellow" aria-label={c.typesHighlight}>
                {(c.typesHighlight || '').split('').map((ch, i) => (
                  <span key={i} className="ct-ch" style={{ '--i': i } as React.CSSProperties} aria-hidden="true">{ch === ' ' ? ' ' : ch}</span>
                ))}
              </span>
            </h2>
          </div>
          <p className="ct-intro">{c.typesIntro}</p>
        </Reveal>

        <div className="ct-grid">
          {types.map(({ Icon, tag, title, text }, i) => (
            <Reveal key={i} delay={i * 140}>
              <article className="ct-card">
                <span className="ct-num display" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className="ct-card-top">
                  <span className="ct-icon"><Icon size={24} strokeWidth={2.1} stroke="url(#ct-gold)" /></span>
                  {tag && <p className="ct-tag">{tag}</p>}
                </div>
                <h3 className="display ct-card-title">{title}</h3>
                <p className="ct-card-text">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
