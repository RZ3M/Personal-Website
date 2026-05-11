export const HERO_TAGLINE =
  "Engineering elegant systems. Designing real things. Chasing the redline.";

export type ExperiencePart =
  | { type: "text"; content: string }
  | { type: "tag"; content: string }
  | { type: "strong"; content: string };

export type SkillColor = "red" | "blue" | "orange" | "green";

type SectionNavItem = {
  id: string;
  label: string;
};

export const sectionNav: readonly SectionNavItem[] = [
  { id: "hero", label: "HERO" },
  { id: "about", label: "ABOUT" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "contact", label: "CONTACT" },
];

export const aboutStats = [
  { number: "4", label: "Companies" },
  { number: "3.86", label: "GPA" },
  { number: "1", label: "Degree" },
  { number: "∞", label: "Curiosity" },
] as const;

export const experiences = [
  {
    lap: "SEP 2025 — Present",
    company: "DAYFORCE",
    role: "Software Engineer (DevOps)",
    location: "North York, ON",
    bullets: [
      [
        { type: "text", content: "Cut file load latency from " },
        { type: "strong", content: "1 min" },
        { type: "text", content: " to " },
        { type: "strong", content: "under 50 ms" },
        { type: "text", content: " by migrating file management to " },
        { type: "tag", content: "Azure Blob Storage" },
        { type: "text", content: " behind an in-memory blob/file-server resolver cache" },
      ],
      [
        { type: "text", content: "Built a " },
        { type: "tag", content: "C#" },
        { type: "text", content: "/" },
        { type: "tag", content: ".NET" },
        { type: "text", content: " deletion-queue workflow on " },
        { type: "tag", content: "SQL Server" },
        { type: "text", content: " that reclaimed " },
        { type: "strong", content: "60+ TB" },
        { type: "text", content: " by retiring " },
        { type: "strong", content: "5,000+" },
        { type: "text", content: " orphaned databases — lifecycle (notify, approve, backup, drop, unregister) with a " },
        { type: "tag", content: "React" },
        { type: "text", content: " approval UI and audit guardrails" },
      ],
      [
        { type: "text", content: "Migrated a core platform integration off a deprecated internal tool — refactored " },
        { type: "strong", content: "20+" },
        { type: "text", content: " call sites behind typed DTOs and mockable service abstractions" },
      ],
      [
        { type: "text", content: "Cut admin dashboard load times from 5–10 min to under 5 sec (" },
        { type: "strong", content: "99%+" },
        { type: "text", content: " faster) by collapsing N+1 per-service health polls into a single control-database query" },
      ],
      [
        { type: "text", content: "Cut CI pipeline runtime from 30 to 18 min (" },
        { type: "strong", content: "40%" },
        { type: "text", content: " faster) by mocking live " },
        { type: "tag", content: "Azure" },
        { type: "text", content: " calls, deduping build steps, and parallelizing tests" },
      ],
    ] satisfies ExperiencePart[][],
  },
  {
    lap: "SEP 2022 — APR 2023",
    company: "ROYAL BANK OF CANADA",
    role: "Software Engineer (Full Stack)",
    location: "Toronto, ON",
    bullets: [
      [
        { type: "text", content: "Shipped a " },
        { type: "tag", content: "React" },
        { type: "text", content: " + " },
        { type: "tag", content: "Redux" },
        { type: "text", content: " dashboard indexing " },
        { type: "strong", content: "1,000+" },
        { type: "text", content: " approved technologies for the Enterprise Architecture team, backed by " },
        { type: "tag", content: "Spring Boot" },
        { type: "text", content: " APIs" },
      ],
      [
        { type: "text", content: "Tuned " },
        { type: "tag", content: "MariaDB" },
        { type: "text", content: " / " },
        { type: "tag", content: "Elasticsearch" },
        { type: "text", content: " indices — cut service-metadata reports from 10s to " },
        { type: "strong", content: "3s" },
        { type: "text", content: " and reduced manual reporting effort by " },
        { type: "strong", content: "80%" },
      ],
      [
        { type: "text", content: "Upgraded " },
        { type: "strong", content: "10+" },
        { type: "text", content: " backend services to current Spring LTS, raising " },
        { type: "tag", content: "JUnit" },
        { type: "text", content: " coverage to " },
        { type: "strong", content: "80%" },
      ],
    ] satisfies ExperiencePart[][],
  },
  {
    lap: "SEP 2019 — DEC 2019",
    company: "IBM",
    role: "Cognos Support Engineer",
    location: "Ottawa, ON",
    bullets: [
      [
        { type: "text", content: "Debugged " },
        { type: "strong", content: "100+" },
        { type: "text", content: " production BI deployment issues across " },
        { type: "tag", content: "Cognos" },
        { type: "text", content: " by tracing logs, profiling report queries, and inspecting config/auth — maintaining " },
        { type: "strong", content: "98%+" },
        { type: "text", content: " uptime across enterprise client environments" },
      ],
      [
        { type: "text", content: "Built internal " },
        { type: "tag", content: "Bash" },
        { type: "text", content: " and " },
        { type: "tag", content: "PowerShell" },
        { type: "text", content: " diagnostic scripts that automated recurring health checks — cutting average triage time from " },
        { type: "strong", content: "45 min" },
        { type: "text", content: " to " },
        { type: "strong", content: "15 min" },
        { type: "text", content: " per case" },
      ],
    ] satisfies ExperiencePart[][],
  },
  {
    lap: "JAN 2019 — APR 2019",
    company: "ONTARIO MINISTRY OF EDUCATION",
    role: "QA Engineer",
    location: "Toronto, ON",
    bullets: [
      [
        { type: "text", content: "Improved release confidence across " },
        { type: "strong", content: "10+" },
        { type: "text", content: " web applications by leading functional, regression, accessibility, and security testing" },
      ],
      [
        { type: "text", content: "Cut test execution time by automating over " },
        { type: "strong", content: "90%" },
        { type: "text", content: " of test coverage using " },
        { type: "tag", content: "Selenium" },
        { type: "text", content: " and " },
        { type: "tag", content: "SQL Server" },
        { type: "text", content: ", improving reliability and repeatability across QA cycles" },
      ],
      [
        { type: "text", content: "Protected platform integrity by identifying pre-production " },
        { type: "strong", content: "security vulnerabilities" },
        { type: "text", content: " and enforcing " },
        { type: "tag", content: "WCAG 2.0" },
        { type: "text", content: " accessibility compliance before release" },
      ],
    ] satisfies ExperiencePart[][],
  },
] as const;

