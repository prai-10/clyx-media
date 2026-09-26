import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Header from './Header';
import { CookieBar, Footer, WhatsAppButton } from './Footer';
import { DirectionalReveal, Reveal } from '@/components/ui/ScrollMotion';
import { isExternalHref, safeHref, usePageContent } from '@/lib/pageContent';
import '@/styles/inner-hero.css';

// The intro card's two buttons, edited under "Header & Footer" in the admin panel.
function HeroButtons(){const c=usePageContent('global');const buttons=[{text:c.heroPrimaryText,href:safeHref(c.heroPrimaryUrl),cls:'ih-btn-primary'},{text:c.heroSecondaryText,href:safeHref(c.heroSecondaryUrl),cls:'ih-btn-ghost'}].filter(b=>b.text);if(!buttons.length)return null;return <div className="ih-actions">{buttons.map(b=><a key={b.cls} href={b.href} className={`ih-btn ${b.cls}`} {...(isExternalHref(b.href)?{target:'_blank',rel:'noreferrer'}:{})}>{b.text} <ArrowUpRight size={16}/></a>)}</div>}
// `aside` replaces the default intro card on the right of the hero; pass `false` to leave that side empty.
export default function PageShell({children, eyebrow, title, intro, tone='light', aside, grid=false}:{children:ReactNode;eyebrow:string;title:ReactNode;intro:string;tone?:'light'|'dark';aside?:ReactNode;grid?:boolean}){return <div className="inner-page-shell min-h-screen bg-[color:var(--background)] text-foreground transition-colors duration-200"><Header/><main>
  <section className={`inner-hero${tone==='dark'?' is-dark':''}${grid?' has-grid':''}`}>
    <div className="ih-orb" aria-hidden="true"/>
    <div className="container ih-inner">
      <Reveal className="ih-copy">
        <p className="ih-eyebrow"><span className="ih-dot" aria-hidden="true"/>{eyebrow}</p>
        <h1 className="ih-title">{title}</h1>
      </Reveal>
      <DirectionalReveal direction="right" delay={420}>
        {aside ?? <div className="ih-card">
          <p className="ih-intro">{intro}</p>
          <HeroButtons/>
        </div>}
      </DirectionalReveal>
    </div>
  </section>
  <Reveal className="page-content-reveal">{children}</Reveal></main><Footer/><WhatsAppButton/><CookieBar/></div>}
