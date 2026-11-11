<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import FloatingChat from "./components/shared/FloatingChat.vue";
import { templateConfig } from "./config/templateConfig";

const route = useRoute();

const isResumePage = computed(() => route.name === "Resume");
const currentYear = new Date().getFullYear();
</script>

<template>
  <div class="app-shell">
    <!-- The navbar controls its own inner content width. -->
    <Navbar v-if="!isResumePage" />

    <RouterView v-slot="{ Component }">
      <component
        :is="Component"
        :class="{ 'secondary-page': !isResumePage }"
      />
    </RouterView>

    <footer v-if="!isResumePage" class="app-footer">
      <p>
        Copyright © {{ currentYear }}
        {{ templateConfig.site.footerName }}
      </p>

      <p class="footer-tagline footer-tagline-desktop">
        {{ templateConfig.site.footerTaglineDesktop }}
      </p>

      <p class="footer-tagline footer-tagline-mobile">
        {{ templateConfig.site.footerTaglineMobile }}
      </p>
    </footer>

    <FloatingChat />
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
  min-height: 100vh;
  background: #f8f9f6;
  color: #153a3b;
  font-family: Arial, Helvetica, sans-serif;
}

.secondary-page {
  width: min(1280px, calc(100% - 32px));
  margin-inline: auto;
}

.app-footer {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
  padding: 32px 0;
  border-top: 1px solid #dce3de;
  color: #617372;
  text-align: center;
  font-size: 0.8rem;
  line-height: 1.65;
}

.app-footer p {
  margin: 0;
}

.footer-tagline {
  margin-top: 10px !important;
}

.footer-tagline-mobile {
  display: none;
}

@media (max-width: 639px) {
  .footer-tagline-desktop {
    display: none;
  }

  .footer-tagline-mobile {
    display: block;
  }
}
</style>