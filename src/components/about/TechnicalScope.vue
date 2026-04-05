<script setup lang="ts">
import { templateConfig } from "@/config/templateConfig";

const toolkitSections = [
  { title: "Languages", values: templateConfig.profile.toolkit.languages },
  {
    title: "Frameworks/Stack",
    values: templateConfig.profile.toolkit.frameworks,
  },
  { title: "Data", values: templateConfig.profile.toolkit.data },
  { title: "Systems", values: templateConfig.profile.toolkit.systems },
];
</script>

<template>
  <div class="card rounded-md" style="border: 1px solid black">
    <div class="card-body pt-3 pb-3 px-0">
      <header class="mb-1 px-3">
        <h1 class="card-title text-neutral-900">Technical Scope</h1>
        <div class="mt-1 border-b border-neutral-200 w-full"></div>
      </header>
      <ul class="grid gap-2 mx-4 py-0 text-sm text-neutral-800">
        <li
          v-for="section in toolkitSections"
          :key="section.title"
          class="flex flex-wrap gap-1 items-baseline transition-colors duration-150 hover:text-neutral-950"
        >
          <span class="font-semibold text-neutral-950">
            {{ section.title }}:
          </span>
          <span class="opacity-90">
            {{ section.values.join(", ") }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  font-family: "PPEN";
  font-weight: 400;
  font-style: normal;
  font-size: 1.5rem;
  margin-top: 5px;
}
</style>
