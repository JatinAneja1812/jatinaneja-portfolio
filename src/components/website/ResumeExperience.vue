<script setup lang="ts">
import { computed } from "vue";
import { ArrowUpRight, Check, ExternalLink, GraduationCap, Users } from "@lucide/vue";
import { templateConfig } from "../../config/templateConfig";
const props = defineProps<{ activeExperience: number }>();
const config = templateConfig;
const experience = computed(() => [...config.timeline.experience].reverse());
const currentExperience = computed(() => experience.value[props.activeExperience]);
</script>

<template>
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

        <!-- CERTIFICATES & EDUCATION -->
        <section
          id="certificates"
          data-nav-section
          class="background-section section-container"
          aria-labelledby="background-title"
        >
          <div class="section-heading" data-reveal>
            <div>
              <p class="eyebrow">Certificates & foundations / 02</p>
              <h2 id="background-title" class="section-title">
                Beyond the code.
              </h2>
            </div>
          </div>

          <div class="background-grid">
            <div data-reveal>
              <h3 class="column-heading">
                <Users :size="21" />
                Certificates & community
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
          </div>
        </section>
</template>

<style scoped>
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

.career-indicator {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.indicator-label,
.chapter-number {
  color: var(--resume-c-7c8c80, #7c8c80);
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
  background: var(--resume-c-dae2d8, #dae2d8);
  transition: background 350ms;
}

.chapter-markers > span.active {
  background: var(--resume-c-6d9277, #6d9277);
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
  background: var(--resume-c-739b7d, #739b7d);
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
  border: 1px solid var(--resume-c-b8c7b9, #b8c7b9);
  border-radius: 50%;
  background: var(--paper);
  transition: border-color 300ms, box-shadow 300ms;
}

.career-node > span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--resume-c-b8c7b9, #b8c7b9);
}

.career-entry.is-current .career-node {
  border-color: var(--resume-c-739b7d, #739b7d);
  box-shadow: 0 0 0 6px rgb(var(--resume-rgb-115-155-125, 115 155 125) / 12%);
}

.career-entry.is-current .career-node > span {
  background: var(--resume-c-739b7d, #739b7d);
}

.career-date {
  display: inline-block;
  margin-bottom: 17px;
  padding: 5px 10px;
  border: 1px solid var(--line);
  border-radius: 5px;
  color: var(--resume-c-637c68, #637c68);
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
  color: var(--resume-c-739b7d, #739b7d);
}

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
  color: var(--resume-c-78917a, #78917a);
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

@media (max-width: 1050px) {
  .career-section {
      gap: 55px;
    }

  .background-grid {
      gap: 40px;
    }
}

@media (max-width: 760px) {
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

  .career-entry {
      padding-left: 37px;
      padding-bottom: 55px;
    }

  .career-entry h3 {
      font-size: 1.25rem;
    }

  .background-section {
      padding-block: 40px 75px;
    }

  .background-grid {
      grid-template-columns: 1fr;
      gap: 45px;
    }

  .career-entry-content {
      min-width: 0;
    }

  .career-highlights li {
      font-size: 0.84rem;
    }
}


.career-section { gap: 72px; padding-block: 88px 50px; }
.career-entry { padding-bottom: 64px; }
.background-section { padding-block: 30px 75px; }
.background-section > .section-heading { margin-bottom: 32px; }
.background-grid { gap: 22px; }
.background-grid > div { min-width: 0; padding: 22px; border: 1px solid var(--line); border-radius: 15px; }
.background-item { padding-top: 20px; }
.background-item + .background-item { margin-top: 18px; }
.background-item h4 { font-size: .95rem; }
@media (max-width: 760px) {
  .career-section { gap: 32px; padding-block: 58px 35px; }
  .background-section { padding-block: 20px 50px; }
  .background-grid { gap: 16px; }
  .background-grid > div { padding: 18px; }
}

</style>
