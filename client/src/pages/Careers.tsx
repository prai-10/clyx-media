import { lazy, Suspense, useRef, useState } from 'react';
import { ArrowUpRight, Briefcase, MapPin } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import { RevealWords } from '@/components/ui/ScrollMotion';
import CareersHeroNote from '@/components/sections/CareersHeroNote';
import CareersValuesFlow from '@/components/sections/CareersValuesFlow';
import { Label, Section } from '@/components/ui/primitives';
import { useCollection } from '@/lib/siteContent';
import { safeHref, usePageContent } from '@/lib/pageContent';
import { useScrollReveal } from '@/hooks/useScrollReveal';
// The apply form (and the dialog library under it) is only downloaded once a visitor points at or picks a role.
const loadApplyDialog=()=>import('@/components/sections/ApplyDialog');
const ApplyDialog=lazy(loadApplyDialog);
const defaultRoles=[{title:'Performance Marketing Lead',type:'Full-time / Remote',detail:'Own the decisions that turn winning creative into efficient growth.'},{title:'Creator Partnerships Manager',type:'Full-time / Mumbai or Remote',detail:'Build the relationships and systems behind our creator network.'},{title:'Conversion Designer',type:'Contract / Remote',detail:'Shape the pages, offers, and interactions that turn attention into action.'}];
export default function Careers(){const c=usePageContent('careers');const roles=useCollection('careers',defaultRoles,item=>({title:item.title,type:item.type,detail:item.detail}));return <PageShell eyebrow={c.heroEyebrow} title={<>{c.heroTitle}<br/><RevealWords className="text-yellow" text={c.heroHighlight} delay={450}/></>} intro="" aside={c.heroNote?<CareersHeroNote text={c.heroNote} sign={c.heroSign}/>:false}><Section><div className="split-intro grid gap-10 md:grid-cols-2 md:items-start"><div><Label>{c.howLabel}</Label><h2 className="display mt-5 max-w-2xl text-4xl font-bold md:text-6xl">{c.howTitle}<br/><span className="text-blue">{c.howHighlight}</span></h2></div><div className="space-y-6 text-base leading-7 text-muted md:pt-10">{c.howText1&&<p>{c.howText1}</p>}{c.howText2&&<p>{c.howText2}</p>}</div></div></Section><RolesSection c={c} roles={roles}/><Section className="values-section"><CareersValuesFlow label={c.valuesLabel} title={c.valuesTitle} highlight={c.valuesHighlight} intro={c.valuesIntro} values={[{title:c.value1,text:c.value1Text},{title:c.value2,text:c.value2Text},{title:c.value3,text:c.value3Text}]}/></Section></PageShell>}
// Words rise out of a mask one by one, then a hand-drawn underline strokes in beneath them.
function AnimatedHighlight({text}:{text:string}){const ref=useRef<HTMLSpanElement>(null);const inView=useScrollReveal(ref);const words=text.split(/\s+/).filter(Boolean);return <span ref={ref} className={`roles-highlight text-clyx-yellow ${inView?'is-in':''}`}>{words.map((w,i)=><span key={i}>{i>0&&' '}<span className="rh-mask"><span className="rh-word" style={{'--i':i} as React.CSSProperties}>{w}</span></span></span>)}<svg aria-hidden className="rh-underline" viewBox="0 0 300 12" preserveAspectRatio="none"><path d="M3 8.5C70 3.5 150 2.5 297 6.5" pathLength={1}/></svg></span>}
type Role={title:string;type:string;detail:string};
function RolesSection({c,roles}:{c:Record<string,string>;roles:Role[]}){const [applyRole,setApplyRole]=useState<string|null>(null);const lastRole=useRef<string|null>(null);if(applyRole)lastRole.current=applyRole;return <section id="open-roles" className="relative scroll-mt-20 overflow-hidden bg-blue text-white">
  <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-white/[.06] blur-3xl"/>
  <div className="container relative py-10 md:py-12">
    <div className="mb-5 md:mb-6"><Label className="!mb-2" style={{color:'#FFDE59'}}>{c.rolesLabel}</Label>{c.rolesTitle&&<h2 className="display text-2xl font-bold md:text-3xl">{c.rolesTitle}{c.rolesHighlight&&<> <AnimatedHighlight text={c.rolesHighlight}/></>}</h2>}</div>
    <div className="grid gap-2">{roles.map((role,i)=>{const [kind,...places]=(role.type||'').split('/').map(x=>x.trim()).filter(Boolean);return <button type="button" key={`${role.title}-${i}`} onClick={()=>setApplyRole(role.title)} onPointerEnter={loadApplyDialog} onFocus={loadApplyDialog} aria-label={`Apply for ${role.title}`} className="group relative grid w-full text-left grid-cols-[auto_1fr_auto] items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/[.08] to-white/[.02] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-clyx-yellow/40 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,.7)] md:grid-cols-[auto_1fr_auto_auto] md:gap-5 md:px-5 md:py-3">
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 origin-center scale-y-0 bg-clyx-yellow transition-transform duration-300 group-hover:scale-y-100"/>
      <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[.06] to-transparent transition-transform duration-700 group-hover:translate-x-full"/>
      <span className="display grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/[.06] text-sm font-semibold tabular-nums text-clyx-yellow transition-colors duration-300 group-hover:border-clyx-yellow group-hover:bg-clyx-yellow group-hover:text-clyx-dark">{String(i+1).padStart(2,'0')}</span>
      <div className="min-w-0">
        <h3 className="display text-lg font-semibold md:text-xl">{role.title}</h3>
        {role.detail&&<p className="mt-0.5 truncate text-sm text-white/60">{role.detail}</p>}
      </div>
      {kind&&<div className="col-span-2 col-start-2 row-start-2 flex flex-wrap items-center gap-2 md:col-span-1 md:col-start-auto md:row-start-auto md:justify-end">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-clyx-yellow/30 bg-clyx-yellow/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-clyx-yellow"><Briefcase size={12}/>{kind}</span>
        {places.map(place=><span key={place} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[.14em] text-white/75"><MapPin size={12}/>{place}</span>)}
      </div>}
      <span className="col-start-3 row-start-1 grid h-9 w-9 place-items-center rounded-full bg-white text-clyx-blue transition-colors duration-300 group-hover:bg-clyx-yellow group-hover:text-clyx-dark md:col-start-auto md:row-start-auto" aria-hidden><ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45"/></span>
    </button>})}</div>
    {c.rolesNote&&<div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><p className="text-sm text-white/70">{c.rolesNote}</p><a href={safeHref(c.applyUrl||'mailto:work@clyxmedia.com?subject=Careers')} className="inline-flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-[.12em] text-clyx-yellow hover:text-white md:self-auto">{c.rolesNoteLink||'Get in touch'}<ArrowUpRight size={14}/></a></div>}
  </div>
  {lastRole.current&&<Suspense fallback={null}><ApplyDialog open={applyRole!==null} onOpenChange={o=>!o&&setApplyRole(null)} roles={roles.map(r=>r.title)} initialRole={lastRole.current}/></Suspense>}
</section>}
