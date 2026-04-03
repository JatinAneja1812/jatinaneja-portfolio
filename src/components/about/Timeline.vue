<script setup lang="ts">
import { computed, ref } from 'vue';
import { templateConfig } from '@/config/templateConfig';

type TabKey = 'experience' | 'education' | 'credentials';

const activeTab = ref<TabKey>('experience');

const tabMeta: { key: TabKey; label: string }[] = [
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'credentials', label: 'Credentials' }
];

const activeItems = computed(() => templateConfig.timeline[activeTab.value]);
</script>

<template>
  <div class="card rounded-md" style="border: 1px solid black;">
    <div class="card-body pt-3 px-4">
      <div role="tablist" class="tabs tabs-boxed">
        <button
          v-for="tab in tabMeta"
          :key="tab.key"
          role="tab"
          :class="{ 'tab': true, 'tab-active': activeTab === tab.key, 'tab-expanded': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="divider my-0"></div>

      <ul class="timeline timeline-snap-icon timeline-compact timeline-vertical lg:w-4/5 lg:ml-20">
        <li v-for="item in activeItems" :key="item.id">
          <div class="timeline-middle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd" />
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

            <ul v-if="item.highlights && item.highlights.length" class="list-disc list-outside ml-5 mt-2">
              <li v-for="highlight in item.highlights" :key="highlight" class="mb-1">
                {{ highlight }}
              </li>
            </ul>

            <div v-if="item.links && item.links.length" class="mt-3 ml-1 flex flex-wrap gap-2">
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
  </div>
</template>

<style scoped>
.tab {
  font-family: 'PPEN';
  font-weight: 400;
  font-style: normal;
  font-size: 0.95rem;
  flex: 1;
  transition: flex 0.35s ease-in-out, border-radius 0.35s ease-in-out;
}

.tab-active {
  flex: 3;
}

.font-black {
  font-family: 'PPEN';
  font-weight: 700;
  font-style: normal;
  font-size: 1.25rem;
}

.font-light {
  font-family: 'PPEN';
  font-weight: 400;
  font-style: normal;
  font-size: 1rem;
}
</style>
