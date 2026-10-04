import { Apple, Download } from 'lucide-react';

export function StoreButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`store-buttons${compact ? ' store-buttons-compact' : ''}`}>
      <a
        className="store-button android-button"
        href={
          import.meta.env.VITE_ANDROID_APK_URL ||
          `${import.meta.env.BASE_URL}downloads/hanap-medisina.apk`
        }
        download="Hanap-Medisina.apk"
        title="Android APK · 104 MB · Android 7.0+"
      >
        <Download size={19} />
        <span>
          <strong>Download for Android</strong>
          {!compact && <small>APK · 104 MB</small>}
        </span>
      </a>
      <button className="store-button ios-button" disabled aria-label="iOS app coming soon">
        {!compact && <Apple size={20} />}
        <span>
          <strong>{compact ? 'iOS coming soon' : 'iOS'}</strong>
          {!compact && <small>Coming soon</small>}
        </span>
      </button>
    </div>
  );
}
