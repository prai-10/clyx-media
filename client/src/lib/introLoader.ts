// The CLYX intro loader plays once per tab: on the first page load that lands on "/", and again when the
// user explicitly reloads the home page. Moving between pages is client-side (see useClientNavigation), which the
// in-memory flag covers; sessionStorage keeps the "seen" state across a normal (non-reload) document load too.
// App.tsx imports this eagerly so the check runs at boot, before any client-side navigation.
const SEEN_KEY = 'clyx-intro-seen';

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function writeSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked (private mode etc.) — the in-memory flag still covers in-app navigation.
  }
}

const navigation = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
const isReload = navigation?.type === 'reload';
const seenThisTab = readSeen();
// Any page load counts as the visit's first load, so landing on /about and then going home skips the loader too.
writeSeen();

let played = window.location.pathname !== '/' || (seenThisTab && !isReload);

export function shouldPlayIntroLoader() {
  return !played;
}

export function markIntroLoaderPlayed() {
  played = true;
}
