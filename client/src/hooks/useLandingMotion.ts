import { useEffect, type RefObject } from 'react';

/** Keeps `state.visible` up to date for an element on (or near) the screen, so animations can skip unseen work. */
function watchVisibility(el: Element | null, onChange?: () => void) {
  const state = { visible: true };
  if (!el || typeof IntersectionObserver === 'undefined') return { state, stop: () => {} };
  const observer = new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting;
    onChange?.();
  }, { rootMargin: '120px 0px' });
  observer.observe(el);
  return { state, stop: () => observer.disconnect() };
}

/**
 * The homepage's pointer and scroll effects: hero clip parallax, the tilting laptop and the live chart bars.
 * Everything paints at most once per frame, pauses while off screen, and is torn down when the page unmounts.
 */
export function useLandingMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];
    const listen = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void, options?: AddEventListenerOptions) => {
      window.addEventListener(type, fn, options);
      cleanups.push(() => window.removeEventListener(type, fn, options));
    };
    const frames = new Set<number>();
    cleanups.push(() => frames.forEach(cancelAnimationFrame));

    // Hero clip parallax: remember the pointer, paint once per frame.
    const stack = root.querySelector<HTMLElement>('#clipStack');
    if (stack) {
      const cards = Array.from(stack.querySelectorAll<HTMLElement>('.clip-card'));
      const depths = cards.map((card) => parseFloat(card.dataset.depth ?? '') || 0.05);
      const view = watchVisibility(stack);
      cleanups.push(view.stop);
      let pointerX = 0;
      let pointerY = 0;
      let frame = 0;
      const paint = () => {
        frames.delete(frame);
        frame = 0;
        const x = (pointerX - window.innerWidth / 2) / (window.innerWidth / 2);
        const y = (pointerY - window.innerHeight / 2) / (window.innerHeight / 2);
        cards.forEach((card, idx) => {
          const baseRot = (idx % 2 === 0 ? -1 : 1) * (idx * 3 + 2);
          card.style.transform = `translate3d(${x * depths[idx] * 70}px, ${y * depths[idx] * 70}px, 0) rotate(${baseRot}deg)`;
        });
      };
      listen('mousemove', (e) => {
        pointerX = e.clientX;
        pointerY = e.clientY;
        if (view.state.visible && !frame) frames.add((frame = requestAnimationFrame(paint)));
      }, { passive: true });
    }

    // Laptop tilt: layout is read at most once per frame and only while the section is near the screen.
    // Leaving the screen triggers one last paint so a fast scroll still lands on the end position.
    const section = root.querySelector<HTMLElement>('.kinetic-section');
    const macbook = root.querySelector<HTMLElement>('.macbook-container');
    if (section && macbook) {
      const badges = Array.from(root.querySelectorAll<HTMLElement>('.floating-badge'));
      let frame = 0;
      const paint = () => {
        frames.delete(frame);
        frame = 0;
        const rect = section.getBoundingClientRect();
        const totalDistance = section.offsetHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, -rect.top / totalDistance));
        const rotateX = 26 * (1 - progress);
        const scale = 0.88 + 0.12 * progress;
        const translateY = (1 - progress) * 35;
        macbook.style.transform = `rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(1)}px)`;
        badges.forEach((b, i) => {
          const dir = i % 2 === 0 ? -1 : 1;
          b.style.transform = `translate3d(${(1 - progress) * 25 * dir}px, ${(1 - progress) * 15}px, 0)`;
        });
      };
      const schedule = () => {
        if (!frame) frames.add((frame = requestAnimationFrame(paint)));
      };
      const view = watchVisibility(section, schedule);
      cleanups.push(view.stop);
      listen('scroll', () => view.state.visible && schedule(), { passive: true });
      paint();
    }

    // Live chart: each bar wobbles around its own starting height, so the weekly shape stays readable.
    // Skipped while the chart is off screen or the tab is hidden.
    const chart = root.querySelector('.chart-bars-wrap');
    if (chart) {
      const bars = Array.from(chart.querySelectorAll<HTMLElement>('.chart-bar'));
      const bases = bars.map((bar) => parseInt(bar.style.height || '70', 10));
      const view = watchVisibility(chart);
      cleanups.push(view.stop);
      const interval = setInterval(() => {
        if (document.hidden || !view.state.visible) return;
        bars.forEach((bar, i) => {
          const next = Math.max(20, Math.min(98, bases[i] + (Math.random() * 12 - 6)));
          bar.style.height = `${next.toFixed(1)}%`;
        });
      }, 2400);
      cleanups.push(() => clearInterval(interval));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [rootRef]);
}
