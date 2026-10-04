import { StoreButtons } from '../ui/StoreButtons';
import { InteractivePhone } from '../ui/InteractivePhone';

export function Hero() {
  return (
    <section className="hero-section" id="home" data-snap-section>
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 data-hero-text>
            Identify plants.
            <br />
            <em>Even offline.</em>
          </h1>
          <p className="hero-description" data-hero-reveal>
            29 Philippine medicinal plants. English or Tagalog.
          </p>
          <div data-hero-reveal>
            <StoreButtons compact />
          </div>
        </div>
        <div className="hero-visual" data-hero-reveal>
          <InteractivePhone />
        </div>
      </div>
    </section>
  );
}
