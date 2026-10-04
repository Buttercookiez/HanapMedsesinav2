# Hanap Medisina landing page

A responsive React + TypeScript landing page for the Hanap Medisina Offline Android app. Uses the actual app icon for branding and favicons, a draggable Three.js phone, GSAP reveal animations, Lenis desktop scrolling, a searchable plant library, installation FAQs, and the Android phone APK. The iOS button is marked “Coming soon.”

## Development

The Android APK is stored with Git LFS. Install Git LFS before cloning, then fetch the actual APK before building:

```sh
git lfs install
git clone https://github.com/Buttercookiez/HanapMedsesinav2.git
cd HanapMedsesinav2
git lfs pull
```

```sh
npm install
npm run dev
npm run build
npm run lint
npm run format
```

The production website is generated in `dist/`. Deploy this directory to a static host. All fonts, photos, screenshots, and the APK are served locally; the page does not depend on third-party image or font services.

If a deployment service checks out the repository without Git LFS, enable LFS checkout or run `git lfs pull` before the build so the download contains the APK rather than an LFS pointer.

## Android download

`public/downloads/hanap-medisina.apk` is copied from the explicitly named phone release at `C:/HanapMedicina/hanap-medisina-offline/release-builds/hanap-medisina-phone.apk`. It targets ARM64 phones running Android 7.0+. Do not substitute the x86_64 emulator APK.

- Size: 109,413,908 bytes (about 104 MiB).
- SHA-256: `747b10a4f56e497817aa8da490fc1504e7b29cd9041db4c3bc8ea8a4808d4912`.
- Both Android buttons download the same release.
- The APK is included in production output. Choose hosting that supports this file size.

To serve the APK from another location, copy `.env.example` to `.env.local`, set `VITE_ANDROID_APK_URL` to the public HTTPS download URL, and rebuild. Vite's `BASE_URL` is used for bundled assets when deploying under a subpath.

To release an updated app, replace the file at `public/downloads/hanap-medisina.apk`, update the displayed size/support details if necessary, and rebuild. Building this site does not build or modify the mobile app.

## Content and assets

Feature descriptions and the 29-profile count come from the local offline app's README, library service, settings store, and English plant dataset. Featured names, species, families, origins, and habitats are extracted into `src/data/plants.json`. Update that file when the app's catalog changes.

The screenshots in `public/app/` are compressed WebP copies of the app's home, library, plant detail, and history screens. The phone preview uses these images as textures: drag horizontally to turn it, tap its display to browse, or use the screen tabs. It demonstrates the app's screens; camera identification runs in the Android app. The original app files remain unchanged.

`public/app/splash.svg` uses the offline app's actual Android splash drawable (`android/app/src/main/res/drawable-mdpi/splashscreen_logo.png`) centered on its original `#63871E` background. Tap the phone or select Home to enter the preview; Splash returns to the splash. Screen changes crossfade, with immediate changes for reduced motion.

`public/brand/app-icon.png` is the original Expo app icon. The smaller logo, PNG/ICO favicons, and Apple touch icon are resized copies of that asset.

Plant photographs are copied from the app, with original authors and licenses preserved in `src/data/photo-credits.json` and `public/plants/PHOTO_CREDITS.md`. Credits are accessible in each plant dialog and in the footer. Display crops do not alter the source photographs.

## Motion and accessibility

- Lenis smooths wheel and anchor scrolling on devices with a fine pointer and hover, including narrow desktop windows. Touch scrolling remains native.
- Scrolling settles near section boundaries with a short magnetic snap. Larger sections get overlapping viewport stops. It runs after wheel, touch, or page-navigation key input, stays out of dialogs and text fields, and allows free scrolling outside the snap radius.
- Snap positions are measured from the current layout, so search results, open FAQs, and viewport changes remain accurate. Pointer interactions cancel pending snaps; reduced motion disables the magnet.
- Header height and scroll offsets share CSS variables, keeping anchor navigation and magnetic stops aligned at each breakpoint.
- FAQs appear before Download as separate sections, each with its own magnetic stop and generous spacing on desktop and mobile.
- The floating header follows the current section with a sliding navigation indicator. Desktop links sit beside Download on the right; mobile navigation appears in a compact panel.
- GSAP SplitText reveals static headings and descriptions a line at a time as they enter the viewport. The progress follows scrolling with a short easing delay; card entrances use a subtle fade and rise.
- Font loading and width changes rebuild the text lines automatically. SplitText retains accessible text labels and cleans up through the GSAP context.
- Feature cards animate their icons, text, photo framing, links, and identification label on entry. The scan moves down once, fades out, and reveals the identification label; its photo entrance does not reverse with scrolling. Offline rings repeat only while visible. The discoveries card shows example plants from the app and switches between favorites and scan history with a short fade. Motion respects reduced-motion preferences and pauses when the document is hidden. Card text completes its reveal so a stationary section remains readable.
- Text reveals, card animations, and smooth scrolling respect `prefers-reduced-motion`.
- The Three.js phone is loaded separately, caps its pixel ratio at 1.5, renders only when the view changes, pauses outside the viewport and when the page is hidden, and releases resources on unmount.
- A screenshot preview remains if WebGL is unavailable. Reduced motion disables rotation easing and pointer tilt. Vertical touch gestures keep native page scrolling.
- Mobile navigation supports Escape and closes after selecting a section.
- Open plant dialogs hold the background scroll position while their own content remains scrollable.
- Phone preview tabs support arrow keys, Home, and End. Plant dialogs use native focus trapping and Escape dismissal.
- Library search includes scientific names and families, with accessible result announcements and an empty state.

## Main files

- `src/index.css`: design system and responsive layouts.
- `src/components/sections/`: page sections and interactions.
- `src/components/ui/PhoneScene.tsx`: Three.js phone and pointer interaction.
- `src/components/ui/InteractivePhone.tsx`: accessible preview controls and screenshot fallback.
- `src/hooks/usePageMotion.ts`: GSAP and Lenis lifecycle.
- `src/hooks/sectionMagnet.ts`: section snapping and input handling.
- `src/hooks/featureMotion.ts`: feature-card entrances and visible decorative animations.
- `src/components/ui/StoreButtons.tsx`: shared Android/iOS controls.
