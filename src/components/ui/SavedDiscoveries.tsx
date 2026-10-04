import { useState } from 'react';
import { Heart, History } from 'lucide-react';
import plants from '../../data/plants.json';

const examples = {
  favorites: plants.filter((plant) => ['lagundi', 'bayabas'].includes(plant.id)),
  history: plants.filter((plant) => ['lagundi', 'sambong'].includes(plant.id)),
};

export function SavedDiscoveries() {
  const [view, setView] = useState<'favorites' | 'history'>('favorites');
  const Marker = view === 'favorites' ? Heart : History;

  return (
    <article
      className="feature-card feature-saved"
      aria-labelledby="saved-discoveries-title"
      data-reveal
    >
      <div className="saved-copy">
        <span className="feature-icon" aria-hidden="true">
          <Heart size={22} strokeWidth={1.5} />
        </span>
        <div className="saved-text">
          <h3 id="saved-discoveries-title" data-scroll-text>
            Keep your discoveries.
          </h3>
          <p data-scroll-text>Favorites, scan history, and backups.</p>
        </div>
      </div>
      <div className="saved-preview">
        <div className="saved-preview-controls" role="group" aria-label="Preview saved discoveries">
          <button
            type="button"
            aria-pressed={view === 'favorites'}
            aria-controls="saved-preview-list"
            onClick={() => setView('favorites')}
          >
            <Heart size={14} aria-hidden="true" /> Favorites
          </button>
          <button
            type="button"
            aria-pressed={view === 'history'}
            aria-controls="saved-preview-list"
            onClick={() => setView('history')}
          >
            <History size={14} aria-hidden="true" /> Scan history
          </button>
        </div>
        <div aria-live="polite" aria-atomic="true">
          <ul
            className="saved-list"
            id="saved-preview-list"
            key={view}
            aria-label={view === 'favorites' ? 'Example favorites' : 'Example scan history'}
          >
            {examples[view].map((plant) => (
              <li key={plant.id}>
                <img
                  src={`${import.meta.env.BASE_URL}plants/${plant.image}`}
                  alt=""
                  width="44"
                  height="44"
                  loading="lazy"
                />
                <span>
                  <strong>{plant.name}</strong>
                  <small>{plant.scientificName}</small>
                </span>
                <Marker
                  className="saved-marker"
                  size={16}
                  strokeWidth={1.6}
                  fill={view === 'favorites' ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
