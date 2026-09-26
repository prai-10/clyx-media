import { useRef } from 'react';
import { Infinity as MetaIcon, Instagram, Search, Youtube, ShoppingBag, MessageCircle, type LucideIcon } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { pageDefaults } from '@/lib/pageContent';

// Tile icons stay fixed by position; names and details come from the Home page content.
const ICONS: LucideIcon[] = [MetaIcon, Instagram, Search, Youtube, ShoppingBag, MessageCircle];

// Where CLYX runs campaigns: an intro on the left, one tile per channel on the right.
export default function ChannelStrip({ content: c = pageDefaults('home') }: { content?: Record<string, string> }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useScrollReveal(ref);
  const channels = ICONS.map((icon, i) => ({ icon, name: c[`channel${i + 1}Name`], detail: c[`channel${i + 1}Detail`] })).filter(
    (ch) => ch.name || ch.detail,
  );

  return (
    <section ref={ref} className={`channel-strip${visible ? ' is-visible' : ''}`} aria-labelledby="channel-strip-title">
      <div className="channel-intro">
        <p className="eyebrow">{c.channelsEyebrow}</p>
        <h2 id="channel-strip-title">{c.channelsTitle}</h2>
        <p>{c.channelsText}</p>
      </div>
      <ul className="channel-grid">
        {channels.map(({ icon: Icon, name, detail }, i) => (
          <li key={i} className="channel-tile">
            <span className="channel-icon"><Icon size={20} strokeWidth={2} aria-hidden="true" /></span>
            <span className="channel-text">
              <strong>{name}</strong>
              <span>{detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
