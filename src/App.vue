<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import { templateConfig } from "./config/templateConfig";

const isMobile = window.innerWidth < 640;

</script>

<template>
    <div class="bg-custom-dotted min-h-screen h-full">
      <Navbar class="max-w-6xl w-11/12 mx-auto"/>
      <router-view class="max-w-7xl w-11/12 mx-auto" />
    </div>
    <footer class="footer footer-center text-base-content p-4 pt-8">
      <aside>
        <p>Copyright © {{ new Date().getFullYear() }} {{ templateConfig.site.footerName }}</p>
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
  background: linear-gradient(55deg, #FBFAF4, #2E565D,);
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

/* Cards get the same gradient + grain as the page */
:deep(.card) {
  background: linear-gradient(135deg, #FCFAF7 0%, #E5E3D5 100%) !important;
  position: relative !important;
  overflow: hidden;
  z-index: 0;
  color: #12353B;
}

:deep(.card)::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--grain-noise);
  background-color: transparent;
  background-repeat: repeat;
  background-size: 182px;
  opacity: 0.12;
  pointer-events: none;
  z-index: -1;
}

</style>
