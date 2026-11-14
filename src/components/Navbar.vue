<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { ArrowUpRight, Menu, X } from "@lucide/vue";
import { templateConfig } from "../config/templateConfig";
import ThemeToggle from "./shared/ThemeToggle.vue";

const route = useRoute();
const menuOpen = ref(false);

const navigation = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];

function closeMenu() {
  menuOpen.value = false;
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape") closeMenu();
}

function isSectionActive(id: string) {
  return route.path === "/" && route.hash === `#${id}`;
}

watch(
  () => route.fullPath,
  () => closeMenu()
);

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <header class="site-header">
    <div class="site-nav-shell">
      <RouterLink
        :to="{ path: '/', hash: '#resume-website' }"
        class="site-wordmark"
        aria-label="Jatin Aneja home"
        @click="closeMenu"
      >
        ja<span>.</span>
      </RouterLink>

      <nav class="site-desktop-nav" aria-label="Main navigation">
        <RouterLink
          v-for="item in navigation"
          :key="item.id"
          :to="{ path: '/', hash: `#${item.id}` }"
          :class="{ 'is-selected': isSectionActive(item.id) }"
          :aria-current="
            isSectionActive(item.id) ? 'location' : undefined
          "
        >
          {{ item.label }}
        </RouterLink>

        <RouterLink
          to="/blog"
          class="site-blog-link"
          active-class="is-selected"
        >
          Blogs
          <ArrowUpRight :size="13" aria-hidden="true" />
        </RouterLink>
      </nav>
      <ThemeToggle />
      <a
        :href="`mailto:${templateConfig.contact.email}`"
        class="site-nav-contact"
      >
        Let’s talk
        <ArrowUpRight :size="15" aria-hidden="true" />
      </a>

      <button
        class="site-menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="site-mobile-navigation"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" :size="22" aria-hidden="true" />
        <Menu v-else :size="22" aria-hidden="true" />
      </button>
    </div>

    <nav
      v-if="menuOpen"
      id="site-mobile-navigation"
      class="site-mobile-nav"
      aria-label="Mobile navigation"
    >
      <RouterLink
        v-for="item in navigation"
        :key="item.id"
        :to="{ path: '/', hash: `#${item.id}` }"
        :class="{ 'is-selected': isSectionActive(item.id) }"
        :aria-current="
          isSectionActive(item.id) ? 'location' : undefined
        "
        @click="closeMenu"
      >
        {{ item.label }}
        <ArrowUpRight :size="17" aria-hidden="true" />
      </RouterLink>

      <RouterLink
        to="/blog"
        active-class="is-selected"
        @click="closeMenu"
      >
        Blogs
        <ArrowUpRight :size="17" aria-hidden="true" />
      </RouterLink>

      <a
        :href="`mailto:${templateConfig.contact.email}`"
        @click="closeMenu"
      >
        Let’s talk
        <ArrowUpRight :size="17" aria-hidden="true" />
      </a>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  --nav-paper: #f8f9f6;
  --nav-ink: #153a3b;
  --nav-muted: #617372;
  --nav-line: #dce3de;

  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;

  border-bottom: 1px solid rgb(21 58 59 / 8%);
  background: rgb(248 249 246 / 92%);
  color: var(--nav-ink);

  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.65;

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.site-header *,
.site-header *::before,
.site-header *::after {
  box-sizing: border-box;
}

.site-header a {
  color: inherit;
  text-decoration: none;
}

.site-header a:focus-visible,
.site-header button:focus-visible {
  outline: 2px solid #a75f32;
  outline-offset: 5px;
}

.site-nav-shell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  width: min(1280px, calc(100% - 64px));
  min-height: 76px;
  margin-inline: auto;
}

.site-wordmark {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;

  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.13em;
  line-height: 1;
}

.site-wordmark span {
  color: #b77a50;
}

.site-desktop-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.site-desktop-nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 44px;
  padding: 9px 14px;
  border-radius: 100px;

  color: var(--nav-muted);
  font-size: 0.8rem;
  font-weight: 400;

  transition:
    background 200ms ease,
    color 200ms ease;
}

.site-desktop-nav a:hover,
.site-desktop-nav a.is-selected {
  background: #e8eee8;
  color: var(--nav-ink);
}

.site-blog-link svg,
.site-nav-contact svg {
  transition: transform 200ms ease;
}

.site-blog-link:hover svg,
.site-nav-contact:hover svg {
  transform: translate(2px, -2px);
}

.site-nav-contact {
  display: inline-flex;
  align-items: center;
  gap: 12px;

  min-height: 44px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.site-menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 44px;
  height: 44px;
  padding: 0;

  border: 1px solid var(--nav-line);
  border-radius: 50%;
  background: transparent;
  color: var(--nav-ink);

  font: inherit;
  cursor: pointer;

  transition:
    background 200ms ease,
    border-color 200ms ease;
}

.site-menu-toggle:hover {
  border-color: #b8c7b9;
  background: #e8eee8;
}

.site-mobile-nav {
  display: none;
}

@media (max-width: 760px) {
  .site-nav-shell {
    width: calc(100% - 40px);
    min-height: 68px;
    gap: 16px;
  }

  .site-desktop-nav {
    display: none;
  }

  .site-nav-contact {
    margin-left: auto;
  }

  .site-menu-toggle {
    display: inline-flex;
  }

  .site-mobile-nav {
    display: grid;
    padding: 8px 20px 24px;
    border-top: 1px solid var(--nav-line);
    background: var(--nav-paper);
  }

  .site-mobile-nav a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    min-height: 52px;
    padding: 14px 0;
    border-bottom: 1px solid var(--nav-line);

    color: var(--nav-muted);
    font-size: 0.9rem;

    transition: color 200ms ease;
  }

  .site-mobile-nav a:hover,
  .site-mobile-nav a.is-selected {
    color: var(--nav-ink);
  }

  .site-mobile-nav a.is-selected {
    font-weight: 600;
  }
}

@media (max-width: 420px) {
  .site-nav-contact {
    display: none;
  }

  .site-menu-toggle {
    margin-left: auto;
  }
}

@media (min-width: 761px) {
  .site-mobile-nav {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header *,
  .site-header *::before,
  .site-header *::after {
    transition: none !important;
  }
}
</style>