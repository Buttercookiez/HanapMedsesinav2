import { ArrowUpRight } from 'lucide-react';

const faqs = [
  [
    'Works offline?',
    'Yes. Scanning, plant profiles, favorites, and history work on your device after installation.',
  ],
  [
    'How do I install it?',
    'Download the 136 MB APK, open it, and follow Android’s prompts. If asked, allow installation from your browser or file manager. Requires Android 7.0+. This universal APK supports Android phones and emulators.',
  ],
  [
    'Which plants are supported?',
    'The library has 30 Philippine medicinal plants. Scanning recognizes species in the bundled model. Profiles are available in English and Tagalog.',
  ],
  [
    'Do I need to create an account?',
    'No. Your data stays on your phone. Export and import scan history for backup.',
  ],
  ['What about iPhone?', 'iOS is coming soon. The current download is for Android.'],
];

export function FAQSection() {
  return (
    <section className="section-pad container faq-section" id="faq" data-snap-section>
      <div>
        <p className="eyebrow" data-scroll-text>
          FAQs
        </p>
        <h2 data-scroll-text>Quick answers.</h2>
        <a className="text-link" href="#download">
          Download for Android <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="faq-list" data-reveal>
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
