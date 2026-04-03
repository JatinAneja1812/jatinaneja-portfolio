<script setup lang="ts">
import { fetchPosts } from '@/services/blogService';
import type { BlogPost } from '@/config/templateConfig';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const posts = ref<BlogPost[]>([]);
const loading = ref(true);
const router = useRouter();

let observer: IntersectionObserver | null = null;

const initializeAnimation = () => {
  const container = document.getElementById('animatedContainer');
  if (!container) return;

  const elements = container.querySelectorAll<HTMLElement>('[data-animation-order]');

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        const order = parseInt(target.dataset.animationOrder || '0', 10);
        setTimeout(() => {
          target.style.opacity = '1';
        }, order * 100);
        observer?.unobserve(target);
      }
    });
  }, { threshold: 0.1 });

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
</script>

<template>
  <div id="animatedContainer" class="my-4 grid gap-3 sm:grid-cols-6 lg:grid-cols-9 xl:px-16">
    <template v-if="!loading && posts.length">
      <div
        class="card w-full sm:col-span-3 lg:col-span-3 rounded-md post animate-fade-in delay-200 relative overflow-hidden cursor-pointer group"
        v-for="(post, index) in posts"
        :key="post.slug"
        :data-animation-order="index"
        @click.prevent="goToPost(post.slug)"
        style="border: 1px solid black;"
      >
        <figure class="relative">
          <img
            :src="post.coverImage.url"
            alt="Blog Post Cover"
            class="rounded-xl w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span class="overlay-text">Read More</span>
          </div>
        </figure>

        <div class="card-body justify-between py-4">
          <h2 class="card-title">{{ post.title }}</h2>
          <p class="text-sm text-slate-700">{{ post.excerpt }}</p>
          <div class="card-actions mt-1">
            <div class="badge badge-ghost badge-outline">
              {{ new Date(post.publishedAt).toLocaleDateString('en-GB') }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="loading" class="col-span-full text-center py-10 font-ppen">Loading posts...</div>
    <div v-else class="col-span-full text-center py-10 font-ppen">No posts found. Update templateConfig.blog.posts.</div>
  </div>
</template>

<style scoped>
.overlay-text {
  font-family: 'PPEN';
  font-size: 1.5rem;
  font-style: italic;
  font-weight: 100;
  color: white;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.8);
}

.card {
  position: relative;
  overflow: hidden;
}

.card figure {
  position: relative;
  margin: 0;
  padding: 1rem 1.25rem;
}

.card img {
  transition: transform 0.3s ease-in-out;
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

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.card-title {
  font-family: 'PPEN';
  font-weight: 400;
  font-style: normal;
  font-size: 1.5rem;
  margin-top: 5px;
}

.badge {
  font-family: 'PPEN';
  font-weight: 100;
  font-style: normal;
  padding-top: 0.35rem;
  padding-bottom: 0.25rem;
}
</style>
