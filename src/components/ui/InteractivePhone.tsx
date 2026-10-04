import { lazy, Suspense, useCallback, useState } from 'react';
import { previewScreens } from '../../data/previewScreens';

const PhoneScene = lazy(() => import('./PhoneScene').catch(() => ({ default: () => <></> })));

export function InteractivePhone() {
  const [screen, setScreen] = useState(0);
  const [ready, setReady] = useState(false);
  const navigate = useCallback((index: number) => setScreen(index), []);
  const active = previewScreens[screen];
  return (
    <div className="interactive-phone" role="region" aria-label="Interactive app preview">
      <div className={`phone-stage ${ready ? 'is-ready' : ''}`}>
        <div className="phone-fallback">
          <img
            src={`${import.meta.env.BASE_URL}app/${active.image}`}
            alt={active.description}
            width="450"
            height="1000"
            fetchPriority="high"
          />
        </div>
        <Suspense fallback={null}>
          <PhoneScene screen={screen} onNavigate={navigate} onReady={setReady} />
        </Suspense>
      </div>
      <div className="preview-tabs" role="tablist" aria-label="Phone preview screens">
        {previewScreens.map((item, index) => (
          <button
            key={item.name}
            role="tab"
            id={`preview-tab-${index}`}
            aria-selected={screen === index}
            aria-controls="phone-preview-panel"
            tabIndex={screen === index ? 0 : -1}
            onClick={() => navigate(index)}
            onKeyDown={(event) => {
              let next: number;
              if (event.key === 'ArrowRight') next = (index + 1) % previewScreens.length;
              else if (event.key === 'ArrowLeft')
                next = (index + previewScreens.length - 1) % previewScreens.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = previewScreens.length - 1;
              else return;
              event.preventDefault();
              navigate(next);
              document.getElementById(`preview-tab-${next}`)?.focus();
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div
        id="phone-preview-panel"
        role="tabpanel"
        aria-labelledby={`preview-tab-${screen}`}
        className="sr-only"
        tabIndex={0}
      >
        {active.description}
      </div>
    </div>
  );
}
