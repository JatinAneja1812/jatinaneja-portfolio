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
  <div
    class="card rounded-md profile-card"
    style="border: 1px solid black; overflow-y: auto"
  >
    <div class="card-body pt-4 px-5 pb-4">
      <!-- Heading -->
      <header class="mb-3">
        <h1 class="card-title text-neutral-900">
          {{ templateConfig.profile.heading }}
        </h1>
        <div class="mt-1 border-b border-neutral-200 w-full"></div>
      </header>

      <!-- Intro -->
      <section class="space-y-2 text-sm leading-relaxed">
        <p class="font-ppen text-neutral-800">
          {{ templateConfig.profile.intro }}
        </p>
        <p class="font-ppen text-neutral-700">
          {{ templateConfig.profile.intro2 }}
        </p>
      </section>
      
      <!-- What I do -->
      <section class="mt-4">
        <h2
          class="font-ppen font-ppen-bold text-xs uppercase tracking-[0.12em] text-neutral-600 mb-2"
        >
          What I Do
        </h2>
        <ul class="space-y-1.5 text-sm text-neutral-800">
          <li
            v-for="item in templateConfig.profile.whatIDo"
            :key="item"
            class="flex gap-2 items-start transition-colors duration-150 hover:text-neutral-950"
          >
            <span class="mt-2 h-1 w-3 rounded-full bg-neutral-400"></span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </section>

      <!-- Current focus -->
      <section class="mt-4">
        <h2
          class="font-ppen font-ppen-bold text-xs uppercase tracking-[0.12em] text-neutral-600 mb-2"
        >
          Current Focus
        </h2>
        <p class="text-sm text-neutral-800 leading-relaxed font-ppen">
          {{ templateConfig.profile.currentFocus }}
        </p>
      </section>
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
.profile-card {
  border: 1px solid black;
  overflow-y: auto;
}

/* Chrome, Edge, Safari */
.profile-card::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* Firefox */
.profile-card {
  scrollbar-width: none;
}

/* Old IE/Edge */
.profile-card {
  -ms-overflow-style: none;
}


</style>
