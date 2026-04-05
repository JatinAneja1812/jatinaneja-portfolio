<script setup lang="ts">
import { ref } from 'vue';
import { templateConfig } from '@/config/templateConfig';

const emailInput = ref("");
const subscribeLabel = ref(templateConfig.newsletter.ctaLabel);

const subscribeToNewsletter = async () => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    alert("Please enter a valid email address.");
    return;
  }

  subscribeLabel.value = templateConfig.newsletter.successLabel;
  setTimeout(() => {
    subscribeLabel.value = templateConfig.newsletter.ctaLabel;
  }, 1000);
  emailInput.value = "";
};

</script>

<template>
    <div class="card rounded-md" style="border: 1px solid black;">
      <div class="card-body pt-3 px-4">
        <h2 class="card-title">{{ templateConfig.newsletter.title }}</h2>
        <div class="divider my-0"></div>
        <p class="text-m mb-2">
          {{ templateConfig.newsletter.description }}
        </p>
        <div class="grid grid-cols-3 gap-2">
          <label class="input input-bordered flex items-center gap-2 col-span-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                 class="h-4 w-4 opacity-70">
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input v-model="emailInput" type="text" class="grow" :placeholder="templateConfig.newsletter.placeholder" />
          </label>
          <button @click="subscribeToNewsletter" class="btn rounded-md btn-outline btn-primary">
            {{ subscribeLabel }}
          </button>

           <!-- Technical scope -->
      <section class="mt-4">
        <h2
          class="font-ppen font-ppen-bold text-xs uppercase tracking-[0.12em] text-neutral-600 mb-2 scope-glitch"
          data-text="Technical Scope"
        >
          Technical Scope
        </h2>
        <ul class="grid gap-1.5 text-sm text-neutral-800">
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
      </section>

        </div>
      </div>
    </div>
  </template>

<style scoped>
 .card-title{
    font-family: 'PPEN';
    font-weight: 400;
    font-style: normal;
    font-size: 1.5rem;
    margin-top: 5px;
 }

 button {
    font-family: 'PPEN';
    font-weight: 100;
    font-style: normal;
    font-size: 1rem;
 }
</style>