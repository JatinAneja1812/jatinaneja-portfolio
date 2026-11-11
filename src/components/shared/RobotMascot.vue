<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const SIZE = 60;
const EDGE = 12;

const ready = ref(false);
const hidden = ref(false);
const paused = ref(false);
const reducedMotion = ref(false);
const dragging = ref(false);
const hovered = ref(false);
const focused = ref(false);
const moving = ref(false);
const dancing = ref(false);
const happy = ref(false);
const controlsOpen = ref(false);
const sentence = ref("");
const danceStyle = ref<"normal" | "balle">("normal");

const x = ref(24);
const y = ref(100);
const viewportWidth = ref(0);
const viewportHeight = ref(0);

type Mode = "explore" | "dash" | "rest" | "glide";

let mode: Mode = "rest";
let velocityX = 0;
let velocityY = 0;
let targetX = 24;
let targetY = 100;

let frame = 0;
let lastFrame = 0;
let nextAction = 0;
let nextPersonalityAction = 0;

let motionQuery: MediaQueryList | undefined;
let speechTimer: ReturnType<typeof setTimeout> | undefined;
let danceTimer: ReturnType<typeof setTimeout> | undefined;

let activePointer: number | null = null;
let offsetX = 0;
let offsetY = 0;
let startX = 0;
let startY = 0;
let lastPointerTime = 0;
let throwX = 0;
let throwY = 0;
let dragged = false;
let previousSentence = -1;

const sentences = [
  "Hello! I’m the tiny engineer around here.",
  "Just checking that all the pixels are in place.",
  "You browse. I’ll supervise.",
  "My code runs on curiosity.",
  "Please do not tell anyone I live in your browser.",
  "Small robot. Very important responsibilities.",
  "Everything looks good from up here.",
  "Drag me somewhere with a better view!",
  "Taking a very important robot break.",
  "Still here. Still extremely helpful.",
];

