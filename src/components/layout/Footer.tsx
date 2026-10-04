import { ArrowUpRight } from 'lucide-react';
import { Brand } from '../ui/Brand';
import credits from '../../data/photo-credits.json';

export function Footer() {
  return (
    <footer className="site-footer" data-snap-section>
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand />
            <p>Philippine plants. Offline.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#library">Plant library</a>
            <a href="#faq">FAQs</a>
            <a href="#download">
              Get the app <ArrowUpRight size={15} />
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Hanap Medisina.</span>
          <span>Plant information is for learning, not medical advice.</span>
          <a href="#home">Back to the top ↑</a>
        </div>
        <details className="credits">
          <summary>Plant photography credits</summary>
          <div>
            {credits.map((c) => (
              <p key={c.target}>
                {c.name}:{' '}
                <a href={c.source} target="_blank" rel="noreferrer">
                  {c.artist.replace('&amp;', '&')}
                </a>{' '}
                ·{' '}
                <a href={c.licenseUrl} target="_blank" rel="noreferrer">
                  {c.license}
                </a>
                . Resized and cropped for display.
              </p>
            ))}
          </div>
        </details>
      </div>
    </footer>
  );
}
