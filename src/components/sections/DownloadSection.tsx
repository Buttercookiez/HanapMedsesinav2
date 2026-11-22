import { StoreButtons } from '../ui/StoreButtons';

export function DownloadSection() {
  return (
    <section
      className="download-section"
      id="download"
      aria-labelledby="download-title"
      data-snap-section
    >
      <div className="container">
        <div className="download-card">
          <div className="download-copy">
            <img
              className="download-icon"
              src={`${import.meta.env.BASE_URL}brand/app-icon-128.png`}
              alt=""
              width="84"
              height="84"
              data-reveal
            />
            <h2 id="download-title" data-scroll-text>
              Get the app.
            </h2>
            <p data-scroll-text>Your plant guide, anywhere.</p>
          </div>
          <div className="download-actions" data-reveal>
            <StoreButtons />
            <p className="download-notes">
              Android 7.0+ · Universal APK · 136 MB
              <br />
              <time dateTime="2026-11-22">Updated November 22, 2026</time>
              <br />
              Clearer plant examples and a cleaner Scan screen
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