const danceSentences = [
  "Tiny dance break.",
  "Compiling some dance moves...",
  "My developer did not teach me this.",
  "Celebrating absolutely nothing!",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function bounds() {
  return {
    left: Math.min(EDGE, Math.max(0, viewportWidth.value - SIZE)),
    right: Math.max(0, viewportWidth.value - SIZE - EDGE),
    top: Math.min(EDGE, Math.max(0, viewportHeight.value - SIZE)),
    bottom: Math.max(0, viewportHeight.value - SIZE - EDGE),
  };
}

const robotStyle = computed(() => ({
  transform: `translate3d(${x.value}px, ${y.value}px, 0)`,
}));

const controlsStyle = computed(() => {
  const controlsWidth = 116;
  const controlsHeight = 48;

  const left = clamp(
    x.value + SIZE / 2 - controlsWidth / 2,
    EDGE,
    viewportWidth.value - controlsWidth - EDGE
  );

  const below = y.value + SIZE + 6;

  const top =
    below + controlsHeight <= viewportHeight.value - EDGE
      ? below
      : y.value - controlsHeight - 6;

  return {
    left: `${left}px`,
    top: `${clamp(
      top,
      EDGE,
      viewportHeight.value - controlsHeight - EDGE
    )}px`,
  };
});

const speechStyle = computed(() => {
  const bubbleWidth = Math.min(
    180,
    Math.max(0, viewportWidth.value - EDGE * 2)
  );

  const gap = 6;

  const left = clamp(
    x.value + SIZE / 2 - bubbleWidth / 2,
    EDGE,
    viewportWidth.value - bubbleWidth - EDGE
  );

  // Above when there is room; otherwise just below the robot.
  const placeAbove = y.value >= 110 + gap + EDGE;

  return {
    left: `${left}px`,
    width: `${bubbleWidth}px`,
    top: placeAbove ? "auto" : `${y.value + SIZE + gap}px`,
    bottom: placeAbove
      ? `${viewportHeight.value - y.value + gap}px`
      : "auto",
  };
});

function contain() {
  const box = bounds();

  x.value = clamp(x.value, box.left, box.right);
  y.value = clamp(y.value, box.top, box.bottom);
}

function stopWalking() {
  velocityX = 0;
  velocityY = 0;
  targetX = x.value;
  targetY = y.value;
  moving.value = false;
}

function schedulePersonality(time = performance.now()) {
  nextPersonalityAction = time + 9000 + Math.random() * 9000;
}

function clearPersonality() {
  clearTimeout(speechTimer);
  clearTimeout(danceTimer);

  sentence.value = "";
  dancing.value = false;
  happy.value = false;
}

function resize() {
  viewportWidth.value = window.innerWidth;
  viewportHeight.value = window.innerHeight;

  contain();
  stopWalking();

  mode = "rest";
  nextAction = performance.now() + 1500;
}

function updateMotion() {
  reducedMotion.value = motionQuery?.matches ?? false;

  clearPersonality();
  stopWalking();

  mode = "rest";
  nextAction = performance.now() + 1500;
  schedulePersonality();
}

function say(text: string) {
  clearTimeout(speechTimer);
  sentence.value = text;
  happy.value = true;

  speechTimer = setTimeout(() => {
    sentence.value = "";
    happy.value = false;
  }, 4500);
}

function chat() {
  let index = Math.floor(Math.random() * sentences.length);

  if (index === previousSentence) {
    index = (index + 1) % sentences.length;
  }

  previousSentence = index;

  stopWalking();
  mode = "rest";
  nextAction = performance.now() + 4700;

  say(sentences[index]!);
}

function dance() {
  if (paused.value || reducedMotion.value) return;

  clearTimeout(danceTimer);
  stopWalking();

  mode = "rest";
  dancing.value = true;
  happy.value = true;

  // Randomly choose its usual dance or Balle Balle.
  danceStyle.value = Math.random() < 0.5 ? "normal" : "balle";

  if (danceStyle.value === "balle") {
    say("Balle Balle! Time for a little bhangra!");
  } else if (Math.random() < 0.5) {
    const index = Math.floor(
      Math.random() * danceSentences.length
    );

    say(danceSentences[index]!);
  }

  danceTimer = setTimeout(() => {
    dancing.value = false;

    if (!sentence.value) {
      happy.value = false;
    }

    nextAction = performance.now() + 1000;
  }, danceStyle.value === "balle" ? 4500 : 3200);
}

function updatePersonality(time: number) {
  const unavailable =
    hidden.value ||
    paused.value ||
    reducedMotion.value ||
    dragging.value ||
    dancing.value ||
    Boolean(sentence.value) ||
    controlsOpen.value ||
    hovered.value ||
    focused.value ||
    document.hidden ||
    mode === "glide";

  if (unavailable) {
    nextPersonalityAction = Math.max(
      nextPersonalityAction,
      time + 3000
    );
    return;
  }

  if (time < nextPersonalityAction) return;

  if (Math.random() < 0.45) {
    dance();
  } else {
    chat();
  }

  schedulePersonality(time);
}

function chooseAction(time: number) {
  const box = bounds();
  const choice = Math.random();

  if (choice < 0.22) {
    mode = "rest";
    stopWalking();
    nextAction = time + 1500 + Math.random() * 2500;
    return;
  }

  mode = choice > 0.78 ? "dash" : "explore";

  targetX =
    box.left + Math.random() * Math.max(0, box.right - box.left);

  targetY =
    box.top + Math.random() * Math.max(0, box.bottom - box.top);

  nextAction =
    time + (mode === "dash" ? 2200 : 5000 + Math.random() * 3000);
}

function bounce() {
  const box = bounds();

  if (x.value < box.left) {
    x.value = box.left;
    velocityX = Math.abs(velocityX) * 0.7;
  } else if (x.value > box.right) {
    x.value = box.right;
    velocityX = -Math.abs(velocityX) * 0.7;
  }

  if (y.value < box.top) {
    y.value = box.top;
    velocityY = Math.abs(velocityY) * 0.7;
  } else if (y.value > box.bottom) {
    y.value = box.bottom;
    velocityY = -Math.abs(velocityY) * 0.7;
  }
}

function animate(time: number) {
  const delta = lastFrame
    ? Math.min((time - lastFrame) / 1000, 0.04)
    : 0;

  lastFrame = time;
  updatePersonality(time);

  const blocked =
    hidden.value ||
    paused.value ||
    reducedMotion.value ||
    dragging.value ||
    dancing.value ||
    Boolean(sentence.value) ||
    controlsOpen.value ||
    document.hidden ||
    (mode !== "glide" && (hovered.value || focused.value));

  if (blocked) {
    moving.value = false;
  } else if (mode === "glide") {
    x.value += velocityX * delta;
    y.value += velocityY * delta;

    bounce();

    const friction = Math.exp(-2.2 * delta);

    velocityX *= friction;
    velocityY *= friction;
    moving.value = Math.hypot(velocityX, velocityY) > 12;

    if (!moving.value) {
      mode = "rest";
      stopWalking();
      nextAction = time + 1500;
    }
  } else {
    if (time >= nextAction) {
      chooseAction(time);
    }

    if (mode === "rest") {
      moving.value = false;
    } else {
      const dx = targetX - x.value;
      const dy = targetY - y.value;
      const distance = Math.hypot(dx, dy);

      if (distance < 5) {
        mode = "rest";
        stopWalking();
        nextAction = time + 800 + Math.random() * 1700;
      } else {
        const speed = mode === "dash" ? 170 : 60;
        const step = Math.min(distance, speed * delta);

        x.value += (dx / distance) * step;
        y.value += (dy / distance) * step;
        moving.value = true;

        contain();
      }
    }
  }

  frame = requestAnimationFrame(animate);
}

function startDrag(event: PointerEvent) {
  if (!event.isPrimary || event.button !== 0) return;
  if (activePointer !== null) return;

  event.preventDefault();

  const button = event.currentTarget as HTMLButtonElement;

  activePointer = event.pointerId;
  offsetX = event.clientX - x.value;
  offsetY = event.clientY - y.value;
  startX = event.clientX;
  startY = event.clientY;

  throwX = 0;
  throwY = 0;
  dragged = false;
  lastPointerTime = performance.now();

  stopWalking();
  button.setPointerCapture(event.pointerId);
}

function moveDrag(event: PointerEvent) {
  if (event.pointerId !== activePointer) return;

  const distance = Math.hypot(
    event.clientX - startX,
    event.clientY - startY
  );

  if (!dragged && distance > 5) {
    dragged = true;
    dragging.value = true;
    controlsOpen.value = false;
    clearPersonality();
  }

  if (!dragged) return;

  const now = performance.now();
  const delta = Math.max((now - lastPointerTime) / 1000, 0.008);
  const previousX = x.value;
  const previousY = y.value;

  x.value = event.clientX - offsetX;
  y.value = event.clientY - offsetY;

  contain();

  throwX = clamp((x.value - previousX) / delta, -900, 900);
  throwY = clamp((y.value - previousY) / delta, -900, 900);

  lastPointerTime = now;
}

function endDrag(event: PointerEvent) {
  if (event.pointerId !== activePointer) return;

  activePointer = null;
  dragging.value = false;
  hovered.value = false;

  const recentlyMoved =
    performance.now() - lastPointerTime < 120;

  const canThrow =
    event.type === "pointerup" &&
    dragged &&
    recentlyMoved &&
    !paused.value &&
    !reducedMotion.value;

  if (canThrow) {
    velocityX = throwX;
    velocityY = throwY;
    mode = "glide";
  } else {
    stopWalking();
    mode = "rest";
    nextAction = performance.now() + 2500;
  }

  contain();
  schedulePersonality();
}

function react(event: MouseEvent) {
  if (dragged && event.detail !== 0) {
    dragged = false;
    return;
  }

  controlsOpen.value = !controlsOpen.value;

  clearPersonality();
  stopWalking();

  mode = "rest";
  nextAction = performance.now() + 1500;
  schedulePersonality();
}

function togglePause() {
  paused.value = !paused.value;

  clearPersonality();
  stopWalking();

  mode = "rest";
  nextAction = performance.now() + 1500;
  schedulePersonality();

  if (!paused.value) {
    controlsOpen.value = false;
  }
}

function dismissRobot() {
  hidden.value = true;
  controlsOpen.value = false;
  hovered.value = false;
  focused.value = false;
  activePointer = null;
  dragging.value = false;

  clearPersonality();
  stopWalking();
}

function showRobot() {
  hidden.value = false;
  controlsOpen.value = false;
  hovered.value = false;
  focused.value = false;

  x.value = 24;
  y.value = window.innerHeight - SIZE - 28;

  resize();
  schedulePersonality();
}

function handleFocusOut(event: FocusEvent) {
  const container = event.currentTarget as HTMLElement;

  if (!container.contains(event.relatedTarget as Node | null)) {
    focused.value = false;
  }
}

function handleVisibility() {
  lastFrame = 0;

  if (document.hidden) {
    clearPersonality();
    stopWalking();
    mode = "rest";
  } else {
    nextAction = performance.now() + 1500;
    schedulePersonality();
  }
}

onMounted(() => {
  motionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  updateMotion();

  x.value = 24;
  y.value = window.innerHeight - SIZE - 28;

  resize();
  schedulePersonality();

  ready.value = true;

  motionQuery.addEventListener("change", updateMotion);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", handleVisibility);

  frame = requestAnimationFrame(animate);
});

onUnmounted(() => {
  cancelAnimationFrame(frame);
  clearTimeout(speechTimer);
  clearTimeout(danceTimer);

  motionQuery?.removeEventListener("change", updateMotion);
  window.removeEventListener("resize", resize);
  document.removeEventListener(
    "visibilitychange",
    handleVisibility
  );
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="ready && !hidden"
      class="robot-mascot"
     :class="{
        'is-dragging': dragging,
        'is-moving': moving,
        'is-happy': happy,
        'is-dancing': dancing,
        'is-balle': dancing && danceStyle === 'balle',
        'is-still': paused || reducedMotion,
        }"
      :style="robotStyle"
      role="group"
      aria-label="Robot mascot"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      @focusin="focused = true"
      @focusout="handleFocusOut"
    >
      <button
        type="button"
        class="robot-handle"
        aria-label="Robot companion. Click for pause and hide controls, or drag to move."
        title="Drag me, or click for controls"
        :aria-expanded="controlsOpen"
        :aria-controls="
          controlsOpen ? 'robot-mascot-controls' : undefined
        "
        @pointerdown="startDrag"
        @pointermove="moveDrag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
        @lostpointercapture="endDrag"
        @click="react"
        @keydown.esc="controlsOpen = false"
      >
        <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <!-- Ground shadow -->
        <ellipse
            cx="40"
            cy="73"
            rx="22"
            ry="4"
            fill="#153a3b"
            opacity=".12"
        />

        <g class="robot-body">
            <!-- Antenna -->
            <path
            d="M40 17V10"
            stroke="#153a3b"
            stroke-width="3"
            stroke-linecap="round"
            />
            <circle cx="40" cy="8" r="4" fill="#b77a50" />

            <!-- Left arm -->
            <g class="robot-arm-left">
            <path
                d="M17 43L11 52"
                stroke="#739b7d"
                stroke-width="7"
                stroke-linecap="round"
            />
            </g>

            <!-- Right arm -->
            <g class="robot-wave">
            <path
                d="M63 43L69 51"
                stroke="#739b7d"
                stroke-width="7"
                stroke-linecap="round"
            />
            </g>

            <!-- Left foot -->
            <rect
            class="robot-foot-left"
            x="25"
            y="62"
            width="11"
            height="9"
            rx="4"
            fill="#153a3b"
            />

            <!-- Right foot -->
            <rect
            class="robot-foot-right"
            x="44"
            y="62"
            width="11"
            height="9"
            rx="4"
            fill="#153a3b"
            />

            <!-- Body -->
            <rect
            x="20"
            y="43"
            width="40"
            height="23"
            rx="10"
            fill="#d5e6d8"
            stroke="#153a3b"
            stroke-width="2"
            />
            <circle cx="40" cy="56" r="3" fill="#b77a50" />

            <!-- Head -->
            <rect
            x="14"
            y="17"
            width="52"
            height="33"
            rx="13"
            fill="#e8eee8"
            stroke="#153a3b"
            stroke-width="2"
            />

            <!-- Face screen -->
            <rect
            x="20"
            y="23"
            width="40"
            height="21"
            rx="8"
            fill="#153a3b"
            />

            <!-- Eyes -->
            <g class="robot-eyes">
            <rect
                x="28"
                y="29"
                width="6"
                height="8"
                rx="3"
                fill="#d5e6d8"
            />
            <rect
                x="46"
                y="29"
                width="6"
                height="8"
                rx="3"
                fill="#d5e6d8"
            />
            </g>

            <!-- Happy smile -->
            <path
            v-if="happy"
            d="M36 38Q40 42 44 38"
            stroke="#d5e6d8"
            stroke-width="2"
            stroke-linecap="round"
            />
        </g>
        </svg>
      </button>
    </div>

    <div
      v-if="ready && !hidden && controlsOpen"
      id="robot-mascot-controls"
      class="robot-controls"
      :style="controlsStyle"
      role="group"
      aria-label="Robot controls"
      @pointerdown.prevent
      @keydown.esc="controlsOpen = false"
    >
      <button
        type="button"
        :aria-label="
          paused ? 'Resume robot activity' : 'Pause robot activity'
        "
        :aria-pressed="paused"
        @click="togglePause"
      >
        {{ paused ? "Play" : "Pause" }}
      </button>

      <button
        type="button"
        class="robot-close"
        aria-label="Hide robot"
        @click="dismissRobot"
      >
        ×
      </button>
    </div>

    <div
      v-if="ready && !hidden && sentence && !controlsOpen"
      class="robot-speech"
      :style="speechStyle"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ sentence }}
    </div>

    <button
      v-if="ready && hidden"
      type="button"
      class="robot-restore"
      @click="showRobot"
    >
      Show robot
    </button>
  </Teleport>
