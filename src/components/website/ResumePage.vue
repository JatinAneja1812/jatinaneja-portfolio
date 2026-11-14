<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Download, Menu, X } from "@lucide/vue";
import ResumeIntro from "./ResumeIntro.vue";
import ResumeExperience from "./ResumeExperience.vue";
import ResumeProjects from "./ResumeProjects.vue";
import ThemeToggle from "../shared/ThemeToggle.vue";
import { templateConfig } from "../../config/templateConfig";

gsap.registerPlugin(ScrollTrigger);

const root = ref<HTMLElement | null>(null);
const menuOpen = ref(false);
const activeSection = ref("about");
const activeExperience = ref(0);
const pageProgress = ref(0);

const config = templateConfig;

const resume = computed(() =>
  config.contact.links.find((link) => link.label === "Resume")
);

const github = computed(() =>
  config.contact.links.find((link) => link.label === "GitHub")
);

const linkedin = computed(() =>
  config.contact.links.find((link) => link.label === "LinkedIn")
);

const navigation = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "certificates", label: "Certificates" },
  { id: "projects", label: "Projects" },
];

const currentYear = new Date().getFullYear();

let media: ReturnType<typeof gsap.matchMedia> | undefined;
let sectionObserver: IntersectionObserver | undefined;
let refreshFrame = 0;
let disposed = false;

function closeMenu() {
  menuOpen.value = false;
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape") closeMenu();
}

function skipToMain() {
  const main = root.value?.querySelector<HTMLElement>("#main-content");

  if (!main) return;

  main.focus({ preventScroll: true });
  main.scrollIntoView({
    behavior: "auto",
    block: "start",
  });
}

function refreshLayout() {
  cancelAnimationFrame(refreshFrame);

  refreshFrame = requestAnimationFrame(() => {
    if (!disposed) ScrollTrigger.refresh();
  });
}

onMounted(async () => {
  await nextTick();

  if (disposed || !root.value) return;

  const page = root.value;

  document.addEventListener("keydown", handleEscape);

  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top) -
            Math.abs(b.boundingClientRect.top)
        );

      if (visible[0]) {
        activeSection.value = visible[0].target.id;
      }
    },
    {
      rootMargin: "-15% 0px -55% 0px",
      threshold: 0,
    }
  );

  page
    .querySelectorAll<HTMLElement>("[data-nav-section]")
    .forEach((section) => sectionObserver?.observe(section));

  media = gsap.matchMedia();

  media.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const motion = Boolean(context.conditions?.motion);

      ScrollTrigger.create({
        trigger: page,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          pageProgress.value = self.progress;
        },
      });

      const careerEntries =
        page.querySelectorAll<HTMLElement>(".career-entry");

      careerEntries.forEach((entry, index) => {
        ScrollTrigger.create({
          trigger: entry,
          start: "top 58%",
          end: "bottom 58%",
          onEnter: () => {
            activeExperience.value = index;
          },
          onEnterBack: () => {
            activeExperience.value = index;
          },
        });
      });

      if (!motion) return;

      gsap.from(page.querySelectorAll(".hero-enter"), {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });


      page.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
      });

      const careerTrack =
        page.querySelector<HTMLElement>(".career-track");

      const careerFill =
        page.querySelector<HTMLElement>(".career-fill");

      if (careerTrack && careerFill) {
        gsap.fromTo(
          careerFill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: careerTrack,
              start: "top 58%",
              end: "bottom 58%",
              scrub: 0.6,
            },
          }
        );
      }


    },
    page
  );

  refreshLayout();
  document.fonts?.ready.then(() => {
    if (!disposed) refreshLayout();
  });
});

