<script setup lang="ts">
import { ref, computed } from "vue";
import { templateConfig } from "@/config/templateConfig";

import {
  PhEnvelopeSimple,
  PhLinkedinLogo,
  PhGithubLogo,
  PhGlobe,
  PhFileText,
} from "@phosphor-icons/vue";

const emailLabel = ref("Mail to");

const openEmail = () => {
  const email = templateConfig.contact.email;
  window.location.href = `mailto:${email}`;
};

const openLink = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const linkItems = computed(() =>
  templateConfig.contact.links.map((link) => {
    let icon = PhGlobe;
    let tooltip = "Open link";
    const lower = link.label.toLowerCase();

    if (lower.includes("linkedin")) {
      icon = PhLinkedinLogo;
      tooltip = "Open LinkedIn";
    }
    if (lower.includes("github")) {
      icon = PhGithubLogo;
      tooltip = "Open GitHub";
    }
    if (lower.includes("resume") || lower.includes("cv")) {
      icon = PhFileText;
      tooltip = "Download CV";
    }

    return { ...link, icon, tooltip };
  }),
);
</script>

<template>
  <div
    class="card rounded-md min-h-[280px] md:min-h-[320px]"
    style="border: 1px solid black"
  >
    <div class="card-body pt-3 px-0 flex flex-col h-full">
      <header class="mb-3 px-3 shrink-0">
        <h1 class="card-title text-neutral-900">Links</h1>
        <div class="mt-1 border-b border-neutral-200 w-full"></div>
      </header>

      <!-- desktop icons >=768px: centered -->
      <div
        class="hidden md:flex flex-col items-center justify-center flex-1 gap-3 mx-3 min-h-0"
      >
        <!-- email icon -->
        <button
          @click="openEmail()"
          class="icon-btn icon-blink-0 group"
          :title="emailLabel"
        >
          <span class="icon-btn-inner">
            <PhEnvelopeSimple :size="26" weight="regular" class="icon-svg" />
          </span>
        </button>

        <!-- other icons -->
        <button
          v-for="(link, index) in linkItems"
          :key="link.label"
          @click="openLink(link.url)"
          class="icon-btn group"
          :class="`icon-blink-${index + 1}`"
          :title="link.tooltip"
        >
          <span class="icon-btn-inner">
            <component
              :is="link.icon"
              :size="26"
              weight="regular"
              class="icon-svg"
            />
          </span>
        </button>
      </div>

      <!-- mobile buttons <768px: top-aligned, no extra top space -->
      <div class="md:hidden flex flex-col gap-3 mx-2 sm:mx-2 flex-1 pt-2">
        <!-- email -->
        <button
          @click="openEmail()"
          class="w-full max-w-[85%] mx-auto inline-flex items-center justify-between px-3 py-2 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-50 text-sm hover:bg-neutral-800 hover:border-neutral-50 transition-colors duration-150 group min-h-[48px]"
        >
          <div class="flex items-center gap-3">
            <PhEnvelopeSimple :size="20" weight="regular" />
            <span>Mail to</span>
          </div>
        </button>

        <!-- other links -->
        <button
          v-for="link in linkItems"
          :key="link.label"
          @click="openLink(link.url)"
          class="w-full max-w-[85%] mx-auto inline-flex items-center justify-between px-3 py-2 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-50 text-sm hover:bg-neutral-800 hover:border-neutral-50 transition-colors duration-150 group min-h-[48px]"
        >
          <div class="flex items-center gap-3">
            <component :is="link.icon" :size="20" weight="regular" />
            <span class="truncate">{{ link.label }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile button container: extra narrow padding below 550px */
@media (max-width: 549px) {
  .card-body > div:last-child {
    margin-left: 1rem !important;
    margin-right: 1rem !important;
  }
}

.card-title {
  font-family: "PPEN";
  font-weight: 400;
  font-style: normal;
  font-size: 1.5rem;
  margin-top: 5px;
}

/* bigger, two‑tone monochrome buttons */
.icon-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  min-width: 2.7rem;
  min-height: 2.7rem;
  max-width: 3.2rem;
  max-height: 3.2rem;
  border-radius: 999px;
  border: 1px solid #020617;
  background:
    radial-gradient(circle at 25% 0, #f9fafb, #e5e7eb),
    radial-gradient(circle at 80% 120%, #d4d4d8, #111827);
  color: #020617;
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.9),
    0 8px 14px rgba(15, 23, 42, 0.35);
  transition:
    width 0.2s,
    height 0.2s;
}

.icon-btn-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  overflow: hidden;
  border-radius: 999px;
}

