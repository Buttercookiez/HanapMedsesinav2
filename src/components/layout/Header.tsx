import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Menu, X } from 'lucide-react';
import { Brand } from '../ui/Brand';

const links = [
  ['Home', '#home'],
  ['Features', '#features'],
  ['Plants', '#library'],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const activeIndex = links.findIndex(([, href]) => href === active);
  useEffect(() => {
    const sections = ['home', 'features', 'how-it-works', 'library', 'faq', 'download']
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => !!element);
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = Math.max(
        parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 24,
        window.innerHeight * 0.3
      );
      let current = '#home';
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= probe) {
          const id = section.id;
          current = id === 'how-it-works' ? '#features' : id === 'faq' ? '#download' : `#${id}`;
        }
      });
      setActive((previous) => (previous === current ? previous : current));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const media = window.matchMedia('(min-width: 760px)');
    const resize = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    media.addEventListener('change', resize);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('pointerdown', outside);
      media.removeEventListener('change', resize);
    };
  }, [open]);
  return (
    <header className="site-header" ref={header}>
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <span
            className="nav-indicator"
            aria-hidden="true"
            style={{
              transform: `translateX(${Math.max(0, activeIndex) * 100}%)`,
              opacity: activeIndex < 0 ? 0 : 1,
            }}
          />
          {links.map(([label, href]) => (
            <a key={href} href={href} aria-current={active === href ? 'location' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <a
          className="header-download"
          href="#download"
          aria-current={active === '#download' ? 'location' : undefined}
        >
          Download <ArrowDown size={14} />
        </a>
        <button
          ref={menuButton}
          className="menu-button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav container" id="mobile-menu" aria-label="Mobile navigation">
          {[...links, ['Download', '#download']].map(([label, href]) => (
            <a
              key={href}
              href={href}
              aria-current={active === href ? 'location' : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