</template>

<style scoped>
.robot-mascot {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 150;
  width: 60px;
  height: 60px;
  user-select: none;
}

.robot-mascot,
.robot-controls,
.robot-speech,
.robot-restore {
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

.robot-mascot *,
.robot-controls * {
  box-sizing: border-box;
}

.robot-handle {
  display: block;
  width: 60px;
  height: 60px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  cursor: grab;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}

.robot-handle svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  filter: drop-shadow(0 4px 6px rgb(21 58 59 / 10%));
}

.is-dragging .robot-handle {
  cursor: grabbing;
}

.is-dragging .robot-handle svg {
  filter: drop-shadow(0 14px 10px rgb(21 58 59 / 22%));
}

.robot-body {
  transform-box: fill-box;
  transform-origin: center;
  animation: robot-idle 3s ease-in-out infinite;
}

.is-moving .robot-body {
  animation: robot-walk 280ms ease-in-out infinite;
}

.robot-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: robot-blink 5s infinite;
}

.robot-wave {
  transform-box: fill-box;
  transform-origin: top left;
}

.is-happy .robot-wave {
  animation: robot-wave 350ms ease-in-out 4 alternate;
}

.is-dancing .robot-body {
  animation: robot-dance 550ms ease-in-out infinite;
}

.is-dancing .robot-wave {
  animation: robot-wave 220ms ease-in-out infinite alternate;
}

