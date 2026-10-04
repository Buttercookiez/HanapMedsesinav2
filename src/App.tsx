import { useRef } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import { ScannerShowcase } from './components/sections/ScannerShowcase';
import { PlantLibrary } from './components/sections/PlantLibrary';
import { FAQSection } from './components/sections/FAQSection';
import { DownloadSection } from './components/sections/DownloadSection';
import { usePageMotion } from './hooks/usePageMotion';

function App() {
  const page = useRef<HTMLDivElement>(null);
  usePageMotion(page);
  return (
    <div ref={page}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Features />
        <ScannerShowcase />
        <PlantLibrary />
        <FAQSection />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}
export default App;
