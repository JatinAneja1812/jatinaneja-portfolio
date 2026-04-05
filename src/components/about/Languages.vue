<script setup lang="ts">
import { templateConfig } from "@/config/templateConfig";

const languages = [
  { name: "English", level: 100, label: "Fluent" },
  { name: "Hindi", level: 100, label: "Native" },
  { name: "Spanish", level: 20, label: "Basic" },
];

const radius = 28;
const strokeWidth = 6;
const normalizedRadius = radius - strokeWidth / 2;
const circumference = 2 * Math.PI * normalizedRadius;

function getStrokeDashoffset(level: number) {
  return circumference - (level / 100) * circumference;
}
</script>

<template>
  <div class="card rounded-md" style="border: 1px solid black">
    <div class="card-body pt-4 pb-4 px-0">
      <header class="mb-3 px-3">
        <h1 class="card-title text-neutral-900">Known Languages</h1>
        <div class="mt-1 border-b border-neutral-200 w-full"></div>
      </header>
      <div class="lang-list">
        <div v-for="lang in languages" :key="lang.name" class="lang-item group">
          <svg :height="radius * 2 + 4" :width="radius * 2 + 4">
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
  font-style: normal;
  font-size: 1.3rem;
  margin-top: 5px;
}

.lang-title {
  color: #111;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 1.1rem;
}
.lang-list {
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  justify-content: center;
}
.lang-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.1rem;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.lang-item:hover svg {
  transform: scale(1.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.lang-progress {
  transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.lang-percent {
  font-weight: 600;
  font-size: 0.9rem;
  fill: #111;
  user-select: none;
}
.lang-labels {
  text-align: left;
}
.lang-name {
  font-weight: 600;
  color: #222;
}
.lang-desc {
  font-size: 0.75rem;
  color: #666;
}
</style>
