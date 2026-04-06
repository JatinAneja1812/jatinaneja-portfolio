<script setup lang="ts">
import { templateConfig } from "@/config/templateConfig";

const languages = [
  { name: "English", level: 90, label: "Fluent" },
  { name: "Hindi", level: 100, label: "Native" },
  { name: "Spanish", level: 20, label: "Basic" },
];

const radius = 24;
const strokeWidth = 5;
const normalizedRadius = radius - strokeWidth / 2;
const circumference = 2 * Math.PI * normalizedRadius;

function getStrokeDashoffset(level: number) {
  return circumference - (level / 100) * circumference;
}
</script>

<template>
  <div class="card rounded-md" style="border: 1px solid black">
    <div class="card-body pt-4 pb-4 px-3 sm:px-4">
      <header class="mb-3 px-1 sm:px-3">
        <h1 class="card-title text-neutral-900">Known Languages</h1>
        <div class="mt-1 border-b border-neutral-200 w-full"></div>
      </header>

      <div class="lang-list no-scrollbar">
        <div v-for="lang in languages" :key="lang.name" class="lang-item group">
          <svg
            :height="radius * 2 + 4"
            :width="radius * 2 + 4"
            class="shrink-0"
          >
            <circle
              :stroke="'#bdbdbd'"
              fill="transparent"
              :stroke-width="strokeWidth"
              :r="normalizedRadius"
              :cx="radius + 2"
              :cy="radius + 2"
            />
            <circle
              stroke="#111"
              fill="transparent"
              :stroke-width="strokeWidth"
              stroke-linecap="round"
              :stroke-dasharray="`${circumference} ${circumference}`"
              :stroke-dashoffset="getStrokeDashoffset(lang.level)"
              :r="normalizedRadius"
              :cx="radius + 2"
              :cy="radius + 2"
              class="lang-progress"
            />
            <text
              x="50%"
              y="50%"
              dominant-baseline="middle"
              text-anchor="middle"
              class="lang-percent"
            >
              {{ lang.level }}%
            </text>
          </svg>

          <div class="lang-labels">
            <div class="lang-name">{{ lang.name }}</div>
            <div class="lang-desc">{{ lang.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  font-family: "PPEN";
  font-weight: 400;
  font-size: 1.3rem;
  margin-top: 5px;
}

/* 2. Updated lang-list to prevent wrapping */
.lang-list {
  display: flex;
  flex-wrap: nowrap; /* Forces one line */
  overflow-x: auto; /* Allows scrolling if screen is too narrow */
  gap: 1rem;
  justify-content: flex-start;
  padding-bottom: 4px;
}

/* Hide scrollbar but keep functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (min-width: 768px) {
  .lang-list {
    justify-content: center;
    gap: 2rem;
  }
}

.lang-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex: 0 0 auto; /* Prevents items from shrinking */
  cursor: pointer;
  transition: transform 0.25s ease;
}

.lang-item:hover {
  transform: translateY(-2px);
}

.lang-progress {
  transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.lang-percent {
  font-weight: 600;
  font-size: 0.8rem;
  fill: #111;
}

.lang-labels {
  text-align: left;
  white-space: nowrap; /* Keeps text on one line */
}

.lang-name {
  font-weight: 600;
  color: #222;
  font-size: 0.85rem;
}

.lang-desc {
  font-size: 0.7rem;
  color: #666;
}
</style>
