import PageShell from '@/components/layout/PageShell';
import { Label, Section } from '@/components/ui/primitives';
import AboutLeadership from '@/components/sections/AboutLeadership';
import AboutValues from '@/components/sections/AboutValues';
import { leaders as defaultLeaders } from '@/data/home';
import { Lines } from '@/components/ui/Lines';
import { useCollection } from '@/lib/siteContent';
import { usePageContent } from '@/lib/pageContent';
export default function About(){const c=usePageContent('about');const leaders=useCollection('team',defaultLeaders,item=>({name:item.name,role:item.role,metric:item.badge,bio:item.bio,img:item.img}));return <PageShell eyebrow={c.heroEyebrow} title={<>{c.heroTitle}<br/><span className="text-yellow">{c.heroHighlight}</span></>} intro={c.heroIntro}><Section><div className="split-intro grid gap-10 md:grid-cols-2 md:items-start"><div><Label>{c.introLabel}</Label><h2 className="display mt-5 max-w-2xl text-4xl font-bold md:text-6xl"><Lines text={c.introTitle}/></h2></div><p className="max-w-xl text-base leading-7 text-muted md:pt-10">{c.introText}</p></div></Section><AboutValues content={c}/><AboutLeadership members={leaders} content={c}/></PageShell>}
