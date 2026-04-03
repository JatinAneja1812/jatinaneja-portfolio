<script setup lang="ts">
import { onMounted, ref, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPost } from '@/services/blogService';
import { marked } from 'marked';
import TableOfContents from '@/components/shared/TableOfContents.vue';

const mathBlockExtension = {
  name: 'mathBlock',
  level: 'block',
  start(src: string) {
    return src.indexOf('$$');
  },
  tokenizer(src: string) {
    const rule = /^\$\$([\s\S]+?)\$\$/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'mathBlock',
        raw: match[0],
        text: match[1].trim()
      };
    }
    return undefined;
  },
  renderer(token: { text: string }) {
    return `$$${token.text}$$`;
  }
};

const mathInlineExtension = {
  name: 'mathInline',
  level: 'inline',
  start(src: string) {
    return src.indexOf('$');
  },
  tokenizer(src: string) {
    const rule = /^\$([^\$]+?)\$/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'mathInline',
        raw: match[0],
        text: match[1].trim()
      };
    }
    return undefined;
  },
  renderer(token: { text: string }) {
    return `$${token.text}$`;
  }
};

marked.use({ extensions: [mathBlockExtension, mathInlineExtension] });

const route = useRoute();
const loading = ref(true);

const post = ref({
  title: '',
  content: { markdown: '' },
  coverImage: { url: '' },
  publishedAt: ''
});

const loadPost = async (slugParam: string | string[] | undefined) => {
  const slug = typeof slugParam === 'string' ? slugParam : '';
  loading.value = true;

  const data = await fetchPost(slug);
  if (data) {
    post.value = data;
  } else {
    post.value = {
      title: 'Post not found',
      content: { markdown: '# Post not found\n\nUpdate templateConfig.blog.posts to add this slug.' },
      coverImage: { url: 'https://images.unsplash.com/photo-1505236738415-9d479aef7835?auto=format&fit=crop&w=1400&q=80' },
      publishedAt: new Date().toISOString().slice(0, 10)
    };
  }

  loading.value = false;
};

onMounted(() => {
  loadPost(route.params.slug);
});

watch(
  () => route.params.slug,
  (newSlug) => {
    loadPost(newSlug);
  }
);

const fixAlignAttributes = (markdown: string) => {
  return markdown.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+align="([^"]+)")?\)/g,
    (_match, alt, url, alignVal) => {
      if (alignVal && alignVal.toLowerCase() === 'center') {
        return `<p style="text-align: center;"><img src="${url}" alt="${alt}" /></p>`;
      }
      if (alignVal) {
        return `<p style="text-align: ${alignVal};"><img src="${url}" alt="${alt}" /></p>`;
      }
      return `![${alt}](${url})`;
    }
  );
};

const renderedMarkdown = computed(() => {
  const processedMarkdown = fixAlignAttributes(post.value.content.markdown);
  return marked.parse(processedMarkdown);
});

watch(renderedMarkdown, async () => {
  await nextTick();
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([document.querySelector('.prose')]).catch((err: unknown) => console.error(err));
  }
});
</script>

<template>
  <template v-if="loading">
    <div class="flex flex-col items-center w-full mx-auto py-8 px-4">
      <img class="w-full mb-6 rounded-md object-cover skeleton" style="height: 500px;" />
      <div class="flex flex-col md:flex-row items-start md:items-center w-full mb-6">
        <p class="text-sm text-gray-600 mt-2 md:mt-0 skeleton">
          <span class="font-semibold skeleton" style="width: 80px;">&nbsp;</span>&nbsp;
        </p>
      </div>
      <hr class="w-full border-black border-1-2 mb-6" />
      <h1 class="blog-title mb-6 text-gray-900 skeleton" style="width: 100%;">&nbsp;</h1>
    </div>
  </template>

  <template v-else>
    <TableOfContents content-selector=".prose" />

    <div class="flex flex-col items-center w-full mx-auto py-6 px-4">
      <img
        :src="post.coverImage.url"
        alt="Blog Cover Image"
        class="w-full mb-6 rounded-xl object-cover"
        style="max-height: 500px; max-width: 1400px;"
      />

      <div class="card rounded-md mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-3">
          <p class="text-sm text-gray-600 mt-2 md:mt-0">
            <span class="meta-info font-semibold">Published on</span>
            {{ new Date(post.publishedAt).toLocaleDateString('en-GB') }}
          </p>
        </div>

        <hr class="w-full border-black border-1-2 mb-6" />

        <h1 class="blog-title mb-6 text-gray-900">
          {{ post.title }}
        </h1>

        <div class="mx-auto prose text-justify w-full sm:prose-sm md:prose-md lg:prose-lg" v-html="renderedMarkdown"></div>
      </div>
    </div>
  </template>