.is-dragging .robot-body {
  animation: none;
  transform: rotate(-8deg);
}

.is-still .robot-body,
.is-still .robot-eyes,
.is-still .robot-wave {
  animation: none;
}

.robot-controls {
  position: fixed;
  z-index: 151;

  display: grid;
  grid-template-columns: minmax(0, 1fr) 36px;
  gap: 4px;

  width: 116px;
  height: 48px;
  padding: 5px;

  border: 1px solid #dce3de;
  border-radius: 12px;
  background: #f8f9f6;
  box-shadow: 0 8px 24px rgb(21 58 59 / 12%);
}

.robot-controls button {
  min-width: 0;
  padding: 0 5px;
  border: 0;
  border-radius: 7px;
  background: #e8eee8;
  color: #153a3b;
  font: inherit;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
}

.robot-controls button:hover {
  background: #d5e6d8;
}

.robot-controls .robot-close {
  font-size: 21px;
}

.robot-speech {
  position: fixed;
  z-index: 151;

  max-height: 110px;
  overflow: hidden;
  padding: 9px 11px;

  border: 1px solid #dce3de;
  border-radius: 11px;
  background: #f8f9f6;
  color: #153a3b;

  font-size: 11px;
  line-height: 1.5;
  overflow-wrap: anywhere;

  box-shadow: 0 6px 18px rgb(21 58 59 / 10%);
  pointer-events: none;
}

