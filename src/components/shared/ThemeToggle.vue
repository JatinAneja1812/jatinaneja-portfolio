<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

type Theme = "light" | "dark";
interface NativeTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition(): void;
}
type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => NativeTransition;
};
const dark = ref(false);
const busy = ref(false);
const storageKey = "portfolio-theme";
let disposed = false;
let transition: NativeTransition | null = null;
let animation: Animation | null = null;
let dynamicStyle: HTMLStyleElement | null = null;

function current(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
function sync() { dark.value = current() === "dark"; }
function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try { localStorage.setItem(storageKey, theme); } catch { /* Storage may be disabled. */ }
  window.dispatchEvent(new Event("portfolio-theme-change"));
  sync();
}
function cleanup() {
  animation?.cancel();
  animation = null;
  dynamicStyle?.remove();
  dynamicStyle = null;
  document.documentElement.classList.remove("theme-transition-active");
}
function stop() {
  transition?.skipTransition();
  animation?.cancel();
}
function smooth(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

// function buildTiles(next: Theme) {
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//   const size = Math.max(40, Math.ceil(Math.sqrt(width * height / 400)));
//   const fromTopLeft = next === "light";
//   const originX = fromTopLeft ? 0 : width;
//   const originY = fromTopLeft ? 0 : height;
//   const diagonal = Math.max(2, Math.hypot(width, height));
//   const tiles: { x: number; y: number; w: number; h: number; delay: number }[] = [];
//   for (let y = 0; y < height; y += size) {
//     for (let x = 0; x < width; x += size) {
//       const w = Math.min(size, width - x);
//       const h = Math.min(size, height - y);
//       tiles.push({ x, y, w, h,
//         delay: Math.hypot(x + w / 2 - originX, y + h / 2 - originY) / diagonal * 1050,
//       });
//     }
//   }
//   const duration = 1750;
//   const frames: Keyframe[] = [];
//   // Animate only the mask. Neither snapshot nor its text is translated or scaled.
//   for (let index = 0; index <= 50; index++) {
//     const time = index / 50 * duration;
//     const sizes = tiles.map(tile => {
//       const reveal = smooth((time - tile.delay) / 650);
//       const w = reveal === 0 ? 0 : (tile.w + 1) * reveal;
//       return `${w.toFixed(2)}px ${tile.h + 1}px`;
//     }).join(",");
//     frames.push({ offset: index / 50, maskSize: sizes, webkitMaskSize: sizes });
//   }
//   const images = tiles.map(() => "linear-gradient(#fff,#fff)").join(",");
//   const positions = tiles.map(tile => `${tile.x}px ${tile.y}px`).join(",");
//   const initial = tiles.map(tile => `0px ${tile.h + 1}px`).join(",");
//   const rule = `html.theme-transition-active::view-transition-new(root) {
//     mask-image: ${images}; -webkit-mask-image: ${images};
//     mask-position: ${positions}; -webkit-mask-position: ${positions};
//     mask-size: ${initial}; -webkit-mask-size: ${initial};
//     mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;
//     mask-mode: alpha;
//   }`;
//   return { frames, duration, rule };
// }

function buildTiles(next: Theme) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const size = Math.max(
    40,
    Math.ceil(Math.sqrt((width * height) / 400))
  );

  const fromTopLeft = next === "light";

  const originX = fromTopLeft ? 0 : width;
  const originY = fromTopLeft ? 0 : height;

  const diagonal = Math.max(
    1,
    Math.hypot(width, height)
  );

  const waveDuration = 1050;
  const tileDuration = 750;
  const duration = waveDuration + tileDuration;

  const tiles: {
    x: number;
    y: number;
    w: number;
    h: number;
    delay: number;
  }[] = [];

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      const w = Math.min(size, width - x);
      const h = Math.min(size, height - y);

      const distance = Math.hypot(
        x + w / 2 - originX,
        y + h / 2 - originY
      );

      tiles.push({
        x,
        y,
        w,
        h,
        delay: (distance / diagonal) * waveDuration,
      });
    }
  }

  function tileFrame(time: number) {
    const sizes: string[] = [];
    const positions: string[] = [];

    for (const tile of tiles) {
      const progress = smooth(
        (time - tile.delay) / tileDuration
      );

      // A square grows from its relevant corner.
      const revealWidth = tile.w * progress;
      const revealHeight = tile.h * progress;

      const left = fromTopLeft
        ? tile.x
        : tile.x + tile.w - revealWidth;

      const top = fromTopLeft
        ? tile.y
        : tile.y + tile.h - revealHeight;

      sizes.push(
        `${revealWidth.toFixed(3)}px ` +
        `${revealHeight.toFixed(3)}px`
      );

      positions.push(
        `${left.toFixed(3)}px ${top.toFixed(3)}px`
      );
    }

    return {
      sizes: sizes.join(","),
      positions: positions.join(","),
    };
  }

  const frames: Keyframe[] = [];

  for (let index = 0; index <= 60; index++) {
    const offset = index / 60;
    const frame = tileFrame(offset * duration);

    frames.push({
      offset,
      maskSize: frame.sizes,
      webkitMaskSize: frame.sizes,
      maskPosition: frame.positions,
      webkitMaskPosition: frame.positions,
    });
  }

  const images = tiles
    .map(() => "linear-gradient(#fff,#fff)")
    .join(",");

  const initial = tileFrame(0);

  const rule = `
    html.theme-transition-active::view-transition-new(root) {
      mask-image: ${images};
      -webkit-mask-image: ${images};

      mask-position: ${initial.positions};
      -webkit-mask-position: ${initial.positions};

      mask-size: ${initial.sizes};
      -webkit-mask-size: ${initial.sizes};

      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;

      mask-mode: alpha;
      mask-composite: add;
      -webkit-mask-composite: source-over;
    }
  `;

  return {
    frames,
    duration,
    rule,
  };
}

