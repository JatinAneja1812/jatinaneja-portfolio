<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import TOCItem from './TOCItem.vue';

interface TOCHeading {
  id: string;
  text: string;
  level: number;
  element?: HTMLElement;
  children: TOCHeading[];
}

const props = defineProps<{
  contentSelector?: string;
}>();

// State
const isExpanded = ref(false);
const tocHeadings = ref<TOCHeading[]>([]);
const activeId = ref<string>('');
const observer = ref<IntersectionObserver | null>(null);

// Parse headings from content (only h1 and h2)
const parseHeadings = (): TOCHeading[] => {
  const contentElement = document.querySelector(props.contentSelector || '.prose');
  if (!contentElement) return [];

  const headingElements = contentElement.querySelectorAll('h1, h2');
  const headings: TOCHeading[] = [];
  const stack: TOCHeading[] = [];

  headingElements.forEach((element, index) => {
    const level = parseInt(element.tagName.charAt(1));
    const text = element.textContent?.trim() || '';
    
    // Generate ID if it doesn't exist
    let id = element.id;
    if (!id) {
      id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-') + '-' + index;
      element.id = id;
    }

    const heading: TOCHeading = {
      id,
      text,
      level,
      element: element as HTMLElement,
      children: []
    };

    // Build hierarchy
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      headings.push(heading);
    } else {
      stack[stack.length - 1].children.push(heading);
    }

    stack.push(heading);
  });

  return headings;
};

// Create flat list of all headings for dash generation
const flatHeadings = computed(() => {
  const flattenHeadings = (headings: TOCHeading[]): TOCHeading[] => {
    const result: TOCHeading[] = [];
    headings.forEach(heading => {
      result.push(heading);
      if (heading.children.length > 0) {
        result.push(...flattenHeadings(heading.children));
      }
    });
    return result;
  };
  return flattenHeadings(tocHeadings.value);
});

// Setup intersection observer for active section tracking
const setupIntersectionObserver = () => {
  const headingElements = document.querySelectorAll('h1[id], h2[id]');
  
  if (headingElements.length === 0) return;

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id;
        }
      });
    },
    {
      rootMargin: '-100px 0px -66%',
      threshold: 0
    }
  );

  headingElements.forEach((el) => observer.value?.observe(el));
};

// Scroll to heading
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    });
  }
};

// Toggle expanded state
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

// Initialize
const initialize = async () => {
  await nextTick();
  tocHeadings.value = parseHeadings();
  setupIntersectionObserver();
};

// Lifecycle
onMounted(() => {
  // Small delay to ensure content is fully rendered
  setTimeout(initialize, 100);
});

onUnmounted(() => {
  observer.value?.disconnect();
});

// Watch for content changes
watch(() => props.contentSelector, initialize);

// Computed
const hasHeadings = computed(() => tocHeadings.value.length > 0);
</script>

<template>
  <div 
    v-if="hasHeadings"
    class="table-of-contents"
    :class="{ 'expanded': isExpanded }"
  >
    <!-- Collapsed State: Dash Indicators -->
    <div 
      v-if="!isExpanded" 
      class="toc-collapsed"
      role="button"
      aria-label="Open table of contents"
      aria-expanded="false"
      tabindex="0"
      @click="toggleExpanded"
      @mouseenter="isExpanded = true"
      @keydown.enter="toggleExpanded"
      @keydown.space.prevent="toggleExpanded"
    >
      <div class="dash-indicators">
        <div 
          v-for="heading in flatHeadings" 
          :key="heading.id"
          class="dash"
          :class="{
            'dash-h1': heading.level === 1,
            'dash-h2': heading.level === 2
          }"
          aria-hidden="true"
        ></div>
      </div>
    </div>

    <!-- Expanded State: Full TOC -->
    <div 
      v-if="isExpanded" 
      class="toc-expanded card"
      role="navigation"
      aria-label="Table of contents navigation"
      @mouseleave="isExpanded = false"
    >
      <div class="toc-header">
        <h3 class="toc-title">CONTENTS</h3>
        <button 
          class="toc-close"
          aria-label="Close table of contents"
          @click="toggleExpanded"
          @keydown.escape="toggleExpanded"
        >
          ×
        </button>
      </div>
      
      <div 
        class="toc-content"
        role="list"
        aria-label="Article sections"
      >
        <TOCItem
          v-for="heading in tocHeadings"
          :key="heading.id"
          :heading="heading"
          :active-id="activeId"
          @click="scrollToHeading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-of-contents {
  position: fixed;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  font-family: 'PPEN', sans-serif;
}

/* Collapsed State */
.toc-collapsed {
  width: 20px;
  min-height: 60px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  padding: 8px 0;
}

.toc-collapsed:hover,
.toc-collapsed:focus {
  opacity: 1;
  outline: 2px solid #218190;
  outline-offset: 2px;
}

.dash-indicators {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  padding: 8px 0;
}

.dash {
  background-color: #091717;
  border-radius: 1px;
  transition: all 0.3s ease;
}

.dash-h1 {
  width: 14px;
  height: 3px;
}

.dash-h2 {
  width: 10px;
  height: 1.5px;
  opacity: 0.8;
}

.toc-collapsed:hover .dash {
  background-color: #2E565D;
  transform: scale(1.1);
}

.toc-collapsed:hover .dash-h1 {
  transform: scale(1.15);
}

.toc-collapsed:hover .dash-h2 {
  transform: scale(1.2);
  opacity: 1;
}

/* Expanded State */
.toc-expanded {
  width: 240px;
  max-height: 60vh;
  background: linear-gradient(135deg, #FCFAF7 0%, #E5E3D5 100%) !important;
  border: 1px solid #091717;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(9, 23, 23, 0.1);
  animation: expandIn 0.3s ease-out;
}

.toc-expanded::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 182px;
  opacity: 0.08;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: multiply;
}

@keyframes expandIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateX(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateX(0);
  }
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(9, 23, 23, 0.1);
  background: rgba(252, 250, 247, 0.8);
}

.toc-title {
  font-size: 0.875rem;
  font-weight: 400;
  color: #091717;
  margin: 0;
  letter-spacing: 0.05em;
}

.toc-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #2E565D;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.toc-close:hover {
  background-color: rgba(46, 86, 93, 0.1);
  color: #091717;
}

.toc-content {
  padding: 8px 0;
  max-height: calc(60vh - 60px);
  overflow-y: auto;
}

.toc-content::-webkit-scrollbar {
  width: 4px;
}

.toc-content::-webkit-scrollbar-track {
  background: transparent;
}

.toc-content::-webkit-scrollbar-thumb {
  background: rgba(46, 86, 93, 0.3);
  border-radius: 2px;
}

.toc-content::-webkit-scrollbar-thumb:hover {
  background: rgba(46, 86, 93, 0.5);
}

/* Mobile: Hide completely */
@media (max-width: 768px) {
  .table-of-contents {
    display: none;
  }
}

/* Tablet: Adjust positioning */
@media (max-width: 1024px) {
  .table-of-contents {
    left: 0.5rem;
  }
  
  .toc-expanded {
    width: 200px;
  }
}
</style>