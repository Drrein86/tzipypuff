# Tzipi Puff — אפיון מלא

**גרסה:** 1.0  
**תאריך:** 5 ביולי 2026  
**קונספט:** Premium Smoke Boutique · Cyberpunk יוקרתי · VIP Lounge לילי

---

## תוכן עניינים

1. [חזון ומטרות](#1-חזון-ומטרות)
2. [קהל יעד](#2-קהל-יעד)
3. [שפה עיצובית (Design System)](#3-שפה-עיצובית-design-system)
4. [Smoke Engine — מנוע העשן](#4-smoke-engine--מנוע-העשן)
5. [אנימציות ואפקטים](#5-אנימציות-ואפקטים)
6. [מבנה אתר ו-IA](#6-מבנה-אתר-ו-ia)
7. [מסכים ודפים](#7-מסכים-ודפים)
8. [רכיבים גלובליים](#8-רכיבים-גלובליים)
9. [חוויית משתמש וזרימות](#9-חוויית-משתמש-וזרימות)
10. [מועדון לקוחות](#10-מועדון-לקוחות)
11. [חיפוש](#11-חיפוש)
12. [מודל נתונים](#12-מודל-נתונים)
13. [Stack טכני מומלץ](#13-stack-טכני-מומלץ)
14. [ביצועים ונגישות](#14-ביצועים-ונגישות)
15. [משפטי ותאימות](#15-משפטי-ותאימות)
16. [שלבי פיתוח](#16-שלבי-פיתוח)

---

## 1. חזון ומטרות

### 1.1 חזון

Tzipi Puff הוא לא "עוד חנות טבק" — אלא **מותג פרימיום בינלאומי** בסגנון Cyberpunk. כל ביקור באתר מרגיש כמו כניסה למועדון VIP לילי: שחור מט, נאון ורוד/כחול, עשן חי, זכוכית, Glow, ומעברים חלקים.

### 1.2 מטרות עסקיות

| מטרה | KPI |
|------|-----|
| המרת מבקרים ללקוחות | Conversion Rate ≥ 2.5% |
| ערך הזמנה ממוצע | AOV ≥ ₪180 |
| חזרתיות | Repeat Purchase ≥ 35% |
| מועדון לקוחות | 60% מהלקוחות רשומים |
| חוויה ייחודית | Bounce Rate < 40%, Session Duration > 3 דק' |

### 1.3 עקרונות מוצר

- **Premium First** — כל פיקסל משרת תחושת יוקרה
- **Immersive** — העשן והאנימציות הם חלק מהמוצר, לא קישוט
- **Fast & Fluid** — 60fps גם עם אפקטים כבדים (אופטימיזציה חכמה)
- **RTL Native** — עברית ראשונה, תמיכה מלאה ב-RTL
- **Dark Only** — ללא Light Mode; עקביות מותגית מלאה

---

## 2. קהל יעד

| פרופיל | תיאור | צרכים |
|--------|--------|--------|
| **VIP Regular** | 25–40, מעשן/מאג' נרגילה, רגיל לקנות אונליין | מוצרים מקוריים, משלוח מהיר, נקודות מועדון |
| **Explorer** | 18–30, מחפש טעמים/מותגים חדשים | גילוי, המלצות, ביקורות, מבצעים |
| **Gift Buyer** | קונה מתנה | Wishlist, קופונים, אריזת מתנה (עתידי) |

---

## 3. שפה עיצובית (Design System)

### 3.1 פלטת צבעים

```css
:root {
  /* רקע */
  --bg-primary:     #05070B;
  --bg-secondary:   #0A0E14;
  --bg-glass:       rgba(10, 14, 20, 0.55);

  /* נאון */
  --neon-pink:      #FF2EA6;
  --neon-blue:      #27B8FF;
  --neon-purple:    #7B3EFF;

  /* הדגשות */
  --gold:           #C8A96A;
  --text-primary:   #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.65);
  --text-muted:     rgba(255, 255, 255, 0.4);

  /* Glassmorphism */
  --glass-border:   rgba(255, 255, 255, 0.08);
  --glass-blur:     16px;

  /* Glow */
  --glow-pink:      0 0 20px rgba(255, 46, 166, 0.5);
  --glow-blue:      0 0 20px rgba(39, 184, 255, 0.5);
  --glow-gold:      0 0 12px rgba(200, 169, 106, 0.4);
}
```

### 3.2 טיפוגרפיה

| שימוש | משקל | גודל (Desktop) | צבע |
|-------|------|----------------|-----|
| H1 — Hero | 800 | 64–80px | Gradient Pink→Blue + Glow |
| H2 — סקשנים | 700 | 36–48px | Gold (#C8A96A) |
| H3 — כרטיסים | 600 | 24–28px | White |
| Body | 400 | 16–18px | White 85% |
| Caption | 400 | 12–14px | White 65% |
| Price | 700 | 20–28px | Neon Pink |
| Button | 600 | 16px | White |

**פונטים מומלצים:**
- עברית: **Heebo** / **Assistant** (Google Fonts)
- אנגלית/מספרים: **Inter** / **Space Grotesk**
- לוגו/Accent: **Orbitron** (Cyberpunk, לשימוש מוגבל)

### 3.3 Spacing & Grid

- **Container max-width:** 1440px
- **Grid:** 12 columns, gap 24px
- **Section padding:** 80px vertical (Desktop), 48px (Mobile)
- **Border radius:** Cards 16px, Buttons 12px, Inputs 8px, Glass panels 20px

### 3.4 Glassmorphism

```css
.glass-panel {
  background: var(--bg-glass);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 20px;
}
```

**שימוש:** Header בגלילה, Sidebar פילטרים, סיכום הזמנה, Overlays, Cards משניים.

### 3.5 כפתורים

| סוג | רקע | Border | Hover |
|-----|-----|--------|-------|
| Primary | Gradient Pink | Glow Pink | Scale 1.05 + Ripple + Glow ↑ |
| Secondary | Transparent | Neon Blue 2px | Fill Blue 10% + Glow Blue |
| Ghost | Transparent | None | Underline Neon |
| Danger | Transparent | Red Neon | Glow Red |

### 3.6 Cards

- רקע: `rgba(255,255,255,0.03)`
- Border: 1px `rgba(255,255,255,0.06)`
- Hover: `translateY(-8px)`, Glow Pink, Shadow `0 20px 40px rgba(255,46,166,0.15)`
- Smoke micro-particle מאחורי הכרטיס ב-Hover

---

## 4. Smoke Engine — מנוע העשן

> **הרכיב הקריטי ביותר באתר.** לא GIF, לא וידאו — Particle System אמיתי.

### 4.1 ארכיטקטורה

```
┌─────────────────────────────────────────┐
│  Layer 0: Background (Gradient+Noise)   │
├─────────────────────────────────────────┤
│  Layer 1: Floating Lights (Parallax)    │
├─────────────────────────────────────────┤
│  Layer 2: Smoke Canvas (WebGL/Canvas2D)│  ← Smoke Engine
├─────────────────────────────────────────┤
│  Layer 3: Content (z-index above smoke) │
├─────────────────────────────────────────┤
│  Layer 4: UI Overlays (Header, Modals)  │
└─────────────────────────────────────────┘
```

### 4.2 התנהגות חלקיקים

| פרמטר | ערך Desktop | ערך Mobile |
|-------|-------------|------------|
| מקור שמאל | Pink (#FF2EA6), opacity 0.15–0.35 | opacity 0.10–0.25 |
| מקור ימין | Blue (#27B8FF), opacity 0.15–0.35 | opacity 0.10–0.25 |
| כיוון | עולה (velocity Y: -0.5 to -1.5) | -0.3 to -0.8 |
| גודל חלקיק | 40–120px (blurred circle) | 30–80px |
| Blur | 20–60px (dynamic) | 15–40px |
| Lifespan | 3–8 שניות | 4–10 שניות |
| Max particles | 80–120 | 30–50 |
| Spawn rate | 2–4/sec per side | 1–2/sec per side |

### 4.3 אינטראקציות

| Trigger | התנהגות |
|---------|----------|
| **Mouse Move** | חלקיקים קרובים נדחפים מהעכבר (force field radius ~150px) |
| **Scroll Down** | עשן "נמשך" למטה, velocity Y מוגבר |
| **Scroll Up** | עשן עולה מהר יותר |
| **Page Transition** | Fade out → respawn בדף חדש |
| **Idle** | תנועה איטית אקראית (Perlin noise drift) |

### 4.4 מימוש טכני

**אופציה A — Canvas 2D (מומלץ ל-MVP):**
- `requestAnimationFrame` loop
- Offscreen particles array
- `ctx.filter = 'blur(Npx)'` per particle
- `globalCompositeOperation: 'screen'` ל-blending נאוני

**אופציה B — WebGL (Production):**
- Three.js / custom shader
- Fragment shader עם noise + blur
- GPU-accelerated, 200+ particles

**קומפוננט React:**
```tsx
<SmokeEngine
  intensity="normal"      // low | normal | high
  mouseInteraction={true}
  scrollInteraction={true}
  pinkSide="left"
  blueSide="right"
  className="fixed inset-0 -z-10 pointer-events-none"
/>
```

### 4.5 ביצועים

- `will-change: transform` על Canvas
- Throttle mouse events ל-16ms
- `IntersectionObserver` — pause כשלא visible
- Mobile: `intensity="low"`, FPS cap 30
- `prefers-reduced-motion`: opacity static gradient, no particles

---

## 5. אנימציות ואפקטים

### 5.1 Loader (פתיחת האתר)

```
Timeline (3.5–5 שניות):
─────────────────────────────────────────
0.0s   │ מסך שחור (#05070B)
0.2s   │ Smoke Engine מתחיל — עשן ממלא מסך
0.5s   │ לוגו "ציפי" — Neon Flicker (opacity 0→1, flicker 3x)
1.2s   │ "Puff" — אות-אות (stagger 80ms per letter)
2.0s   │ Glow stabilizes — לוגו דולק מלא
2.5s   │ Smoke disperses (particles velocity ↑, opacity ↓)
3.5s   │ Fade to site — Loader unmount
─────────────────────────────────────────
```

**Neon Flicker CSS:**
```css
@keyframes neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: 0.4; }
}
```

### 5.2 Micro Animations (גלובלי)

| אלמנט | אנימציה | Duration | Easing |
|-------|---------|----------|--------|
| Button Click | Scale 0.95 → 1.0 + Ripple | 300ms | ease-out |
| Button Hover | Glow ↑ + Scale 1.05 | 200ms | ease |
| Card Hover | translateY(-8px) + Shadow + Smoke puff | 350ms | cubic-bezier(.4,0,.2,1) |
| Image Hover | Scale 1.08 + Parallax tilt | 400ms | ease |
| Link Hover | Underline slide-in Neon | 250ms | ease |
| Add to Cart | Icon fly to cart (FLIP) | 600ms | spring |
| Toast/Notification | Slide-in from top + Glow | 400ms | ease-out |

### 5.3 Page Transitions

- **Route change:** Crossfade 400ms + Smoke respawn
- **Modal open:** Backdrop blur 0→16px, panel scale 0.95→1
- **Drawer (Cart):** Slide from left (RTL) + Glass backdrop

### 5.4 Cursor מותאם

- Default cursor: **hidden**
- Custom cursor: עיגול נאון 24px, border 2px Pink, `mix-blend-mode: screen`
- Hover על clickable: Scale 1.5 + Glow Blue
- Trail: 3–5 smoke micro-particles behind cursor (Canvas overlay)
- Mobile: disabled (touch)

### 5.5 Scroll Effects

- Smoke direction change (ראה §4.3)
- Header → Glass transition at scrollY > 80px
- Parallax layers: Background 0.3x, Smoke 0.5x, Content 1x
- Section reveal: Fade-up + stagger children (Intersection Observer)

### 5.6 Background Layers

```
Layer stack (bottom to top):
1. Solid #05070B
2. Radial gradient (Purple center-bottom, opacity 0.08)
3. Noise texture (SVG filter, opacity 0.03)
4. Floating light orbs (3–5, slow drift, blur 80px)
5. Smoke Engine
6. Content
```

### 5.7 Ambient Sound (אופציונלי)

- **ברירת מחדל:** כבוי
- **Toggle:** אייקון רמקול ב-Footer
- **Track:** Lounge ambient, 30% volume, loop
- **Fade in:** 2s on enable
- **localStorage:** `soundEnabled: boolean`

---

## 6. מבנה אתר ו-IA

### 6.1 Sitemap

```
/                          → דף הבית
/catalog                   → קטלוג (כל המוצרים)
/catalog/[category]        → קטגוריה
/catalog/[category]/[slug] → דף מוצר
/cart                      → עגלה
/checkout                  → תשלום (multi-step)
/checkout/success          → אישור הזמנה
/account                   → חשבון
/account/orders            → הזמנות
/account/addresses         → כתובות
/account/wishlist          → Wishlist
/account/points            → נקודות
/account/coupons           → קופונים
/club                      → מועדון לקוחות
/sales                     → מבצעים
/about                     → אודות
/contact                   → צור קשר
/search                    → תוצאות חיפוש
/legal/terms               → תנאי שימוש
/legal/shipping            → משלוחים
/legal/faq                 → שאלות נפוצות
/legal/privacy             → פרטיות
```

### 6.2 קטגוריות מוצרים

| # | קטגוריה | Slug | אייקון |
|---|---------|------|--------|
| 1 | טבק לנרגילה | `tobacco` | 🌿 |
| 2 | נוזלים | `liquids` | 💧 |
| 3 | סיגריות אלקטרוניות | `vapes` | ⚡ |
| 4 | אביזרים | `accessories` | 🔧 |
| 5 | פחמים | `coals` | 🔥 |
| 6 | פילטרים | `filters` | 🎯 |
| 7 | גלגול | `rolling` | 📜 |
| 8 | מקטרות | `pipes` | 🚬 |
| 9 | באנגים | `bongs` | 💨 |

### 6.3 מותגים

RAW · Starbuzz · Al Fakher · Adalya · Fumari · IVG · Vaporesso · GeekVape · SMOK

---

## 7. מסכים ודפים

### 7.1 Age Gate (כניסה ראשונה)

```
┌──────────────────────────────────────┐
│         [Smoke Background]           │
│                                      │
│         🚬 Tzipi Puff Logo           │
│                                      │
│   האם אתה מעל גיל 18?               │
│                                      │
│   [כן, אני מעל 18]  [לא, צא]        │
│                                      │
│   localStorage: ageVerified=true     │
│   cookie expiry: 30 days             │
└──────────────────────────────────────┘
```

- עיצוב Glass panel מרכזי
- Glow Pink על כפתור "כן"
- "לא" → redirect ל-Google
- חובה לפני Loader

---

### 7.2 Header (Sticky)

**Desktop Layout (RTL):**
```
[Logo] [Search Bar ─────────────] [קטגוריות] [מבצעים] [מועדון] [אודות] [צור קשר] [👤] [♡] [🛒]
```

**Mobile:** Hamburger → Full-screen overlay menu + Bottom bar (Home, Catalog, Cart, Account)

| מצב | התנהגות |
|-----|----------|
| Top | Transparent, logo glow |
| Scrolled (>80px) | Glass background, blur 16px, border-bottom glow |
| Cart badge | Pink circle, count, bounce on add |

**Search Bar:**
- Width: 400px (Desktop), full (Mobile)
- Placeholder: "חפש מוצר, מותג, טעם..."
- Focus: Glow Blue border + expand animation
- Live results dropdown (ראה §11)

---

### 7.3 דף הבית (`/`)

#### Hero Section
- **רקע:** מדפים עם תאורת נאון (parallax image) + Smoke Engine
- **לוגו:** ענק, Gradient Pink→Blue, Neon Glow
- **Subtitle:** "PREMIUM SMOKE BOUTIQUE" — Gold
- **CTA Primary:** "קנה עכשיו" → `/catalog`
- **CTA Secondary:** "מבצעים" → `/sales`
- **Animation:** Logo pulse glow, buttons stagger fade-in

#### יתרונות (4 Icons)
| אייקון | כותרת | תיאור |
|--------|--------|--------|
| 🚚 | משלוח מהיר | עד 48 שעות לכל הארץ |
| ✔ | 100% מקורי | מוצרים מייבוא רשמי |
| ⭐ | שירות VIP | ייעוץ אישי 24/7 |
| 💳 | תשלום מאובטח | SSL + Bit + PayPal |

#### קטגוריות (Grid Cards)
- 9 cards (3×3 Desktop, 2×N Mobile)
- כל card: אייקון נאון, שם, Glow on hover, Smoke puff
- Click → `/catalog/[category]`

#### מוצרים מובילים (Carousel)
- 8–12 מוצרים, auto-scroll + manual arrows
- Card: תמונה, שם, מחיר, "הוסף לסל"
- Hover: lift + Pink glow + mini smoke
- Swipe on mobile

#### באנר מבצעים
- רקע Smoke + Gradient
- Countdown timer (ימים:שעות:דקות:שניות)
- Coupon code display + "Copy" button
- CTA → `/sales`

#### מותגים (Logo Slider)
- Infinite horizontal scroll
- Logos: grayscale → color on hover
- Brands: RAW, Starbuzz, Al Fakher, Adalya, Fumari, IVG, Vaporesso, GeekVape, SMOK

---

### 7.4 קטלוג (`/catalog`, `/catalog/[category]`)

#### Layout
```
┌──────────────────────────────────────────────────┐
│ Header                                           │
├──────────────┬───────────────────────────────────┤
│              │  [Sort ▼]  [Grid 3|4|5 ▼]  [42]  │
│   Sidebar    ├───────────────────────────────────┤
│   Filters    │                                   │
│              │   [Product] [Product] [Product]   │
│   - קטגוריות │   [Product] [Product] [Product]   │
│   - מחיר     │   [Product] [Product] [Product]   │
│   - מותג     │                                   │
│   - טעם      │         [Load More / Pagination]  │
│   - עוצמה    │                                   │
│   - מלאי     │                                   │
│   - מבצעים   │                                   │
└──────────────┴───────────────────────────────────┘
```

#### Sidebar Filters
| פילטר | סוג UI | ערכים |
|-------|--------|-------|
| קטגוריות | Checkbox tree | 9 קטגוריות |
| מחיר | Range slider (dual) | ₪0 – ₪500+ |
| מותג | Checkbox list | 9+ מותגים |
| טעם | Tag chips | תפוח, מנטה, תות, ענבים... |
| עוצמה | Radio | קל / בינוני / חזק |
| מלאי | Toggle | במלאי בלבד |
| מבצעים | Toggle | מוצרים במבצע |

- Glass panel styling
- Active filters → Pink glow chips above grid
- URL sync: `/catalog?brand=starbuzz&price=50-200`

#### Product Grid
- 3–5 columns (responsive)
- Card: Image, Brand, Name, Price, "הוסף לסל", Wishlist ♡
- Hover: Glow + Zoom 1.05 + Smoke
- Skeleton loading on fetch
- Empty state: Smoke animation + "לא נמצאו מוצרים"

#### Sort Options
- פופולריות · מחיר ↑ · מחיר ↓ · חדש · דירוג

---

### 7.5 דף מוצר (`/catalog/[category]/[slug]`)

#### Layout
```
┌──────────────────────────────────────────────────┐
│ Breadcrumb: בית > טבק > Starbuzz Blue Mist       │
├────────────────────┬─────────────────────────────┤
│                    │  Starbuzz Blue Mist         │
│   [Main Image]     │  Starbuzz                   │
│   [Zoom on hover]  │  ₪95                        │
│                    │  [- 1 +]  [הוסף לסל 🛒]     │
│   [Thumb][Thumb]   │  [♡ הוסף ל-Wishlist]        │
│   [Thumb][Thumb]   │                             │
├────────────────────┴─────────────────────────────┤
│ Tabs: [תיאור] [מאפיינים] [ביקורות] [שאלות]       │
├──────────────────────────────────────────────────┤
│ Feature Icons: ✔ מקורי | 🌿 טעמים | 💨 עשן נקי  │
├──────────────────────────────────────────────────┤
│ מוצרים קשורים — Carousel                         │
└──────────────────────────────────────────────────┘
```

#### תמונה
- Zoom on hover (magnifier lens)
- 360° view (optional: sprite sheet / 36 frames)
- Gallery thumbnails with active glow
- Lightbox on click

#### ביקורות
- Star rating (1–5)
- Review form (logged in only)
- Sort: חדש / מועיל / דירוג

#### שאלות ותשובות
- Q&A accordion
- "שאל שאלה" form

---

### 7.6 עגלה (`/cart` + Drawer)

#### Cart Drawer (Sidebar)
- Opens from left (RTL) on "Add to Cart"
- Glass backdrop
- Items list: thumb, name, price, qty (+/-), remove ✕
- Coupon input + "החל"
- Summary: סכום ביניים, משלוח, סה"כ
- CTA: "לתשלום" → `/checkout`
- Animations: item add (slide-in), remove (fade-out), qty change (number flip)

#### Cart Page
- Full page version with same content
- Trust icons bottom: 24/7 · משלוח · תשלום מאובטח
- "המשך קניות" link

---

### 7.7 Checkout (`/checkout`)

#### Progress Bar
```
(1) פרטים ──→ (2) משלוח ──→ (3) תשלום ──→ (4) אישור
  ●              ○              ○              ○
```

#### Step 1 — פרטים
- שם מלא, אימייל, טלפון
- Validation inline with Glow Red on error

#### Step 2 — משלוח
- כתובת: עיר, רחוב, מספר בית, דירה, מיקוד
- Saved addresses dropdown (logged in)
- Shipping method: רגיל (₪25) / מהיר (₪45) / Pickup (חינם)

#### Step 3 — תשלום
| Method | UI |
|--------|-----|
| כרטיס אשראי | Stripe iframe |
| PayPal | PayPal button |
| Bit | QR / deep link |
| Apple Pay | Native button |

#### Step 4 — אישור
- Order summary
- "בצע הזמנה" → Processing animation (Smoke + Spinner)
- Success → `/checkout/success` with confetti smoke

#### Order Summary (Sticky Right)
- Glass panel
- Items mini-list
- Totals
- Updates live on each step

---

### 7.8 חשבון (`/account`)

#### Dashboard
```
┌─────────────────────────────────────────┐
│  שלום, [שם] 👤                          │
│  נקודות: 450 ⭐  |  דרגה: Gold 🥇       │
├──────────┬──────────────────────────────┤
│ Sidebar  │  Content Area                │
│          │                              │
│ הזמנות   │  [Recent Orders Table]       │
│ כתובות   │                              │
│ Wishlist │                              │
│ נקודות   │                              │
│ קופונים  │                              │
│ היסטוריה │                              │
│ הגדרות   │                              │
│ יציאה    │                              │
└──────────┴──────────────────────────────┘
```

| עמוד | תוכן |
|------|------|
| הזמנות | טבלה: #, תאריך, סטטוס, סכום, "צפה" |
| כתובות | CRUD כתובות |
| Wishlist | Grid מוצרים + "הוסף לסל" |
| נקודות | היסטוריית צבירה/מימוש |
| קופונים | קופונים פעילים/פגי תוקף |
| היסטוריה | פעילות: צפיות, חיפושים, הוספות לסל |

---

### 7.9 מועדון לקוחות (`/club`)

#### דרגות

| דרגה | סף | הטבות |
|------|-----|-------|
| 🥈 Silver | 0–999 נקודות | 5% Cashback, קופון יום הולדת |
| 🥇 Gold | 1,000–4,999 | 8% Cashback, משלוח חינם ×2/חודש |
| 💎 Diamond | 5,000+ | 12% Cashback, Early Access, VIP Box |

#### UI
- Progress bar to next tier
- Points balance (animated counter)
- Available coupons grid
- Cashback history
- "How it works" section

**נקודות:** ₪1 = 1 נקודה · 100 נקודות = ₪10

---

### 7.10 מבצעים (`/sales`)

- Hero banner with Smoke + Countdown
- Grid of sale products (badge: "-30%")
- Filter by category
- Multiple promo banners with different Smoke colors
- Coupon codes section

---

### 7.11 אודות (`/about`)

- **Timeline:** שנות פעילות, אבני דרך
- **העסק:** סיפור, תמונות, צוות
- **חזון:** Mission statement with Gold typography
- **סרטון:** Embedded hero video with Glass frame
- Parallax scroll sections

---

### 7.12 צור קשר (`/contact`)

```
┌─────────────────────────────────────────┐
│  📞 050-XXX-XXXX                        │
│  📧 info@tzipipuff.co.il                │
│  🕐 א'-ה' 10:00–22:00, ו' 10:00–15:00   │
│  📍 [כתובת החנות]                       │
├─────────────────────────────────────────┤
│  [Google Maps Embed]                    │
├─────────────────────────────────────────┤
│  WhatsApp | Instagram | Facebook        │
├─────────────────────────────────────────┤
│  טופס: שם, אימייל, נושא, הודעה         │
│  [שלח הודעה]                            │
├─────────────────────────────────────────┤
│  FAQ Accordion                          │
└─────────────────────────────────────────┘
```

---

### 7.13 Footer

```
┌──────────────────────────────────────────────────┐
│  [Logo]                                          │
│                                                  │
│  קטגוריות    │  מידע        │  Newsletter       │
│  טבק         │  אודות       │  [Email] [הרשם]   │
│  נוזלים      │  משלוחים     │                   │
│  סיגריות     │  תנאים       │  [Social Icons]   │
│  ...         │  FAQ         │                   │
│              │  צור קשר     │                   │
├──────────────────────────────────────────────────┤
│  © 2026 Tzipi Puff. כל הזכויות שמורות.          │
└──────────────────────────────────────────────────┘
```

---

## 8. רכיבים גלובליים

### 8.1 Component Library

| Component | Props | Variants |
|-----------|-------|----------|
| `SmokeEngine` | intensity, mouse, scroll | — |
| `NeonLogo` | size, animate | flicker, static |
| `GlassPanel` | blur, border | default, strong |
| `NeonButton` | variant, size, loading | primary, secondary, ghost |
| `ProductCard` | product, onAddToCart | grid, carousel, compact |
| `CategoryCard` | category, icon | default, large |
| `PriceTag` | amount, sale, original | — |
| `QuantitySelector` | value, min, max, onChange | — |
| `FilterSidebar` | filters, onChange | — |
| `SearchBar` | onSearch, live | header, page |
| `CartDrawer` | open, onClose | — |
| `CountdownTimer` | targetDate | banner, page |
| `ReviewStars` | rating, interactive | display, input |
| `Toast` | message, type | success, error, info |
| `AgeGate` | onVerify | — |
| `CustomCursor` | enabled | — |
| `Loader` | onComplete | — |
| `Breadcrumb` | items | — |
| `Pagination` | page, total, onChange | — |
| `EmptyState` | title, icon | — |
| `TrustBadges` | badges[] | row, grid |

---

## 9. חוויית משתמש וזרימות

### 9.1 First Visit Flow

```
Age Gate → Loader → Homepage → Browse → Product → Add to Cart → Checkout → Success
```

### 9.2 Returning User

```
Homepage → (Logged in) → Quick reorder from Account
```

### 9.3 Cart Abandonment

- Cart saved in localStorage + server (logged in)
- Toast reminder after 5 min idle: "יש לך 3 מוצרים בעגלה"

### 9.4 Error States

| מצב | UI |
|-----|-----|
| 404 | Smoke + "העמוד לא נמצא" + CTA Home |
| 500 | "משהו השתבש" + Retry |
| Out of stock | Badge + disabled button + "הודע לי" |
| Payment fail | Red glow + retry + support link |

---

## 10. מועדון לקוחות

### 10.1 צבירת נקודות

| פעולה | נקודות |
|-------|--------|
| רכישה | ₪1 = 1 נקודה |
| ביקורת | 50 נקודות |
| הרשמה | 100 נקודות |
| יום הולדת | 200 נקודות |
| Referral | 500 נקודות |

### 10.2 מימוש

- 100 נקודות = ₪10 הנחה
- מקסימום 50% מהזמנה
- קופונים ייחודיים לפי דרגה

---

## 11. חיפוש

### 11.1 Live Search

- Debounce: 300ms
- Min chars: 2
- Results: Products (top 5) + Categories (top 3) + Brands (top 3)
- Highlight matching text (Neon Pink)
- Keyboard navigation (↑↓ Enter Esc)
- "ראה הכל" → `/search?q=...`

### 11.2 Search Page

- Full results grid
- Filters sidebar (same as catalog)
- Sort options
- "חיפושים פופולריים" when empty

---

## 12. מודל נתונים

### 12.1 Product

```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  brand: Brand;
  category: Category;
  price: number;
  salePrice?: number;
  currency: 'ILS';
  images: string[];
  images360?: string[];
  description: string;
  attributes: {
    flavor?: string;
    strength?: 'light' | 'medium' | 'strong';
    nicotine?: string;
    weight?: string;
  };
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured: boolean;
  isOnSale: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 12.2 Order

```typescript
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: 'card' | 'paypal' | 'bit';
  couponCode?: string;
  pointsEarned: number;
  createdAt: Date;
}
```

### 12.3 User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  addresses: Address[];
  wishlist: string[]; // product IDs
  points: number;
  tier: 'silver' | 'gold' | 'diamond';
  coupons: Coupon[];
  createdAt: Date;
}
```

---

## 13. Stack טכני מומלץ

### 13.1 Frontend

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 15** (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Animation | Framer Motion |
| Smoke Engine | Canvas 2D (MVP) → WebGL (v2) |
| State | Zustand (cart, UI) + React Query (server) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React (custom Neon wrapper) |

### 13.2 Backend

| Layer | Technology |
|-------|-----------|
| API | Next.js API Routes / Server Actions |
| Database | PostgreSQL (Neon / Supabase) |
| ORM | Drizzle / Prisma |
| Auth | NextAuth.js / Clerk |
| Payments | Stripe + PayPal + Bit API |
| Search | Algolia / Meilisearch |
| CMS | Sanity / Payload (products, content) |
| Email | Resend (order confirmations) |
| Storage | Cloudinary / Vercel Blob (images) |

### 13.3 DevOps

| Layer | Technology |
|-------|-----------|
| Hosting | Vercel |
| CDN | Vercel Edge |
| Analytics | Vercel Analytics + GA4 |
| Monitoring | Sentry |
| CI/CD | GitHub Actions |

### 13.4 Project Structure

```
tzipypuff/
├── app/                    # Next.js App Router
│   ├── (shop)/             # Shop layout group
│   │   ├── page.tsx        # Homepage
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── ...
│   ├── (account)/          # Account layout group
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout (Smoke, Cursor, AgeGate)
│   └── globals.css
├── components/
│   ├── smoke/              # SmokeEngine, Loader
│   ├── ui/                 # Button, Card, Glass, etc.
│   ├── shop/               # ProductCard, CartDrawer, etc.
│   ├── layout/             # Header, Footer, Sidebar
│   └── effects/            # Cursor, Parallax, NeonFlicker
├── lib/                    # Utils, API clients
├── hooks/                  # Custom hooks
├── stores/                 # Zustand stores
├── types/                  # TypeScript types
├── public/                 # Static assets
└── docs/                   # Documentation
```

---

## 14. ביצועים ונגישות

### 14.1 Performance Budget

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Lighthouse Performance | ≥ 85 |
| Smoke Engine FPS | ≥ 30 (mobile), ≥ 60 (desktop) |

### 14.2 Optimizations

- Image: Next/Image, WebP/AVIF, lazy load
- Code splitting per route
- Smoke Engine: Web Worker (v2)
- Prefetch catalog on hover
- Service Worker for offline cart

### 14.3 Accessibility

- `prefers-reduced-motion` → disable smoke, simplify animations
- Keyboard navigation full support
- ARIA labels on all interactive elements
- Focus visible: Neon Blue outline
- Screen reader: skip to content link
- Color contrast: WCAG AA minimum
- Custom cursor disabled when `prefers-reduced-motion`

---

## 15. משפטי ותאימות

| דרישה | מימוש |
|-------|--------|
| **Age Gate** | 18+ verification, localStorage + cookie |
| **תנאי שימוש** | `/legal/terms` |
| **מדיניות פרטיות** | `/legal/privacy` — GDPR-style |
| **Cookie Banner** | Essential + Analytics opt-in |
| **אזהרת בריאות** | Footer disclaimer |
| **חוק עישון** | בהתאם לחקיקה הישראלית |
| **PCI DSS** | Stripe handles card data |
| **חשבונית** | Email + PDF on order |

---

## 16. שלבי פיתוח

### Phase 1 — Foundation (2–3 שבועות)
- [ ] Project setup (Next.js, Tailwind, TypeScript)
- [ ] Design System (CSS variables, components)
- [ ] Smoke Engine (Canvas 2D)
- [ ] Loader + Age Gate
- [ ] Header + Footer
- [ ] Homepage (Hero, Categories, Products carousel)

### Phase 2 — Shop Core (2–3 שבועות)
- [ ] Catalog + Filters
- [ ] Product page
- [ ] Cart (Drawer + Page)
- [ ] Search (Live)
- [ ] Database + Product API

### Phase 3 — Commerce (2 שבועות)
- [ ] Checkout flow (4 steps)
- [ ] Payment integration (Stripe, Bit)
- [ ] Order confirmation + emails
- [ ] Auth (register/login)

### Phase 4 — Account & Club (1–2 שבועות)
- [ ] Account dashboard
- [ ] Orders, Addresses, Wishlist
- [ ] Loyalty program (points, tiers)
- [ ] Coupons

### Phase 5 — Content & Polish (1–2 שבועות)
- [ ] About, Contact, FAQ
- [ ] Sales page
- [ ] Custom Cursor
- [ ] Micro animations polish
- [ ] Mobile optimization
- [ ] Performance audit

### Phase 6 — Launch (1 שבוע)
- [ ] SEO (meta, sitemap, structured data)
- [ ] Analytics
- [ ] Legal pages
- [ ] QA + Bug fixes
- [ ] Production deploy

---

## נספח א׳ — Mockup Reference

העיצוב מבוסס על Mockup שסופק (WhatsApp Image, 5.7.2026) וכולל:

1. **Home** — Hero + Categories + Popular Products + Free Shipping Banner
2. **Catalog** — Sidebar filters + Product grid
3. **Product** — Split layout + Related products
4. **Cart** — Items list + Order summary
5. **Checkout** — Form + Payment methods
6. **Navigation** — Category sidebar overlay
7. **Account** — User profile menu
8. **Contact** — Info + Form + FAQ

---

## נספח ב׳ — CSS Tokens (Tailwind Config)

```javascript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      bg: { primary: '#05070B', secondary: '#0A0E14' },
      neon: { pink: '#FF2EA6', blue: '#27B8FF', purple: '#7B3EFF' },
      gold: '#C8A96A',
    },
    boxShadow: {
      'glow-pink': '0 0 20px rgba(255, 46, 166, 0.5)',
      'glow-blue': '0 0 20px rgba(39, 184, 255, 0.5)',
      'glow-gold': '0 0 12px rgba(200, 169, 106, 0.4)',
    },
    backdropBlur: { glass: '16px' },
    animation: {
      'neon-flicker': 'neon-flicker 2s infinite',
      'float': 'float 6s ease-in-out infinite',
      'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
    },
  },
}
```

---

*מסמך זה מהווה את האפיון המלא לפרויקט Tzipi Puff. כל שינוי יתועד ב-CHANGELOG.*