export const projects = [
  {
    badge: "LOCAL-FIRST RAG",
    name: "TERRARIA RAG",
    brief:
      "Spoiler-free Terraria assistant powered by local RAG over 3,671 wiki pages",
    backTitle: "TERRARIA RAG SYSTEM",
    description:
      "Local-first Python RAG that ingests 3,671 Terraria wiki pages into 22,005 Qdrant chunks for spoiler-free hints. Hit 81.8% recall@5, 95.5% content-recall@5, and 0.629 MRR via metadata filters, section reranking, and cross-encoders.",
    techStack: ["Python", "Qdrant", "Embeddings", "Cross-Encoders", "RAG"],
    href: "https://github.com/RZ3M/terraria-rag",
    delayClass: "reveal-delay-2",
  },
  {
    badge: "🏆 HACKHIVE 2025 WINNER",
    name: "FLASH.AI",
    brief:
      "AI-powered study assistant that converts raw notes into interactive quizzes",
    backTitle: "FLASH.AI",
    description:
      "Won HackHive 2025 by building a React/Vite + Express/MongoDB AI study assistant with a Google Gemini pipeline that converts PDF/TXT/DOCX into tagged, difficulty-rated quizzes. Returned to HackHive 2026 as a mentor representing Dayforce, hosting workshops for student builders.",
    techStack: ["Google Gemini", "React", "Vite", "Express", "MongoDB"],
    href: "https://github.com/Macpickle/Flash.AI",
    delayClass: "reveal-delay-3",
  },
  {
    badge: "3D INTERACTIVE",
    name: "CUBE 3D",
    brief:
      "Interactive 3D Rubik's Cube with drag turns, keyboard moves, and solve playback",
    backTitle: "CUBE 3D",
    description:
      "Interactive 3D Rubik's Cube built with React and Three.js, focused on direct manipulation through drag-based layer turns, keyboard controls, instant scramble/reset actions, and self solve.",
    techStack: ["React", "Three.js", "@react-three/fiber", "drei", "postprocessing", "Vite"],
    href: "https://github.com/RZ3M/cube-3d",
    demoHref: "https://cube-3d-weld.vercel.app/",
    delayClass: "reveal-delay-2",
  },
  {
    badge: "CLOUD NATIVE",
    name: "FRAGMENTS",
    brief:
      "Cloud-native file hosting platform with automated CI/CD and autoscaling",
    backTitle: "FRAGMENTS FILE HOSTING",
    description:
      "Cloud-native file hosting platform enabling secure upload, conversion, and storage for multiple file types. Fully automated CI/CD using GitHub Actions to build and deploy containers to AWS ECR/ECS with zero-touch deployments.",
    techStack: ["Node.js", "AWS S3", "Cognito", "Docker", "ECR/ECS", "GitHub Actions"],
    href: "https://github.com/RZ3M/fragments",
    delayClass: "reveal-delay-3",
  },
  {
    badge: "FREE CAD / 3D PRINT",
    name: "OIL CHANGE FUNNELS",
    brief:
      "Precision CAD funnel system for cleaner oil changes, storage, and engine-specific fitment",
    backTitle: "3D PRINTED CAR FUNNELS",
    description:
      "Designed precise screw-on oil funnels in CAD to thread cleanly onto engine fill ports, with a matching cap for mess-free storage and a built-in hanging hook. Released fully free designs spanning 3+ car brands and driving 3K+ downloads from the community.",
    techStack: ["CAD", "3D Printing", "Automotive", "DFM", "MakerWorld"],
    href: "https://makerworld.com/en/@grapes/upload",
    linkLabel: "VIEW ON MAKERWORLD",
    delayClass: "reveal-delay-2",
  },
] as const;

