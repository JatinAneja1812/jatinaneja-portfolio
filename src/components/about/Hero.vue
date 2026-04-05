<script setup lang="ts">
import { templateConfig } from "@/config/templateConfig";
import Picture from "@/assets/profileImg.png";
</script>

<template>
  <div class="card rounded-md hero-card" style="border: 1px solid black">
    <!-- status in top-left -->
    <div class="hero-status">
      <span class="hero-status-dot"></span>
      <span class="hero-status-text">ONLINE</span>
    </div>

    <div class="hero-inner">
      <div class="hero-avatar-wrap">
        <img
          :src="Picture"
          alt="Avatar"
          class="w-80 h-50 object-cover mb-0 mt-10 pt-10 grayscale"
        />
      </div>
      <div class="hero-title">JATIN ANEJA</div>
      <div class="hero-subtitle">SOFTWARE ENGINEER | FULL-STACK DEVELOPER</div>
      <div class="hero-meta">
        <span class="hero-meta-item">Middlesbrough, UK</span>
        <span class="hero-meta-item">EST: 2022</span>
        <span class="hero-meta-item">Age: 24</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-card {
  position: relative;
  overflow: hidden;
}

.hero-avatar-wrap {
  position: relative;
  display: inline-block;
  align-self: center;
}

/* distorted 4-sided “triangle-ish” shape behind avatar */
.hero-avatar-wrap::before {
  content: "";
  position: absolute;
  inset: 0;
  top: 4.75rem;
  left: 0.9rem;
  right: -1.4rem;
  bottom: -0.75rem;
  background: #020617;
  clip-path: polygon(5% 15%, 95% 5%, 85% 100%, 0% 85%);
  z-index: -1;
  opacity: 0.9;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.45),
    0 0 20px rgba(15, 23, 42, 0.6);
}

/* compact, top-left status */
.hero-status {
  position: absolute;
  top: 0.5rem;
  left: 0.6rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.12rem 0.4rem;
  border-radius: 999px;
  background: rgba(240, 253, 250, 0.9);
  border: 1px solid rgba(34, 197, 94, 0.6);
  font-family: "SDDystopian", system-ui, sans-serif;
  font-size: 0.55rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #166534;
}

.hero-status-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: radial-gradient(
    circle at 30% 30%,
    #bbf7d0 0%,
    #22c55e 40%,
    #166534 100%
  );
  box-shadow:
    0 0 3px rgba(34, 197, 94, 0.9),
    0 0 6px rgba(22, 163, 74, 0.7);
  animation: status-pulse 1.4s ease-in-out infinite;
}

.hero-status-text {
  line-height: 1;
}

/* existing styles below… */

.hero-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, #badfdf 0%, transparent 45%),
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
  font-family: "Audiowide", system-ui, sans-serif;
  font-size: clamp(1.6rem, 2.4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #020617;
  position: relative;
  display: inline-block;
  text-align: center;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.4);
}

.hero-title::before,
.hero-title::after {
  content: "JATIN ANEJA";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  opacity: 0;
}

.hero-title::before {
  text-shadow: -2px 0 #22d3ee;
  animation: slow-glitch 10s infinite steps(1, end);
}

.hero-title::after {
  text-shadow: 2px 0 #fb923c;
  animation: slow-glitch 10s infinite steps(1, end);
  animation-delay: 0.09s;
}

@keyframes slow-glitch {
  0%,
  79% {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
    transform: translate(0, 0);
  }
  80% {
    opacity: 1;
    clip-path: inset(0 0 65% 0);
    transform: translate(-1px, -1px);
  }
  85% {
    opacity: 1;
    clip-path: inset(35% 0 0 0);
    transform: translate(1px, 1px);
  }
  90% {
    opacity: 1;
    clip-path: inset(10% 0 30% 0);
    transform: translate(-1px, 1px);
  }
  91%,
  100% {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
    transform: translate(0, 0);
  }
}

.hero-subtitle {
  font-family: "SDDystopian", system-ui, sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #4b5563;
  text-align: center;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.35rem;
  font-family: "SDDystopian", system-ui, sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6b7280;
}

.hero-meta-item {
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(31, 75, 81, 0.25);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(2px);
}

/* pulse animation */
@keyframes status-pulse {
  0% {
    transform: scale(0.95);
    box-shadow:
      0 0 2px rgba(34, 197, 94, 0.7),
      0 0 4px rgba(22, 163, 74, 0.6);
  }
  50% {
    transform: scale(1.05);
    box-shadow:
      0 0 6px rgba(34, 197, 94, 1),
      0 0 10px rgba(22, 163, 74, 0.9);
  }
  100% {
    transform: scale(0.95);
    box-shadow:
      0 0 2px rgba(34, 197, 94, 0.7),
      0 0 4px rgba(22, 163, 74, 0.6);
  }
}
</style>
