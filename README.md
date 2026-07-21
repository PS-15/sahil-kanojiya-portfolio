# Sahil Kanojiya — Personal Brand Website

A premium, single-page personal brand site built with vanilla HTML/CSS/JS,
GSAP, Lenis (smooth scroll), and AOS (scroll reveals). No build step, no
framework — open `index.html` in a browser or deploy the folder as-is.

## Structure

```
├── index.html          All markup and content, section by section
├── css/
│   └── style.css       Design tokens, layout, components, motion
├── js/
│   └── script.js       Lenis, GSAP, AOS init + custom interactions
├── assets/
│   ├── favicon.svg      Generated "SK" monogram mark
│   ├── images/          (empty — add a headshot / OG image here if desired)
│   └── fonts/           (empty — fonts are currently loaded from Google Fonts)
└── README.md
```

## Before you publish — 1 thing to finish

The site is fully built and content-complete from your resume. LinkedIn is
linked (https://www.linkedin.com/in/sahil-v-kanojiya) and the GitHub button
has been removed. One item left:

1. **Resume PDF** — the "Download Resume" buttons point to
   `assets/Sahil_Kanojiya_Resume.pdf`, which doesn't exist yet. Export a
   PDF version of your resume into `assets/` with that filename (or update
   the two `href` attributes in `index.html` to match your filename).

Optional: drop a headshot into `assets/images/` and add an `<img>` to the
hero or about section if you'd like a photo — the design currently works
fully photo-free by design (glass card + ambient canvas as the visual
anchor instead).

## Content notes

- Every metric, role, date, and certification comes directly from your
  resume. Where the design needed connective copy (section intros, the
  About narrative), I wrote it to match your tone without inventing new
  facts.
- Career breaks are shown on the timeline exactly as your resume states
  them, styled as quieter, secondary entries rather than hidden — an
  honest timeline reads as more credible, not less.
- "Idenzo" from your original brief and "Inceptly" appear to be the same
  practice — I used **Inceptly** throughout (footer credit + Projects) since
  that's the name I have on file. Rename if that's not right.
- Projects: "This Portfolio" is marked Live, "Inceptly" is marked In
  Progress, and AI Receptionist / Healthcare Automation / AI Workflow
  Builder are marked Coming Soon per your original brief — update statuses
  as they change.

## Signature design choice

The hero background is a lightweight canvas animation of drifting,
connecting nodes — a quiet nod to claims and data moving through an
operational pipeline, tying the ambient motion back to your actual domain
(healthcare RCM + AI workflows) rather than a generic decorative blob.

## Tech

- **GSAP** — magnetic buttons, tilt cards, timeline scroll-fade
- **Lenis** — smooth scroll, synced with ScrollTrigger
- **AOS** — section-level scroll reveals
- **Vanilla Canvas 2D** — ambient hero node-flow animation
- All library calls are feature-detected, so the page still works if a CDN
  is blocked (e.g. offline preview) — it just loses the smoothing/reveal
  layer, not the content.

## Customizing colors / type

Everything runs off CSS custom properties at the top of `css/style.css`:

```css
--bg: #050816;
--primary: #5B8CFF;
--purple: #8B5CF6;
--cyan: #00D4FF;
--font-display: 'Space Grotesk';
--font-body: 'Inter';
```

Change values there and the whole site follows.

## Accessibility

- Visible focus states on all interactive elements
- `prefers-reduced-motion` disables Lenis, cursor spotlight, magnetic/tilt
  effects, canvas animation, and counter/typing animation (content still
  renders, just statically)
- Semantic landmarks (`header`, `main`, section `id`s, `footer`)
