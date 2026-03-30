# 🌐 Custom Browser Homepage

A sleek, anime-themed personal browser homepage featuring a live clock, quick-access shortcuts, a Google search bar, and an animated sidebar — all wrapped in a Tokyo Ghoul aesthetic.

---

## ✨ Features

- **🔍 Google Search** — Search the web directly from the homepage
- **⚡ Quick Shortcuts** — One-click access to Anime, Manga, YouTube, ChatGPT, Instagram, WhatsApp, Epic Games, Telegram, and more
- **🕐 Live Clock** — Real-time clock displaying time, day, date, month, and year
- **📂 Animated Sidebar** — Hover-to-expand sidebar with links to Google services (Gmail, Drive, Meet, Photos, Translate, Web Store)
- **🎬 Video Background** — Looping MP4 background video with a static image fallback
- **📱 Responsive Design** — Mobile-friendly layout with adaptive components
- **🎨 Tokyo Ghoul Theme** — Custom Ken Kaneki aesthetic with blur effects, dark overlays, and anime imagery

---

## 📁 Project Structure

```
├── index.html        # Main HTML structure
├── index.css         # Styles and responsive layout
├── index.js          # Clock logic and sidebar toggle
├── k2.mp4            # Background video
├── 3.jpg             # Desktop background image fallback
├── sm.jpg            # Mobile background image
├── search.png        # Search button icon
├── l2.jpeg           # Sidebar burger icon
├── 20.jpeg           # Logo / branding image
├── 4.png             # Favicon
└── [12-18].jpg/png   # Shortcut tile icons
```

---

## 🚀 Getting Started

### Prerequisites

No build tools or dependencies required — this is plain HTML/CSS/JS.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Add your assets**  
   Place your background images (`3.jpg`, `sm.jpg`), video (`k2.mp4`), icons, and shortcut tile images in the project root.

3. **Open in browser**  
   ```bash
   # Simply open index.html in your browser
   open index.html
   ```

### Set as Browser Homepage

| Browser | Steps |
|--------|-------|
| **Chrome** | Settings → On startup → Open a specific page → Add `file:///path/to/index.html` |
| **Firefox** | Settings → Home → Custom URLs → Add file path |
| **Edge** | Settings → Start, home, and new tabs → Add file path |

> 💡 For a seamless experience, host the files on a local server or GitHub Pages.

---

## 🛠️ Customization

### Adding / Editing Shortcuts

In `index.html`, each shortcut tile follows this pattern:

```html
<a href="YOUR_URL" class="tile" title="TOOLTIP_TEXT">
    <div class="tile-icon">
        <img alt="label" src="YOUR_ICON.png" draggable="false">
    </div>
    <div class="tile-title">
        <span>LABEL</span>
    </div>
</a>
```

### Changing the Background

- **Desktop:** Replace `3.jpg` or update the `background` URL in `.overlay` in `index.css`
- **Mobile:** Replace `sm.jpg` or update the `background` URL in the `@media (max-width:800px)` block
- **Video:** Replace `k2.mp4` with your own video file

### Changing the Clock Font / Style

The clock is styled under `.clock`, `.time`, and `.c-time` in `index.css`. The font family is set globally via `font-family: 'Caveat', cursive` — update the Google Fonts import to switch it.

---

## 📸 Preview

> Add a screenshot of your homepage here.

```
![Homepage Preview](preview.png)
```

---

## 🧰 Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 | Structure and layout |
| CSS3 | Styling, animations, responsive design |
| Vanilla JavaScript | Live clock, sidebar toggle |
| Google Fonts | Typography (`Ubuntu`, `Indie Flower`) |
| Font Awesome / Boxicons | Sidebar and social icons |

---

## 🙋 Author

**Ankit Kumar**  
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/_.ken_k_/)
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=flat&logo=discord&logoColor=white)](https://discord.com/invite/QzeZ3haT)
[![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?style=flat&logo=facebook&logoColor=white)](https://www.facebook.com/profile.php?id=100014608938403)

---

> *"If you're going to eat, eat until you're satisfied."*
