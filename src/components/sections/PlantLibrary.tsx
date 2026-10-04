import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import plants from '../../data/plants.json';
import credits from '../../data/photo-credits.json';

type Plant = (typeof plants)[number];
const groups = ['All plants', 'Asteraceae', 'Fabaceae'] as const;

export function PlantLibrary() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string>('All plants');
  const [selected, setSelected] = useState<Plant | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = plants.filter(
    (p) =>
      `${p.name} ${p.scientificName} ${p.family}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()) &&
      (group === 'All plants' || p.family.includes(group))
  );
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  const credit = selected ? credits.find((c) => c.target === selected.image) : undefined;
  return (
    <section className="section-pad container library-section" id="library" data-snap-section>
      <div className="section-heading">
        <div>
          <p className="eyebrow" data-scroll-text>
            Plant library
          </p>
          <h2 data-scroll-text>Get to know the plants.</h2>
        </div>
        <div>
          <p data-scroll-text>Six of 29 plants. Search or open a profile.</p>
          <a href="#download" className="text-link">
            All 29 in the app <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
      <div className="library-controls">
        <div className="filter-group" role="group" aria-label="Filter plant families">
          {groups.map((g) => (
            <button
              key={g}
              aria-pressed={group === g}
              className={group === g ? 'selected' : ''}
              onClick={() => setGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="search-field">
          <Search size={17} />
          <input
            aria-label="Search plant library"
            type="search"
            placeholder="Search a name or species…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <p className="sr-only" role="status">
        {filtered.length} {filtered.length === 1 ? 'plant' : 'plants'} found
      </p>
      <div className="plant-grid">
        {filtered.map((plant) => (
          <button
            className="plant-card"
            key={plant.id}
            onClick={() => setSelected(plant)}
            aria-label={`Learn about ${plant.name}`}
          >
            <div className="plant-photo">
              <img
                src={`${import.meta.env.BASE_URL}plants/${plant.image}`}
                alt={`${plant.name} (${plant.scientificName})`}
                width="640"
                height="480"
                loading="lazy"
              />
              <span className="plant-open">
                <ArrowUpRight size={19} />
              </span>
            </div>
            <div className="plant-description">
              <h3>{plant.name}</h3>
              <p>{plant.scientificName}</p>
              <span>{plant.family.split(' (')[0]}</span>
            </div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-library">
          <Search size={28} />
          <h3>No plants found.</h3>
          <p>Try another name.</p>
          <button
            className="button"
            onClick={() => {
              setQuery('');
              setGroup('All plants');
            }}
          >
            Reset search
          </button>
        </div>
      )}
      <dialog
        data-lenis-prevent
        ref={dialog}
        className="plant-dialog"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const box = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < box.left ||
              event.clientX > box.right ||
              event.clientY < box.top ||
              event.clientY > box.bottom
            )
              setSelected(null);
          }
        }}
        aria-labelledby="plant-dialog-title"
      >
        {selected && (
          <>
            <button
              className="dialog-close"
              autoFocus
              aria-label="Close plant profile"
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
            <img
              className="dialog-photo"
              src={`${import.meta.env.BASE_URL}plants/${selected.image}`}
              alt={selected.name}
              width="640"
              height="480"
            />
            <div className="dialog-body">
              <p className="eyebrow">Plant profile</p>
              <h2 id="plant-dialog-title">{selected.name}</h2>
              <p className="scientific-name">{selected.scientificName}</p>
              <dl>
                <div>
                  <dt>Plant family</dt>
                  <dd>{selected.family}</dd>
                </div>
                <div>
                  <dt>Origin</dt>
                  <dd>{selected.origin}</dd>
                </div>
                <div>
                  <dt>Where it grows</dt>
                  <dd>{selected.habitat}</dd>
                </div>
              </dl>
              <p>Full profiles, references, and safety notes are in the app.</p>
              <a className="button" href="#download" onClick={() => setSelected(null)}>
                Explore in the app <ArrowUpRight size={17} />
              </a>
              {credit && (
                <p className="photo-credit">
                  Photo:{' '}
                  <a href={credit.source} target="_blank" rel="noreferrer">
                    {credit.artist.replace('&amp;', '&')}
                  </a>{' '}
                  ·{' '}
                  <a href={credit.licenseUrl} target="_blank" rel="noreferrer">
                    {credit.license}
                  </a>
                  . Resized and cropped for display.
                </p>
              )}
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