/* improved tooltip bubble: centered below icon */
.icon-tooltip {
  pointer-events: auto;
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%) translateY(8px);
  min-width: 110px;
  max-width: 200px;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  background: #22292f;
  color: #f9fafb;
  font-size: 12px;
  font-weight: 500;
  white-space: pre-line;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  opacity: 0;
  z-index: 990;
  transition:
    opacity 150ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* show tooltip on hover */
.icon-btn.group:hover .icon-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(16px);
  border-radius: 999px;
}

/* hover highlight for desktop icons */
.icon-btn:hover {
  box-shadow:
    0 0 0 1px rgba(250, 250, 250, 0.9),
    0 10px 20px rgba(15, 23, 42, 0.6);
}

/* blink overlay */
.icon-btn-inner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: #000000;
  opacity: 0;
  pointer-events: none;
  border-radius: 999px;
  box-shadow: 0 0 0 0px #fff;
  transition:
    box-shadow 0.15s,
    background 0.15s;
}

/* icon */
.icon-svg {
  position: relative;
  z-index: 1;
  stroke-width: 1.7;
  filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.2))
    drop-shadow(0 1px 0 rgba(0, 0, 0, 0.6));
  transition: color 0.25s ease-out;
}

/* blink timing per button */
.icon-blink-0 .icon-btn-inner::before {
  animation: btn-blink 8s ease-in-out infinite;
}
.icon-blink-1 .icon-btn-inner::before {
  animation: btn-blink 8s ease-in-out infinite 0.6s;
}
.icon-blink-2 .icon-btn-inner::before {
  animation: btn-blink 8s ease-in-out infinite 1.2s;
}
.icon-blink-3 .icon-btn-inner::before {
  animation: btn-blink 8s ease-in-out infinite 1.8s;
}
.icon-blink-4 .icon-btn-inner::before {
  animation: btn-blink 8s ease-in-out infinite 2.4s;
}

/* icon color blink: sync with background blink */
.icon-blink-0 .icon-btn-inner .icon-svg {
  animation: icon-color-blink-sync 8s ease-in-out infinite;
}
.icon-blink-1 .icon-btn-inner .icon-svg {
  animation: icon-color-blink-sync 8s ease-in-out infinite 0.6s;
}
.icon-blink-2 .icon-btn-inner .icon-svg {
  animation: icon-color-blink-sync 8s ease-in-out infinite 1.2s;
}
.icon-blink-3 .icon-btn-inner .icon-svg {
  animation: icon-color-blink-sync 8s ease-in-out infinite 1.8s;
}
.icon-blink-4 .icon-btn-inner .icon-svg {
  animation: icon-color-blink-sync 8s ease-in-out infinite 2.4s;
}

@keyframes btn-blink {
  0%,
  78%,
  100% {
    opacity: 0;
    background: #000000;
    box-shadow: 0 0 0 0px #fff;
  }
  82%,
  88% {
    opacity: 1;
    background: #000000;
    box-shadow: 0 0 0 2px #fff;
  }
  90% {
    opacity: 0;
    background: #000000;
    box-shadow: 0 0 0 0px #fff;
  }
}

@keyframes icon-color-blink-sync {
  0%,
  78%,
  100% {
    color: #020617;
  }
  82%,
  88% {
    color: #fff;
  }
  90% {
    color: #020617;
  }
}
</style>
