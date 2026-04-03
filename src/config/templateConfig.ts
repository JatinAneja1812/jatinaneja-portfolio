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
  date: string;
  title: string;
  organization: string;
  organizationUrl?: string;
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
    toolkit: {
      languages: string[];
      frameworks: string[];
      databases: string[];
      tools: string[];
    };
    whatIDo: string[];
    currentFocus: string;
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
    credentials: TimelineItem[];
  };
  blog: {
    posts: BlogPost[];
  };
}

export const templateConfig: TemplateConfig = {
  site: {
    title: "Portfolio Template",
    footerName: "Template Owner",
    footerTaglineDesktop: "Built with curiosity, shipped with consistency.",
    footerTaglineMobile: "Built with curiosity"
  },
  profile: {
    heading: "About",
    intro:
      "Hi, I am a software engineer focused on practical products and thoughtful user experiences. I enjoy building things that are reliable, useful, and easy to evolve.",
    toolkit: {
      languages: ["TypeScript", "Python", "Go", "SQL"],
      frameworks: ["Vue", "Node.js", "Express", "Tailwind CSS"],
      databases: ["PostgreSQL", "MongoDB", "Redis"],
      tools: ["GitHub", "Docker", "Figma", "Linear"]
    },
    whatIDo: [
      "Design and ship full-stack features from idea to production.",
      "Improve internal workflows with automation and better tooling.",
      "Translate ambiguous requirements into clear technical plans."
    ],
    currentFocus:
      "Current focus: product architecture, developer experience, and scalable frontend systems."
  },
  contact: {
    email: "hello@example.dev",
    links: [
      {
        label: "Resume",
        url: "https://example.com/resume.pdf"
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/your-handle"
      },
      {
        label: "GitHub",
        url: "https://github.com/your-handle"
      }
    ]
  },
  newsletter: {
    title: "Subscribe",
    description:
      "Subscribe for occasional notes on engineering, systems thinking, and lessons learned while shipping products.",
    placeholder: "Email",
    ctaLabel: "Subscribe",
    successLabel: "Subscribed"
  },
  abilities: {
    title: "Current Experiments",
    items: [
      { label: "System Design", value: 70 },
      { label: "Developer Tooling", value: 62 },
      { label: "Product Analytics", value: 54 },
      { label: "UI Craft", value: 66 },
      { label: "Automation", value: 74 }
    ]
  },
  timeline: {
    experience: [
      {
        id: "exp-1",
        date: "2024 - Present",
        title: "Software Engineer",
        organization: "Acme Digital",
        organizationUrl: "https://example.com",
        summary:
          "Building customer-facing features and internal automation tools for operations teams.",
        highlights: [
          "Led migration of legacy workflows to a modern web stack.",
          "Reduced onboarding time with reusable templates and docs.",
          "Introduced observability dashboards for faster incident response."
        ]
      },
      {
        id: "exp-2",
        date: "2022 - 2024",
        title: "Full-Stack Developer",
        organization: "Northwind Labs",
        summary:
          "Worked across frontend and backend services to deliver product improvements for SMB customers.",
        highlights: [
          "Shipped multiple end-to-end product modules with measurable adoption.",
          "Improved release confidence with CI quality gates.",
          "Partnered with design to improve accessibility and responsiveness."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        date: "2019 - 2023",
        title: "BSc in Computer Science",
        organization: "Sample University",
        organizationUrl: "https://example.edu",
        summary: "Coursework in software engineering, distributed systems, and HCI.",
        highlights: [
          "Capstone: collaboration dashboard with real-time updates.",
          "Student engineering society organizer."
        ]
      },
      {
        id: "edu-2",
        date: "2021",
        title: "Summer Program in Product Strategy",
        organization: "Open Learning Institute",
        summary: "Focused on product discovery, experimentation, and execution."
      }
    ],
    credentials: [
      {
        id: "cred-1",
        date: "2025",
        title: "Cloud Fundamentals",
        organization: "Cloud Academy",
        summary: "Core cloud architecture and deployment practices.",
        links: [{ label: "View Certificate", url: "https://example.com/cert/cloud" }]
      },
      {
        id: "cred-2",
        date: "2024",
        title: "Applied Machine Learning",
        organization: "Open Institute",
        summary: "Hands-on model training, evaluation, and deployment basics.",
        links: [{ label: "View Certificate", url: "https://example.com/cert/ml" }]
      }
    ]
  },
  blog: {
    posts: [
      {
        slug: "designing-reliable-side-projects",
        title: "Designing Reliable Side Projects",
        excerpt:
          "A practical framework for choosing small, durable bets that survive beyond the first week.",
        publishedAt: "2026-02-04",
        coverImage: {
          url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80"
        },
        content: {
          markdown: "# Designing Reliable Side Projects\n\nMost side projects fail because they are oversized and underspecified.\n\n## Start with constraints\n\nSet clear boundaries for time, scope, and success metrics.\n\n## Bias toward maintenance-friendly choices\n\nChoose tools your future self can understand in one sitting.\n\n## Define done before you start\n\nA project is complete when it solves one clear problem for one clear audience."
        }
      },
      {
        slug: "frontend-performance-by-default",
        title: "Frontend Performance by Default",
        excerpt:
          "Simple defaults that keep pages fast without turning performance into a separate project.",
        publishedAt: "2025-11-21",
        coverImage: {
          url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80"
        },
        content: {
          markdown: "# Frontend Performance by Default\n\nPerformance improves when your defaults are opinionated.\n\n## Keep dependencies intentional\n\nAudit packages regularly and remove dead code paths.\n\n## Optimize where users feel it\n\nFocus first on first load, interaction delay, and visual stability.\n\n## Measure continuously\n\nTrack regressions in CI so slowdowns are caught early."
        }
      },
      {
        slug: "writing-better-engineering-notes",
        title: "Writing Better Engineering Notes",
        excerpt:
          "A lightweight note format that makes your decisions searchable and reusable.",
        publishedAt: "2025-09-15",
        coverImage: {
          url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80"
        },
        content: {
          markdown: "# Writing Better Engineering Notes\n\nGood notes reduce repeated decisions and speed up collaboration.\n\n## Use one-page decision logs\n\nCapture context, options considered, and final choice.\n\n## Link outcomes back to decisions\n\nUpdate old notes with what happened in production.\n\n## Keep language concrete\n\nWrite so teammates can execute without needing a meeting."
        }
      }
    ]
  }
};