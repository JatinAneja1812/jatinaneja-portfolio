<script setup lang="ts">
import { templateConfig } from "@/config/templateConfig";
</script>

<template>
  <div class="card rounded-md hero-card" style="border: 1px solid black;">
    <div class="hero-inner">
      <div class="hero-label">Template</div>
      <div class="hero-title">{{ templateConfig.site.footerName }}</div>
      <div class="hero-subtitle">Portfolio starter</div>
    </div>
  </div>
</template>

<style scoped>
.hero-card {
  position: relative;
  overflow: hidden;
}

.hero-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, #badfdf 0%, transparent 45%),
    radial-gradient(circle at 80% 80%, #2e565d 0%, transparent 40%),
    linear-gradient(140deg, #fbfaf4 0%, #dfe8e5 100%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.35rem;
  padding: 1rem;
}

.hero-label {
  font-family: "FKGN";
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #1f4b51;
}

.hero-title {
  font-family: "PPEN";
  font-size: clamp(1.25rem, 2vw, 2rem);
  color: #102f34;
}

.hero-subtitle {
  font-family: "FKGN";
  font-size: 0.9rem;
  color: #1f4b51;
}
</style>