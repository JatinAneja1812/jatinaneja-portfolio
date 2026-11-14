<script setup lang="ts">
import { ref } from "vue";
import Github from "../shared/icons/Github.vue";
import { ArrowUpRight, Code2, Sparkles } from "@lucide/vue";
import { templateConfig } from "../../config/templateConfig";

const config = templateConfig;
const emit = defineEmits<{ (event: "refresh-layout"): void }>();
type Project = (typeof config.timeline.projects)[number];
const activeId = ref<Project["id"] | null>(null);
function handleDetails(event: Event, id: Project["id"]) {
  if ((event.currentTarget as HTMLDetailsElement).open) activeId.value = id;
  emit("refresh-layout");
}
</script>

<template>
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
                :class="{ 'is-active': activeId === project.id }"
                @click="activeId = project.id"
              >
                <button
                  type="button"
                  :aria-label="`${project.title} preview`"
                  @click.stop="activeId = project.id"
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
                    @load="emit('refresh-layout')"
                  />

                  <Code2 v-else :size="90" aria-hidden="true" />

                  <span class="project-art-label">
                    {{ project.organization }}
                  </span>
                </button>

                <div class="project-copy" data-reveal>
                  <p class="eyebrow">PROJECT / {{ index + 1 }}</p>
                  <h3>{{ project.title }}</h3>
                  <p class="project-summary">{{ project.summary }}</p>

                  <details
                    v-if="project.highlights?.length"
                    class="project-details"
                    @toggle="handleDetails($event, project.id)"
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
</template>

<style scoped>

.projects-section { --project-accent: var(--copper, var(--resume-c-b77a50, #b77a50)); padding-block: 65px; background: var(--resume-c-eef2ed, #eef2ed); }
.projects-section .section-heading { margin-bottom: 34px; }
.project-list { display: grid; gap: 20px; }
.project-showcase { position: relative; isolation: isolate; display: grid; grid-template-columns: 240px minmax(0, 1fr); align-items: start; gap: 28px; padding: 22px; border: 1px solid var(--line); border-radius: 16px; background: var(--paper); transition: border-color 220ms ease, box-shadow 260ms ease, background-color 260ms ease; }
.project-showcase::before { content: ""; position: absolute; z-index: 0; inset: 0; border-radius: inherit; pointer-events: none; background: linear-gradient(115deg, transparent 20%, color-mix(in srgb, var(--project-accent) 11%, transparent) 50%, transparent 80%); background-size: 230% 100%; opacity: 0; }
.project-showcase > * { position: relative; z-index: 1; }
.project-showcase.is-active,
.project-showcase:focus-within { border-color: var(--project-accent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--project-accent) 35%, transparent), 0 8px 26px rgb(0 0 0 / 7%); background: color-mix(in srgb, var(--paper) 97%, var(--project-accent) 3%); }
.project-showcase.is-active::before { animation: project-scan 750ms ease-out both; }
@keyframes project-scan { 0% { background-position: 100% 0; opacity: 0; } 20% { opacity: 1; } 100% { background-position: 0 0; opacity: 0; } }
.project-art { display: flex; align-items: center; justify-content: center; min-width: 0; width: 100%; height: 170px; padding: 24px 16px; overflow: hidden; border: 1px solid var(--line); border-radius: 11px; color: var(--ink); font: inherit; cursor: pointer; appearance: none; }
.project-tone-0 { background: linear-gradient(145deg, var(--resume-c-dce8dd, #dce8dd), var(--resume-c-c8d8cd, #c8d8cd)); }
.project-tone-1 { background: linear-gradient(145deg, var(--resume-c-eee1d4, #eee1d4), var(--resume-c-dfd0c1, #dfd0c1)); }
.project-tone-2 { background: linear-gradient(145deg, var(--resume-c-d9e3e5, #d9e3e5), var(--resume-c-c8d6dc, #c8d6dc)); }
.project-art img { display: block; width: 100%; height: 100%; max-height: 122px; object-fit: contain; border-radius: 7px; transition: transform 350ms ease; }
.project-art > svg { width: 46px; height: 46px; }
.project-showcase.is-active .project-art img { transform: scale(1.02); }
.project-index { position: absolute; top: 8px; left: 10px; color: var(--muted); font-family: monospace; font-size: .55rem; }
.project-art-label { position: absolute; right: 10px; bottom: 7px; left: 10px; overflow: hidden; color: var(--muted); font-family: monospace; font-size: .5rem; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
.project-copy { min-width: 0; }
.project-copy h3 { margin-top: 10px; font-size: clamp(1.3rem, 2vw, 1.7rem); line-height: 1.15; font-weight: 500; letter-spacing: -.05em; }
.project-summary { margin-top: 12px !important; color: var(--muted); font-size: .83rem; line-height: 1.85; }
.project-details { margin-top: 15px; border-block: 1px solid var(--line); }
.project-details summary { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 44px; padding-block: 13px; font-size: .75rem; list-style: none; cursor: pointer; }
.project-details summary::-webkit-details-marker { display: none; }
.project-details summary > span { font-size: 1.2rem; transition: transform 200ms ease; }
.project-details[open] summary > span { transform: rotate(45deg); }
.project-details ul { display: grid; gap: 12px; margin: 0; padding: 5px 0 20px 17px; color: var(--muted); font-size: .78rem; line-height: 1.8; }
.project-links { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 14px; }
.project-art:focus-visible { outline: 2px solid var(--project-accent); outline-offset: 4px; }
@media (hover: hover) {
  .project-showcase:hover { border-color: var(--project-accent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--project-accent) 25%, transparent), 0 8px 26px rgb(0 0 0 / 6%); }
  .project-art:hover img { transform: scale(1.02); }
}
.focus-section { padding-block: 58px; background: var(--resume-c-173b3b, #173b3b); color: var(--resume-c-f4f6ee, #f4f6ee); text-align: center; }
.focus-inner { max-width: 800px; }
.focus-icon { margin: 0 auto 20px; color: var(--resume-c-d9bd9b, #d9bd9b); }
.focus-inner .eyebrow { justify-content: center; color: var(--resume-c-a9c1b6, #a9c1b6); }
.focus-inner h2 { margin-top: 24px; font-size: clamp(2rem, 4vw, 3.3rem); font-weight: 500; line-height: 1.12; letter-spacing: -.055em; }
.focus-inner h2 span { color: var(--resume-c-a2baaa, #a2baaa); }
.focus-inner > p:last-child { max-width: 590px; margin: 25px auto 0; color: var(--resume-c-c0cfc6, #c0cfc6); font-size: .9rem; line-height: 1.85; }
@media (max-width: 950px) { .project-showcase { grid-template-columns: 190px minmax(0, 1fr); gap: 22px; } .project-art { height: 150px; } }
@media (max-width: 600px) {
  .projects-section { padding-block: 45px; }
  .project-showcase { grid-template-columns: 1fr; gap: 18px; padding: 16px; }
  .project-art { height: 145px; }
  .project-art img { max-height: 103px; }
  .project-copy h3 { font-size: 1.4rem; }
  .focus-section { padding-block: 45px; }
}
@media (prefers-reduced-motion: reduce) {
  .project-showcase, .project-art img, .project-details summary > span { transition: none !important; }
  .project-showcase::before { display: none; animation: none !important; }
  .project-art img { transform: none !important; }
}
</style>
