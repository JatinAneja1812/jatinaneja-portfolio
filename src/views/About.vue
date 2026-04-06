<script setup lang="ts">
import Hero from ".././components/about/Hero.vue";
import About from ".././components/about/About.vue";
import Email from ".././components/about/Email.vue";
import Abilities from ".././components/about/Abilities.vue";
import Timeline from ".././components/about/Timeline.vue";
import TechnicalScope from ".././components/about/TechnicalScope.vue";
import Languages from ".././components/about/Languages.vue";
import { onMounted, onUnmounted } from "vue";

let observer: IntersectionObserver | null = null;

const initializeAnimation = () => {
  const container = document.getElementById("animatedContainer");
  if (!container) return;

  const elements = container.querySelectorAll<HTMLElement>(
    "[data-animation-order]",
  );

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const order = parseInt(target.dataset.animationOrder || "0");
          // Delay the animation based on the order value
          setTimeout(() => {
            target.style.opacity = "1";
          }, order * 100);
          observer?.unobserve(target);
        }
      });
    },
    { threshold: 0.1 },
  );

  elements.forEach((element) => {
    element.style.opacity = "0";
    observer?.observe(element);
  });
};

onMounted(() => {
  initializeAnimation();
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div
    id="animatedContainer"
    class="my-4 max-w-6xl xl:px-16 grid gap-1 sm:grid-cols-6 lg:grid-cols-9"
  >
    <About
      class="w-full col-span-full lg:col-span-6 h-[70vh] animate-fade-in"
      data-animation-order="1"
    />
    <Hero
      class="w-full col-span-full lg:col-span-3 h-[70vh] hidden lg:block animate-fade-in delay-100"
      data-animation-order="2"
    />
    <Email
      class="w-full sm:col-span-2 lg:col-span-1 min-h-[26vh] animate-fade-in delay-200"
      data-animation-order="3"
    />
    <Abilities
      class="w-full sm:col-span-4 lg:col-span-4 min-h-[26vh] animate-fade-in delay-300"
      data-animation-order="4"
    />
    <div
      class="w-full sm:col-span-full lg:col-span-4 min-h-[13vh]"
      data-animation-order="4"
    >
      <TechnicalScope
        data-animation-order="5"
        class="w-full mb-1 animate-fade-in delay-400"
      />
      <Languages
        data-animation-order="5"
        class="w-full animate-fade-in delay-400"
      />
    </div>

    <Timeline
      class="w-full col-span-full animate-fade-in delay-500"
      data-animation-order="6"
    />
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-300 {
  animation-delay: 300ms;
}

.delay-400 {
  animation-delay: 400ms;
}

.delay-500 {
  animation-delay: 500ms;
}
</style>
