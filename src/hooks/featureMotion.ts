import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Called inside the page's GSAP context and reduced-motion guard.
export function featureMotion(section: HTMLElement) {
  const loops: Array<() => void> = [];
  const playInView = (trigger: Element, animation: gsap.core.Timeline) => {
    const sync = (active: boolean) => {
      if (active && !document.hidden) animation.resume();
      else animation.pause();
    };
    const scroll = ScrollTrigger.create({
      trigger,
      start: 'top 90%',
      end: 'bottom 10%',
      onToggle: (self) => sync(self.isActive),
    });
    loops.push(() => sync(scroll.isActive));
    sync(scroll.isActive);
  };

  section.querySelectorAll('.feature-card').forEach((card) => {
    gsap.from(card.querySelector('.feature-icon'), {
      scale: 0.8,
      y: 8,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'all',
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
    });
  });

  const photo = section.querySelector('.scan-photo');
  if (photo) {
    gsap.from(photo.querySelectorAll('.scan-frame span'), {
      scale: 1.35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      clearProps: 'all',
      scrollTrigger: { trigger: photo, start: 'top 90%', once: true },
    });
    gsap.fromTo(
      photo.querySelector('img'),
      { scale: 1.06 },
      {
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: { trigger: photo, start: 'top 90%', once: true },
      }
    );
    playInView(
      photo,
      gsap
        .timeline({ paused: true })
        .fromTo(
          photo.querySelector('.scan-sweep'),
          { yPercent: 0, opacity: 0 },
          { yPercent: 100, opacity: 0.65, duration: 2.3, ease: 'sine.inOut' }
        )
        .to(photo.querySelector('.scan-sweep'), { opacity: 0, duration: 0.4 })
        .from(
          photo.querySelector('figcaption'),
          {
            y: 12,
            opacity: 0,
            duration: 0.6,
            clearProps: 'all',
          },
          '<'
        )
    );
  }

  const offline = section.querySelector('.offline-symbol');
  if (offline) {
    playInView(
      offline,
      gsap
        .timeline({ paused: true, repeat: -1, repeatDelay: 0.7 })
        .fromTo(
          offline.querySelectorAll('span'),
          { scale: 0.7, opacity: 0 },
          { scale: 1.3, opacity: 0.8, duration: 2.3, stagger: 0.65, ease: 'sine.out' }
        )
        .to(offline.querySelectorAll('span'), { opacity: 0, duration: 0.8, stagger: 0.3 }, '-=1')
    );
  }

  const knowledge = section.querySelector('.feature-links');
  if (knowledge) {
    gsap.from(knowledge.querySelectorAll('a'), {
      x: -10,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      clearProps: 'all',
      scrollTrigger: { trigger: knowledge, start: 'top 92%', once: true },
    });
  }

  const saved = section.querySelector('.saved-preview');
  if (saved) {
    gsap.from(saved, {
      y: 12,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'all',
      scrollTrigger: { trigger: saved, start: 'top 92%', once: true },
    });
  }

  const visibility = () => {
    loops.forEach((sync) => sync());
  };
  document.addEventListener('visibilitychange', visibility);
  return () => document.removeEventListener('visibilitychange', visibility);
}
