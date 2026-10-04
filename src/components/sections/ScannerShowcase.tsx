const steps = [
  ['Scan', 'Take a clear leaf photo.'],
  ['Check', 'Compare the result and review safety notes.'],
  ['Save', 'Keep a favorite or revisit your history.'],
];

export function ScannerShowcase() {
  return (
    <section className="how-section" id="how-it-works" data-snap-section>
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow" data-scroll-text>
              How it works
            </p>
            <h2 data-scroll-text>Scan. Check. Save.</h2>
          </div>
        </div>
        <div className="how-grid">
          {steps.map(([title, body], index) => (
            <article key={title}>
              <span className="step-number">0{index + 1}</span>
              <h3 data-scroll-text>{title}</h3>
              <p data-scroll-text>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
