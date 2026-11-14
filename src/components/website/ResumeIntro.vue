<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import Github from "../shared/icons/Github.vue";
import Linkedin from "../shared/icons/LinkedIn.vue";
import { ArrowDown, ArrowUpRight, Braces, Code2, Database, Download, Layers, Mail, ShieldCheck, Terminal } from "@lucide/vue";
import { templateConfig } from "../../config/templateConfig";
import "devicon/devicon.min.css";
import deviconCatalog from "devicon/devicon.json";
import profilepic from "../../assets/profilepic.png";

const config = templateConfig;
const photoFailed = ref(false);
const photoSrc = profilepic;
const profileDialog = ref<HTMLDialogElement | null>(null);
const profileOpen = ref(false);
const portraitHovered = ref(false);
const suppressPortraitHover = ref(false);
const profileOpenedByPointer = ref(false);

function handlePortraitEnter() {
  if (!suppressPortraitHover.value && !profileOpen.value) portraitHovered.value = true;
}
function handlePortraitLeave() {
  portraitHovered.value = false;
  suppressPortraitHover.value = false;
}
function handlePortraitKeyboard() { profileOpenedByPointer.value = false; }
function openProfile(event: MouseEvent) {
  const dialog = profileDialog.value;
  if (photoFailed.value || !dialog || dialog.open) return;
  profileOpenedByPointer.value = event.detail > 0;
  portraitHovered.value = false;
  dialog.showModal();
  profileOpen.value = true;
}
function closeProfile() { profileDialog.value?.close(); }
function handleProfileClosed() {
  profileOpen.value = false;
  portraitHovered.value = false;
  suppressPortraitHover.value = true;
}
function handleProfileBackdrop(event: MouseEvent) {
  const dialog = profileDialog.value;
  if (!dialog || event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) closeProfile();
}

const resume = computed(() =>
  config.contact.links.find((link) => link.label === "Resume")
);

const github = computed(() =>
  config.contact.links.find((link) => link.label === "GitHub")
);

const linkedin = computed(() =>
  config.contact.links.find((link) => link.label === "LinkedIn")
);


