<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import { templateConfig } from "./config/templateConfig";

const isMobile = window.innerWidth < 640;
</script>

<template>
  <div class="bg-custom-dotted min-h-screen h-full">
    <Navbar class="max-w-6xl w-11/12 mx-auto" />
    <router-view class="max-w-7xl w-11/12 mx-auto" />
  </div>
  <footer class="footer footer-center text-base-content p-4 pt-8">
    <aside>
      <p>
        Copyright © {{ new Date().getFullYear() }}
        {{ templateConfig.site.footerName }}
      </p>
      <p class="pt-2 opacity-90">
        <span v-if="!isMobile">
          {{ templateConfig.site.footerTaglineDesktop }}
        </span>
        <span v-else>
          {{ templateConfig.site.footerTaglineMobile }}
        </span>
      </p>
    </aside>
  </footer>
</template>

<style scoped>
.hover-reveal {
  opacity: 0;
  transition: opacity 0.3s ease;
}
:hover > .hover-reveal {
  opacity: 1;
}

.bg-custom-dotted {
  /* your gradient */
  background: linear-gradient(55deg, #fcfaf7 0%, #e9e9e9 100%) !important;
  /* static background size */
  background-size: 400% 400%;
  /* animate it */

  position: relative;
  overflow-x: hidden;
}

.bg-custom-dotted::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: var(--grain-noise);
  background-repeat: repeat;
  background-size: 182px;
  opacity: 0.12;
  pointer-events: none;
  z-index: 1;
}

/* Cards share the same gradient + grain as the page, but with depth */
:deep(.card) {
  position: relative !important;
  overflow: hidden;
  z-index: 0;

  background: linear-gradient(135deg, #fcfaf7 0%, #e5e3d5 100%) !important;
  border-radius: 18px;

  box-shadow:
    0 18px 35px rgba(0, 0, 0, 0.12),
    0 1px 0 rgba(255, 255, 255, 0.6) inset;

  color: #12353b;

  /* subtle lift on hover */
  transition:
    transform 220ms ease-out,
    box-shadow 220ms ease-out;
}

:deep(.card:hover) {
  transform: translateY(-3px);
  box-shadow:
    0 22px 45px rgba(0, 0, 0, 0.16),
    0 1px 0 rgba(255, 255, 255, 0.7) inset;
}

/* Grain overlay */
:deep(.card)::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--grain-noise);
  background-repeat: repeat;
  background-size: 182px;
  opacity: 0.1;
  pointer-events: none;
  z-index: -1;
}

/* Soft inner highlight at the top, very subtle */
:deep(.card)::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3),
    transparent 40%
  );
  mix-blend-mode: soft-light;
  pointer-events: none;
  z-index: -1;
}
</style>
