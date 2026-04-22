# Libby Live as Native App — PWA Implementation

**Goal:** Libby Live works on iOS, iPad, and web as a full-screen native-feeling app with automatic device/orientation detection.

---

## What We're Delivering

✅ **iOS (iPhone)** — Install to home screen, full-screen portrait
✅ **iPad** — Install to home screen, landscape + portrait
✅ **Web (desktop)** — Responsive, full-screen capable
✅ **Offline-first** — Service worker caches essential data
✅ **Orientation detection** — Auto-adapts to portrait/landscape
✅ **No browser chrome** — Looks like app store app
✅ **Touch-optimized** — Large tap targets, swipe gestures
✅ **iOS status bar** — Matches app theme

---

## Installation Instructions (Users)

### On iPhone
1. Open https://libbynatico.github.io/libby_live/ in Safari
2. Tap Share (bottom or top right)
3. Scroll down, tap "Add to Home Screen"
4. Name it "Libby Live" (default is fine)
5. Tap "Add"
6. App appears on home screen, tap to open
7. Full-screen mode (no Safari chrome)

### On iPad
1. Same as iPhone
2. Orientation auto-detects (portrait/landscape)
3. Full-screen with native app feel
4. App behaves differently in each orientation (see below)

### On Web (Desktop)
1. Visit https://libbynatico.github.io/libby_live/
2. Browser shows "Install" prompt (in Chrome/Edge/Firefox)
3. Click install, app opens in own window
4. Or just use in browser (responsive design)

---

## PWA Files (Already Created)

### `manifest.json`
- App name, icon, colors, orientation settings
- Shortcuts (quick actions from home screen)
- Tells OS: "This is an installable app"

### `sw.js`
- Service worker for offline support
- Caches app shell + API responses
- Network-first for API calls, cache-first for assets
- Enables offline meeting mode

### HTML `<head>` Meta Tags (See index.html)
```html
<!-- PWA Setup -->
<meta name="theme-color" content="#75a7ff">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Libby Live">
<link rel="manifest" href="/libby_live/manifest.json">
<link rel="apple-touch-icon" href="data:image/svg+xml,...">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">

<!-- Viewport for Mobile/Tablet -->
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
```

**Explanation:**
- `apple-mobile-web-app-capable` — Full screen on iOS
- `viewport-fit=cover` — Use full notch/safe area on iPhone X+
- `user-scalable=no` — Prevent pinch zoom (feels more app-like)
- `theme-color` — Status bar color (blue to match app)

---

## Responsive Breakpoints (Handled in CSS)

### Portrait Mobile (< 480px)
- Single column layout
- Sidebar collapses to hamburger menu
- Right chat panel hidden (access via button in header)
- Full-width main content
- Vertical tab navigation

### Landscape Mobile (480px - 768px)
- Two column: sidebar + main
- Right chat panel hidden (toggleable)
- Sidebar narrower
- Horizontal navigation

### iPad Portrait (768px - 1024px)
- Three column: sidebar | main | chat (collapsible)
- Full navigation visible
- Larger tap targets
- Comfortable reading width

### iPad Landscape (1024px+)
- Three column fully visible: sidebar | main | chat
- All features accessible
- Optimal layout for meeting mode
- Large display optimized

### Desktop (1200px+)
- Expanded sidebar
- Full-width main content
- Always-visible right panel
- Maximum information density

---

## Orientation Handling (JavaScript)

```javascript
// Detect orientation changes
window.addEventListener('orientationchange', () => {
  const portrait = window.innerHeight > window.innerWidth;
  
  if (portrait) {
    // Hide right chat panel on mobile portrait
    document.body.classList.add('portrait-mode');
    // Adjust layout
  } else {
    // Show both panels on landscape
    document.body.classList.remove('portrait-mode');
    // Adjust layout
  }
});

// Also handle resize for desktop
window.addEventListener('resize', () => {
  // Same logic
});

// On load
document.addEventListener('DOMContentLoaded', () => {
  window.dispatchEvent(new Event('orientationchange'));
});
```

CSS implementation:
```css
/* Landscape (hide right panel) */
@media (max-width: 768px) and (orientation: portrait) {
  .chat-sidebar {
    display: none;
  }
  .main {
    grid-template-columns: 280px 1fr;
  }
}

/* Landscape (show right panel) */
@media (orientation: landscape) and (max-height: 500px) {
  .app {
    grid-template-columns: 280px 1fr 360px;
  }
  .chat-sidebar {
    display: flex;
  }
}
```

---

## Safe Areas (iPhone Notch/Home Indicator)

CSS handles notch automatically:
```css
body {
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-top: env(safe-area-inset-top);
}

.chat-input {
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
```

This ensures nothing is hidden under notch or home indicator.

---

## Touch Optimizations

### Tap Targets
- All buttons/inputs: minimum 44px × 44px
- Current: record button (44px), send button (44px) ✅
- Navigation buttons: 48px × 48px

