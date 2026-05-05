# Galacosh Games - University Final Project Documentation

## 1. Project Introduction & Business Concept
**Galacosh Games** is an independent game studio born out of a desire to break away from dark, gritty realism in modern gaming. We specialize in crafting vibrant, high-energy, and playfully challenging experiences that evoke the joy of Saturday morning cartoons. Our target audience is indie gamers aged 16–35 who appreciate striking art styles, tight platforming controls, and high replay value. Our flagship title, *No Safe Tile*, represents this ethos perfectly.

**Architecture Justification:**
The university guidelines initially requested a WordPress installation. However, we opted for a **hand-coded static site architecture** (HTML5, CSS3, Vanilla JS) deployed on a static host (like GitHub Pages/Cloudflare Pages) for several crucial reasons:
1. **Unmatched Performance:** Without the overhead of a PHP backend, SQL database queries, or heavy WordPress plugins, the site achieves perfect Lighthouse performance scores, which is crucial for retaining users on mobile.
2. **Security:** A purely static site has no backend vulnerabilities or database to inject, eliminating the risk of common CMS exploits.
3. **Technical Demonstration:** Hand-coding custom logic for the blog feed and contact validation demonstrates a deeper understanding of fundamental web technologies (JavaScript DOM manipulation, the Fetch API, and IntersectionObservers) rather than merely configuring third-party plugins.

---

## 2. Design Identity (UI/UX)
The UI/UX design is built to reflect the "Jolly Indie Game Studio" brand—energetic, playful, and professional.

### Color Palette
- **Background (`#fdfbf7`):** A warm off-white. It reduces eye strain compared to pure white and gives a softer, more inviting canvas.
- **Text (`#2b2d42`):** A dark slate gray to ensure high legibility and strong contrast against the light background.
- **Primary Action (`#06d6a0`):** Emerald Green. Used for primary buttons and hover states to convey positive action and energy.
- **Accent 1 (`#00b4d8`):** Bright Turquoise. Used for secondary highlights and background shapes.
- **Accent 2 (`#ffd166`):** Golden Yellow. Used to draw attention and add a "jolly" pop of color.
- **Accent 3 (`#ff9f1c`):** Tangerine Orange. Used for critical "call to action" buttons (like "Send Message" or "Learn More").

### Typography
- **Headings (`Rubik`, sans-serif):** A geometric, slightly rounded sans-serif font provided by Google Fonts. It feels modern but retains a playful, bouncy character.
- **Body (`Quicksand`, sans-serif):** A highly legible, rounded sans-serif that pairs perfectly with Rubik, ensuring long devlog posts are easy to read.

### UI Elements
- **Borders:** Generous border radii (`8px` for inputs, `16px` for cards, `50px` for pill buttons) remove sharp edges, contributing to the friendly aesthetic.
- **Animations:** Hover states use a custom cubic-bezier transition (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`) which creates a slight "bouncy" effect, making the interface feel alive and interactive.

---

## 3. SEO & Optimization Setup
Every HTML page in the project has been rigorously structured for Search Engine Optimization:
- **Semantic HTML5:** The use of `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` tags ensures screen readers and search engine crawlers can accurately parse the content hierarchy.
- **Meta Tags:** Each page includes unique `<title>`, `<meta name="description">`, and `<meta name="keywords">` tags tailored to the page content.
- **Open Graph (OG) Tags:** Added to the `<head>` to control how the site appears when shared on social media platforms like Twitter or Discord, critical for an indie studio marketing its games.

---

## 4. Performance Documentation
To ensure the website loads instantaneously without relying on third-party optimization plugins, we implemented custom Vanilla JS performance logic.

### Custom Lazy Loading via `IntersectionObserver`
On the **Games Portfolio (`games.html`)**, we display high-resolution game assets in a CSS Grid. Loading all images simultaneously would cause a massive initial network payload, slowing down the page significantly.

Instead of an external library, we utilized the native browser `IntersectionObserver` API.
1. The `<img>` tags load a tiny, 1x1 transparent base64 GIF initially.
2. The actual high-res image URL is stored in a `data-src` attribute.
3. The Vanilla JS script (`main.js`) monitors the scroll position. When an image is about to enter the viewport (with a `rootMargin` of `200px`), the script swaps the `src` with the `data-src`, downloading the image just-in-time.
4. Once loaded, a CSS class is applied to smoothly fade the image in.

### Simulated Dynamic Rendering
For the Devlog, we avoided sending multiple HTML files over the network. Instead, the blog posts are stored in a highly compressed local JSON array (`blog-data.js`). The frontend JavaScript parses this array and dynamically creates DOM nodes for the blog cards, injecting them into the page. This mimics a single-page application (SPA) architecture while remaining entirely static, drastically reducing server requests.
