<script setup lang="ts">
import { fetchPosts } from '../../services/blogService';
import type { BlogPost } from '../../config/templateTypes';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowUpRight } from '@lucide/vue';

const posts = ref<BlogPost[]>([]);
const loading = ref(true);
const router = useRouter();

let observer: IntersectionObserver | null = null;

const initializeAnimation = () => {
  const container = document.getElementById('animatedContainer');

  if (!container) return;

  const elements = container.querySelectorAll<HTMLElement>(
    '[data-animation-order]'
  );

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const order = parseInt(
            target.dataset.animationOrder || '0',
            10
          );

          setTimeout(() => {
            target.style.opacity = '1';
          }, order * 100);

          observer?.unobserve(target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((element) => {
    element.style.opacity = '0';
    observer?.observe(element);
  });
};

onMounted(async () => {
  initializeAnimation();
  posts.value = await fetchPosts();
  loading.value = false;
});

onUnmounted(() => {
  observer?.disconnect();
});

function goToPost(slug: string) {
  router.push({ name: 'BlogPostDetail', params: { slug } });
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
</script>

<template>
  <section class="blog-section">
    <div class="section-container">
      <div class="section-heading" data-reveal>
        <div>
          <p class="eyebrow">Notes & ideas</p>
          <h2 class="section-title">
            Thinking out loud.
          </h2>
        </div>

        <p>
          A collection of notes, experiments,<br class="desktop-break" />
          and things I am learning along the way.
        </p>
      </div>

      <div id="animatedContainer" class="blog-grid">
        <template v-if="!loading && posts.length">
          <article
            v-for="(post, index) in posts"
            :key="post.slug"
            class="blog-card"
            :data-animation-order="index"
            @click.prevent="goToPost(post.slug)"
          >
            <figure class="blog-media">
              <img
                :src="post.coverImage.url"
                :alt="`${post.title} cover image`"
                loading="lazy"
                decoding="async"
              />

              <div class="blog-overlay" aria-hidden="true">
                <span class="overlay-text">
                  Read more
                  <ArrowUpRight :size="18" />
                </span>
              </div>
            </figure>

            <div class="blog-content">
              <time class="blog-date">
                {{ formatDate(post.publishedAt) }}
              </time>

              <h2 class="blog-title">
                {{ post.title }}
              </h2>

              <p class="blog-excerpt">
                {{ post.excerpt }}
              </p>

              <span class="blog-link">
                Read post
                <ArrowUpRight :size="16" />
              </span>
            </div>
          </article>
        </template>

        <div v-else-if="loading" class="blog-state">
          Loading posts...
        </div>

        <div v-else class="blog-state">
          No posts found. Update
          <code>templateConfig.blog.posts</code>.
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-section {
  padding-block: 110px;
  background: var(--paper, #f8f9f6);
  color: var(--ink, #153a3b);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.65;
}

.section-container {
  width: min(1160px, calc(100% - 96px));
  margin-inline: auto;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 65px;
}

.section-heading > p {
  max-width: 420px;
  color: var(--muted, #617372);
  font-size: 0.83rem;
  line-height: 1.8;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted, #617372);
  font-size: 0.66rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.section-title {
  margin-top: 18px;
  font-size: clamp(2.4rem, 4.8vw, 4rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.065em;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.blog-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line, #dce3de);
  border-radius: 18px;
  background: #ffffff;
  cursor: pointer;
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    border-color 220ms ease;
}

.blog-card:hover {
  transform: translateY(-4px);
  border-color: #b8c7b9;
  box-shadow: 0 18px 38px rgb(21 58 59 / 8%);
}

.blog-card:focus-visible {
  outline: 2px solid #a75f32;
  outline-offset: 6px;
}

.blog-media {
  position: relative;
  margin: 0;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: #eef2ed;
}

.blog-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 450ms ease;
}

.blog-card:hover .blog-media img {
  transform: scale(1.045);
}

.blog-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    to top,
    rgb(21 58 59 / 78%),
    rgb(21 58 59 / 10%)
  );
  opacity: 0;
  transition: opacity 250ms ease;
}

.blog-card:hover .blog-overlay,
.blog-card:focus-visible .blog-overlay {
  opacity: 1;
}

.overlay-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.blog-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
}

.blog-date {
  color: var(--muted, #617372);
  font-family: monospace;
  font-size: 0.67rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.blog-title {
  margin: 0;
  color: var(--ink, #153a3b);
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.035em;
}

.blog-excerpt {
  margin: 0;
  color: var(--muted, #617372);
  font-size: 0.84rem;
  line-height: 1.8;
}

.blog-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
  color: var(--ink, #153a3b);
  font-size: 0.76rem;
  font-weight: 600;
}

.blog-link svg {
  transition: transform 200ms ease;
}

.blog-card:hover .blog-link svg {
  transform: translate(2px, -2px);
}

.blog-state {
  grid-column: 1 / -1;
  padding-block: 70px;
  color: var(--muted, #617372);
  font-size: 0.9rem;
  text-align: center;
}

.blog-state code {
  padding: 2px 6px;
  border-radius: 5px;
  background: #eef2ed;
  font-size: 0.8rem;
}

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

.blog-card {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

@media (max-width: 1050px) {
  .section-container {
    width: calc(100% - 64px);
  }

  .blog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .blog-section {
    padding-block: 70px;
  }

  .section-container {
    width: calc(100% - 40px);
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 22px;
    margin-bottom: 38px;
  }

  .section-title {
    font-size: clamp(2.4rem, 8vw, 3.4rem);
  }

  .blog-grid {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .blog-content {
    padding: 20px;
  }

  .blog-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 420px) {
  .section-container {
    width: calc(100% - 32px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-card,
  .blog-media img,
  .blog-overlay,
  .blog-link svg {
    animation: none !important;
    transition: none !important;
  }
}
</style>