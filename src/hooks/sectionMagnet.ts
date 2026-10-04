import type Lenis from 'lenis';

// A proximity snap after user scrolling stops. Targets are measured each time,
// so filtering the library or expanding an FAQ never leaves stale positions.
export function sectionMagnet(root: HTMLElement, getScroller: () => Lenis | null) {
  let timer = 0;
  let completion = 0;
  let intent = false;
  let snapping = false;
  let touching = false;
  let origin = window.scrollY;
  let direction = 1;
  let touchX = 0;
  let touchY = 0;

  const blocked = (target: EventTarget | null) =>
    !!root.querySelector('dialog[open]') ||
    (target instanceof Element &&
      !!target.closest('input, textarea, select, [contenteditable="true"], [data-lenis-prevent]'));

  const clear = () => {
    window.clearTimeout(timer);
    window.clearTimeout(completion);
    intent = false;
    snapping = false;
  };

  const settle = () => {
    if (!intent || touching || snapping) return;
    if (blocked(document.activeElement)) {
      clear();
      return;
    }
    const scroller = getScroller();
    if (scroller?.isScrolling) {
      schedule();
      return;
    }
    const current = window.scrollY;
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const view = Math.max(200, window.innerHeight - padding);
    const limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const points = [0, limit];
    root.querySelectorAll<HTMLElement>('[data-snap-section]').forEach((section) => {
      const box = section.getBoundingClientRect();
      const start = box.top + current - padding;
      points.push(start);
      // Long sections get overlapping viewport stops, keeping all content reachable.
      if (box.height > view + 48) {
        const end = start + box.height - view;
        for (let stop = start + view * 0.88; stop < end - 96; stop += view * 0.88)
          points.push(stop);
        points.push(end);
      }
    });
    const targets = [
      ...new Set(points.map((point) => Math.round(Math.max(0, Math.min(limit, point))))),
    ];
    const nearest = targets
      .filter(
        (point) =>
          Math.abs(point - origin) > 40 &&
          (direction > 0 ? point >= current - 40 : point <= current + 40)
      )
      .sort((a, b) => Math.abs(a - current) - Math.abs(b - current))[0];
    intent = false;
    if (
      nearest === undefined ||
      Math.abs(nearest - current) < 3 ||
      Math.abs(nearest - current) > Math.min(220, window.innerHeight * 0.26)
    )
      return;
    snapping = true;
    if (scroller) {
      scroller.scrollTo(nearest, {
        duration: 0.65,
        lerp: 0,
        easing: (progress) => 1 - Math.pow(1 - progress, 3),
        userData: { initiator: 'magnet' },
        onComplete: () => {
          snapping = false;
        },
      });
    } else {
      window.scrollTo({ top: nearest, behavior: 'smooth' });
      completion = window.setTimeout(() => {
        snapping = false;
      }, 900);
    }
  };

  function schedule() {
    window.clearTimeout(timer);
    if (intent && !touching && !snapping) timer = window.setTimeout(settle, 180);
  }
  const begin = (delta: number) => {
    if (!intent) origin = window.scrollY;
    window.clearTimeout(completion);
    snapping = false;
    intent = true;
    direction = delta > 0 ? 1 : -1;
    schedule();
  };
  const wheel = (event: WheelEvent) => {
    if (
      event.ctrlKey ||
      event.defaultPrevented ||
      blocked(event.target) ||
      Math.abs(event.deltaY) < 2 ||
      Math.abs(event.deltaY) < Math.abs(event.deltaX)
    )
      return;
    begin(event.deltaY);
  };
  const touchStart = (event: TouchEvent) => {
    clear();
    touching = event.touches.length === 1;
    if (touching) {
      touchX = event.touches[0].clientX;
      touchY = event.touches[0].clientY;
    }
  };
  const touchMove = (event: TouchEvent) => {
    if (!touching || event.touches.length !== 1 || blocked(event.target)) return;
    const delta = touchY - event.touches[0].clientY;
    if (Math.abs(delta) > 4 && Math.abs(delta) > Math.abs(touchX - event.touches[0].clientX))
      begin(delta);
  };
  const touchEnd = () => {
    touching = false;
    schedule();
  };
  const key = (event: KeyboardEvent) => {
    if (
      event.defaultPrevented ||
      blocked(event.target) ||
      (event.target instanceof Element && event.target.closest('button, a, summary, [role="tab"]'))
    )
      return;
    if (['ArrowDown', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey))
      begin(1);
    else if (['ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey))
      begin(-1);
    else clear();
  };
  const scrollEnd = () => {
    if (snapping && !getScroller()) {
      snapping = false;
      window.clearTimeout(completion);
    }
    schedule();
  };

  window.addEventListener('wheel', wheel, { passive: true });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('scrollend', scrollEnd);
  window.addEventListener('pointerdown', clear, { passive: true });
  window.addEventListener('touchstart', touchStart, { passive: true });
  window.addEventListener('touchmove', touchMove, { passive: true });
  window.addEventListener('touchend', touchEnd, { passive: true });
  window.addEventListener('touchcancel', touchEnd, { passive: true });
  window.addEventListener('keydown', key);
  window.addEventListener('resize', clear);
  return () => {
    clear();
    window.removeEventListener('wheel', wheel);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('scrollend', scrollEnd);
    window.removeEventListener('pointerdown', clear);
    window.removeEventListener('touchstart', touchStart);
    window.removeEventListener('touchmove', touchMove);
    window.removeEventListener('touchend', touchEnd);
    window.removeEventListener('touchcancel', touchEnd);
    window.removeEventListener('keydown', key);
    window.removeEventListener('resize', clear);
  };
}
