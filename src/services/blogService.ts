import { templateConfig, type BlogPost } from '@/config/templateConfig';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchPosts = async (): Promise<BlogPost[]> => {
  await delay(120);
  return [...templateConfig.blog.posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

export const fetchPost = async (slug: string): Promise<BlogPost | null> => {
  await delay(120);
  const post = templateConfig.blog.posts.find((entry) => entry.slug === slug);
  return post ?? null;
};
