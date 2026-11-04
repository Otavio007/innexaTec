# Innexa / Galway portfolio

Static English-language portfolio for Innexa, built with HTML, CSS and JavaScript. Includes a fictional interactive cafe menu and downloadable sales materials.

## Deploy with GitHub and Vercel

1. Extract this package. Upload its CONTENTS to the root of a new GitHub repository: `index.html` should be directly in the repository root, alongside `menu.html`, `assets/` and `downloads/`.
2. In Vercel, choose **Add New > Project** and import that repository.
3. Set **Framework Preset: Other**.
4. Use **Root Directory: ./**.
5. Enable the Build Command override and leave the command blank to skip the build step.
6. No output override is required: without a `public/` folder, Vercel serves the repository root. If explicitly setting the output directory, use `.`.
7. No dependencies, environment variables or backend are required. Deploy and check the public HTTPS URL.

Reference: https://vercel.com/docs/builds/configure-a-build

## Important before printing

The current QR codes in the PDF and card open Otavio's WhatsApp. They are accurately labelled but provisional: after the public portfolio URL is known, regenerate the materials with that URL and update `downloads/` before printing the final cards. The authoring scripts live in the full local project folder, not this deployment package.

## Files

- `index.html`, `styles.css`, `app.js`: portfolio.
- `menu.html`, `menu.css`, `menu.js`: fictional Harbour & Oat cafe demonstration.
- `assets/`: local images, logo, font and font licence.
- `downloads/`: portfolio PDF, printable card PDF and card images.

The admin panel on the portfolio is an illustrative visual. The menu supports browsing, category filtering and search; it accepts no orders or payments. There is no tracking, form processing or authentication.

## Credits

Created for Innexa / Otavio Ribeiro. The owner supplied and authorised the project examples and logo. Illustrative cafe photographs: Unsplash. Font: Inter (licence in `assets/Inter-LICENSE.txt`).
