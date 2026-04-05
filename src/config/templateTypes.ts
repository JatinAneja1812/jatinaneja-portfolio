
export interface ExternalLink {
  label: string;
  url: string;
}

export interface AbilityItem {
  label: string;
  value: number;
}

export interface TimelineItem {
  id: string;
  date?: string;
  title: string;
  organization: string;
  organizationUrl?: string;
  icon?: string;
  images?: string[];
  summary: string;
  highlights?: string[];
  links?: ExternalLink[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage: {
    url: string;
  };
  content: {
    markdown: string;
  };
}

export interface TemplateConfig {
  site: {
    title: string;
    footerName: string;
    footerTaglineDesktop: string;
    footerTaglineMobile: string;
  };
  profile: {
    heading: string;
    intro: string;
    intro2: string;
    toolkit: {
      languages: string[];
      frameworks: string[];
      data: string[];
      systems: string[];
    };
    whatIDo: string[];
    currentFocus: string;
    spokenLanguages: {
      english: string;
      hindi: string;
      spanish: string;
    };
  };
  contact: {
    email: string;
    links: ExternalLink[];
  };
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    ctaLabel: string;
    successLabel: string;
  };
  abilities: {
    title: string;
    items: AbilityItem[];
  };
  timeline: {
    experience: TimelineItem[];
    education: TimelineItem[];
    certificates: TimelineItem[];
    projects: TimelineItem[];
  };
  blog: {
    posts: BlogPost[];
  };
}
