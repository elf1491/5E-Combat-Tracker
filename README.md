# D&D 5e Combat & Initiative Tracker (Web App)

A fluid, responsive web application for managing Dungeons & Dragons (5th Edition) combat encounters, initiative orders, party rosters, monster stats, and dice rolls.

Built with clean HTML5, CSS3, and modern ES6 JavaScript with zero external dependencies. Designed to run offline as a Progressive Web App (PWA) and deploy directly to **GitHub Pages**.

---

## 🚀 How to Host on GitHub Pages (Free & Instant)

You can share this web app with your players and DMs using GitHub Pages in under a minute:

1. **Push this repository to GitHub** (or fork/import it).
2. Go to your repository on GitHub and click on the **Settings** tab.
3. In the left navigation sidebar under "Code and automation", click **Pages**.
4. Under **Build and deployment** > **Branch**:
   - Select **Branch**: `main` (or `master`)
   - Select **Folder**: `/ (root)` or `/docs` (both are fully configured and ready!)
5. Click **Save**.
6. Wait 30–60 seconds. GitHub will provide your live URL, for example:  
   `https://<your-username>.github.io/<your-repo-name>/`
7. Share the link with your group!

---

## 📱 Responsive Design & Fluid Typography Verification

This web application has been tested and styled to adapt fluidly across all screen sizes:

- **Mobile Phones (320px – 768px):**
  - Ergonomic bottom navigation bar with thumb-accessible tabs.
  - Full-width combatant cards with quick `±1`, `±5`, `±10` damage and heal buttons.
  - Responsive modals and bottom sheets for managing conditions, AC, and speeds.
  - Touch targets calibrated to standard 44px–48px dimensions.

- **Tablets & Laptops (768px – 1100px):**
  - Top navigation bar with fantasy brand styling.
  - Adaptive two-column roster and monster grid layouts.

- **Desktop & 4K Ultra-wide Displays (1100px+):**
  - Dual-pane Combat Arena:
    - **Left column:** Initiative order, active combatant indicators, quick stats, and cards.
    - **Right column:** Active Combatant Spotlight pane, live combat log stream, and quick shortcuts.
  - Container capped at `1440px` with radial fantasy ambient lighting to prevent stretched UI.

### Font Scaling Verification
Typography uses dynamic CSS `clamp()` functions:
```css
font-size: clamp(14px, 0.85rem + 0.35vw, 17px);
--font-xs: clamp(0.7rem, 0.65rem + 0.15vw, 0.8rem);
--font-sm: clamp(0.8rem, 0.75rem + 0.2vw, 0.92rem);
--font-base: clamp(0.92rem, 0.88rem + 0.25vw, 1.05rem);
--font-md: clamp(1.05rem, 0.98rem + 0.35vw, 1.25rem);
--font-lg: clamp(1.25rem, 1.12rem + 0.6vw, 1.55rem);
--font-xl: clamp(1.45rem, 1.25rem + 0.9vw, 1.95rem);
--font-2xl: clamp(1.75rem, 1.45rem + 1.4vw, 2.5rem);
```
All UI elements scale proportionally with browser zoom, system accessibility font settings, and device pixel densities without text truncation or awkward layout shifts.

---

## ⚔️ Key Features

### 1. Combat Arena & Initiative Tracker
- **Smart Turn Order:** Automatically sorts by Initiative Roll → Initiative Modifier → Combatant Name.
- **Automated Turn Progression:** "Next Turn" and "Previous Turn" automatically advance rounds and skip dead combatants.
- **Health Management:** Dynamic color-coded HP bar (Green > 50%, Amber 25–50%, Red < 25%, Grey = Dead/Down).
- **Temporary HP:** Blue badge and health bar overlay; absorbs incoming damage before reducing real HP.
- **Death Saves System:** 3 successes and 3 failures tracker for downed PCs (0 HP), auto-failure when taking damage at 0 HP, stabilization tracker, and 1 HP revive button.
- **Armor Class & Cover:** 5e Cover calculations (+2 Half Cover, +5 3/4 Cover, +10 Total Cover).
- **Movement Speed & Terrain:** Halves speed when Difficult Terrain is toggled.
- **24 D&D 5e Conditions:** Color-coded badges with mechanical rule summaries (Blinded, Charmed, Concentrating, Exhaustion, Frightened, Grappled, Haste, Incapacitated, Paralyzed, Poisoned, Prone, Stunned, Unconscious, etc.).
- **Live Combat Event Log:** Timestamped event feed recording damage, heals, turn changes, death saves, and status effects.

### 2. Party Roster (Persistent Storage)
- Save and edit player characters directly in your browser (`localStorage`).
- Pre-populated with starter heroes:
  - **Thorin Stonehammer** (Fighter)
  - **Lyra Moonwhisper** (Wizard)
  - **Elidor Shadowfoot** (Rogue)
  - **Selene Lightbringer** (Cleric)
- One-click "+ Add All to Arena" or individual character spawn.

### 3. Bestiary (20 SRD Monster Presets + Custom Builder)
- Official 5e SRD stats for: *Bandit, Cultist, Goblin, Skeleton, Zombie, Wolf, Orc, Hobgoblin, Bugbear, Ghoul, Bandit Captain, Cult Fanatic, Ogre, Wight, Troll, Vampire Spawn, Mage, Young Red Dragon, Beholder, Lich*.
- Search and category filters (*Humanoid, Undead, Beast, Giant, Dragon, Aberration*).
- Quantity counter for instant mob spawning (e.g. 4 Goblins spawn automatically as Goblin #1, Goblin #2, Goblin #3, Goblin #4).
- Custom Monster Builder dialog to create and spawn homebrew enemies.

### 4. Dice Roller & 5e Reference
- Polyhedral 3D-styled dice: `d4`, `d6`, `d8`, `d10`, `d12`, `d20`, `d100`.
- Quantity and modifier adjustments.
- **Advantage & Disadvantage:** Rolls two d20s, picks the highest/lowest, and clearly displays the discarded roll.
- **Nat 20 & Nat 1 Visual Feedback:** Golden pulse for Critical Hits, Crimson flare for Fumbles.
- Complete 5e Conditions guide with search and rules reference.

### 5. Backup & Restore
- Export your entire party, active combat state, and dice history as a single `.json` file.
- Import backup JSON on any computer, tablet, or phone to transfer your campaign state.

---

## 📲 Install as an App (PWA)

- **Chrome / Edge (PC & Mac):** Click the install icon in the address bar to run as a dedicated desktop app.
- **iPhone / iPad (Safari):** Tap the Share button &rarr; **Add to Home Screen**.
- **Android (Chrome):** Tap the three-dot menu &rarr; **Install app** or **Add to Home screen**.
