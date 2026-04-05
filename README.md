# 🌑 Custom Browser Homepage

A sleek, anime-themed personal browser homepage with a smart Trie-powered search bar, animated sidebar, real-time clock, and quick-access shortcut tiles.

---

## ✨ Features

- **Trie-Based Search Autocomplete** — A custom Trie data structure powers Google search suggestions with 600+ pre-seeded terms, ranked by popularity. Supports keyboard navigation (↑ ↓ Enter Esc) and instant prefix matching.
- **Quick-Access Tiles** — One-click shortcuts to your most visited sites: Anime, Manga, Movies, YouTube, ChatGPT, Instagram, WhatsApp, Epic Games, and Telegram.
- **Animated Sidebar** — A hover-activated sliding sidebar with Google service links (Gmail, Drive, Meet, Photos, Translate, Web Store).
- **Live Clock** — Displays real-time hours, minutes, seconds, and full date in the corner.
- **Looping Background Video** — A cinematic video background with a static image fallback.
- **Responsive Design** — Adapts gracefully for mobile screens with a collapsible sidebar and adjusted layout.
- **Social Links** — Quick access to Instagram, Discord, and Facebook profiles.

---

## 📁 Project Structure

```
homepage/
├── index.html        # Main HTML structure
├── index.css         # Styles, layout, animations, responsive rules
├── index.js          # Trie engine, autocomplete UI, clock, sidebar logic
└── image/
    ├── 3.jpg         # Desktop background image
    ├── sm.jpg        # Mobile background image
    ├── k2.mp4        # Background video
    ├── 20.jpeg       # Logo / character image
    ├── l2.jpeg       # Sidebar avatar
    ├── search.png    # Search button icon
    ├── 4.png         # Favicon
    ├── 9.jpg         # Movie tile icon
    ├── 10.jfif       # Manga tile icon
    ├── 11.png        # YouTube tile icon
    ├── 12.jpg        # Anime tile icon
    ├── 13.jpg        # Instagram tile icon
    ├── 14.jpg        # Epic Games tile icon
    ├── 15.png        # Manga (Asura) tile icon
    ├── 16.jpg        # WhatsApp tile icon
    ├── 17.jpg        # ChatGPT tile icon
    └── 18.jpg        # Telegram tile icon
```

---

## 🧠 How the Trie Works

```
               (root)
              /  |  \
            'a' 'n' 'y' ...
            |    |
           'n'  'e'
            |    |
           'i'  't'
            |    |
           'm'  'f' ←── "netflix" ✓
            |
           'e' ←── "anime" ✓
            |
           ' '
            |
           'n' ←── "anime news" ✓
```

**Insert:** Each character of a search term is stored as a node. The final node is marked as a word-end with a frequency score.

**Suggest:** On each keystroke, the Trie traverses to the prefix node then runs a DFS to collect all completions — returned sorted by frequency, top 8 shown.

**Complexity:**
| Operation | Time |
|-----------|------|
| Insert | O(L) where L = word length |
| Suggest | O(P + N) where P = prefix length, N = matching nodes |

---

## 🗂️ Autocomplete Categories

| Category | Example Terms |
|----------|--------------|
| 🎌 Anime & Manga | One Piece, Jujutsu Kaisen, Solo Leveling, Manhwa |
| 💻 Tech & AI | ChatGPT, Python, React, GitHub, VS Code |
| 🎬 Movies & TV | GTA 6, Squid Game S2, Dune Part 2, IMDB |
| 🎵 Music | Taylor Swift, BTS, Spotify, Arijit Singh |
| 🏏 Sports | IPL 2025, Virat Kohli, F1, NBA, Football |
| 🛒 Shopping | Amazon, Flipkart, iPhone 16, Samsung S25 |
| 💰 Finance | Groww, Zerodha, Bitcoin, SBI Net Banking |
| 🎓 Education | NEET, JEE, UPSC, Coursera, Udemy |
| ✈️ Travel | IRCTC, Goa, Manali, Dubai, Japan |
| 🏥 Health | Yoga, Workout, Practo, 1mg |
| 📰 News | NDTV, BBC, Times of India, Weather |
| 🔧 Utilities | Canva, Figma, Grammarly, PDF Tools, VPN |
| 🎮 Gaming | Elden Ring, CS2, Genshin Impact, Valorant |
| 🌐 Google Services | Gmail, Drive, Meet, Translate, Photos |

> Total: **600+ search terms** pre-seeded into the Trie.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` | Move selection down |
| `↑` | Move selection up |
| `Enter` | Select suggestion & search |
| `Esc` | Close dropdown |

---

## 🚀 Getting Started

No build tools or dependencies required. Just open the file in a browser.

**Option 1 — Open directly:**
```bash
# Clone or download the project
open index.html
```

**Option 2 — Set as New Tab page:**

- **Chrome:** Install the [Custom New Tab URL](https://chrome.google.com/webstore/detail/custom-new-tab-url/mmjbdbjnoablegbcapnhobbgefbcbhkn) extension, then point it to your local `index.html` path.
- **Firefox:** Use the [New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/) add-on.
- **Edge:** Use the Custom New Tab URL extension from the Edge Add-ons store.

---

## 🔧 Customization

### Add a new shortcut tile
In `index.html`, inside `.container`:
```html
<a href="https://your-site.com" class="tile" title="My Site">
    <div class="tile-icon">
        <img src="image/your-icon.png" draggable="false">
    </div>
    <div class="tile-title">
        <span>My Site</span>
    </div>
</a>
```

### Add new autocomplete terms
In `index.js`, after the `popularSearches` array:
```js
searchTrie.insert("your search term", 85); // higher score = surfaces first
```

### Change the background
Replace `image/3.jpg` (desktop) and `image/sm.jpg` (mobile) with your preferred images, or update the paths in `index.css`:
```css
.overlay {
    background: url(image/your-background.jpg);
}
```

### Change the background video
Replace `image/k2.mp4` or update the `<source>` tag in `index.html`:
```html
<source src="image/your-video.mp4" type="video/mp4">
```

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure and layout |
| CSS3 | Styling, animations, responsive design |
| Vanilla JavaScript | Trie engine, clock, sidebar, autocomplete UI |
| [Font Awesome 6](https://fontawesome.com/) | Sidebar icons |
| [Boxicons 2](https://boxicons.com/) | Sidebar and social icons |
| [Google Fonts](https://fonts.google.com/) | Ubuntu & Indie Flower typefaces |

---

## 📱 Responsive Behavior

| Screen | Behavior |
|--------|----------|
| Desktop (> 800px) | Full layout: video BG, sidebar on left, logo, 5-column tile grid |
| Mobile (≤ 800px) | Static BG, collapsible hamburger sidebar, centered search, adjusted tile grid |

---

## 📄 License

This project is personal and open for modification. Feel free to fork and customize it as your own homepage.

---

<div align="center">

Made with ❤️ by **Ankit Kumar**

*"You can't lose what you never had."*

</div>
