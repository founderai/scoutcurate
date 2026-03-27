# ScoutCurate — AI Gift Finder Chrome Extension

> **Scout** finds perfect gifts for kids. **Curate** finds curated gifts for adults.
> Powered by OpenAI · Amazon Affiliate-linked · Built with Plasmo + React + Tailwind

---

## What It Does

| Mode | Who it's for | AI Focus |
|------|-------------|----------|
| 🟠 **Scout** | Kids gifts | Age-appropriate, safe, educational |
| 🥇 **Curate** | Adult gifts | Luxury, utility, aesthetic vibes |

1. Click the extension icon
2. Hit **Record** and speak naturally (or type)
3. Click **Scout 25 Gifts** / **Curate 25 Gifts**
4. Get 25 AI-curated Amazon affiliate links instantly

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/yourname/scoutcurate
cd scoutcurate
npm install --ignore-scripts
```

> **Windows Note:** `--ignore-scripts` skips native addon compilation. Plasmo builds fine without it.

### 2. Set Your Amazon Affiliate Tag

Edit `lib/amazon.ts`:

```ts
const AFFILIATE_TAG = "scoutcurate-20"  // ← change to YOUR tag
```

Your tag comes from [Amazon Associates](https://affiliate-program.amazon.com/).

### 3. Build the Extension

```bash
npm run build
```

Output goes to `build/chrome-mv3-prod/`.

### 4. Load in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `build/chrome-mv3-prod/` folder

### 5. Set Your OpenAI API Key

On first launch, the extension will ask for your OpenAI API key.  
Get one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).  
The key is stored **locally** in Chrome storage — never transmitted anywhere except OpenAI.

---

## Development

```bash
npm run dev     # Hot-reload dev mode
npm run build   # Production build
npm run package # Package as .zip for Chrome Web Store
```

---

## Project Structure

```
scoutcurate/
├── popup.tsx                    # Main extension popup (root UI)
├── style.css                    # Global styles (Tailwind + Google Fonts)
├── components/
│   ├── VoiceRecorder.tsx        # Web Speech API microphone component
│   ├── ProductCard.tsx          # Individual gift card (Scout & Curate styles)
│   └── ApiKeySetup.tsx          # First-run OpenAI key entry screen
├── lib/
│   ├── types.ts                 # Shared TypeScript types
│   ├── amazon.ts                # Affiliate URL builder (tag appended here)
│   ├── generateKidsGifts.ts     # Scout AI logic (GPT-4o-mini, kids prompt)
│   ├── generateAdultGifts.ts    # Curate AI logic (GPT-4o-mini, adult prompt)
│   └── storage.ts               # Chrome storage wrapper (@plasmohq/storage)
├── assets/
│   └── icon.png                 # Extension icon
├── tailwind.config.js           # Custom Scout (orange) + Curate (gold/dark) themes
└── package.json                 # Plasmo + manifest config
```

---

## Customization

### Changing the AI Model

In `lib/generateKidsGifts.ts` and `lib/generateAdultGifts.ts`, change:

```ts
model: "gpt-4o-mini"  // → "gpt-4o" for higher quality, "gpt-3.5-turbo" to save cost
```

### Adjusting the System Prompts

- **Scout prompt** — `lib/generateKidsGifts.ts` → `systemPrompt` variable
- **Curate prompt** — `lib/generateAdultGifts.ts` → `systemPrompt` variable

### Amazon Affiliate Tag

`lib/amazon.ts` — update `AFFILIATE_TAG` to your Associates ID.

---

## Monetization Model

Every "Buy on Amazon" button appends your affiliate tag:
```
https://www.amazon.com/s?k=product+name&tag=scoutcurate-20
```
Amazon pays **1–10% commission** on qualifying purchases.

---

## Tech Stack

- **[Plasmo](https://plasmo.com)** — Chrome Extension framework
- **React 18** — UI
- **Tailwind CSS** — Styling
- **OpenAI API** — GPT-4o-mini for gift generation
- **Web Speech API** — Voice-to-text (built into Chrome)
- **@plasmohq/storage** — Chrome storage abstraction
- **Lucide React** — Icons

---

## Privacy

- No data is collected or stored by ScoutCurate
- Voice transcripts are sent directly to OpenAI
- Your API key is stored locally in Chrome's storage
- All Amazon links include your affiliate tag only

---

*ScoutCurate.com — Scout for Kids, Curate for Adults*
