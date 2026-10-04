import {
  ArrowUpRight,
  BookOpen,
  Camera,
  Check,
  Globe2,
  Leaf,
  ShieldCheck,
  WifiOff,
} from 'lucide-react';
import { SavedDiscoveries } from '../ui/SavedDiscoveries';

export function Features() {
  return (
    <section className="section-pad container features-section" id="features" data-snap-section>
      <div className="section-heading features-heading">
        <div>
          <p className="eyebrow" data-scroll-text>
            Features
          </p>
          <h2 data-scroll-text>
            A small app. <br />
            <em>A whole world of knowledge.</em>
          </h2>
        </div>
        <p data-scroll-text>Scan, learn, and save. All on your phone.</p>
      </div>
      <div className="feature-grid">
        <article className="feature-card feature-scan" data-reveal>
          <div className="feature-card-top">
            <span className="feature-icon" aria-hidden="true">
              <Camera size={21} strokeWidth={1.5} />
            </span>
          </div>
          <h3 data-scroll-text>Point. Scan. Discover.</h3>
          <p data-scroll-text>Identify supported plants with your camera.</p>
          <figure className="scan-photo">
            <img
              src={`${import.meta.env.BASE_URL}plants/lagundi.jpg`}
              alt="Lagundi leaves, an example plant from the app"
              width="640"
              height="484"
              loading="lazy"
            />
            <div className="scan-frame" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="scan-sweep" aria-hidden="true" />
            <figcaption>
              <span>
                <Leaf size={14} /> Lagundi
              </span>
              <i>Vitex negundo</i>
              <Check size={14} aria-label="Identified" />
            </figcaption>
          </figure>
          <a href="#how-it-works" className="feature-card-link">
            See how it works <ArrowUpRight size={17} />
          </a>
        </article>
        <article className="feature-card feature-offline" data-reveal data-reveal-delay="0.06">
          <span className="feature-icon" aria-hidden="true">
            <WifiOff size={21} strokeWidth={1.5} />
          </span>
          <div className="offline-symbol" aria-hidden="true">
            <span />
            <span />
            <WifiOff size={43} strokeWidth={1.4} />
          </div>
          <h3 data-scroll-text>No signal. No problem.</h3>
          <p data-scroll-text>Scan and browse offline. No account needed.</p>
        </article>
        <article className="feature-card feature-knowledge" data-reveal data-reveal-delay="0.12">
          <span className="feature-icon" aria-hidden="true">
            <BookOpen size={21} strokeWidth={1.5} />
          </span>
          <h3 data-scroll-text>More than a plant name.</h3>
          <p data-scroll-text>Plant facts, safety notes, and growing guides.</p>
          <nav aria-label="Explore app features" className="feature-links">
            <a href="#library">
              <Leaf size={15} /> Explore plants <ArrowUpRight size={13} />
            </a>
            <a href="#download">
              <ShieldCheck size={15} /> Safety notes <ArrowUpRight size={13} />
            </a>
            <a href="#download">
              <Globe2 size={15} /> English / Tagalog <ArrowUpRight size={13} />
            </a>
          </nav>
        </article>
        <SavedDiscoveries />
      </div>
    </section>
  );
}
