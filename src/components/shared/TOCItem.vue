<script setup lang="ts">
import { computed } from 'vue';

interface TOCHeading {
  id: string;
  text: string;
  level: number;
  element?: HTMLElement;
  children: TOCHeading[];
}

const props = defineProps<{
  heading: TOCHeading;
  activeId: string;
  depth?: number;
}>();

const emit = defineEmits<{
  click: [id: string];
}>();

// Computed properties
const isActive = computed(() => props.activeId === props.heading.id);
const currentDepth = computed(() => props.depth || 0);
const hasChildren = computed(() => props.heading.children.length > 0);

// Calculate indentation based on heading level and depth
const indentationLevel = computed(() => {
  // Base indentation for level 1 headings, more for deeper levels
  const baseIndent = Math.max(0, props.heading.level - 1);
  return baseIndent + currentDepth.value;
});

// Handle click
const handleClick = () => {
  emit('click', props.heading.id);
};

// Get text truncation for long headings
const displayText = computed(() => {
  const maxLength = Math.max(20, 40 - (indentationLevel.value * 4));
  return props.heading.text.length > maxLength 
    ? props.heading.text.slice(0, maxLength) + '...'
    : props.heading.text;
});
</script>

<template>
  <div class="toc-item-wrapper">
    <!-- Main heading item -->
    <div 
      class="toc-item"
      :class="[
        `level-${heading.level}`,
        `indent-${indentationLevel}`,
        { 'active': isActive }
      ]"
      role="listitem"
      tabindex="0"
      :aria-label="`Go to section: ${heading.text}`"
      :aria-current="isActive ? 'location' : false"
      @click="handleClick"
      @keydown.enter="handleClick"
      @keydown.space.prevent="handleClick"
    >
      <span class="toc-text">{{ displayText }}</span>
      <div v-if="isActive" class="active-indicator" aria-hidden="true"></div>
    </div>

    <!-- Children items (recursive) -->
    <div v-if="hasChildren" class="toc-children">
      <TOCItem
        v-for="child in heading.children"
        :key="child.id"
        :heading="child"
        :active-id="activeId"
        :depth="currentDepth + 1"
        @click="emit('click', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.toc-item-wrapper {
  animation: fadeInUp 0.4s ease-out forwards;
  opacity: 0;
  animation-delay: calc(var(--animation-order, 0) * 0.08s);
}

.toc-item-wrapper:nth-child(1) { animation-delay: 0.1s; }
.toc-item-wrapper:nth-child(2) { animation-delay: 0.18s; }
.toc-item-wrapper:nth-child(3) { animation-delay: 0.26s; }
.toc-item-wrapper:nth-child(4) { animation-delay: 0.34s; }
.toc-item-wrapper:nth-child(5) { animation-delay: 0.42s; }
.toc-item-wrapper:nth-child(6) { animation-delay: 0.5s; }
.toc-item-wrapper:nth-child(n+7) { animation-delay: 0.58s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toc-item {
  position: relative;
  padding: 6px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  margin: 1px 8px;
  font-family: 'FKGN', sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toc-item:hover,
.toc-item:focus {
  background-color: rgba(46, 86, 93, 0.08);
  transform: translateX(2px);
  outline: none;
}

.toc-item:focus {
  box-shadow: inset 0 0 0 2px #218190;
  border-radius: 4px;
}

.toc-text {
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.3;
  color: #12353B;
  transition: color 0.2s ease;
}

/* Heading level styles */
.toc-item.level-1 .toc-text {
  font-weight: 500;
  font-size: 0.9rem;
  color: #091717;
}

.toc-item.level-2 .toc-text {
  font-weight: 400;
  font-size: 0.85rem;
  color: #12353B;
}

.toc-item.level-3 .toc-text {
  font-weight: 300;
  font-size: 0.8rem;
  color: #2E565D;
}

.toc-item.level-4,
.toc-item.level-5,
.toc-item.level-6 {
  .toc-text {
    font-weight: 300;
    font-size: 0.75rem;
    color: #2E565D;
    opacity: 0.9;
  }
}

/* Indentation levels */
.toc-item.indent-0 { padding-left: 16px; }
.toc-item.indent-1 { padding-left: 24px; }
.toc-item.indent-2 { padding-left: 32px; }
.toc-item.indent-3 { padding-left: 40px; }
.toc-item.indent-4 { padding-left: 48px; }
.toc-item.indent-5 { padding-left: 56px; }

/* Active state */
.toc-item.active {
  background-color: rgba(186, 223, 223, 0.3);
  border-left: 3px solid #218190;
  padding-left: calc(16px + (var(--indent-level, 0) * 8px) - 3px);
}

.toc-item.active .toc-text {
  color: #091717;
  font-weight: 500;
}

.active-indicator {
  width: 6px;
  height: 6px;
  background-color: #218190;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* Children container */
.toc-children {
  margin-left: 0;
}

.toc-children .toc-item-wrapper {
  animation-delay: calc((var(--animation-order, 0) + 1) * 0.05s);
}

/* Hover effects for parent items with children */
.toc-item-wrapper:has(.toc-children) > .toc-item:hover {
  background-color: rgba(46, 86, 93, 0.05);
}

.toc-item-wrapper:has(.toc-children) > .toc-item:hover .toc-text {
  color: #091717;
}

/* Custom scrollbar for nested content */
.toc-children {
  position: relative;
}

.toc-children::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    rgba(46, 86, 93, 0.2) 20%, 
    rgba(46, 86, 93, 0.2) 80%, 
    transparent 100%
  );
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .toc-text {
    font-size: 0.8rem;
  }
  
  .toc-item {
    padding: 5px 12px;
  }
  
  .toc-item.indent-1 { padding-left: 20px; }
  .toc-item.indent-2 { padding-left: 28px; }
  .toc-item.indent-3 { padding-left: 36px; }
  .toc-item.indent-4 { padding-left: 44px; }
  .toc-item.indent-5 { padding-left: 52px; }
}

/* Smooth transitions for all state changes */
* {
  transition: all 0.2s ease;
}
</style>