<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Github from "../../components/shared/icons/Github.vue";
import Linkedin from "../../components/shared/icons/LinkedIn.vue";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Check,
  Code2,
  Database,
  Download,
  ExternalLink,

  GraduationCap,
  Layers,

  Mail,
  Menu,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  X,
} from "@lucide/vue";
import { templateConfig } from "../../config/templateConfig.js";

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

// Tell the career story chronologically.
const experience = computed(() =>
  [...config.timeline.experience].reverse()
);

const currentExperience = computed(
  () => experience.value[activeExperience.value]
);

const skills = [
  {
    title: "Languages",
    icon: Code2,
    values: config.profile.toolkit.languages,
  },
  {
    title: "Frameworks",
    icon: Layers,
    values: config.profile.toolkit.frameworks,
  },
  {
    title: "Data",
    icon: Database,
    values: config.profile.toolkit.data,
  },
  {
    title: "Delivery & tools",
    icon: Terminal,
    values: config.profile.toolkit.systems,
  },
];

const navigation = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
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

      gsap.from(".hero-enter", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".system-visual", {
        y: 36,
        opacity: 0,
        scale: 0.96,
        duration: 1.3,
        delay: 0.2,
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

      page
        .querySelectorAll<HTMLElement>(".project-art")
        .forEach((art) => {
          const image = art.querySelector("img");

          if (!image) return;

          gsap.fromTo(
            image,
            { yPercent: 4, scale: 0.96 },
            {
              yPercent: -4,
              scale: 1.02,
              ease: "none",
              scrollTrigger: {
                trigger: art,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            }
          );
        });
    },
    page
  );

  refreshLayout();
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

        <a
          :href="`mailto:${config.contact.email}`"
          class="nav-contact"
        >
          Let’s talk <ArrowUpRight :size="15" />
        </a>

        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-navigation"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" :size="22" />
          <Menu v-else :size="22" />
        </button>
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
      <!-- INTRO / ABOUT -->
      <section
        id="about"
        data-nav-section
        class="intro-section section-container"
        aria-labelledby="intro-title"
      >
        <div class="hero-layout">
          <div class="hero-copy">
            <p class="eyebrow hero-enter">
              <span class="status-light"></span>
              Software engineer · United Kingdom
            </p>

            <h1 id="intro-title" class="hero-enter">
              Jatin Aneja<span class="name-dot">.</span>
            </h1>

            <p class="hero-statement hero-enter">
              Built with intention.<br />
              <span>Engineered to last.</span>
            </p>

            <p class="hero-description hero-enter">
              {{ config.profile.intro }}
            </p>

            <p class="hero-secondary hero-enter">
              {{ config.profile.intro2 }}
            </p>

            <div class="hero-actions hero-enter">
              <a
                v-if="resume"
                :href="resume.url"
                target="_blank"
                rel="noopener noreferrer"
                class="button button-dark"
              >
                <Download :size="17" />
                View CV
                <ArrowUpRight :size="16" />
              </a>

              <a
                :href="`mailto:${config.contact.email}`"
                class="button button-outline"
              >
                Let’s connect
                <ArrowUpRight :size="17" />
              </a>
            </div>

            <div class="social-row hero-enter">
              <a
                v-if="github"
                :href="github.url"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
              >
                <Github :size="19" />
              </a>

              <a
                v-if="linkedin"
                :href="linkedin.url"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
              >
                <Linkedin :size="19" />
              </a>

              <a
                :href="`mailto:${config.contact.email}`"
                aria-label="Send an email"
              >
                <Mail :size="19" />
              </a>

              <span>Code. Craft. Continuous learning.</span>
            </div>
          </div>

          <!-- CSS-built illustration: no image download needed -->
          <div
            class="system-visual"
            role="img"
            aria-label="Connected interface, API and data layers, representing full-stack software engineering"
          >
            <div class="visual-grid" aria-hidden="true"></div>
            <div class="visual-orbit orbit-one" aria-hidden="true"></div>
            <div class="visual-orbit orbit-two" aria-hidden="true"></div>

            <div class="visual-caption">
              <span class="mini-dot"></span>
              THE WAY I BUILD
            </div>

            <div class="system-layer layer-interface">
              <div class="layer-icon"><Layers :size="22" /></div>
              <div>
                <span class="layer-label">01 / Interface</span>
                <p>Designed for people.</p>
              </div>
              <span class="layer-tech">React</span>
            </div>

            <div class="system-connector connector-one"></div>

            <div class="system-layer layer-service">
              <div class="layer-icon"><Braces :size="22" /></div>
              <div>
                <span class="layer-label">02 / Services</span>
                <p>Built for complexity.</p>
              </div>
              <span class="layer-tech">.NET</span>
            </div>

            <div class="system-connector connector-two"></div>

            <div class="system-layer layer-data">
              <div class="layer-icon"><Database :size="22" /></div>
              <div>
                <span class="layer-label">03 / Foundation</span>
                <p>Ready to evolve.</p>
              </div>
              <span class="layer-tech">Data</span>
            </div>

            <div class="visual-footer">
              <ShieldCheck :size="15" />
              Security at every layer
            </div>
          </div>
        </div>

        <div class="intro-footer hero-enter">
          <p class="intro-employment">
            <span class="employment-dot" aria-hidden="true"></span>

            <span>
              Currently at
              <a
                href="https://www.tekgem.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                TEKGEM
                <ArrowUpRight :size="14" />
              </a>
            </span>
          </p>

          <RouterLink
            :to="{ path: '/', hash: '#experience' }"
            class="intro-explore"
          >
            Explore my journey
            <ArrowDown :size="16" />
          </RouterLink>
        </div>
      </section>

      <!-- TOOLKIT -->
      <section
        class="toolkit-band"
        aria-labelledby="toolkit-title"
      >
        <div class="section-container toolkit-inner">
          <div class="toolkit-intro" data-reveal>
            <p class="eyebrow">The toolkit</p>
            <h2 id="toolkit-title">
              The right tools.<br />
              The right foundations.
            </h2>
          </div>

          <div class="toolkit-grid">
            <article
              v-for="group in skills"
              :key="group.title"
              class="toolkit-group"
              data-reveal
            >
              <component :is="group.icon" :size="21" />
              <h3>{{ group.title }}</h3>
              <ul>
                <li v-for="skill in group.values" :key="skill">
                  {{ skill }}
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <!-- CAREER TIMELINE -->
      <section
        id="experience"
        data-nav-section
        class="career-section section-container"
        aria-labelledby="career-title"
      >
        <div class="career-intro">
          <div class="career-sticky">
            <p class="eyebrow" data-reveal>Experience / 01</p>
            <h2 id="career-title" class="section-title" data-reveal>
              A little further.<br />
              <span>Every year.</span>
            </h2>

            <p class="section-description" data-reveal>
              From studying computer science to taking ownership of
              production software. A journey built one challenge at a time.
            </p>

            <div class="career-indicator">
              <span class="indicator-label">THE CHAPTER</span>

              <Transition name="chapter" mode="out-in">
                <div :key="currentExperience?.id">
                  <p class="chapter-date">
                    {{ currentExperience?.date }}
                  </p>
                  <p class="chapter-role">
                    {{ currentExperience?.title }}
                  </p>
                </div>
              </Transition>

              <div class="chapter-markers" aria-hidden="true">
                <span
                  v-for="(item, index) in experience"
                  :key="item.id"
                  :class="{ active: index <= activeExperience }"
                ></span>
              </div>
            </div>
          </div>
        </div>

        <div class="career-track">
          <div class="career-line" aria-hidden="true">
            <div class="career-fill"></div>
          </div>

          <article
            v-for="(item, index) in experience"
            :key="item.id"
            class="career-entry"
            :class="{ 'is-current': activeExperience === index }"
          >
            <span class="career-node" aria-hidden="true">
              <span></span>
            </span>

            <div class="career-entry-content" data-reveal>
              <span class="career-date">{{ item.date }}</span>

              <h3>{{ item.title }}</h3>

              <a
                v-if="item.organizationUrl"
                :href="item.organizationUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="organization-link"
              >
                {{ item.organization }}
                <ArrowUpRight :size="14" />
              </a>

              <p v-else class="organization-link">
                {{ item.organization }}
              </p>

              <p class="career-summary">{{ item.summary }}</p>

              <ul class="career-highlights">
                <li
                  v-for="highlight in item.highlights"
                  :key="highlight"
                >
                  <Check :size="15" aria-hidden="true" />
                  <span>{{ highlight }}</span>
                </li>
              </ul>

              <span class="chapter-number">
                CHAPTER {{ String(index + 1).padStart(2, "0") }}
              </span>
            </div>
          </article>
        </div>
      </section>

      <!-- PROJECTS -->
      <section
        id="projects"
        data-nav-section
        class="projects-section"
        aria-labelledby="projects-title"
      >
        <div class="section-container">
          <div class="section-heading" data-reveal>
            <div>
              <p class="eyebrow">Selected work / 02</p>
              <h2 id="projects-title" class="section-title">
                Ideas, made real.
              </h2>
            </div>
            <p>
              A selection of applications, experiments,<br class="desktop-break" />
              and problems I enjoyed solving.
            </p>
          </div>

          <div class="project-list">
            <article
              v-for="(project, index) in config.timeline.projects"
              :key="project.id"
              class="project-showcase"
              :class="{ 'project-reverse': index % 2 === 1 }"
            >
              <div
                class="project-art"
                :class="`project-tone-${index % 3}`"
                data-reveal
              >
                <span class="project-index" aria-hidden="true">
                  {{ String(index + 1).padStart(2, "0") }}
                </span>

                <img
                  v-if="project.images?.length"
                  :src="project.images[0]"
                  :alt="`${project.title} preview`"
                  loading="lazy"
                  decoding="async"
                  @load="refreshLayout"
                />

                <Code2 v-else :size="90" aria-hidden="true" />

                <span class="project-art-label">
                  {{ project.organization }}
                </span>
              </div>

              <div class="project-copy" data-reveal>
                <p class="eyebrow">PROJECT / {{ index + 1 }}</p>
                <h3>{{ project.title }}</h3>
                <p class="project-summary">{{ project.summary }}</p>

                <details
                  v-if="project.highlights?.length"
                  class="project-details"
                  @toggle="refreshLayout"
                >
                  <summary>
                    Engineering details
                    <span aria-hidden="true">+</span>
                  </summary>

                  <ul>
                    <li
                      v-for="highlight in project.highlights"
                      :key="highlight"
                    >
                      {{ highlight }}
                    </li>
                  </ul>
                </details>

                <div class="project-links">
                  <a
                    v-for="link in project.links"
                    :key="link.url"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-link"
                  >
                    <Github :size="17" />
                    {{ link.label }}
                    <ArrowUpRight :size="16" />
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- CURRENT FOCUS -->
      <section class="focus-section">
        <div class="section-container focus-inner" data-reveal>
          <Sparkles :size="26" class="focus-icon" />
          <p class="eyebrow">Always a work in progress</p>
          <h2>
            Curious by nature.<br />
            <span>Learning by building.</span>
          </h2>
          <p>{{ config.profile.currentFocus }}</p>
        </div>
      </section>

      <!-- EDUCATION & COMMUNITY -->
      <section
        class="background-section section-container"
        aria-labelledby="background-title"
      >
        <div class="section-heading" data-reveal>
          <div>
            <p class="eyebrow">Foundations / 04</p>
            <h2 id="background-title" class="section-title">
              Beyond the code.
            </h2>
          </div>
        </div>

        <div class="background-grid">
          <div data-reveal>
            <h3 class="column-heading">
              <GraduationCap :size="21" />
              Education
            </h3>

            <article
              v-for="item in config.timeline.education"
              :key="item.id"
              class="background-item"
            >
              <p class="small-date">{{ item.date }}</p>
              <h4>{{ item.title }}</h4>
              <p class="background-organization">
                {{ item.organization }}
              </p>
              <p>{{ item.summary }}</p>
            </article>
          </div>

          <div data-reveal>
            <h3 class="column-heading">
              <Users :size="21" />
              Leadership & community
            </h3>

            <article
              v-for="item in config.timeline.certificates"
              :key="item.id"
              class="background-item"
            >
              <p class="small-date">{{ item.date }}</p>
              <h4>{{ item.title }}</h4>
              <p class="background-organization">
                {{ item.organization }}
              </p>
              <p>{{ item.summary }}</p>

              <a
                v-if="item.images?.[0]"
                :href="item.images[0]"
                target="_blank"
                rel="noopener noreferrer"
                class="text-link certificate-link"
              >
                View certificate <ExternalLink :size="14" />
              </a>
            </article>
          </div>
        </div>
      </section>

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
/* Keep this design isolated from legacy card styles. */
.portfolio {
  --paper: #f8f9f6;
  --ink: #153a3b;
  --muted: #617372;
  --line: #dce3de;
  --accent: #d5e6d8;
  --peach: #f1ceb0;

  background: var(--paper);
  color: var(--ink);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.65;
  overflow: clip;
}

.portfolio *,
.portfolio *::before,
.portfolio *::after {
  box-sizing: border-box;
}

.portfolio a {
  color: inherit;
  text-decoration: none;
}

.portfolio button {
  font: inherit;
}

.portfolio a:focus-visible,
.portfolio button:focus-visible,
.portfolio summary:focus-visible {
  outline: 2px solid #a75f32;
  outline-offset: 6px;
}

.portfolio h1,
.portfolio h2,
.portfolio h3,
.portfolio h4,
.portfolio p {
  margin: 0;
}

.portfolio svg {
  flex-shrink: 0;
}

.section-container {
  width: min(1160px, calc(100% - 96px));
  margin-inline: auto;
}

section[id] {
  scroll-margin-top: 100px;
}

.skip-link:not(:focus) {
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

.skip-link:focus {
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

#main-content {
  scroll-margin-top: 85px;
}

.reading-progress {
  position: fixed;
  inset: 0 0 auto;
  height: 3px;
  z-index: 110;
  pointer-events: none;
}

.reading-progress > div {
  width: 100%;
  height: 100%;
  background: #739b7d;
  transform-origin: left;
}

.portfolio-header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgb(21 58 59 / 8%);
  background: rgb(248 249 246 / 88%);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.nav-shell {
  width: min(1280px, calc(100% - 64px));
  min-height: 76px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.wordmark {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.13em;
  line-height: 1;
}

.wordmark span {
  color: #b77a50;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.desktop-nav a {
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

.desktop-nav a:hover,
.desktop-nav a.selected {
  background: #e8eee8;
  color: var(--ink);
}

.nav-contact {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 0.8rem;
}

.menu-toggle {
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

.mobile-nav {
  display: grid;
  padding: 8px 24px 24px;
  border-top: 1px solid var(--line);
}

.mobile-nav a {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.eyebrow {
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

.intro-section {
  display: block;
  padding-top: clamp(60px, 7vw, 110px);
}

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  align-items: center;
  gap: 56px;
}

.status-light,
.mini-dot {
  display: inline-block;
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6c9977;
  box-shadow: 0 0 0 5px rgb(108 153 119 / 10%);
}

.intro-section h1 {
  margin-top: 25px;
  font-size: clamp(3.2rem, 5.7vw, 5.2rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.075em;
}

.name-dot {
  color: #b77a50;
}

.hero-statement {
  margin-top: 24px !important;
  font-size: clamp(1.45rem, 2.4vw, 2.15rem);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.045em;
}

.hero-statement > span {
  color: #84978a;
}

.hero-description {
  max-width: 590px;
  margin-top: 26px !important;
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.85;
}

.hero-secondary {
  max-width: 590px;
  margin-top: 14px !important;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 48px;
  padding: 12px 19px;
  border: 1px solid var(--ink);
  border-radius: 8px;
  font-size: 0.8rem;
  transition: transform 200ms, background 200ms;
}

.button:hover {
  transform: translateY(-3px);
}

.button-dark {
  background: var(--ink);
  color: white !important;
}

.button-dark:hover {
  background: #245354;
}

.button-outline:hover {
  background: #e9eee7;
}

.social-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 19px;
  margin-top: 26px;
  color: var(--muted);
}

.social-row a {
  display: inline-flex;
  padding-block: 8px;
  transition: color 200ms, transform 200ms;
}

.social-row a:hover {
  color: var(--ink);
  transform: translateY(-2px);
}

.social-row > span {
  font-size: 0.67rem;
}

.intro-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  width: 100%;
  margin-top: 48px;
  padding-block: 22px;

  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.75rem;
}

.intro-employment {
  display: flex;
  align-items: center;
  gap: 11px;
}

.employment-dot {
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #739b7d;
}

.intro-employment a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 5px;

  color: var(--ink);
  font-weight: 600;
}

.intro-explore {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
}

.intro-explore svg {
  transition: transform 200ms ease;
}

.intro-explore:hover svg {
  transform: translateY(3px);
}

/* Layered engineering illustration */
.system-visual {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 480px;
  overflow: hidden;
  border: 1px solid #e0e7df;
  border-radius: 24px;
  background:
    radial-gradient(ellipse at 70% 20%, #e4ecdf 0%, transparent 60%),
    linear-gradient(145deg, #f0f4ee, #e7eee8);
}

.visual-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(21 58 59 / 4%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(21 58 59 / 4%) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, transparent, black 30%, transparent);
}

.visual-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgb(21 58 59 / 9%);
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(-25deg);
}

.orbit-one {
  width: 440px;
  height: 230px;
}

.orbit-two {
  width: 300px;
  height: 430px;
}

.visual-caption {
  position: absolute;
  top: 28px;
  left: 28px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #637c6c;
  font-family: monospace;
  font-size: 0.64rem;
  letter-spacing: 0.12em;
}

.system-layer {
  position: absolute;
  left: 9%;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 82%;
  padding: 21px 18px;
  border: 1px solid rgb(255 255 255 / 85%);
  border-radius: 13px;
  background: rgb(255 255 255 / 78%);
  box-shadow: 0 14px 35px rgb(29 64 45 / 7%);
  backdrop-filter: blur(8px);
}

.layer-interface {
  top: 102px;
  transform: rotate(-5deg);
  animation: layer-drift-one 7s ease-in-out infinite;
}

.layer-service {
  top: 212px;
  z-index: 3;
  background: var(--ink);
  color: #f1f5ef;
  transform: translateX(12px) rotate(3deg);
  animation: layer-drift-two 8s ease-in-out infinite;
}

.layer-data {
  top: 322px;
  transform: rotate(-3deg);
  animation: layer-drift-one 9s ease-in-out infinite reverse;
}

.layer-icon {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  border-radius: 10px;
  background: rgb(117 151 122 / 12%);
}

.layer-service .layer-icon {
  background: rgb(255 255 255 / 10%);
}

.layer-label {
  font-family: monospace;
  font-size: 0.58rem;
  opacity: 0.65;
}

.system-layer p {
  margin-top: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.layer-tech {
  margin-left: auto;
  font-family: monospace;
  font-size: 0.6rem;
  opacity: 0.65;
}

.system-connector {
  position: absolute;
  left: 50%;
  width: 1px;
  height: 40px;
  background: #8ba18d;
}

.connector-one {
  top: 183px;
}

.connector-two {
  top: 292px;
}

.visual-footer {
  position: absolute;
  bottom: 23px;
  left: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #637c6c;
  font-size: 0.65rem;
}

@keyframes layer-drift-one {
  0%, 100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -7px;
  }
}

@keyframes layer-drift-two {
  0%, 100% {
    translate: 0 0;
  }
  50% {
    translate: 0 7px;
  }
}

/* Toolkit */
.toolkit-band {
  margin-top: 20px;
  background: #edf1eb;
}

.toolkit-inner {
  display: grid;
  grid-template-columns: 1fr 2.2fr;
  gap: 56px;
  padding-block: 58px;
}

.toolkit-intro h2 {
  margin-top: 15px;
  font-size: 1.55rem;
  line-height: 1.3;
  letter-spacing: -0.05em;
  font-weight: 500;
}

.toolkit-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 25px;
}

.toolkit-group > svg {
  color: #718772;
}

.toolkit-group h3 {
  margin-top: 13px;
  font-size: 0.78rem;
  font-weight: 600;
}

.toolkit-group ul {
  display: grid;
  gap: 6px;
  margin: 13px 0 0;
  padding: 0;
  list-style: none;
  color: var(--muted);
  font-size: 0.72rem;
}

/* Timeline */
.career-section {
  display: grid;
  grid-template-columns: 0.95fr 1.25fr;
  align-items: start;
  gap: 100px;
  padding-block: 130px 100px;
}

.career-intro {
  height: 100%;
}

.career-sticky {
  position: sticky;
  top: 145px;
}

.section-title {
  margin-top: 18px !important;
  font-size: clamp(2.4rem, 4.8vw, 4rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.065em;
}

.section-title > span {
  color: #87988a;
}

.section-description {
  max-width: 340px;
  margin-top: 24px !important;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.85;
}

.career-indicator {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.indicator-label,
.chapter-number {
  color: #7c8c80;
  font-family: monospace;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
}

.chapter-date {
  margin-top: 15px !important;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  letter-spacing: -0.055em;
  font-weight: 500;
}

.chapter-role {
  margin-top: 6px !important;
  color: var(--muted);
  font-size: 0.8rem;
}

.chapter-markers {
  display: flex;
  gap: 7px;
  margin-top: 23px;
}

.chapter-markers > span {
  width: 35px;
  height: 3px;
  border-radius: 5px;
  background: #dae2d8;
  transition: background 350ms;
}

.chapter-markers > span.active {
  background: #6d9277;
}

.chapter-enter-active,
.chapter-leave-active {
  transition: opacity 180ms, transform 180ms;
}

.chapter-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.chapter-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.career-track {
  position: relative;
}

.career-line {
  position: absolute;
  top: 16px;
  bottom: 25px;
  left: 8px;
  width: 1px;
  background: var(--line);
}

.career-fill {
  width: 100%;
  height: 100%;
  background: #739b7d;
  transform-origin: top;
}

.career-entry {
  position: relative;
  padding: 0 0 95px 47px;
}

.career-entry:last-child {
  padding-bottom: 25px;
}

.career-node {
  position: absolute;
  top: 8px;
  left: 0;
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  border: 1px solid #b8c7b9;
  border-radius: 50%;
  background: var(--paper);
  transition: border-color 300ms, box-shadow 300ms;
}

.career-node > span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #b8c7b9;
}

.career-entry.is-current .career-node {
  border-color: #739b7d;
  box-shadow: 0 0 0 6px rgb(115 155 125 / 12%);
}

.career-entry.is-current .career-node > span {
  background: #739b7d;
}

.career-date {
  display: inline-block;
  margin-bottom: 17px;
  padding: 5px 10px;
  border: 1px solid var(--line);
  border-radius: 5px;
  color: #637c68;
  font-family: monospace;
  font-size: 0.67rem;
}

.career-entry h3 {
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.035em;
}

.organization-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px !important;
  color: var(--muted) !important;
  font-size: 0.76rem;
}

.career-summary {
  margin-top: 20px !important;
  font-size: 0.88rem;
  line-height: 1.8;
}

.career-highlights {
  display: grid;
  gap: 14px;
  padding: 0;
  margin: 23px 0;
  list-style: none;
}

.career-highlights li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.8;
}

.career-highlights svg {
  margin-top: 4px;
  color: #739b7d;
}

/* Projects */
.projects-section {
  padding-block: 110px;
  background: #eef2ed;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 65px;
}

.section-heading > p {
  color: var(--muted);
  font-size: 0.83rem;
}

.project-list {
  display: grid;
  gap: 95px;
}

.project-showcase {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 65px;
}

.project-reverse {
  grid-template-columns: 1fr 1.2fr;
}

.project-reverse .project-art {
  grid-column: 2;
  grid-row: 1;
}

.project-reverse .project-copy {
  grid-column: 1;
  grid-row: 1;
}

.project-art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  aspect-ratio: 1.2;
  padding: 50px 35px;
  overflow: hidden;
  border: 1px solid rgb(21 58 59 / 5%);
  border-radius: 18px;
}

.project-tone-0 {
  background: linear-gradient(145deg, #dce8dd, #c8d8cd);
}

.project-tone-1 {
  background: linear-gradient(145deg, #eee1d4, #dfd0c1);
}

.project-tone-2 {
  background: linear-gradient(145deg, #d9e3e5, #c8d6dc);
}

.project-art img {
  display: block;
  width: 100%;
  max-height: 330px;
  object-fit: contain;
  border-radius: 7px;
  filter: drop-shadow(0 18px 20px rgb(21 58 59 / 12%));
}

.project-index {
  position: absolute;
  top: 18px;
  left: 22px;
  color: rgb(21 58 59 / 40%);
  font-family: monospace;
  font-size: 0.65rem;
}

.project-art-label {
  position: absolute;
  right: 20px;
  bottom: 18px;
  left: 20px;
  color: rgb(21 58 59 / 60%);
  font-family: monospace;
  font-size: 0.6rem;
  text-align: center;
}

.project-copy h3 {
  margin-top: 19px;
  font-size: clamp(1.6rem, 2.7vw, 2.3rem);
  line-height: 1.15;
  font-weight: 500;
  letter-spacing: -0.05em;
}

.project-summary {
  margin-top: 20px !important;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.85;
}

.project-details {
  margin-top: 23px;
  border-block: 1px solid #d2dcd2;
}

.project-details summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-block: 13px;
  font-size: 0.75rem;
  list-style: none;
  cursor: pointer;
}

.project-details summary::-webkit-details-marker {
  display: none;
}

.project-details summary > span {
  font-size: 1.2rem;
  transition: transform 200ms;
}

.project-details[open] summary > span {
  transform: rotate(45deg);
}

.project-details ul {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 5px 0 20px 17px;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.8;
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 23px;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  width: fit-content;
  font-size: 0.76rem;
  font-weight: 500;
}

.text-link svg:last-child {
  transition: transform 200ms;
}

.text-link:hover svg:last-child {
  transform: translate(2px, -2px);
}

/* Focus */
.focus-section {
  padding-block: 105px;
  background: #173b3b;
  color: #f4f6ee;
  text-align: center;
}

.focus-inner {
  max-width: 800px;
}

.focus-icon {
  margin: 0 auto 20px;
  color: #d9bd9b;
}

.focus-inner .eyebrow {
  justify-content: center;
  color: #a9c1b6;
}

.focus-inner h2 {
  margin-top: 24px;
  font-size: clamp(2.4rem, 5vw, 4.3rem);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.055em;
}

.focus-inner h2 span {
  color: #a2baaa;
}

.focus-inner > p:last-child {
  max-width: 590px;
  margin: 25px auto 0;
  color: #c0cfc6;
  font-size: 0.9rem;
  line-height: 1.85;
}

/* Education */
.background-section {
  padding-block: 65px 110px;
}

.background-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 75px;
}

.column-heading {
  display: flex;
  align-items: center;
  gap: 11px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
  font-size: 0.9rem;
  font-weight: 500;
}

.column-heading svg {
  color: #78917a;
}

.background-item {
  padding-top: 27px;
}

.background-item + .background-item {
  margin-top: 25px;
  border-top: 1px solid var(--line);
}

.small-date {
  color: var(--muted);
  font-family: monospace;
  font-size: 0.67rem;
}

.background-item h4 {
  margin-top: 10px;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.02em;
}

.background-organization {
  margin-top: 6px !important;
  font-size: 0.75rem;
}

.background-item > p:last-of-type {
  margin-top: 14px;
  color: var(--muted);
  font-size: 0.8rem;
  line-height: 1.8;
}

.certificate-link {
  margin-top: 15px;
}

/* Contact */
.contact-section {
  padding-block: 90px 65px;
  border-top: 1px solid var(--line);
  background: #e9eee5;
}

.contact-inner h2 {
  margin-top: 24px;
  font-size: clamp(2.8rem, 6vw, 5.4rem);
  line-height: 1.08;
  letter-spacing: -0.065em;
  font-weight: 500;
}

.contact-inner h2 span {
  color: #7b907d;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  max-width: 100%;
  margin-top: 35px;
  padding-bottom: 10px;
  border-bottom: 1px solid #a5b4a1;
  font-size: clamp(1rem, 2vw, 1.5rem);
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
}

.contact-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 55px;
  padding-top: 25px;
  border-top: 1px solid #d1dccd;
  color: var(--muted);
  font-size: 0.75rem;
}

.portfolio-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-block: 27px 40px;
  color: var(--muted);
  font-size: 0.68rem;
}

