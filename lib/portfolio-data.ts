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
  { number: "3", label: "Companies" },
  { number: "3.86", label: "GPA" },
  { number: "2", label: "Degrees" },
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
        { type: "text", content: "Designed a " },
        { type: "tag", content: "C#" },
        {
          type: "text",
          content:
            " Database Deletion Queue worker automating cleanup of 5,000+ orphaned resources, restoring ",
        },
        { type: "strong", content: "60+ TB" },
        { type: "text", content: " of storage" },
      ],
      [
        { type: "text", content: "Built a hybrid file-management service in " },
        { type: "tag", content: ".NET" },
        {
          type: "text",
          content: " integrating on-prem servers with ",
        },
        { type: "tag", content: "Azure Blob" },
        {
          type: "text",
          content: " via Managed Identity — eliminating credential incidents",
        },
      ],
      [
        { type: "text", content: "Cut page load & build times " },
        { type: "strong", content: "2×" },
        { type: "text", content: " with a new " },
        { type: "tag", content: "React" },
        { type: "text", content: " + " },
        { type: "tag", content: "Next.js" },
        {
          type: "text",
          content: ", automated tests, and ",
        },
        { type: "tag", content: "GitHub Actions" },
        { type: "text", content: " CI/CD" },
      ],
    ] satisfies ExperiencePart[][],
  },
  {
    lap: "SEP 2022 — APR 2023",
    company: "ROYAL BANK OF CANADA",
    role: "Software Developer (Full Stack)",
    location: "Toronto, ON",
    bullets: [
      [
        { type: "text", content: "Boosted reporting efficiency " },
        { type: "strong", content: "80%" },
        { type: "text", content: " with real-time " },
        { type: "tag", content: "React" },
        { type: "text", content: " dashboards and " },
        { type: "tag", content: "Spring Boot" },
        { type: "text", content: " REST APIs" },
      ],
      [
        { type: "text", content: "Optimized " },
        { type: "tag", content: "MariaDB" },
        { type: "text", content: " queries and " },
        { type: "tag", content: "Elasticsearch" },
        { type: "text", content: " indices — report gen dropped from 10s to " },
        { type: "strong", content: "3s" },
      ],
      [
        {
          type: "text",
          content:
            "Upgraded backend from Spring 5 → 6, refactored legacy modules, pushed test coverage to ",
        },
        { type: "strong", content: "95%" },
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
        { type: "text", content: "Resolved " },
        { type: "strong", content: "100+" },
        { type: "text", content: " complex client issues maintaining " },
        { type: "strong", content: "98%+" },
        { type: "text", content: " system uptime" },
      ],
      [
        { type: "text", content: "Automated deployment workflows with " },
        { type: "tag", content: "Bash" },
        { type: "text", content: " & " },
        { type: "tag", content: "Python" },
        {
          type: "text",
          content: ", cutting onboarding from days to hours",
        },
      ],
    ] satisfies ExperiencePart[][],
  },
] as const;

export const projects = [
  {
    badge: "🏆 HACKHIVE 2ND PLACE",
    name: "FLASH.AI",
    brief:
      "AI-powered study assistant that converts raw notes into interactive quizzes",
    backTitle: "FLASH.AI",
    description:
      "Built an award-winning study assistant using Google Gemini that converts raw notes into quizzes with secure JWT authentication and scalable real-time generation. Handled 500+ concurrent requests during launch.",
    techStack: ["Google Gemini", "React", "Node.js", "Express", "MongoDB", "JWT"],
    href: "https://github.com/Macpickle/Flash.AI",
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
] as const;

type SkillPanel = {
  title: string;
  delayClass: string;
  color: SkillColor;
  skills: readonly { label: string; value: number }[];
};

export const skillPanels = [
  {
    title: "LANGUAGES",
    delayClass: "reveal-delay-2",
    color: "red",
    skills: [
      { label: "C#", value: 92 },
      { label: "Java", value: 90 },
      { label: "Python", value: 88 },
      { label: "TypeScript", value: 90 },
      { label: "C/C++", value: 78 },
      { label: "SQL", value: 85 },
      { label: "Bash", value: 80 },
    ],
  },
  {
    title: "FRAMEWORKS",
    delayClass: "reveal-delay-3",
    color: "blue",
    skills: [
      { label: "React", value: 92 },
      { label: "Next.js", value: 88 },
      { label: "Spring Boot", value: 90 },
      { label: ".NET", value: 90 },
      { label: "Node.js", value: 88 },
      { label: "Express", value: 85 },
      { label: "Angular", value: 72 },
    ],
  },
  {
    title: "DEVOPS & CLOUD",
    delayClass: "reveal-delay-2",
    color: "orange",
    skills: [
      { label: "Docker", value: 90 },
      { label: "Azure", value: 88 },
      { label: "AWS", value: 85 },
      { label: "CI/CD", value: 92 },
      { label: "Jenkins", value: 80 },
      { label: "Git", value: 95 },
      { label: "Linux", value: 85 },
    ],
  },
  {
    title: "CONCEPTS",
    delayClass: "reveal-delay-3",
    color: "green",
    skills: [
      { label: "Full Stack", value: 94 },
      { label: "Microservices", value: 88 },
      { label: "REST APIs", value: 95 },
      { label: "Automation", value: 92 },
      { label: "Cloud Arch.", value: 88 },
      { label: "DevOps", value: 90 },
      { label: "Testing", value: 88 },
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