### Swipe Gestures
```javascript
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;
  
  // Swipe left: next tab
  if (diff > 50) {
    showNextTab();
  }
  
  // Swipe right: previous tab
  if (diff < -50) {
    showPreviousTab();
  }
});
```

### Visual Feedback
- Pressed states (scale 0.96)
- Long-press menus
- Haptic feedback (vibration) on iOS

---

## Status Bar Styling (iOS)

```html
<!-- Dark status bar (light text) -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- OR light status bar (dark text) -->
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

Current: `black-translucent` (blue theme, light text) ✅

---

## Offline Capability

Service worker (`sw.js`) enables:
1. **App shell caching** — Index.html, CSS, JS loaded once, cached forever
2. **API response caching** — Recent chat responses, meeting notes cached
3. **Offline meeting mode** — Can still view evidence, notes, drafts without internet
4. **Sync on reconnect** — Queues changes, syncs when online

Example: User has weak cellular connection during meeting.
- Evidence loads from cache (fast)
- Notes save to localStorage
- When connection restores, sync happens automatically

---

## Testing Checklist

### iOS iPhone
- [ ] Install to home screen (shows on home screen)
- [ ] Full-screen mode (no Safari chrome)
- [ ] Portrait orientation works
- [ ] Landscape orientation works
- [ ] Status bar color correct (blue)
- [ ] Notch safe area respected
- [ ] Tap targets large enough
- [ ] No pinch zoom

### iPad
- [ ] Install to home screen
- [ ] Portrait: sidebar visible, right panel hidden
- [ ] Landscape: all three panels visible
- [ ] Orientation change smooth
- [ ] Text readable (no zoom needed)
- [ ] Home indicator safe area respected

### Web (Desktop)
- [ ] Install prompt shows (Chrome/Edge)
- [ ] Window mode works
- [ ] Full-screen mode works (F11)
- [ ] Responsive at all widths
- [ ] No horizontal scroll

### Offline
- [ ] App loads without internet
- [ ] Cached data visible
- [ ] New meeting notes save locally
- [ ] API calls queue (when online, send)
- [ ] No errors in console

---

## Device-Specific Layout Strategy

### **iPhone (Portrait)**
```
┌─ Hamburger Menu
│
├─ Header (Libby Live | Settings)
│
├─ Tabs (📊 | 📋 | 🔍 | 👥 | 💬)
│
├─ Content Area (Full Width)
│  (Summary | Timeline | Evidence | etc)
│
└─ Footer (Chat or Task Input)
```

**Orientation change → Landscape:**
```
┌─ Hamburger Menu | Header | Settings
├──────────────────────────────────
│ Sidebar      │ Main Content Area
│ (collapsed)  │
└──────────────────────────────────
```

### **iPad (Landscape)**
```
┌─ Sidebar | Main Content | Chat Panel
│  (280px) | (1fr)        | (360px)
│
├─ Nav:
│ 📊 Dashboard
│ 📋 Situation
│ 🔍 Evidence
│ 👥 Contacts
│ 📧 Correspondence
│
├─ Tabs/Content
│
└─ Chat always visible on right
```

### **iPad (Portrait)**
```
┌─ Sidebar | Main Content
│ (280px)  | (1fr)
│
├─ Chat Panel Hidden
│ (Access via "💬 Chat" button in header)
│
└─ Full content width + safer reading
```

---

## Implementation Checklist

- [ ] `manifest.json` in place (controls app name, icon, orientation)
- [ ] `sw.js` registered in index.html (offline support)
- [ ] Meta tags in `<head>` (viewport, apple-mobile-web-app, theme-color)
- [ ] CSS responsive breakpoints (portrait/landscape handling)
- [ ] JavaScript orientation detection (adapts UI dynamically)
- [ ] Safe area CSS (notch/home indicator)
- [ ] Tap targets ≥ 44px
- [ ] Status bar color matches theme
- [ ] Tested on real iPhone (portrait + landscape)
- [ ] Tested on real iPad (portrait + landscape)
- [ ] Offline mode works (service worker)
- [ ] No console errors
- [ ] Looks native (no browser chrome when installed)

---

## Installation URLs

**For Users:**
- iOS/iPad: Share → "Add to Home Screen" from Safari
  - URL: `https://libbynatico.github.io/libby_live/`
- Desktop: Install prompt or manual install
  - URL: Same as above

**For Developers:**
- Manifest location: `/libby_live/manifest.json`
- Service worker: `/libby_live/sw.js` (registered in index.html)
- Meta tags: `<head>` of `/libby_live/index.html`

---

## Result

When complete:
- User taps home screen icon
- App opens full-screen
- Looks like native app (no address bar, no browser chrome)
- Adapts to device: iPhone portrait → iPad landscape → Desktop web
- Works offline with cached evidence
- Touch-optimized (large buttons, swipes work)
- Status bar matches blue theme
- Notch/home indicator respected

This is production-ready PWA implementation. No app store needed.