onUnmounted(() => {
  disposed = true;
  media?.revert();
  sectionObserver?.disconnect();
  cancelAnimationFrame(refreshFrame);
  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <div ref="root" class="portfolio">
    <a
      class="skip-link"
      href="#main-content"
      @click.prevent="skipToMain"
    >
      Skip to content
    </a>

    <div class="reading-progress" aria-hidden="true">
      <div :style="{ transform: `scaleX(${pageProgress})` }"></div>
    </div>

    <header class="portfolio-header">
      <div class="nav-shell">
        <RouterLink
          :to="{ path: '/', hash: '#about' }"
          class="wordmark"
          aria-label="Jatin Aneja home"
          @click="closeMenu"
        >
          ja<span>.</span>
        </RouterLink>

        <nav class="desktop-nav" aria-label="Main navigation">
          <RouterLink
            v-for="item in navigation"
            :key="item.id"
            :to="{ path: '/', hash: `#${item.id}` }"
            :class="{ selected: activeSection === item.id }"
            :aria-current="
              activeSection === item.id ? 'location' : undefined
            "
          >
            {{ item.label }}
          </RouterLink>

          <RouterLink to="/blog">
            Blogs
            <ArrowUpRight :size="13" />
          </RouterLink>
        </nav>
<div class="nav-actions">
  <a
    :href="`mailto:${config.contact.email}`"
    class="nav-contact"
  >
    Let’s talk
    <ArrowUpRight :size="15" aria-hidden="true" />
  </a>

  <ThemeToggle />

  <button
    class="menu-toggle"
    type="button"
    :aria-expanded="menuOpen"
    aria-controls="mobile-navigation"
    :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
    @click="menuOpen = !menuOpen"
  >
    <X v-if="menuOpen" :size="22" aria-hidden="true" />
    <Menu v-else :size="22" aria-hidden="true" />
  </button>
</div>
      </div>

      <nav
        v-if="menuOpen"
        id="mobile-navigation"
        class="mobile-nav"
        aria-label="Mobile navigation"
      >
        <RouterLink
          v-for="item in navigation"
          :key="item.id"
          :to="{ path: '/', hash: `#${item.id}` }"
          @click="closeMenu"
        >
          {{ item.label }}
          <ArrowUpRight :size="17" />
        </RouterLink>

        <RouterLink to="/blog" @click="closeMenu">
          Blogs
          <ArrowUpRight :size="17" />
        </RouterLink>
      </nav>
    </header>

    <main id="main-content" tabindex="-1">
      <ResumeIntro />
      <ResumeExperience :active-experience="activeExperience" />
      <ResumeProjects @refresh-layout="refreshLayout" />

      <!-- CONTACT -->
      <section class="contact-section">
        <div class="section-container contact-inner" data-reveal>
          <p class="eyebrow">Next chapter?</p>
          <h2>
            Let’s build<br />
            <span>something that matters.</span>
          </h2>

          <a
            :href="`mailto:${config.contact.email}`"
            class="contact-link"
          >
            {{ config.contact.email }}
            <ArrowUpRight :size="25" />
          </a>

          <div class="contact-bottom">
            <span>Good conversations are a good place to start.</span>

            <a
              v-if="resume"
              :href="resume.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-link"
            >
              View my CV <Download :size="16" />
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer class="portfolio-footer section-container">
      <span>© {{ currentYear }} {{ config.site.footerName }}</span>

      <div>
        <a
          v-if="github"
          :href="github.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <ArrowUpRight :size="13" />
        </a>

        <a
          v-if="linkedin"
          :href="linkedin.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn <ArrowUpRight :size="13" />
        </a>

        <RouterLink :to="{ path: '/', hash: '#about' }">
          Back to top <ArrowUpRight :size="13" />
        </RouterLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.portfolio {
  --paper: var(--resume-c-f8f9f6, #f8f9f6);
  --ink: var(--resume-c-153a3b, #153a3b);
  --muted: var(--resume-c-617372, #617372);
  --line: var(--resume-c-dce3de, #dce3de);
  --accent: var(--resume-c-d5e6d8, #d5e6d8);
  --peach: var(--resume-c-f1ceb0, #f1ceb0);

  background: var(--paper);
  color: var(--ink);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.65;
  overflow: clip;
}

:where(.portfolio) :deep(*),
:where(.portfolio) :deep(*::before),
:where(.portfolio) :deep(*::after) {
  box-sizing: border-box;
}

:where(.portfolio) :deep(a) {
  color: inherit;
  text-decoration: none;
}

:where(.portfolio) :deep(button) {
  font: inherit;
}

:where(.portfolio) :deep(a:focus-visible),
:where(.portfolio) :deep(button:focus-visible),
:where(.portfolio) :deep(summary:focus-visible) {
  outline: 2px solid var(--resume-c-a75f32, #a75f32);
  outline-offset: 6px;
}

:where(.portfolio) :deep(h1),
:where(.portfolio) :deep(h2),
:where(.portfolio) :deep(h3),
:where(.portfolio) :deep(h4),
:where(.portfolio) :deep(p) {
  margin: 0;
}

:where(.portfolio) :deep(svg) {
  flex-shrink: 0;
}

:deep(.section-container) {
  width: min(1160px, calc(100% - 96px));
  margin-inline: auto;
}

:deep(section[id]) {
  scroll-margin-top: 100px;
}

:deep(.skip-link:not(:focus)) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

:deep(.skip-link:focus) {
  position: fixed;
  top: 12px;
  left: 16px;
  z-index: 200;

  display: inline-block;
  width: auto;
  height: auto;
  margin: 0;
  padding: 12px 18px;

  border-radius: 8px;
  background: var(--ink);
  color: white !important;
  clip-path: none;
}

:deep(#main-content) {
  scroll-margin-top: 85px;
}

:deep(.reading-progress) {
  position: fixed;
  inset: 0 0 auto;
  height: 3px;
  z-index: 110;
  pointer-events: none;
}

:deep(.reading-progress > div) {
  width: 100%;
  height: 100%;
  background: var(--resume-c-739b7d, #739b7d);
  transform-origin: left;
}

:deep(.portfolio-header) {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgb(var(--resume-rgb-21-58-59, 21 58 59) / 8%);
  background: rgb(var(--resume-rgb-248-249-246, 248 249 246) / 88%);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

:deep(.nav-shell) {
  width: min(1280px, calc(100% - 64px));
  min-height: 76px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

:deep(.wordmark) {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.13em;
  line-height: 1;
}

:deep(.wordmark span) {
  color: var(--resume-c-b77a50, #b77a50);
}

:deep(.desktop-nav) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.desktop-nav a) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
  padding: 9px 14px;
  border-radius: 100px;
  color: var(--muted);
  font-size: 0.8rem;
  transition: background 200ms, color 200ms;
}

:deep(.desktop-nav a:hover),
:deep(.desktop-nav a.selected) {
  background: var(--resume-c-e8eee8, #e8eee8);
  color: var(--ink);
}

:deep(.nav-contact) {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8rem;
}

:deep(.menu-toggle) {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

:deep(.mobile-nav) {
  display: grid;
  padding: 8px 24px 24px;
  border-top: 1px solid var(--line);
}

:deep(.mobile-nav a) {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

:deep(.eyebrow) {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 0.66rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

:deep(.mini-dot) {
  display: inline-block;
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--resume-c-6c9977, #6c9977);
  box-shadow: 0 0 0 5px rgb(var(--resume-rgb-108-153-119, 108 153 119) / 10%);
}

:deep(.section-title) {
  margin-top: 18px !important;
  font-size: clamp(2.4rem, 4.8vw, 4rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.065em;
}

:deep(.section-title > span) {
  color: var(--resume-c-87988a, #87988a);
}

:deep(.section-description) {
  max-width: 340px;
  margin-top: 24px !important;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.85;
}

:deep(.section-heading) {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 65px;
}

:deep(.section-heading > p) {
  color: var(--muted);
  font-size: 0.83rem;
}

:deep(.text-link) {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  width: fit-content;
  font-size: 0.76rem;
  font-weight: 500;
}

:deep(.text-link svg:last-child) {
  transition: transform 200ms;
}

:deep(.text-link:hover svg:last-child) {
  transform: translate(2px, -2px);
}

:deep(.contact-section) {
  padding-block: 90px 65px;
  border-top: 1px solid var(--line);
  background: var(--resume-c-e9eee5, #e9eee5);
}

:deep(.contact-inner h2) {
  margin-top: 24px;
  font-size: clamp(2.8rem, 6vw, 5.4rem);
  line-height: 1.08;
  letter-spacing: -0.065em;
  font-weight: 500;
}

:deep(.contact-inner h2 span) {
  color: var(--resume-c-7b907d, #7b907d);
}

:deep(.contact-link) {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  max-width: 100%;
  margin-top: 35px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--resume-c-a5b4a1, #a5b4a1);
  font-size: clamp(1rem, 2vw, 1.5rem);
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
}

:deep(.contact-bottom) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 55px;
  padding-top: 25px;
  border-top: 1px solid var(--resume-c-d1dccd, #d1dccd);
  color: var(--muted);
  font-size: 0.75rem;
}

:deep(.portfolio-footer) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-block: 27px 40px;
  color: var(--muted);
  font-size: 0.68rem;
}

:deep(.portfolio-footer > div) {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
}

:deep(.portfolio-footer a) {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

/* Equal outer columns keep the navigation truly centred. */
.portfolio-header .nav-shell {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    auto
    minmax(0, 1fr);

  align-items: center;
  gap: 20px !important;
}

/* Left column */
.portfolio-header .nav-shell > .wordmark {
  grid-column: 1;
  grid-row: 1;
  justify-self: start;
  margin: 0;
}

/* Centre column */
.portfolio-header .nav-shell > .desktop-nav {
  grid-column: 2;
  grid-row: 1;
  justify-self: center;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 2px;

  margin: 0 !important;
  white-space: nowrap;
}

/* Right column */
.portfolio-header .nav-actions {
  grid-column: 3;
  grid-row: 1;
  justify-self: end;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;

  min-width: 0;
  white-space: nowrap;
}

.portfolio-header .nav-actions > .nav-contact {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 !important;
}

.portfolio-header .nav-actions > :deep(.theme-toggle) {
  flex-shrink: 0;
  margin: 0 !important;
}

.portfolio-header .nav-actions > .menu-toggle {
  display: none;
  flex-shrink: 0;
  margin: 0 !important;
}

/* Use the mobile menu before the centred links become crowded. */
@media (max-width: 900px) {
  .portfolio-header .nav-shell {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 12px !important;
  }

  .portfolio-header .nav-shell > .desktop-nav {
    display: none;
  }

  .portfolio-header .nav-actions {
    grid-column: 2;
    gap: 10px;
  }

  .portfolio-header .nav-actions > .menu-toggle {
    display: inline-flex;
  }
}

@media (max-width: 420px) {
  .portfolio-header .nav-actions > .nav-contact {
    display: none;
  }

  .portfolio-header .nav-actions {
    gap: 6px;
  }
}

@media (max-width: 1050px) {
  :deep(.section-container) {
      width: calc(100% - 64px);
    }
}

@media (max-width: 760px) {
  :deep(.section-container) {
      width: calc(100% - 40px);
    }

  :deep(.nav-shell) {
      width: calc(100% - 40px);
      min-height: 68px;
      gap: 16px;
    }

  :deep(.desktop-nav) {
      display: none;
    }

  :deep(.nav-contact) {
      margin-left: auto;
    }

  :deep(.menu-toggle) {
      display: inline-flex;
    }

  :deep(section[id]) {
      scroll-margin-top: 85px;
    }

  :deep(.section-description) {
      max-width: 500px;
    }

  :deep(.section-heading) {
      align-items: flex-start;
      flex-direction: column;
      gap: 22px;
      margin-bottom: 38px;
    }

  :deep(.section-title) {
      font-size: clamp(2.4rem, 8vw, 3.4rem);
    }

  :deep(.contact-section) {
      padding-block: 65px 45px;
    }

  :deep(.contact-inner h2) {
      font-size: clamp(2.5rem, 9vw, 4rem);
    }

  :deep(.contact-bottom),
  :deep(.portfolio-footer) {
      align-items: flex-start;
      flex-direction: column;
    }

  :deep(.portfolio-footer) {
    
      padding-bottom: 110px;
    }

  :deep(.desktop-break) {
      display: none;
    }

  :deep(.contact-link) {
      gap: 10px;
      font-size: clamp(0.9rem, 4.2vw, 1.2rem);
    }
}

@media (max-width: 420px) {
  :deep(.nav-contact) {
      display: none;
    }

  :deep(.menu-toggle) {
      margin-left: auto;
    }
}

@media (prefers-reduced-motion: reduce) {
  :where(.portfolio) :deep(*),
  :where(.portfolio) :deep(*::before),
  :where(.portfolio) :deep(*::after) {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
}


.portfolio {
  --paper: var(--theme-paper, #f8f9f6);
  --ink: var(--theme-ink, #153a3b);
  --muted: var(--theme-muted, #617372);
  --line: var(--theme-line, #dce3de);
  --surface: var(--theme-surface, #e8eee8);
  --copper: var(--resume-c-b77a50, #b77a50);
}
:deep(.section-title) { font-size: clamp(2rem, 4vw, 3.3rem); }
@media (min-width: 761px) {
  :deep(.desktop-nav) { gap: 2px; }
  :deep(.desktop-nav a) { padding-inline: 10px; font-size: .76rem; }
}
@media (max-width: 900px) and (min-width: 761px) {
  :deep(.nav-contact) { display: none; }
  :deep(.nav-shell) { gap: 10px; }
}

</style>