type SkillPanel = {
  title: string;
  delayClass: string;
  color: SkillColor;
  skills: readonly string[];
};

export const skillPanels = [
  {
    title: "LANGUAGES",
    delayClass: "reveal-delay-2",
    color: "red",
    skills: ["Python", "SQL", "C#", "TypeScript", "JavaScript", "Java", "Bash"],
  },
  {
    title: "FRAMEWORKS",
    delayClass: "reveal-delay-3",
    color: "blue",
    skills: [
      ".NET",
      "ASP.NET Core",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "Spring Boot",
      "REST APIs",
    ],
  },
  {
    title: "AI & DATA",
    delayClass: "reveal-delay-2",
    color: "green",
    skills: [
      "RAG",
      "Vector Search",
      "Embeddings",
      "Cross-Encoder Reranking",
      "Function Calling",
      "Structured Output",
      "Pandas/NumPy",
      "SQL Server",
      "MariaDB",
      "MongoDB",
      "Elasticsearch",
      "Supabase",
      "Qdrant",
    ],
  },
  {
    title: "CLOUD & TOOLS",
    delayClass: "reveal-delay-3",
    color: "orange",
    skills: [
      "Azure",
      "AWS",
      "Docker",
      "GitHub Actions",
      "Jenkins",
      "Git",
      "Linux",
      "CI/CD",
      "SonarQube",
    ],
  },
] satisfies SkillPanel[];

export const contactLinks = [
  {
    label: "Resume",
    href: "/Jack_2026.pdf",
    icon: "resume",
  },
  {
    label: "GitHub",
    href: "https://github.com/RZ3M",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jack-m-39a313181/",
    icon: "linkedin",
  },
  {
    label: "Email",
    href: "mailto:rzma0628@gmail.com",
    icon: "email",
  },
] as const;
