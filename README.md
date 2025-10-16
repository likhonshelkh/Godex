# Godex

This repository contains the marketing site for **Godex**, a concept for an autonomous coding partner. The site is a single-page React application that showcases the product vision, design language, and sample workflows.

The application focuses on presenting the story of Godex—not on providing a working automation backend. All copy, metrics, and screenshots are illustrative so potential customers can understand the direction of the product.

## What’s in the site

- **Hero, value pillars, workflow, and testimonial sections** that describe the envisioned product narrative.
- **Interactive UI shell** composed with reusable components, Tailwind CSS utility classes, and custom semantic tokens defined in `src/styles`.
- **Showcase module** that highlights how the console could look by combining product cards and mock data.
- **Chat console section** that demonstrates the intended multi-agent workflow using static content to avoid misleading claims about real-time automation.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The project is powered by Vite + React + TypeScript with a custom Tailwind-based design system using semantic tokens.
