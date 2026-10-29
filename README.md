# InviLinks — invitation studio

An elegant, stationery-led invitation studio using the established InviLinks envelope mark and green-and-gold wordmark. Warm ivory paper, Bodoni Moda serif headings and italic accents, muted olive and burgundy, fine borders and framed sample designs replace the previous mint/lilac app-like design. The opening uses a full-bleed real reception photograph by Jonathan Borba, with a dark olive reading overlay and separate MacBook and iPhone mockups displaying an actual desktop screenshot of Isla & Theo and a mobile screenshot of Shamira Amber. No browser-window chrome, orbit graphics or floating status widgets remain in the opening.

## Pages and source

Home, `/pricing/`, `/how-it-works/`. Generate all pages with `python scripts/build-pages.py` after content, CSS or JavaScript changes. Shared layout/content lives in that generator; styling in `experience.css`; native scroll effects in `experience.js`; accessible menus, filters, live sample dialogs and local inquiries in `app.js`; progressive page navigation in `transitions.js`. Generated asset URLs have content fingerprints.

Buildless static HTML; no runtime framework or CDN. Lenis 1.3.27 is vendored locally with its MIT license. Serve `` directly. Syntax checks: `node --check app.js`, `node --check experience.js`, `node --check transitions.js`.

## Motion and navigation

- Desktop fine-pointer wheel input is gently smoothed by the locally hosted Lenis library, driving the real document scroll position. Touch, keyboard, smaller screens and reduced-motion users retain native behavior. Same-page links animate to their target, preserve hash/history and move keyboard focus after arrival. The anchor offset uses the sticky-header padding without doubling the package margin. Dialogs pause background smoothing and resume it on close.
- Same-origin cross-document View Transitions fade and subtly lift the page content while the header remains anchored. Browsers without the pagereveal API use a short exit fade and normal document navigation, followed by an entrance fade. Modified clicks, downloads, external links and same-page anchors retain their normal behavior. Back/forward restores the page and scroll handlers.
- The opening photograph is fixed to the viewport. The text and device mockups scroll normally; the following opaque paper surface rises over and covers the photograph. The photo has no panning, zooming or scroll-driven transform, and the hero is not pinned. A viewport clip prevents the fixed image from showing beyond the moving hero boundary. Reduced motion uses a normal static image instead.
- Service pages retain their stacked presentation; the sample gallery uses a horizontal browser with previous/next buttons, keyboard arrows and touch swiping. The homepage no longer requires vertical scrolling through a pinned gallery timeline.
- Masked reveals have a viewport geometry fallback and focus visibility. Reduced motion disables smooth scrolling, parallax, sticky stacking and animated page changes. Atmosphere stays subtle and behind paper surfaces.

## Required content

Classic ₱1,499 → Sophia. Signature ₱1,999 → Shamira Amber and Leo’s Wild Five. Immersive ₱2,499 → Isla & Theo and Elena & Gabriel. All packages are fully customizable and available for any occasion; samples show design and animation scope, not templates or event restrictions. Duration wording is No expiration / no scheduled expiry date.

Pricing includes How it works and How to order. Official Facebook and Instagram links are stored in `SOCIAL_LINKS` in the page generator and rendered as real anchors in the order dialog and footer. The inquiry helper prepares a local message and does not send it.

Live samples use the exact supplied pages.dev URLs and load only on request. Closing a preview unloads its iframe to stop media. Sample RSVP forms are demonstrations. See `assets/hero-photo-credit.json` for the new reception photograph and its verified free Unsplash license, and `assets/wedding-photo-credits.json` for existing photo attribution. The desktop background is approximately 303 KB; the mobile variant approximately 118 KB. No AI-generated imagery was added. Source repository, Site identity and owner-private audience are preserved.

The hero device frames are made with HTML/CSS rather than generated product imagery. The MacBook shows Isla & Theo’s floral-glass cover; the iPhone shows Shamira Amber’s ribbon cover, captured from the supplied public sample. Each opens the existing live preview in its matching desktop/phone mode.

The opening content is centered; every event name shares one type style and size. The pricing and process pages retain distinct real-photo sections, while the shortened homepage uses its original hero and one closing photo section, using fixed viewport photographs clipped to the scrolling section boundaries. Following content covers the still image. Reduced motion uses static section images. Sources and licenses are retained in `assets/section-photo-credits.json`.

Background photography now includes birthdays, an 18th-birthday/debut setup, a kids’ party and reception styling. `assets/background-photo-credits.json` is the current source/license manifest. Every used background has an unobtrusive link to `/photo-credits/`, which lists the photographer, source page, placement and license. Original sample screenshots remain separate from stock-photo credits. Old unused background assets are retained but not displayed.

## Focused collection update

The home flow is opening → compact services → live sample browser → packages → closing. Removed stacked service cards, the repeated customization bento and extra decorative interludes from the home render. The iPhone shows an actual captured mobile cover from Shamira Amber; the MacBook retains Isla & Theo. Background photographs retain their fixed viewport behavior with a static 3px CSS blur and overscan; actual sample screenshots stay sharp. Mobile captions, controls, source credits and package labels are enlarged.

Pricing compares composition, graphics, interactions and coordinated scene animation; opening themes can be adapted across every package. Matching samples, RSVP, music, revision rounds and delivery are shown. Confirmed package terms: RSVP is included via text message or Google Forms; background music is included and chosen by the client. Classic includes 2 revision rounds; Signature and Immersive include 3. Additional revisions may incur a fee. Delivery is 1–2 days. The comparison, plan cards, FAQs, process copy and local inquiry form use these terms. Each design example links to the corresponding supplied live sample. Existing prices, sample URLs, owner-supplied official social links and owner-private audience are preserved. Current displayed background credits live in `background-photo-credits.json` and `/photo-credits/`.

The home package cards have distinct olive/ivory, blush/burgundy and forest/gold identities with CSS stationery illustrations. Cross-page navigation uses an ivory paper curtain with the established logo and an envelope animation; the destination reveals once its document and fonts are ready, with bounded recovery timers. External links, modified clicks, downloads and same-page anchors keep normal behavior. Reduced motion skips the curtain. Back/forward cache restoration clears all busy/overlay states. `transitions.js` owns this transition; the old native root fade is opted out to avoid competing animations.

The detailed pricing cards share the home package palettes and CSS artwork (olive, blush/burgundy, forest/gold). The collection has no Lenis-prevent attribute or vertical overscroll containment, so wheel and touch gestures continue vertically while horizontal browsing stays native. Inquiry spelling is consistent across copy, generated messages and DOM identifiers.
