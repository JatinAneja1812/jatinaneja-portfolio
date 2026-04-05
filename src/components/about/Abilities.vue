<script setup lang="ts">
import { templateConfig } from "@/config/templateConfig";
import { onMounted, ref } from "vue";

const animatedValues = ref<number[]>(
  templateConfig.abilities.items.map(() => 0),
);

const containerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const el = containerRef.value;
  if (!el) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animatedValues.value = templateConfig.abilities.items.map(
            (item) => item.value,
          );
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(el);
});
</script>

<template>
  <div
    ref="containerRef"
    class="card rounded-md border border-neutral-800 bg-white"
    style="border: 1px solid black"
  >
    <div class="card-body pt-3 px-4">
      <header class="mb-3 px-3">
        <h1 class="card-title text-neutral-900">
          {{ templateConfig.abilities.title }}
        </h1>
        <div class="mt-1 border-b border-neutral-200 w-full"></div>
      </header>

      <!-- responsive rows -->
      <div class="space-y-2.5">
        <template
          v-for="(item, index) in templateConfig.abilities.items"
          :key="item.label"
        >
          <div class="grid grid-cols-12 gap-1 items-center">
            <!-- label: full width on mobile, 8/12 from md -->
            <div class="col-span-12 md:col-span-8 min-w-0">
              <span
                class="block text-neutral-900 progress-label text-sm md:text-base truncate"
              >
                {{ item.label }}
              </span>
            </div>

            <!-- bar: full width on mobile, 4/12 from md -->
            <div class="col-span-12 md:col-span-4 mt-1 md:mt-0">
              <div
                class="w-full h-2.5 rounded-full bg-neutral-200 overflow-hidden relative"
              >
                <div class="absolute inset-0 bg-neutral-200"></div>

                <div
                  class="relative h-full rounded-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.7)] transition-[width] duration-900 ease-out will-change-[width]"
                  :style="{ width: animatedValues[index] + '%' }"
                >
                  <div
                    class="absolute inset-0 pointer-events-none animate-scanline"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
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

/* white moving highlight */
@keyframes scanline {
  0% {
    mask-position: 0 0;
  }
  100% {
    mask-position: 200% 0;
  }
}

.animate-scanline {
  background: linear-gradient(
    300deg,
    transparent 0%,
    rgba(255, 255, 255, 0.9) 100%,
    transparent 40%,
    transparent 100%
  );
  mask-image: linear-gradient(
    330deg,
    transparent 0%,
    black 20%,
    transparent 50%,
    transparent 100%
  );
  mask-size: 200% 100%;
  animation: scanline-reversed 2.4s linear infinite;
  opacity: 0.9;
}

@keyframes scanline-reversed {
  0% {
    mask-position: 100% 0;
    background-position: 100% 0;
  }
  100% {
    mask-position: -100% 0;
    background-position: -100% 0;
  }
}
</style>