.robot-restore {
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 150;

  min-height: 44px;
  padding: 8px 12px;

  border: 1px solid #dce3de;
  border-radius: 9px;
  background: #f8f9f6;
  color: #153a3b;

  font-size: 11px;
  cursor: pointer;
}

.robot-handle:focus-visible,
.robot-controls button:focus-visible,
.robot-restore:focus-visible {
  outline: 2px solid #a75f32;
  outline-offset: 3px;
}

/* Rotate each arm around its shoulder in SVG coordinates. */
.is-balle .robot-arm-left {
  transform-box: view-box;
  transform-origin: 17px 43px;
  animation: balle-left-arm 420ms ease-in-out infinite;
}

.is-balle .robot-wave {
  transform-box: view-box;
  transform-origin: 63px 43px;
  animation: balle-right-arm 420ms ease-in-out infinite;
}

.is-balle .robot-body {
  animation: balle-hop 420ms ease-in-out infinite;
}

.is-balle .robot-foot-left {
  transform-box: fill-box;
  transform-origin: center;
  animation: balle-foot 420ms ease-in-out infinite;
}

.is-balle .robot-foot-right {
  transform-box: fill-box;
  transform-origin: center;
  animation: balle-foot 420ms ease-in-out infinite;
  animation-delay: -210ms;
}

