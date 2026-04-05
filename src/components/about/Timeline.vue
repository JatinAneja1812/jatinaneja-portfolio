<script setup lang="ts">
import { computed, ref } from "vue";
import { templateConfig } from "@/config/templateConfig";

type TabKey = "experience" | "education" | "certificates";

const activeTab = ref<TabKey>("experience");

const tabMeta: { key: TabKey; label: string }[] = [
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "certificates", label: "Certificates" },
  { key: "projects", label: "Projects" },
];

const activeItems = computed(() => templateConfig.timeline[activeTab.value]);

// Flipping logic: use a Set to track flipped cards by id
import { reactive } from "vue";
const flippedCards = reactive(new Set());
function toggleFlip(id: string | number) {
  if (flippedCards.has(id)) {
    flippedCards.delete(id);
  } else {
    flippedCards.add(id);
  }
}
</script>

<template>
  <div class="card rounded-md" style="border: 1px solid black">
    <div class="card-body pt-3 px-4">
      <div role="tablist" class="tabs tabs-boxed">
        <button
          v-for="tab in tabMeta"
          :key="tab.key"
          role="tab"
          :class="{
            tab: true,
            'tab-active': activeTab === tab.key,
            'tab-expanded': activeTab === tab.key,
          }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="divider my-0"></div>

      <div v-if="activeTab !== 'projects'">
        <ul
          class="timeline timeline-snap-icon timeline-compact timeline-vertical lg:w-4/5 lg:ml-20"
        >
          <li v-for="item in activeItems" :key="item.id">
            <div class="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <div class="timeline-end mb-10 text-start">
              <time class="font-mono italic">{{ item.date }}</time>
              <div class="text-lg font-black">{{ item.title }}</div>
              <div class="font-light">
                <a
                  v-if="item.organizationUrl"
                  :href="item.organizationUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-info hover:underline hover:decoration-dashed italic decoration-info hover:text-error"
                >
                  {{ item.organization }}
                </a>
                <span v-else>{{ item.organization }}</span>
              </div>

              <p class="mt-2 ml-1">{{ item.summary }}</p>

              <!-- render highlights -->
              <ul
                v-if="item.highlights && item.highlights.length"
                class="list-disc list-outside ml-5 mt-2"
              >
                <li
                  v-for="highlight in item.highlights"
                  :key="highlight"
                  class="mb-1"
                >
                  {{ highlight }}
                </li>
              </ul>

              <!-- render certificate / timeline images -->
              <div
                v-if="item.images && item.images.length"
                class="mt-3 ml-1 flex flex-wrap gap-2"
              >
                <img
                  v-for="img in item.images"
                  :key="img"
                  :src="img"
                  :alt="item.title + ' image'"
                  class="h-[250px] w-auto rounded border border-neutral-200 object-contain"
                />
              </div>

              <!-- render links -->
              <div
                v-if="item.links && item.links.length"
                class="mt-3 ml-1 flex flex-wrap gap-2"
              >
                <a
                  v-for="link in item.links"
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-xs"
                >
                  {{ link.label }}
                </a>
              </div>
            </div>

            <hr />
          </li>
        </ul>
      </div>
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <div
            v-for="item in activeItems"
            :key="item.id"
            class="flip-card group"
            tabindex="0"
            @click="toggleFlip(item.id)"
            @keydown.enter.space="toggleFlip(item.id)"
          >
            <div
              class="flip-card-inner"
              :class="{ flipped: flippedCards.has(item.id) }"
            >
              <!-- Front Side -->
              <div class="flip-card-front relative overflow-hidden">
                <div
                  v-if="item.images && item.images.length"
                  class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none"
                >
                  <img
                    :src="item.images[0]"
                    :alt="item.title + ' background'"
                    class="w-full h-full object-cover opacity-20 scale-110 blur-sm"
                  />
                </div>
                <div
                  class="flex flex-col items-center justify-center h-full p-4 relative z-10"
                >
                  <div
                    v-if="item.images && item.images.length"
                    class="mb-4 flex justify-center"
                  >
                    <img
                      :src="item.images[0]"
                      :alt="item.title + ' image'"
                      class="w-60 h-40 rounded object-contain border border-neutral-340 bg-white/20 backdrop-blur-sm"
                      style="
                        min-width: 15rem;
                        min-height: 10rem;
                        max-width: 15rem;
                        max-height: 10rem;
                      "
                    />
                  </div>
                  <div class="font-black text-lg text-center mb-1">
                    {{ item.title }}
                  </div>
                  <div
                    v-if="item.summary"
                    class="text-sm text-center text-gray-500 mb-2"
                  >
                    {{ item.summary }}
                  </div>
                </div>
              </div>
              <!-- Back Side -->
              <div class="flip-card-back">
                <div class="flex flex-col justify-center h-full p-4">
                  <div class="font-black text-lg text-center mb-1">
                    {{ item.title }}
                  </div>
                  <div class="text-sm text-left text-gray-500 mb-2 mt-3">
                    Details:
                  </div>

                  <ul
                    v-if="item.highlights && item.highlights.length"
                    class="list-disc list-inside mb-2 text-xs text-neutral-700 text-left mx-auto max-w-xs"
                  >
                    <li v-for="highlight in item.highlights" :key="highlight">
                      {{ highlight }}
                    </li>
                  </ul>
                  <div
                    v-if="item.links && item.links.length"
                    class="mt-2 flex flex-wrap gap-2 justify-center"
                  >
                    <a
                      v-for="link in item.links"
                      :key="link.url"
                      :href="link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-xs"
                    >
                      {{ link.label }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab {
  font-family: "PPEN";
  font-weight: 400;
  font-style: normal;
  font-size: 0.95rem;
  flex: 1;
  transition:
    flex 0.35s ease-in-out,
    border-radius 0.35s ease-in-out;
}

.tab-active {
  flex: 3;
}

.font-black {
  font-family: "PPEN";
  font-weight: 700;
  font-style: normal;
  font-size: 1.25rem;
}

.font-light {
  font-family: "PPEN";
  font-weight: 400;
  font-style: normal;
  font-size: 1rem;
}
</style>
<style scoped>
/* Flipping Card Styles for Projects Tab */
.flip-card {
  perspective: 1200px;
  min-height: 370px;
  height: 370px;
  cursor: pointer;
  outline: none;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 370px;
  transition:
    transform 0.7s cubic-bezier(0.4, 2, 0.6, 1),
    box-shadow 0.3s;
  transform-style: preserve-3d;
  border-radius: 1rem;
}
.flip-card-inner.flipped {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  min-height: 370px;
  backface-visibility: hidden;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  box-shadow: 0 2px 8px 0 rgba(80, 80, 120, 0.1);
}
.flip-card-front {
  z-index: 2;
  border: 1.5px solid #e5e7eb;
}
.flip-card-back {
  transform: rotateY(180deg);
  border: 1.5px solid #e5e7eb;
}
</style>
