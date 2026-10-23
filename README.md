# Silent Signal — Interactive Puzzle Experience

Silent Signal is a lightweight, browser-based interactive experience built with HTML, CSS, and JavaScript. It combines a cinematic interface, short puzzles, animated transitions, and a customizable final screen. No framework, server, database, API key, or build step is required.

## Project files

- `index.html` — page structure and interface elements.
- `style.css` — responsive visual design, transitions, and animations.
- `script.js` — puzzle logic, interactions, editable content, gallery behavior, interface sounds, and confetti effects.
- `assets/` — optional local images and other media used by the page.

## Customize the content

Open `script.js` and find the `CONFIG` object near the beginning of the file. You can edit the displayed names, text, cards, and gallery entries there. The rest of the JavaScript controls the interactions and can usually remain unchanged when you only need to update the content.

### Add images to the gallery

1. Put image files you are allowed to share in the `assets/` folder.
2. Use simple filenames such as `moment-1.jpg`, `moment-2.jpg`, and `moment-3.jpg`.
3. In the `memories` entries inside `CONFIG`, set each `image` value to the matching path, such as `assets/moment-1.jpg`.
4. Make sure the path, filename, and extension match exactly, including capitalization.

If an image path is left empty, the page will display its built-in placeholder instead.

## Publish with GitHub Pages

1. Create a repository on GitHub.
2. Upload `index.html`, `style.css`, `script.js`, `README.md`, and the `assets` folder to the repository's root directory. Do not put the files inside an additional nested folder.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and the `/(root)` folder, then save.
6. After GitHub Pages publishes the site, open the URL shown on the Pages settings screen.

## Notes

- The experience runs in the visitor's browser. Progress is not stored on a server.
- The puzzle flow is for interactive entertainment, not access control. Client-side JavaScript and editable content can be inspected by visitors who know how to view a site's source.
- Avoid publishing sensitive personal information. Only use media and text that you are comfortable sharing through a public link.