async function toggle() {
  if (busy.value || document.documentElement.classList.contains("theme-transition-active")) return;
  const next: Theme = current() === "dark" ? "light" : "dark";
  const doc = document as TransitionDocument;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduced || !Element.prototype.animate) {
    apply(next);
    return;
  }
  busy.value = true;
  const useTiles = CSS.supports("mask-image", "linear-gradient(#fff,#fff)");
  const tiles = useTiles ? buildTiles(next) : null;
  try {
    document.documentElement.classList.add("theme-transition-active");
    if (tiles) {
      dynamicStyle = document.createElement("style");
      dynamicStyle.textContent = tiles.rule;
      document.head.append(dynamicStyle);
    }
    transition = doc.startViewTransition(() => {
      if (!disposed) apply(next);
    });
    // Observe rejection even if ready fails (e.g. a resize during capture).
    const finished = transition.finished.catch(() => undefined);
    await transition.ready;
    if (disposed) { transition.skipTransition(); return; }
    if (tiles) {
      animation = document.documentElement.animate(tiles.frames, {
        duration: tiles.duration, easing: "linear", fill: "both",
        pseudoElement: "::view-transition-new(root)",
      });
    } else {
      const x = next === "light" ? 0 : window.innerWidth;
      const y = next === "light" ? 0 : window.innerHeight;
      const radius = Math.hypot(window.innerWidth, window.innerHeight);
      animation = document.documentElement.animate({
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
      }, {
        duration: 1600, easing: "cubic-bezier(.4,0,.2,1)", fill: "both",
        pseudoElement: "::view-transition-new(root)",
      });
    }
    await animation.finished.catch(() => undefined);
    await finished;
  } catch (error) {
    transition?.skipTransition();
    if (!disposed) apply(next);
    console.warn("Native theme animation unavailable; theme changed without animation.", error);
  } finally {
    cleanup();
    transition = null;
    busy.value = false;
  }
}
onMounted(() => {
  let saved: string | null = null;
  try { saved = localStorage.getItem(storageKey); } catch { /* Use system preference. */ }
  const existing = document.documentElement.dataset.theme;
  const initial: Theme = existing === "dark" || existing === "light" ? existing :
    saved === "dark" || saved === "light" ? saved :
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  apply(initial);
  window.addEventListener("portfolio-theme-change", sync);
  window.addEventListener("resize", stop);
});
onUnmounted(() => {
  disposed = true;
  stop();
  cleanup();
  window.removeEventListener("portfolio-theme-change", sync);
  window.removeEventListener("resize", stop);
});
</script>

