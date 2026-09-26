import { useEffect, useId, useRef, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import '@/styles/careers-hero-note.css';

// How long the pen lingers on each character; punctuation gets a breath like real handwriting.
const pause = (ch: string) => (ch === '\n' ? 420 : ch === '.' || ch === '—' ? 360 : ch === ',' ? 220 : ch === ' ' ? 70 : 34 + Math.random() * 30);

// A lacquered fountain pen drawn lying flat, nib at the left-centre point (0, 10) so it can pivot on the caret.
function Pen() {
  const id = useId().replace(/:/g, '');
  const gold = `url(#${id}-gold)`;
  const lacquer = `url(#${id}-lacquer)`;
  return (
    <svg className="chn-pen-svg" viewBox="0 0 132 20" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3C4" />
          <stop offset=".35" stopColor="#E8BC52" />
          <stop offset=".65" stopColor="#A87822" />
          <stop offset="1" stopColor="#E9C66A" />
        </linearGradient>
        <linearGradient id={`${id}-lacquer`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9AA6C4" />
          <stop offset=".14" stopColor="#2C3654" />
          <stop offset=".5" stopColor="#080B14" />
          <stop offset=".84" stopColor="#020305" />
          <stop offset="1" stopColor="#46506E" />
        </linearGradient>
        <linearGradient id={`${id}-grip`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A5E66" />
          <stop offset=".45" stopColor="#15171B" />
          <stop offset="1" stopColor="#2C2F35" />
        </linearGradient>
      </defs>
      {/* Nib, with its slit and breather hole */}
      <path d="M0 10C5 8.6 11 6.6 17 6V14C11 13.4 5 11.4 0 10Z" fill={gold} />
      <path d="M1.5 10H11" stroke="#5C3F0E" strokeWidth=".55" strokeLinecap="round" />
      <circle cx="11.6" cy="10" r=".85" fill="#3A280A" />
      <path d="M13.5 7.2Q15 10 13.5 12.8" fill="none" stroke="#8A6118" strokeWidth=".45" />
      {/* Grip section and trim ring */}
      <path d="M16 6.2L31 5V15L16 13.8Z" fill={`url(#${id}-grip)`} />
      <rect x="31" y="4.4" width="3" height="11.2" fill={gold} />
      {/* Barrel, cap band and rounded cap */}
      <rect x="34" y="3.6" width="62" height="12.8" fill={lacquer} />
      <rect x="96" y="3.2" width="4" height="13.6" fill={gold} />
      <rect x="101" y="3.3" width="1" height="13.4" fill={gold} />
      <path d="M100 3.4H124A6.6 6.6 0 0 1 124 16.6H100Z" fill={lacquer} />
      {/* Specular highlight running along the lacquer */}
      <rect x="35" y="5.2" width="93" height="1.3" rx=".65" fill="#FFFFFF" opacity=".55" />
      <rect x="38" y="13.4" width="86" height=".6" rx=".3" fill="#FFFFFF" opacity=".14" />
      <rect x="17" y="6.9" width="13" height=".7" rx=".35" fill="#FFFFFF" opacity=".25" />
      {/* Clip */}
      <rect x="104" y="1.3" width="23" height="2.3" rx="1.15" fill={gold} />
      <circle cx="105.2" cy="2.45" r="1.9" fill={gold} />
    </svg>
  );
}

const chars = (s: string) => s.split('').map((ch, i) => <span key={i} className="chn-ch">{ch}</span>);

// Careers hero: a fountain pen writes a short handwritten note, letter by letter, then signs it.
export default function CareersHeroNote({ text, sign }: { text: string; sign?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useScrollReveal(ref);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  // The signature is written on its own line after the note, so the pen ends up resting beside it.
  const full = sign ? `${text}\n${sign}` : text;
  const signAt = text.length + 1;
  const done = count >= full.length;

  useEffect(() => {
    if (!inView || started) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCount(full.length); setStarted(true); return; }
    const t = window.setTimeout(() => setStarted(true), 900);
    return () => window.clearTimeout(t);
  }, [inView, started, full.length]);

  useEffect(() => {
    if (!started || done) return;
    const t = window.setTimeout(() => setCount(n => n + 1), pause(full[count]));
    return () => window.clearTimeout(t);
  }, [started, done, count, full]);

  // Edited text in the admin restarts the note from the top.
  useEffect(() => { setCount(0); setStarted(false); }, [full]);

  return (
    <div ref={ref} className={`chn${started ? ' is-writing' : ''}${done && started ? ' is-done' : ''}`}>
      <p className="sr-only">{text}{sign ? ` ${sign}` : ''}</p>
      <div className="chn-paper" aria-hidden="true">
        {/* Invisible full copy reserves the final height so nothing jumps while writing. */}
        <p className="chn-text chn-ghost">{text}{sign && <>{'\n'}<span className="chn-sign">{sign}</span></>}</p>
        <p className="chn-text">
          {chars(text.slice(0, count))}
          {sign && count >= signAt && <>{'\n'}<span className="chn-sign">
            {chars(sign.slice(0, count - signAt))}
            <svg viewBox="0 0 200 12" preserveAspectRatio="none"><path pathLength={1} d="M3 8.5C60 3 130 2.5 197 6.5" /></svg>
          </span></>}
          <span className="chn-caret"><span className="chn-pen"><Pen /></span></span>
        </p>
      </div>
    </div>
  );
}
