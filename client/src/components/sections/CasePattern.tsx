import { Activity, FlaskConical, Scissors, TrendingUp, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/ui/ScrollMotion';
import { pageDefaults } from '@/lib/pageContent';
import '@/styles/case-pattern.css';

// Card icons stay fixed; the copy on each card comes from the Case Studies page content.
const ICONS: LucideIcon[] = [TrendingUp, Scissors, FlaskConical];

// The yellow "recurring pattern" band on the Case Studies page. It stays yellow in both themes.
export default function CasePattern({ content: c = pageDefaults('caseStudies') }: { content?: Record<string, string> }) {
  const lines = c.patternTitle.split('\n');
  const steps = ICONS.map((Icon, i) => ({
    Icon,
    tag: c[`patternStep${i + 1}Tag`],
    title: c[`patternStep${i + 1}Title`],
    text: c[`patternStep${i + 1}Text`],
  })).filter((s) => s.title || s.text);

  return (
    <section className="cp-band mb-10 bg-yellow text-dark md:mb-14">
      <div className="container cp-inner">
        <Reveal className="cp-top">
          <div className="cp-head">
            <p className="cp-eyebrow"><Activity size={13} strokeWidth={2.4} aria-hidden="true" />{c.patternLabel}</p>
            <h2 className="display cp-title">
              {lines.map((line, i) => (
                <span key={i} className={i === lines.length - 1 && lines.length > 1 ? 'cp-title-line is-hl' : 'cp-title-line'} style={{ '--i': i } as React.CSSProperties}>
                  {line}
                </span>
              ))}
            </h2>
          </div>

          <p className="cp-text">{c.patternText}</p>
        </Reveal>

        <ol className="cp-steps">
          {steps.map(({ Icon, tag, title, text }, i) => (
            <li key={i}>
              <Reveal delay={i * 140} className="cp-step-reveal">
                <div className="cp-step">
                  <div className="cp-step-top">
                    <span className="cp-step-icon"><Icon size={18} strokeWidth={2.2} aria-hidden="true" /></span>
                    <span className="cp-step-tag">{tag}</span>
                    <span className="cp-step-num display" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="display cp-step-title">{title}</h3>
                  <p className="cp-step-text">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
