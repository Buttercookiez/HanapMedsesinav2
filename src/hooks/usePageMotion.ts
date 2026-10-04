import { useEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { sectionMagnet } from './sectionMagnet';
import { featureMotion } from './featureMotion';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function usePageMotion(page: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const media = gsap.matchMedia();
    let scroller: Lenis | null = null;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const disposeMagnet = page.current ? sectionMagnet(page.current, () => scroller) : () => {};
      let disposeFeatures = () => {};
      const context = gsap.context(() => {
        gsap.from('[data-hero-reveal]', {
          y: 12,
          opacity: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
          clearProps: 'all',
        });
        gsap.utils
          .toArray<HTMLElement>('[data-hero-text], [data-scroll-text]')
          .forEach((element) => {
            const isHero = element.hasAttribute('data-hero-text');
            const isFeature = !!element.closest('.feature-card');
            // Split static copy into lines while preserving its accessible name.
            // Auto-splitting keeps line breaks correct when fonts or widths change.
            SplitText.create(element, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'motion-line',
              aria: 'auto',
              autoSplit: true,
              onSplit: (split) =>
                gsap.from(split.lines, {
                  yPercent: isHero ? 70 : 55,
                  opacity: 0,
                  duration: isHero ? 0.85 : isFeature ? 0.65 : 1,
                  stagger: isHero ? 0.08 : 0.07,
                  ease: isHero || isFeature ? 'power3.out' : 'none',
                  ...(isHero
                    ? { delay: 0.06 }
                    : isFeature
                      ? {
                          scrollTrigger: { trigger: element, start: 'top 96%', once: true },
                        }
                      : {
                          scrollTrigger: {
                            trigger: element,
                            start: 'top 94%',
                            end: 'top 74%',
                            scrub: 0.45,
                            invalidateOnRefresh: true,
                          },
                        }),
                }),
            });
          });
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, {
            y: 18,
            opacity: 0,
            duration: 0.75,
            delay: Number(element.dataset.revealDelay || 0),
            ease: 'power3.out',
            clearProps: 'all',
            scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          });
        });
        const features = page.current?.querySelector<HTMLElement>('#features');
        if (features) disposeFeatures = featureMotion(features);
      }, page);
      return () => {
        disposeMagnet();
        disposeFeatures();
        context.revert();
      };
    });
    // Fine-pointer desktops get wheel smoothing at every window width.
    // Touch devices retain native scrolling and receive the same text reveals.
    media.add(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        const lenis = new Lenis({
          duration: 0.9,
          lerp: 0,
          easing: (progress) => 1 - Math.pow(1 - progress, 3),
          smoothWheel: true,
          syncTouch: false,
          autoRaf: false,
          anchors: false,
          stopInertiaOnNavigate: true,
          prevent: () => !!page.current?.querySelector('dialog[open]'),
        });
        scroller = lenis;
        const tick = (seconds: number) => lenis.raf(seconds * 1000);
        // Handle in-page links once, preventing the native fragment jump from
        // competing with the smooth scroll. Keep hashes available for sharing.
        const navigate = (event: MouseEvent) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const link =
            event.target instanceof Element
              ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
              : null;
          const hash = link?.getAttribute('href');
          if (!hash || hash.length < 2 || link?.hasAttribute('download')) return;
          const target = document.getElementById(hash.slice(1));
          if (!target) return;
          event.preventDefault();
          if (window.location.hash !== hash) window.history.pushState(null, '', hash);
          // Lenis reads CSS scroll-padding and scroll-margin for the header gap.
          lenis.scrollTo(target, {
            duration: 1.05,
            lerp: 0,
            onComplete: () => {
              if (link?.classList.contains('skip-link')) target.focus({ preventScroll: true });
            },
          });
        };
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        document.addEventListener('click', navigate);
        return () => {
          document.removeEventListener('click', navigate);
          gsap.ticker.remove(tick);
          lenis.destroy();
          scroller = null;
        };
      }
    );
    return () => media.revert();
  }, [page]);
}