</template>

<style scoped>
.card {
  background: white !important;
}

.border-1-2 {
  border-width: 1.2px;
}

.meta-info {
  font-family: 'PPEN';
  font-weight: 400;
  font-size: 1rem;
  margin-bottom: 5px;
  color: #13333bcc;
}

.blog-title {
  font-family: 'PPEN';
  font-weight: 200;
  font-style: normal;
  font-size: clamp(2rem, 5vw, 4rem);
  margin-top: 5px;
  line-height: clamp(2.4rem, 5vw, 4.8rem);
  color: #13343B;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  font-family: 'PPEN' !important;
  font-weight: 100 !important;
  font-style: italic !important;
  color: #13333bcc !important;
  text-align: left !important;
  scroll-margin-top: 120px !important;
  position: relative !important;
}

.prose :deep(h1) {
  font-size: clamp(2.5rem, 3vw, 3rem) !important;
  margin-bottom: 10px !important;
  margin-top: 30px !important;
}

.prose :deep(h2) {
  font-size: clamp(2rem, 2.5vw, 2.5rem) !important;
  margin-bottom: 8px !important;
  margin-top: 25px !important;
}

.prose :deep(h3) {
  font-size: clamp(1.5rem, 2vw, 2rem) !important;
  margin-bottom: 6px !important;
  margin-top: 20px !important;
}

.prose :deep(ul),
.prose :deep(ol),
.prose-sm :deep(ul),
.prose-sm :deep(ol),
.prose-md :deep(ul),
.prose-md :deep(ol),
.prose-lg :deep(ul),
.prose-lg :deep(ol) {
  margin-top: 0.3rem !important;
  margin-bottom: 0.3rem !important;
  padding-left: 1.5em !important;
}

.prose :deep(li),
.prose-sm :deep(li),
.prose-md :deep(li),
.prose-lg :deep(li) {
  margin-top: 0.25rem !important;
  margin-bottom: 0.25rem !important;
  padding-left: 0 !important;
  font-family: 'FKGN' !important;
  color: #13333bcc !important;
}

.prose :deep(li > p),
.prose-sm :deep(li > p),
.prose-md :deep(li > p),
.prose-lg :deep(li > p) {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.prose :deep(ul li)::marker,
.prose-sm :deep(ul li)::marker,
.prose-md :deep(ul li)::marker,
.prose-lg :deep(ul li)::marker,
.prose :deep(ol li)::marker,
.prose-sm :deep(ol li)::marker,
.prose-md :deep(ol li)::marker,
.prose-lg :deep(ol li)::marker {
  font-family: 'FKGN' !important;
  color: #13333bcc !important;
}

.prose :deep(strong),
.prose-sm :deep(strong),
.prose-md :deep(strong),
.prose-lg :deep(strong),
.prose :deep(b),
.prose-sm :deep(b),
.prose-md :deep(b),
.prose-lg :deep(b) {
  font-family: 'FKGN' !important;
  font-weight: 600 !important;
}

.prose {
  max-width: 90% !important;
  font-family: 'FKGN';
  color: #13333bcc;
}
</style>