const toolkit = config.profile.toolkit as typeof config.profile.toolkit & { domains?: readonly string[] };
function unique(values: readonly string[]) {
  const seen = new Set<string>();
  return values.filter(value => {
    const key = value.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
const skills = computed(() => [
  { title: "Languages", icon: Code2, values: unique([...toolkit.languages, "TypeScript"]) },
  { title: "Frameworks", icon: Layers, values: unique([...toolkit.frameworks, "Vue"]) },
  { title: "Data", icon: Database, values: unique([...toolkit.data, "SQLite"]) },
  { title: "Delivery & tools", icon: Terminal, values: unique([...toolkit.systems, "CI/CD", "Postman", "Git"]) },
  { title: "Architecture & domains", icon: ShieldCheck, values: unique([...(toolkit.domains ?? []), "IT/OT", "Microservices", "Cybersecurity", "AI / ML"]) },
]);

type DeviconEntry = { name: string; versions: { font?: string[] } };
const installedIcons = new Map<string, DeviconEntry>(
  (deviconCatalog as DeviconEntry[]).map(icon => [icon.name, icon])
);
const technologyNames: Record<string, string[]> = {
  "c#": ["csharp"], csharp: ["csharp"], java: ["java"], python: ["python"],
  javascript: ["javascript"], typescript: ["typescript"], powershell: ["powershell"],
  ".net core": ["dotnetcore", "dot-net"], ".net": ["dot-net", "dotnetcore"],
  "react js": ["react"], react: ["react"], reactjs: ["react"],
  vue: ["vuejs"], "vue.js": ["vuejs"], vuejs: ["vuejs"],
  "android (jetpack compose)": ["jetpackcompose", "android"],
  "jetpack compose": ["jetpackcompose", "android"], android: ["android"],
  mysql: ["mysql"], firebase: ["firebase"], mongodb: ["mongodb"],
  postgresql: ["postgresql"], postgres: ["postgresql"], sqlite: ["sqlite"],
  "vs & vs code": ["visualstudio", "vscode"], "visual studio": ["visualstudio"],
  "vs code": ["vscode"], vscode: ["vscode"], postman: ["postman"],
  "azure devops": ["azuredevops"], "grafana k6": ["k6"],
  k6: ["k6"], grafana: ["grafana"], git: ["git"],
};
function deviconClass(name: string): string | null {
  const entry = installedIcons.get(name);
  if (!entry) return null;
  const variants = entry.versions.font ?? [];
  const variant = ["plain", "original", "line"].find(candidate => variants.includes(candidate));
  return variant ? `devicon-${name}-${variant}` : null;
}
function technologyIcons(label: string): string[] {
  const key = label.trim().toLowerCase();
  const candidates = technologyNames[key] ?? [];
  if (key === "vs & vs code") return candidates.map(deviconClass).filter((icon): icon is string => icon !== null);
  for (const candidate of candidates) {
    const icon = deviconClass(candidate);
    if (icon) return [icon];
  }
  return [];
}

const quotes = [
  { first: "Built with intention.", second: "Engineered to last." },
  { first: "Code. Craft.", second: "Continuous learning." },
  { first: "Curious by nature.", second: "Learning by building." },
];
const quoteIndex = ref(0);
const currentQuote = computed(() => quotes[quoteIndex.value]!);
let quoteTimer: ReturnType<typeof setInterval> | undefined;
let quoteQueue: number[] = [];
function nextQuote() {
  if (document.hidden || profileDialog.value?.open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!quoteQueue.length) {
    quoteQueue = quotes.map((_, index) => index).filter(index => index !== quoteIndex.value);
    for (let i = quoteQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const value = quoteQueue[i]!;
      quoteQueue[i] = quoteQueue[j]!;
      quoteQueue[j] = value;
    }
  }
  quoteIndex.value = quoteQueue.shift()!;
}
onMounted(() => { quoteTimer = setInterval(nextQuote, 5200); });
onUnmounted(() => { clearInterval(quoteTimer); closeProfile(); });

const particles = Array.from({ length: 24 }, (_, id) => {
  const edge = Math.floor(id / 6);
  const position = 9 + id % 6 * 16;
  const distance = 38 + id % 4 * 9;
  return { id, style: {
    left: `${edge === 2 ? 0 : edge === 3 ? 100 : position}%`,
    top: `${edge === 0 ? 0 : edge === 1 ? 100 : position}%`,
    "--dx": `${edge === 2 ? -distance : edge === 3 ? distance : (id % 3 - 1) * 12}px`,
    "--dy": `${edge === 0 ? -distance : edge === 1 ? distance : (id % 3 - 1) * 12}px`,
    "--delay": `${-id * .23}s`,
    "--duration": `${2.2 + id % 4 * .25}s`,
  }};
});
</script>

<template>
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

              <div class="intro-identity hero-enter">
    <h1 id="intro-title">Jatin Aneja<span class="name-dot">.</span></h1>
    <div class="portrait-frame"
      :class="{ 'is-photo-hovered': portraitHovered && !profileOpen && !photoFailed, 'is-pointer-opened': profileOpenedByPointer, 'is-photo-unavailable': photoFailed }"
      @pointerenter="handlePortraitEnter" @pointerleave="handlePortraitLeave" @click="openProfile">
      <span v-for="particle in particles" :key="particle.id" class="portrait-particle" :style="particle.style" aria-hidden="true"></span>
      <button type="button" class="portrait-image portrait-trigger" :disabled="photoFailed"
        aria-label="Enlarge profile photograph" aria-haspopup="dialog" :aria-expanded="profileOpen"
        aria-controls="profile-photo-dialog" title="Click to enlarge"
        @keydown="handlePortraitKeyboard" @click.stop="openProfile">
        <img v-if="!photoFailed" :src="photoSrc" alt="Jatin Aneja" width="88" height="100" decoding="async" @error="photoFailed = true" />
        <span v-else class="portrait-fallback" aria-label="Jatin Aneja initials">ja<span>.</span></span>
      </button>
      <span class="portrait-corner corner-tl" aria-hidden="true"></span>
      <span class="portrait-corner corner-br" aria-hidden="true"></span>
    </div>
  </div>

              <p class="hero-statement hero-enter" aria-live="off">
    <Transition name="tagline" mode="out-in">
      <span :key="quoteIndex" class="tagline-block">
        <span class="tagline-first">{{ currentQuote.first }}</span>
        <span class="tagline-second">{{ currentQuote.second }}</span>
      </span>
    </Transition>
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
              class="system-visual hero-enter"
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
  <section class="toolkit-band" aria-labelledby="toolkit-title">
    <div class="section-container toolkit-inner">
      <div class="toolkit-intro" data-reveal>
        <p class="eyebrow">My working toolkit</p>
        <h2 id="toolkit-title">Ideas to interfaces.<br />Systems to delivery.</h2>
        <p class="toolkit-caption">The technologies, tools and domains I work with.</p>
      </div>
      <div class="toolkit-grid">
        <article v-for="group in skills" :key="group.title" class="toolkit-group" data-reveal>
          <div class="toolkit-group-heading">
            <component :is="group.icon" :size="17" aria-hidden="true" />
            <h3>{{ group.title }}</h3><span>{{ String(group.values.length).padStart(2, '0') }}</span>
          </div>
          <ul class="skill-chips">
            <li v-for="skill in group.values" :key="skill" class="skill-chip">
              <span v-if="technologyIcons(skill).length" class="skill-brand-icons" aria-hidden="true">
                <i v-for="iconClass in technologyIcons(skill)" :key="iconClass" :class="iconClass"></i>
              </span>
              <component :is="group.icon" v-else class="skill-generic-icon" :size="15" aria-hidden="true" />
              <span>{{ skill }}</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <Teleport to="body">
    <dialog id="profile-photo-dialog" ref="profileDialog" class="profile-dialog"
      aria-labelledby="profile-dialog-title" @click="handleProfileBackdrop" @close="handleProfileClosed">
      <button type="button" class="profile-dialog-close" aria-label="Close enlarged photograph" autofocus @click="closeProfile">×</button>
      <img class="profile-dialog-photo" :src="photoSrc" alt="Jatin Aneja — enlarged portrait" />
      <div class="profile-dialog-caption"><span id="profile-dialog-title">Jatin Aneja</span><span>Software engineer</span></div>
    </dialog>
  </Teleport>
</template>

<style scoped>
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
  background: var(--resume-c-6c9977, #6c9977);
  box-shadow: 0 0 0 5px rgb(var(--resume-rgb-108-153-119, 108 153 119) / 10%);
}

.intro-section h1 {
  margin-top: 25px;
  font-size: clamp(3.2rem, 5.7vw, 5.2rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.075em;
}

.name-dot {
  color: var(--resume-c-b77a50, #b77a50);
}

.hero-statement {
  margin-top: 24px !important;
  font-size: clamp(1.45rem, 2.4vw, 2.15rem);
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.045em;
}

.hero-statement > span {
  color: var(--resume-c-84978a, #84978a);
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
  background: var(--resume-c-245354, #245354);
}

.button-outline:hover {
  background: var(--resume-c-e9eee7, #e9eee7);
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
  background: var(--resume-c-739b7d, #739b7d);
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

.system-visual {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 480px;
  overflow: hidden;
  border: 1px solid var(--resume-c-e0e7df, #e0e7df);
  border-radius: 24px;
  background:
    radial-gradient(ellipse at 70% 20%, var(--resume-c-e4ecdf, #e4ecdf) 0%, transparent 60%),
    linear-gradient(145deg, var(--resume-c-f0f4ee, #f0f4ee), var(--resume-c-e7eee8, #e7eee8));
}

.visual-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(var(--resume-rgb-21-58-59, 21 58 59) / 4%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--resume-rgb-21-58-59, 21 58 59) / 4%) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, transparent, black 30%, transparent);
}

.visual-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgb(var(--resume-rgb-21-58-59, 21 58 59) / 9%);
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
  color: var(--resume-c-637c6c, #637c6c);
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
  border: 1px solid rgb(var(--resume-rgb-255-255-255, 255 255 255) / 85%);
  border-radius: 13px;
  background: rgb(var(--resume-rgb-255-255-255, 255 255 255) / 78%);
  box-shadow: 0 14px 35px rgb(var(--resume-rgb-29-64-45, 29 64 45) / 7%);
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
  color: var(--resume-c-f1f5ef, #f1f5ef);
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
  background: rgb(var(--resume-rgb-117-151-122, 117 151 122) / 12%);
}

.layer-service .layer-icon {
  background: rgb(var(--resume-rgb-255-255-255, 255 255 255) / 10%);
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
  background: var(--resume-c-8ba18d, #8ba18d);
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
  color: var(--resume-c-637c6c, #637c6c);
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

.toolkit-band {
  margin-top: 20px;
  background: var(--resume-c-edf1eb, #edf1eb);
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
  color: var(--resume-c-718772, #718772);
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

@media (max-width: 1050px) {
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
}

@media (max-width: 760px) {
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

  .hero-layout {
      min-width: 0;
    }

  .hero-copy {
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
}

@media (max-width: 420px) {
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

.intro-identity { display: flex; align-items: center; gap: 24px; margin-top: 25px; }
.intro-identity h1 { margin: 0 !important; font-size: clamp(2.8rem, 4.4vw, 4.3rem); }
.portrait-frame { --particle-color: #111; order: -1; position: relative; flex-shrink: 0; width: 88px; padding: 4px; border: 1px solid var(--line); border-radius: 13px; overflow: visible; }
.portrait-image { position: relative; display: grid; place-items: center; width: 100%; aspect-ratio: 22 / 25; overflow: hidden; border-radius: 9px; background: var(--surface, var(--theme-surface, #e8eee8)); }
.portrait-image img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; filter: grayscale(100%) contrast(1.12) brightness(1.06); }
.portrait-trigger { margin: 0; padding: 0; border: 0; font: inherit; color: inherit; }
.portrait-fallback { display: flex; color: var(--ink); font-size: 2rem; font-weight: 700; letter-spacing: -.12em; }
.portrait-fallback > span { color: var(--copper, #b77a50); }
.portrait-corner { position: absolute; width: 11px; height: 11px; border-color: var(--copper, #b77a50); border-style: solid; pointer-events: none; }
.corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; border-radius: 10px 0 0; }
.corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-radius: 0 0 10px; }
.portrait-particle { position: absolute; z-index: 2; width: 2px; height: 2px; border-radius: 50%; background: var(--particle-color); opacity: 0; pointer-events: none; box-shadow: 0 0 2px var(--particle-color); animation: portrait-emit var(--duration) linear infinite; animation-delay: var(--delay); }
@keyframes portrait-emit {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(.5); }
  12% { opacity: .8; }
  55% { opacity: .5; }
  90%, 100% { opacity: 0; transform: translate(calc(-50% + var(--dx) * .7), calc(-50% + var(--dy) * .7)) scale(.2); }
}
/* No focus-within glow: pointer and keyboard states are handled separately. */
.intro-identity > .portrait-frame { border-color: var(--line); box-shadow: none; cursor: pointer !important; transition: border-color 180ms ease, box-shadow 180ms ease; }
.intro-identity > .portrait-frame .portrait-trigger,
.intro-identity > .portrait-frame .portrait-trigger img,
.intro-identity > .portrait-frame .portrait-fallback,
.intro-identity > .portrait-frame .portrait-fallback span { cursor: pointer !important; }
.intro-identity > .portrait-frame .portrait-particle,
.intro-identity > .portrait-frame .portrait-corner { pointer-events: none; }
@media (hover: hover) {
  .intro-identity > .portrait-frame.is-photo-hovered { border-color: var(--ink); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ink) 12%, transparent), 0 6px 18px rgb(0 0 0 / 12%); }
  .intro-identity > .portrait-frame.is-photo-hovered .portrait-corner { border-color: var(--ink); }
}
.intro-identity > .portrait-frame.is-pointer-opened .portrait-trigger:focus,
.intro-identity > .portrait-frame.is-pointer-opened .portrait-trigger:focus-visible { outline: none !important; }
.intro-identity > .portrait-frame:not(.is-pointer-opened) .portrait-trigger:focus-visible { outline: 2px solid var(--ink); outline-offset: 5px; }
.intro-identity > .portrait-frame.is-photo-unavailable,
.intro-identity > .portrait-frame.is-photo-unavailable .portrait-trigger,
.intro-identity > .portrait-frame.is-photo-unavailable .portrait-fallback,
.intro-identity > .portrait-frame.is-photo-unavailable .portrait-fallback span { cursor: default !important; }
.hero-statement { min-height: 2.6em; }
.hero-statement > .tagline-block { display: block; color: var(--ink); }
.tagline-first, .tagline-second { display: block; }
.tagline-second { color: var(--muted); }
.tagline-enter-active, .tagline-leave-active { transition: opacity 260ms ease, transform 260ms ease; }
.tagline-enter-from { opacity: 0; transform: translateY(7px); }
.tagline-leave-to { opacity: 0; transform: translateY(-7px); }
.toolkit-band { margin-top: 12px; padding-block: 42px; border-block: 1px solid var(--line); background: var(--paper); }
.toolkit-inner { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 42px; padding-block: 0; }
.toolkit-intro h2 { margin-top: 14px; font-size: 1.5rem; font-weight: 500; line-height: 1.3; letter-spacing: -.045em; }
.toolkit-caption { max-width: 220px; margin-top: 14px !important; color: var(--muted); font-size: .76rem; line-height: 1.8; }
.toolkit-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; min-width: 0; }
.toolkit-group { min-width: 0; padding: 16px; border: 1px solid var(--line); border-radius: 13px; background: var(--paper); }
.toolkit-group:last-child { grid-column: 1 / -1; }
.toolkit-group-heading { display: flex; align-items: center; gap: 9px; color: var(--muted); }
.toolkit-group-heading > svg { color: var(--copper, #b77a50); }
.toolkit-group-heading h3 { margin: 0; color: var(--ink); font-size: .75rem; font-weight: 600; }
.toolkit-group-heading > span { margin-left: auto; font-family: monospace; font-size: .6rem; }
.toolkit-group .skill-chips { display: flex; flex-wrap: wrap; gap: 7px; padding: 0; margin: 13px 0 0; list-style: none; }
.skill-chips li { display: inline-flex; align-items: center; gap: 7px; min-height: 30px; padding: 5px 9px; border: 1px solid var(--line); border-radius: 7px; color: var(--ink); font-size: .67rem; line-height: 1.4; transition: border-color 180ms, transform 180ms; }
.skill-brand-icons { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; gap: 5px; color: var(--ink); line-height: 1; }
.skill-brand-icons i { display: inline-block; font-size: 16px; line-height: 1; }
.skill-generic-icon { flex-shrink: 0; color: var(--muted); }
@media (hover: hover) { .skill-chips li:hover { border-color: var(--copper, #b77a50); transform: translateY(-2px); } }
@media (max-width: 1100px) and (min-width: 901px) { .hero-layout { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 28px; } .intro-identity { gap: 16px; } .intro-identity h1 { font-size: 2.8rem; } .portrait-frame { width: 72px; } }
@media (max-width: 1050px) { .toolkit-inner { grid-template-columns: 1fr; gap: 24px; } .toolkit-caption { max-width: none; } }
@media (max-width: 900px) {
  .hero-layout { grid-template-columns: 1fr; gap: 34px; }
  .system-visual { max-width: 520px; height: 390px; margin-inline: auto; }
  .layer-interface { top: 65px; } .layer-service { top: 160px; } .layer-data { top: 255px; }
  .visual-footer { bottom: 18px; }
}
@media (max-width: 760px) {
  .intro-identity { gap: 18px; }
  .intro-identity h1 { font-size: clamp(2.4rem, 7.2vw, 3.6rem); }
  .portrait-frame { width: 70px; }
  .toolkit-band { padding-block: 30px; }
  .toolkit-group { padding: 13px; }
}
@media (max-width: 520px) { .toolkit-grid { grid-template-columns: 1fr; } .toolkit-group:last-child { grid-column: auto; } }
@media (max-width: 380px) { .intro-identity { gap: 12px; } .intro-identity h1 { font-size: 2.2rem; } .portrait-frame { width: 58px; } }
.profile-dialog { box-sizing: border-box; position: fixed; inset: 0; width: min(420px, calc(100vw - 40px)); max-width: none; max-height: calc(100dvh - 40px); margin: auto; padding: 8px; overflow: auto; border: 1px solid var(--theme-line, #dce3de); border-radius: 19px; background: var(--theme-paper, #f8f9f6); color: var(--theme-ink, #153a3b); font-family: Arial, Helvetica, sans-serif; box-shadow: 0 24px 90px rgb(0 0 0 / 35%); }
.profile-dialog::backdrop { background: rgb(0 0 0 / 68%); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
.profile-dialog[open] { animation: profile-focus-in 240ms ease-out; }
.profile-dialog-photo { display: block; width: 100%; height: auto; max-height: calc(100dvh - 125px); border-radius: 12px; object-fit: contain; filter: grayscale(100%) contrast(1.12) brightness(1.06); }
.profile-dialog-close { position: absolute; top: 17px; right: 17px; z-index: 1; display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 1px solid rgb(255 255 255 / 35%); border-radius: 50%; background: rgb(0 0 0 / 65%); color: #fff; font-family: Arial, Helvetica, sans-serif; font-size: 25px; line-height: 1; cursor: pointer; }
.profile-dialog-close:hover { background: rgb(0 0 0 / 85%); }
.profile-dialog-close:focus-visible { outline: 2px solid var(--theme-ink, #153a3b); outline-offset: 4px; }
.profile-dialog-caption { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 12px; padding: 13px 7px 6px; font-size: 12px; line-height: 1.5; }
.profile-dialog-caption span:last-child { color: var(--theme-muted, #617372); font-size: 11px; }
@keyframes profile-focus-in { from { opacity: 0; transform: translateY(8px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .portrait-particle { display: none; animation: none; }
  .tagline-enter-active, .tagline-leave-active, .skill-chips li, .intro-identity > .portrait-frame { transition: none; }
  .system-layer, .profile-dialog[open] { animation: none !important; }
}

</style>

<style>
html[data-theme="dark"] .portfolio .portrait-frame { --particle-color: #ffffff; }
html[data-theme="light"] .portfolio .portrait-frame { --particle-color: #111111; }
</style>