@keyframes balle-hop {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }

  25% {
    transform: translateY(-6px) rotate(0);
  }

  50% {
    transform: translateY(0) rotate(5deg);
  }

  75% {
    transform: translateY(-6px) rotate(0);
  }
}

@keyframes balle-left-arm {
  0%, 100% {
    transform: rotate(125deg);
  }

  50% {
    transform: rotate(155deg);
  }
}

@keyframes balle-right-arm {
  0%, 100% {
    transform: rotate(-155deg);
  }

  50% {
    transform: rotate(-125deg);
  }
}

@keyframes balle-foot {
  0%, 100% {
    transform: translateY(0) rotate(0);
  }

  50% {
    transform: translateY(-4px) rotate(-12deg);
  }
}

@keyframes robot-idle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes robot-walk {
  0%, 100% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-3px) rotate(3deg);
  }
}

@keyframes robot-blink {
  0%, 42%, 46%, 100% {
    transform: scaleY(1);
  }
  44% {
    transform: scaleY(0.1);
  }
}

@keyframes robot-wave {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(-65deg);
  }
}

@keyframes robot-dance {
  0%, 100% {
    transform: translateY(0) rotate(-10deg);
  }
  25% {
    transform: translateY(-7px) rotate(8deg);
  }
  50% {
    transform: translateY(0) rotate(12deg);
  }
  75% {
    transform: translateY(-5px) rotate(-8deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .robot-body,
  .robot-eyes,
  .robot-wave {
    animation: none !important;
  }
}
</style>