<template>
  <button type="button" class="theme-toggle" :disabled="busy" :aria-busy="busy"
    :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="dark ? 'Switch to light theme' : 'Switch to dark theme'" @click="toggle">
    <svg v-if="dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20.9 13.1A9 9 0 0 1 10.9 3.1a9 9 0 1 0 10 10Z" />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0; width: 36px; height: 36px; padding: 0;
  border: 0; border-radius: 8px; background: transparent;
  color: var(--theme-muted); cursor: pointer;
  transition: color 180ms ease, background 180ms ease;
}
.theme-toggle svg { width: 16px; height: 16px; }
.theme-toggle:hover { color: var(--theme-ink); background: var(--theme-surface); }
.theme-toggle:focus-visible { outline: 2px solid #b88d6c; outline-offset: 3px; }
.theme-toggle:disabled { cursor: wait; }
@media (pointer: coarse) { .theme-toggle { width: 44px; height: 44px; } }
@media (prefers-reduced-motion: reduce) { .theme-toggle { transition: none; } }
</style>

<style>
:root {
  --theme-paper: #f8f9f6; --theme-ink: #153a3b; --theme-muted: #617372;
  --theme-line: #dce3de; --theme-surface: #e8eee8;
  --resume-c-153a3b: #153a3b;
  --resume-c-173b3b: #173b3b;
  --resume-c-245354: #245354;
  --resume-c-617372: #617372;
  --resume-c-637c68: #637c68;
  --resume-c-637c6c: #637c6c;
  --resume-c-6c9977: #6c9977;
  --resume-c-6d9277: #6d9277;
  --resume-c-718772: #718772;
  --resume-c-739b7d: #739b7d;
  --resume-c-78917a: #78917a;
  --resume-c-7b907d: #7b907d;
  --resume-c-7c8c80: #7c8c80;
  --resume-c-84978a: #84978a;
  --resume-c-87988a: #87988a;
  --resume-c-8ba18d: #8ba18d;
  --resume-c-a2baaa: #a2baaa;
  --resume-c-a5b4a1: #a5b4a1;
  --resume-c-a75f32: #a75f32;
  --resume-c-a9c1b6: #a9c1b6;
  --resume-c-b77a50: #b77a50;
  --resume-c-b8c7b9: #b8c7b9;
  --resume-c-c0cfc6: #c0cfc6;
  --resume-c-c8d6dc: #c8d6dc;
  --resume-c-c8d8cd: #c8d8cd;
  --resume-c-d1dccd: #d1dccd;
  --resume-c-d2dcd2: #d2dcd2;
  --resume-c-d5e6d8: #d5e6d8;
  --resume-c-d9bd9b: #d9bd9b;
  --resume-c-d9e3e5: #d9e3e5;
  --resume-c-dae2d8: #dae2d8;
  --resume-c-dce3de: #dce3de;
  --resume-c-dce8dd: #dce8dd;
  --resume-c-dfd0c1: #dfd0c1;
  --resume-c-e0e7df: #e0e7df;
  --resume-c-e4ecdf: #e4ecdf;
  --resume-c-e7eee8: #e7eee8;
  --resume-c-e8eee8: #e8eee8;
  --resume-c-e9eee5: #e9eee5;
  --resume-c-e9eee7: #e9eee7;
  --resume-c-edf1eb: #edf1eb;
  --resume-c-eee1d4: #eee1d4;
  --resume-c-eef2ed: #eef2ed;
  --resume-c-f0f4ee: #f0f4ee;
  --resume-c-f1ceb0: #f1ceb0;
  --resume-c-f1f5ef: #f1f5ef;
  --resume-c-f4f6ee: #f4f6ee;
  --resume-c-f8f9f6: #f8f9f6;
  --resume-rgb-108-153-119: 108 153 119;
  --resume-rgb-115-155-125: 115 155 125;
  --resume-rgb-117-151-122: 117 151 122;
  --resume-rgb-21-58-59: 21 58 59;
  --resume-rgb-248-249-246: 248 249 246;
  --resume-rgb-255-255-255: 255 255 255;
  --resume-rgb-29-64-45: 29 64 45;
}
:root[data-theme="dark"] {
  --theme-paper: #111318; --theme-ink: #edeae5; --theme-muted: #a9abb3;
  --theme-line: #30333c; --theme-surface: #242832;
  --resume-c-153a3b: #edeae5;
  --resume-c-173b3b: #0c0e12;
  --resume-c-245354: #353b49;
  --resume-c-617372: #a9abb3;
  --resume-c-637c68: #b8bdca;
  --resume-c-637c6c: #b8bdca;
  --resume-c-6c9977: #a6aab7;
  --resume-c-6d9277: #b8bdca;
  --resume-c-718772: #b8bdca;
  --resume-c-739b7d: #aeb5c7;
  --resume-c-78917a: #a6aab7;
  --resume-c-7b907d: #a6aab7;
  --resume-c-7c8c80: #a6aab7;
  --resume-c-84978a: #a6aab7;
  --resume-c-87988a: #a6aab7;
  --resume-c-8ba18d: #a6aab7;
  --resume-c-a2baaa: #b5b8c4;
  --resume-c-a5b4a1: #a6aab7;
  --resume-c-a75f32: #b8bdca;
  --resume-c-a9c1b6: #a4a8b5;
  --resume-c-b77a50: #d6a27e;
  --resume-c-b8c7b9: #252933;
  --resume-c-c0cfc6: #c2c4cc;
  --resume-c-c8d6dc: #252933;
  --resume-c-c8d8cd: #252933;
  --resume-c-d1dccd: #252933;
  --resume-c-d2dcd2: #252933;
  --resume-c-d5e6d8: #282d38;
  --resume-c-d9bd9b: #d4b394;
  --resume-c-d9e3e5: #252933;
  --resume-c-dae2d8: #252933;
  --resume-c-dce3de: #30333c;
  --resume-c-dce8dd: #191c23;
  --resume-c-dfd0c1: #252933;
  --resume-c-e0e7df: #191c23;
  --resume-c-e4ecdf: #191c23;
  --resume-c-e7eee8: #191c23;
  --resume-c-e8eee8: #191c23;
  --resume-c-e9eee5: #191c23;
  --resume-c-e9eee7: #191c23;
  --resume-c-edf1eb: #191c23;
  --resume-c-eee1d4: #191c23;
  --resume-c-eef2ed: #191c23;
  --resume-c-f0f4ee: #191c23;
  --resume-c-f1ceb0: #735541;
  --resume-c-f1f5ef: #191c23;
  --resume-c-f4f6ee: #edeae5;
  --resume-c-f8f9f6: #111318;
  --resume-rgb-108-153-119: 150 157 179;
  --resume-rgb-115-155-125: 150 157 179;
  --resume-rgb-117-151-122: 150 157 179;
  --resume-rgb-21-58-59: 214 218 230;
  --resume-rgb-248-249-246: 17 19 24;
  --resume-rgb-255-255-255: 35 39 49;
  --resume-rgb-29-64-45: 0 0 0;
}
html { background: var(--theme-paper); scrollbar-gutter: stable; }
html.theme-transition-active { scroll-behavior: auto !important; }
html.theme-transition-active::view-transition { pointer-events: auto; }
html.theme-transition-active::view-transition-group(root) { animation: none; }
html.theme-transition-active::view-transition-image-pair(root) { isolation: isolate; }
html.theme-transition-active::view-transition-old(root),
html.theme-transition-active::view-transition-new(root) {
  animation: none; mix-blend-mode: normal; opacity: 1;
  width: 100%; height: 100%; object-fit: fill;
}
html.theme-transition-active::view-transition-old(root) { z-index: 1; }
html.theme-transition-active::view-transition-new(root) { z-index: 2; }
html[data-theme] .app-shell { background: var(--theme-paper); color: var(--theme-ink); }
html[data-theme] .app-footer { border-color: var(--theme-line); color: var(--theme-muted); }
html[data-theme] .site-header {
  --nav-paper: var(--theme-paper); --nav-ink: var(--theme-ink);
  --nav-muted: var(--theme-muted); --nav-line: var(--theme-line);
  background: var(--theme-paper); border-color: var(--theme-line);
}
.nav-shell, .site-nav-shell { gap: 18px !important; }
.nav-shell > .wordmark, .site-nav-shell > .site-wordmark { order: 0; }
.nav-shell > .desktop-nav, .site-nav-shell > .site-desktop-nav { order: 1; margin-inline: auto; }
.nav-shell > .nav-contact, .site-nav-shell > .site-nav-contact { order: 2; margin-left: 0 !important; }
.nav-shell > .theme-toggle, .site-nav-shell > .theme-toggle { order: 3; margin-left: 0 !important; }
.nav-shell > .menu-toggle, .site-nav-shell > .site-menu-toggle { order: 4; margin-left: 0 !important; }
@media (max-width: 760px) {
  .nav-shell, .site-nav-shell { gap: 8px !important; }
  .nav-shell > .nav-contact, .site-nav-shell > .site-nav-contact { margin-left: auto !important; }
}
@media (max-width: 420px) {
  .nav-shell > .theme-toggle, .site-nav-shell > .theme-toggle { margin-left: auto !important; }
}
html[data-theme="dark"] .portfolio-header { background: rgb(17 19 24 / 94%); border-color: var(--theme-line); }
html[data-theme="dark"] .portfolio .layer-service,
html[data-theme="dark"] .portfolio .button-dark,
html[data-theme="dark"] .portfolio .skip-link:focus { background: #343a49; color: #f0ede7 !important; }
html[data-theme="dark"] .desktop-nav a:hover,
html[data-theme="dark"] .desktop-nav a.selected,
html[data-theme="dark"] .site-desktop-nav a:hover,
html[data-theme="dark"] .site-desktop-nav a.is-selected,
html[data-theme="dark"] .site-menu-toggle:hover { background: var(--theme-surface); color: var(--theme-ink); }
html[data-theme="dark"] .blog-section {
  --paper: var(--theme-paper); --ink: var(--theme-ink);
  --muted: var(--theme-muted); --line: var(--theme-line);
  background: var(--theme-paper); color: var(--theme-ink);
}
html[data-theme="dark"] .blog-card { background: #191c23; border-color: var(--theme-line); }
html[data-theme="dark"] .blog-media,
html[data-theme="dark"] .blog-state code { background: var(--theme-surface); }
html[data-theme="dark"] .robot-speech,
html[data-theme="dark"] .robot-controls,
html[data-theme="dark"] .robot-restore { background: #191c23; color: var(--theme-ink); border-color: var(--theme-line); }
html[data-theme="dark"] .robot-controls button { background: var(--theme-surface); color: var(--theme-ink); }
</style>