.portfolio-footer > div {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
}

.portfolio-footer a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

/* Tablet */
@media (max-width: 1050px) {
  .section-container {
    width: calc(100% - 64px);
  }

  .hero-layout {
    gap: 32px;
    grid-template-columns: 1.2fr 1fr;
  }

  .system-visual {
    height: 450px;
  }

  .system-layer {
    gap: 9px;
    padding-inline: 12px;
  }

  .layer-tech {
    display: none;
  }

  .layer-interface {
    top: 92px;
  }

  .layer-service {
    top: 195px;
  }

  .layer-data {
    top: 298px;
  }

  .toolkit-inner {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .career-section {
    gap: 55px;
  }

  .project-showcase,
  .project-reverse {
    gap: 35px;
    grid-template-columns: 1fr 1fr;
  }

  .background-grid {
    gap: 40px;
  }
}

/* Mobile / small tablet */
@media (max-width: 760px) {
  .section-container {
    width: calc(100% - 40px);
  }

  .nav-shell {
    width: calc(100% - 40px);
    min-height: 68px;
    gap: 16px;
  }

  .desktop-nav {
    display: none;
  }

  .nav-contact {
    margin-left: auto;
  }

  .menu-toggle {
    display: inline-flex;
  }

  section[id] {
    scroll-margin-top: 85px;
  }

  .intro-section {
    padding-top: 50px;
  }

  .intro-section h1 {
    font-size: clamp(3rem, 10vw, 4.4rem);
  }

  .hero-layout {
    grid-template-columns: 1fr;
    gap: 38px;
  }

  .hero-statement {
    font-size: 1.8rem;
  }

  .intro-footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    margin-top: 30px;
    padding-block: 20px;
  }

  .toolkit-inner {
    padding-block: 40px;
  }

  .toolkit-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30px;
  }

  .career-section {
    grid-template-columns: 1fr;
    gap: 45px;
    padding-block: 75px;
  }

  .career-sticky {
    position: static;
  }

  .career-indicator {
    display: none;
  }

  .section-description {
    max-width: 500px;
  }

  .career-entry {
    padding-left: 37px;
    padding-bottom: 55px;
  }

  .career-entry h3 {
    font-size: 1.25rem;
  }

  .projects-section {
    padding-block: 70px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 22px;
    margin-bottom: 38px;
  }

  .section-title {
    font-size: clamp(2.4rem, 8vw, 3.4rem);
  }

  .project-list {
    gap: 60px;
  }

  .project-showcase,
  .project-reverse {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .project-reverse .project-art,
  .project-reverse .project-copy {
    grid-column: auto;
    grid-row: auto;
  }

  .project-art {
    aspect-ratio: 1.25;
  }

  .project-copy h3 {
    font-size: 1.8rem;
  }

  .focus-section {
    padding-block: 75px;
  }

  .background-section {
    padding-block: 40px 75px;
  }

  .background-grid {
    grid-template-columns: 1fr;
    gap: 45px;
  }

  .contact-section {
    padding-block: 65px 45px;
  }

  .contact-inner h2 {
    font-size: clamp(2.5rem, 9vw, 4rem);
  }

  .contact-bottom,
  .portfolio-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .portfolio-footer {
    /* Leave room for the existing floating chat button. */
    padding-bottom: 110px;
  }

  .desktop-break {
    display: none;
  }

  .hero-layout {
    min-width: 0;
  }

  .hero-copy,
  .project-copy,
  .career-entry-content {
    min-width: 0;
  }

  .hero-description,
  .hero-secondary {
    font-size: 0.9rem;
    line-height: 1.8;
    overflow-wrap: break-word;
  }

  .hero-actions .button {
    min-height: 48px;
  }

  .social-row {
    gap: 18px;
  }

  .social-row a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    padding: 0;
  }

  .system-visual {
    height: 390px;
  }

  .layer-interface {
    top: 65px;
  }

  .layer-service {
    top: 160px;
  }

  .layer-data {
    top: 255px;
  }

  .visual-footer {
    bottom: 18px;
  }

  .project-art {
    padding: 40px 22px;
    aspect-ratio: 1.15;
  }

  .project-art img {
    max-height: 280px;
  }

  .career-highlights li {
    font-size: 0.84rem;
  }

  .contact-link {
    gap: 10px;
    font-size: clamp(0.9rem, 4.2vw, 1.2rem);
  }
}

@media (max-width: 420px) {
  .nav-contact {
    display: none;
  }

  .menu-toggle {
    margin-left: auto;
  }

  .hero-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .hero-actions .button {
    width: 100%;
  }

  .social-row > span {
    flex-basis: 100%;
  }

  .layer-tech {
    display: none;
  }
}

@media (max-width: 380px) {
  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .system-layer {
    left: 6%;
    width: 88%;
  }

  .layer-tech {
    display: none;
  }

  .social-row > span {
    flex-basis: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .portfolio *,
  .portfolio *::before,
  .portfolio *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
</style>