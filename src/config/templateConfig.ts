
import type { TemplateConfig } from "./templateTypes";
import { loadTestingDotnetApisMarkdown } from "../components/blog/BlogContent/load-testing-dotnet-api";
import { fromUniversityToProductionMarkdown } from "../components/blog/BlogContent/from-university-to-production";
import jatincv from "../assets/Jatin-CV.pdf";
import gdsccert from "../assets/GDSCCert.png";
import algovis from "../assets/algovis.png";
import cfs from "../assets/cfs.jpeg";
import thamcofoods from "../assets/thamcofoods.jpeg";
import thamco from "../assets/thamco.jpeg";
import pocketbeast from "../assets/pocketbeast.jpeg";
import furniture from "../assets/furniture.jpeg";
import loadtest from "../assets/loadTest.png";
import universitytoproduction from "../assets/universitytoproduction.png";


export const templateConfig: TemplateConfig = {
  site: {
    title: "Jatin Aneja · Software Engineer",
    footerName: "Jatin Aneja",
    footerTaglineDesktop:
      "✨Building clean, modern digital experiences with code and creativity 🛠️✨",
    footerTaglineMobile: "Building the Future, One Pixel at a time 👨‍💻 ✨",
  },
  profile: {
    heading: "About",
    intro:
      "I’m a software engineer specialising in full‑stack development with .NET Core and React, delivering scalable, secure and user‑centric systems across both monolithic and microservices architectures. I focus on writing clean, maintainable C# and JavaScript, building modern web applications and Electron‑based desktop apps that are reliable and easy to evolve.",
    intro2:
      "I’m passionate about creating efficient, scalable solutions with clear, well‑structured code, and about sharing knowledge and supporting others so teams can deliver at a consistently high standard.",
    toolkit: {
      languages: ["C#", "Java", "Python", "JavaScript", "PowerShell"],
      frameworks: [".NET Core", "React JS", "Android (Jetpack Compose)"],
      data: ["MySQL", "Firebase", "MongoDB", "PostgreSQL"],
      systems: ["VS & VS Code", "Postman", "Azure DevOps", "Grafana k6"],
    },
    spokenLanguages: {
      english: "Fluent",
      hindi: "Native",
      spanish: "Basic",
    },
    whatIDo: [
      "Lead end‑to‑end delivery of .NET Core and React applications, from requirements and architecture through to production release.",
      "Design and implement scalable, secure, maintainable solutions across both monolithic and microservices‑based systems.",
      "Embed performance monitoring and load/stress testing with Grafana k6, and drive CI/CD and DevOps practices using Azure DevOps.",
      "Harden applications with secure‑by‑default patterns, threat‑aware design and applied cybersecurity practices.",
      "Explore and integrate AI/ML capabilities into web applications, from prototypes through to production‑ready features.",
    ],
    currentFocus:
      "Advancing my expertise in AI and machine learning, with a focus on building ML-powered applications and integrating these capabilities into reliable, scalable, cloud-native solutions using secure code best practices.",
  },
  contact: {
    email: "jatinaneja2000@outlook.com",
    links: [
      {
        label: "Resume",
        url: jatincv,
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/jatin-aneja-b931651a3",
      },
      {
        label: "GitHub",
        url: "https://github.com/JatinAneja1812",
      },
    ],
  },
  abilities: {
    title: "Hobbies & Strengths",
    items: [
      { label: "Deep Work & Focused Problem‑Solving", value: 70 },
      { label: "Continuous Learning (AI/ML, New Tools)", value: 80 },
      { label: "Systematic Debugging", value: 86 },
      { label: "Clean Code & Pragmatic Architecture", value: 74 },
      { label: "Fitness & Discipline (Swimming, Gym)", value: 75 },
      { label: "Creative Outlets (Sketching, UI-Designing)", value: 82 },
      { label: "Technical Leadership & Mentoring", value: 80 },
    ],
  },
  timeline: {
    experience: [
      {
        id: "exp-1",
        date: "2025 - Present",
        title: "Software Engineer",
        organization: "TEKGEM UK Ltd (Sedgefield)",
        icon: "@assets/tekgem-logo.png",
        organizationUrl: "https://www.tekgem.co",
        summary:
          "Leading full-cycle delivery of secure, cloud-ready .NET Core and React applications for critical infrastructure and enterprise clients.",
        highlights: [
          "Own end-to-end development from requirements discovery and solution design through implementation, automated testing and deployment.",
          "Architect and deliver scalable, maintainable services across monolithic and microservices environments with a strong security-first mindset.",
          "Drive performance, reliability and observability using k6, Grafana and structured logging to catch issues early and keep SLAs on track.",
          "Mentor junior developers, review code and champion clean architecture, testing discipline and modern engineering practices within the team.",
        ],
      },
      {
        id: "exp-2",
        date: "2024 - 2025",
        title: "Graduate Software Developer",
        organization: "TEKGEM UK Ltd (Sedgefield)",
        organizationUrl: "https://www.tekgem.co",
        summary:
          "Strengthened core engineering skills while taking on increasing ownership of production features in .NET Core and React solutions.",
        highlights: [
          "Implemented new features and enhancements across the stack, from REST APIs and data access layers to responsive React UIs.",
          "Collaborated with senior engineers on design decisions, code reviews and refactoring to improve performance and maintainability.",
          "Helped evolve CI/CD pipelines and release processes, contributing to smoother, more reliable deployments for customer environments.",
        ],
      },
      {
        id: "exp-3",
        date: "2022 - 2024",
        title: "Student Software Developer (Part‑Time)",
        organization: "TEKGEM UK Ltd (Sedgefield)",
        organizationUrl: "https://www.tekgem.co",
        summary:
          "Gained hands-on experience building and maintaining enterprise-grade systems alongside my Computer Science degree.",
        highlights: [
          "Contributed to real client projects, fixing bugs, implementing smaller features and learning production-grade patterns and tooling.",
          "Worked closely with cross‑functional teams to understand requirements and deliver changes aligned with business priorities.",
          "Balanced part‑time work with full‑time study, demonstrating strong time management, ownership and commitment to continuous learning.",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        date: "2020 - 2024",
        title: "BSc (Hons) Computer Science – First Class Honours",
        organization: "Teesside University",
        organizationUrl: "https://www.tees.ac.uk",
        summary:
          "Coursework in computing projects, immersive technology, applied machine learning, IoT, system design patterns, algorithms and cybersecurity.",
        highlights: [
          "Completed a computing project involving immersive technology and systems design.",
          "Developed strong foundations in algorithms, data structures and networks and security.",
        ],
      },
      {
        id: "edu-2",
        date: "2021",
        title: "Applied Cybersecurity – Summer University",
        organization: "Teesside University",
        summary:
          "Intensive summer programme focused on applied cybersecurity concepts and practical defensive techniques.",
      },
    ],
    certificates: [
      {
        id: "cred-1",
        date: "2022 - 2023",
        title: "Web Development Technical Director",
        organization: "Google Developer Student Club · Teesside University",
        summary:
          "Led the technical direction of the GDSC web track, planning and delivering hands‑on React / .NET workshops and mentoring students on modern web development practices.",
        highlights: [
          "Organised and ran regular coding sessions covering frontend architectures, API integration and deployment workflows.",
          "Designed events and hackathons that grew the active developer community on campus.",
          "Strengthened public speaking and leadership while coordinating content and logistics alongside studies.",
        ],
        images: [gdsccert], // put your cert image here
        links: [],
      },
      {
        id: "cred-2",
        date: "2021 - 2022",
        title: "Course Representative · BSc Computer Science",
        organization: "Teesside University",
        summary:
          "Elected to represent Computer Science students, collecting feedback and working with academics to improve teaching and assessment.",
        highlights: [
          "Facilitated student feedback and presented key themes to programme leaders.",
          "Helped shape changes to module delivery and communication based on student experience.",
          "Built stakeholder communication and negotiation skills now used with product owners and clients.",
        ],
        links: [],
      },
    ],
    projects: [
      {
        id: "proj-1",
        title: "Algorithms Visualizer · Desktop App",
        organization: "Final Year Project · Teesside University",
        organizationUrl: "",
        summary:
          "C# desktop application that visualises core algorithms step‑by‑step to support interactive e‑learning.",
        highlights: [
          "Implemented visual animations for algorithms such as linear search, merge sort, quick sort, Dijkstra and A*, mapping each algorithm step to a clear UI state so learners can follow the logic.",
          "Designed an architecture that separates algorithm logic from rendering, making it easy to plug in new algorithms or change visual themes without rewriting core code.",
          "Built an integrated chat and file‑sharing panel so students can discuss runs, share test data and collaborate on problem‑solving directly inside the app.",
          "Focused on UX details such as speed controls, pausing, stepping forwards/backwards and colour‑coding to make complex behaviour approachable for non‑experts.",
        ],
        images: [algovis], // put your project image here
        links: [
          {
            label: "View on GitHub",
            url: "https://github.com/JatinAneja1812/E-AlgoViz.Backend",
          },
        ],
      },
      {
        id: "proj-2",
        title: "CFS Tracker · Mobile App",
        organization: "University Project",
        organizationUrl: "",
        images: [cfs], // put your project image here
        summary:
          "Mobile application designed to support people with chronic fatigue syndrome (CFS) by tracking key health signals over time.",
        highlights: [
          "Integrated device sensors to capture metrics such as heart rate and breathing patterns, then stored structured time‑series data for later analysis.",
          "Modelled user profiles and daily logs so patients can correlate symptoms with activity levels, sleep and other lifestyle factors.",
          "Designed low‑friction input flows and calm visual design specifically to reduce cognitive load for users already dealing with fatigue.",
          "Explored basic analytics and visualisations (trends and anomalies) to help patients and clinicians spot potential triggers and progress over time.",
        ],
        links: [
          {
            label: "View on GitHub",
            url: "https://github.com/JatinAneja2000/CFSTracker",
          },
        ],
      },
      {
        id: "proj-3",
        title: "Food Sales Management Website",
        organization: ".NET Core & React",
        organizationUrl: "",
        summary:
          "Full‑stack web application for managing food sales, orders and inventory with a responsive admin interface.",
        highlights: [
          "Developed a .NET Core backend with an Azure‑hosted SQL database, exposing REST APIs for products, orders, inventory and reporting.",
          "Implemented a React frontend using reusable components for dashboards, forms and tables, ensuring good UX on both desktop and mobile.",
          "Added basic unit tests around core business logic and API endpoints to reduce regression risk as features evolved.",
          "Set up simple deployment scripts and configuration for different environments, practising CI/CD concepts and environment‑specific settings.",
        ],
        images: [thamcofoods], // put your project image here
        links: [
          {
            label: "View on GitHub",
            url: "https://github.com/JatinAneja1812/thamco_staff_frontendapp",
          },
        ],
      },
      {
        id: "proj-4",
        title: "ThAmCo Events Management",
        organization: "ASP.NET Core MVC",
        organizationUrl: "",
        summary:
          "Events and catering management system that streamlines creation and administration of events for staff.",
        highlights: [
          "Built an ASP.NET Core MVC application allowing staff to create events, assign venues and configure menus with validation and error handling.",
          "Designed relational models for events, venues, menus, guests and staff, enforcing realistic business rules via constraints and server‑side checks.",
          "Implemented full CRUD workflows with filtered lists, search and detail views to make day‑to‑day admin tasks faster and less error‑prone.",
          "Focused on clean separation between controllers, views and data access to keep the codebase maintainable and easy to extend.",
        ],
        images: [thamco], // put your project image here
        links: [
          {
            label: "View on GitHub",
            url: "https://github.com/JatinAneja1812/ThAmCoICA",
          },
        ],
      },
      {
        id: "proj-5",
        date: "Jan 2021 – Apr 2021",
        title: "Pocket Beast · Java Card Game",
        organization: "Java · OOP · Design Patterns",
        organizationUrl: "",
        summary:
          "Java card game that evolved from a console prototype into a full GUI application, applying solid object‑oriented design and networking concepts.",
        highlights: [
          "Started as a console‑based game and refactored into a proper Java GUI, separating core game logic from presentation to keep the codebase modular and testable.",
          "Applied Strategy, Singleton and Factory patterns to model behaviours such as card effects, game state management and object creation in a clean, extensible way.",
          "Implemented a built‑in chat feature using WebSockets and Java threading so players can communicate in real time while a match is in progress.",
          "Managed game state, turns and networking concurrently, ensuring the UI stays responsive while handling messages and game events in the background.",
        ],
        images: [pocketbeast], // put your project image here
        links: [
          {
            label: "View on GitHub",
            url: "https://github.com/JatinAneja2000/PocketBeast",
          },
        ],
      },
      {
        id: "proj-6",
        date: "Sep 2020 – Jan 2021",
        title: "Furniture Management System · Java GUI",
        organization: "Java Application Development (GUI / UX/UI)",
        organizationUrl: "",
        summary:
          "Desktop furniture management system built in Java with a graphical user interface for managing products and basic operations.",
        highlights: [
          "Designed and implemented a Java GUI to manage furniture items, including adding, updating and viewing products in a structured way.",
          "Separated UI components from core logic so the application remains maintainable and easier to extend with new features.",
          "Practised event‑driven programming, wiring up form inputs, buttons and validation to drive changes in the underlying data model.",
          "Paid attention to basic UX details such as clear labelling, layouts and feedback to make the tool usable for non‑technical users.",
        ],
        images: [furniture], // put your project image here
        links: [
          {
            label: "View on GitHub",
            url: "https://github.com/JatinAneja2000/FurnitureMain",
          },
        ],
      },
    ],
  },
  blog: {
    posts: [
      {
        slug: "load-testing-dotnet-apis",
        title: "Load Testing .NET APIs with k6 and Grafana",
        excerpt:
          "Practical notes from integrating k6 and Grafana into everyday development to keep services fast, observable and calm in production.",
        publishedAt: "2026-02-04",
        coverImage: {
          url: loadtest,
        },
        content: {
          markdown: loadTestingDotnetApisMarkdown,
        },
      },
      {
        slug: "from-university-to-production",
        title: "From University Projects to Production Systems",
        excerpt:
          "Reflections on the shift from assignments and capstones to long‑lived systems that customers depend on every day.",
        publishedAt: "2026-02-04",
        coverImage: {
          url: universitytoproduction,
        },
        content: {
          markdown: fromUniversityToProductionMarkdown,
        },
      },
      // {
      //   slug: "visualizing-algorithms",
      //   title: "Visualizing Algorithms for Better Learning",
      //   excerpt:
      //     "Why I built an Algorithms Visualizer desktop app and how visual tools can make complex algorithms easier to grasp.",
      //   publishedAt: "2025-09-15",
      //   coverImage: {
      //     url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
      //   },
      //   content: {
      //     markdown:
      //       "# Visualizing Algorithms for Better Learning\n\nA look at the Algorithms Visualizer app I built to help people understand algorithms like Merge Sort, Dijkstra and A* through animation and collaboration.",
      //   },
      // },
    ],
  },
};
