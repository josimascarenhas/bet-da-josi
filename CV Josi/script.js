/**
 * Currículo — Josi Evellyn Mascarenhas
 * Atualize o objeto PROFILE com os dados do seu LinkedIn (experiências, datas, e-mail).
 */

const PROFILE = {
  role: "Profissional de Marketing em transição para Tecnologia",
  pitch:
    "Combino visão de negócio, comunicação e dados do marketing com fundamentos práticos em desenvolvimento web e IA. Busco oportunidades em tech onde estratégia, produto e execução digital se encontram.",
  location: "Brasil",
  email: "", // ex.: "seu@email.com" — deixe vazio para ocultar
  phone: "",
  linkedin: "https://www.linkedin.com/in/josievellyn/",
  github: "",

  tags: [
    "Marketing Digital",
    "Transição de Carreira",
    "HTML · CSS · JS",
    "IA Generativa",
    "Remoto ou híbrido",
  ],

  about:
    "Profissional de Marketing com experiência em comunicação, presença digital e campanhas orientadas a resultado. Estou em transição ativa para a área de tecnologia, aplicando o repertório de growth, conteúdo e análise de performance em projetos com código, automação e ferramentas de IA. Valorizo ambientes colaborativos, aprendizado contínuo e impacto mensurável.",

  highlights: [
    { value: "Marketing", label: "Base de carreira" },
    { value: "Tech", label: "Nova direção profissional" },
    { value: "IA", label: "Pós-graduação em andamento" },
    { value: "100%", label: "Disponível para conversar" },
  ],

  skillBars: {
    marketing: [
      { name: "Marketing Digital", level: 90 },
      { name: "Redes Sociais & Conteúdo", level: 88 },
      { name: "Comunicação & Branding", level: 85 },
      { name: "Analytics & Métricas", level: 75 },
      { name: "CRM & Automação", level: 70 },
    ],
    tech: [
      { name: "HTML, CSS & JavaScript", level: 65 },
      { name: "IA Generativa & Prompts", level: 72 },
      { name: "Ferramentas No-Code / Low-Code", level: 68 },
      { name: "Git & Versionamento", level: 55 },
      { name: "Lógica & Resolução de Problemas", level: 70 },
    ],
  },

  skillTags: [
    "Google Analytics",
    "Meta Ads",
    "Canva",
    "Copywriting",
    "SEO básico",
    "HTML5",
    "CSS3",
    "JavaScript",
    "ChatGPT / Copilot",
    "Notion",
    "Excel",
    "Aprendizado ágil",
  ],

  radar: {
    labels: [
      "Marketing",
      "Comunicação",
      "Dados",
      "Criatividade",
      "Tech / Código",
      "IA & Automação",
    ],
    data: [90, 88, 78, 85, 62, 72],
  },

  donut: {
    labels: ["Marketing", "Tech & Código", "IA & Inovação"],
    data: [45, 30, 25],
  },

  experience: [
    {
      period: "Atualizar período",
      role: "Cargo em Marketing",
      company: "Nome da empresa · Cidade/UF",
      bullets: [
        "Planejamento e execução de campanhas digitais alinhadas aos objetivos de negócio.",
        "Gestão de redes sociais, calendário editorial e produção de conteúdo.",
        "Acompanhamento de métricas (alcance, engajamento, conversão) para otimização contínua.",
        "Colaboração com times comercial, produto e atendimento.",
      ],
    },
    {
      period: "Atualizar período",
      role: "Cargo anterior (opcional)",
      company: "Nome da empresa",
      bullets: [
        "Apoio em ações de comunicação, branding e relacionamento com o público.",
        "Participação em projetos de lançamento, eventos ou campanhas sazonais.",
      ],
    },
  ],

  education: [
    {
      title: "Pós-graduação IA Builder",
      org: "Formação em Inteligência Artificial e construção de soluções digitais",
      period: "Em andamento",
    },
    {
      title: "Formação em Marketing / Comunicação",
      org: "Instituição · Atualize com seu histórico acadêmico",
      period: "Ano — Ano",
    },
  ],

  projects: [
    {
      title: "Currículo interativo (este site)",
      description:
        "Portfólio em HTML, CSS e JavaScript com visual moderno, gráficos de competências e versão para impressão em PDF.",
      tags: ["HTML", "CSS", "JavaScript", "Chart.js"],
    },
    {
      title: "Projeto de transição para tech",
      description:
        "Substitua por um case real: landing page, automação com IA, dashboard ou campanha com foco em dados.",
      tags: ["IA", "Marketing", "Web"],
    },
    {
      title: "Seu próximo projeto",
      description:
        "Adicione links de GitHub, Behance ou LinkedIn com trabalhos que reforcem sua migração para tecnologia.",
      tags: ["Portfólio"],
    },
  ],

  cta:
    "Aberta a vagas júnior, trainee, estágio ou posições híbridas (marketing tech, produto digital, customer success, conteúdo técnico). Vamos conversar?",
};

const COLORS = {
  primary: "#7C6CF0",
  accent: "#F472B6",
  accentSoft: "#FB923C",
  muted: "#64748B",
  grid: "rgba(255, 255, 255, 0.08)",
};

function $(id) {
  return document.getElementById(id);
}

function renderProfile() {
  $("heroRole").textContent = PROFILE.role;
  $("heroPitch").textContent = PROFILE.pitch;
  $("aboutLead").textContent = PROFILE.about;
  $("ctaText").textContent = PROFILE.cta;

  const tagsEl = $("heroTags");
  tagsEl.innerHTML = PROFILE.tags.map((t) => `<li>${t}</li>`).join("");

  const facts = [
    { label: "Localização", value: PROFILE.location },
    {
      label: "LinkedIn",
      value: `<a href="${PROFILE.linkedin}" target="_blank" rel="noopener noreferrer">linkedin.com/in/josievellyn</a>`,
    },
  ];

  if (PROFILE.email) {
    facts.push({
      label: "E-mail",
      value: `<a href="mailto:${PROFILE.email}">${PROFILE.email}</a>`,
    });
  }
  if (PROFILE.phone) {
    facts.push({
      label: "Telefone",
      value: `<a href="tel:${PROFILE.phone.replace(/\D/g, "")}">${PROFILE.phone}</a>`,
    });
  }
  if (PROFILE.github) {
    facts.push({
      label: "GitHub",
      value: `<a href="${PROFILE.github}" target="_blank" rel="noopener noreferrer">${PROFILE.github.replace(/^https?:\/\//, "")}</a>`,
    });
  }

  $("quickFacts").innerHTML = facts
    .map(
      (f) => `<div><dt>${f.label}</dt><dd>${f.value}</dd></div>`
    )
    .join("");

  $("highlights").innerHTML = PROFILE.highlights
    .map(
      (h) =>
        `<article class="highlight-card"><strong>${h.value}</strong><span>${h.label}</span></article>`
    )
    .join("");

  $("skillColumns").innerHTML = `
    <div class="skill-col">
      <h3>Marketing &amp; negócios</h3>
      ${PROFILE.skillBars.marketing.map(skillBarHtml).join("")}
    </div>
    <div class="skill-col">
      <h3>Tecnologia &amp; inovação</h3>
      ${PROFILE.skillBars.tech.map(skillBarHtml).join("")}
    </div>
  `;

  $("skillTags").innerHTML = PROFILE.skillTags
    .map((t) => `<li>${t}</li>`)
    .join("");

  $("timeline").innerHTML = PROFILE.experience
    .map(
      (job) => `
      <li class="timeline__item">
        <div class="timeline__period">${job.period}</div>
        <div class="timeline__body">
          <h3>${job.role}</h3>
          <p class="timeline__company">${job.company}</p>
          <ul>${job.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
        </div>
      </li>`
    )
    .join("");

  $("education").innerHTML = PROFILE.education
    .map(
      (edu) => `
      <li>
        <strong>${edu.title}</strong>
        <span class="edu-meta">${edu.org}</span>
        <time>${edu.period}</time>
      </li>`
    )
    .join("");

  $("projects").innerHTML = PROFILE.projects
    .map(
      (p) => `
      <article class="project-card">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="project-card__tags">
          ${p.tags.map((t) => `<span>${t}</span>`).join("")}
        </div>
      </article>`
    )
    .join("");

  const ctaActions = $("ctaActions");
  let ctaHtml = `<a class="btn btn--primary" href="${PROFILE.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`;
  if (PROFILE.email) {
    ctaHtml += `<a class="btn btn--ghost" href="mailto:${PROFILE.email}">E-mail</a>`;
  }
  ctaActions.innerHTML = ctaHtml;
}

function skillBarHtml({ name, level }) {
  return `
    <div class="skill-bar" data-level="${level}">
      <div class="skill-bar__head">
        <span>${name}</span>
        <span>${level}%</span>
      </div>
      <div class="skill-bar__track">
        <div class="skill-bar__fill" style="width: 0"></div>
      </div>
    </div>`;
}

function initCharts() {
  if (typeof Chart === "undefined") return;

  Chart.defaults.color = "#94A3B8";
  Chart.defaults.font = { family: "'Outfit', system-ui, sans-serif", size: 12 };
  Chart.defaults.plugins.legend.labels.usePointStyle = true;

  const radarCtx = $("chartRadar");
  if (radarCtx) {
    new Chart(radarCtx, {
      type: "radar",
      data: {
        labels: PROFILE.radar.labels,
        datasets: [
          {
            data: PROFILE.radar.data,
            backgroundColor: "rgba(124, 108, 240, 0.25)",
            borderColor: COLORS.primary,
            borderWidth: 2,
            pointBackgroundColor: COLORS.accent,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { stepSize: 25, backdropColor: "transparent" },
            grid: { color: COLORS.grid },
            angleLines: { color: COLORS.grid },
            pointLabels: { font: { size: 10, weight: "600" } },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  const donutCtx = $("chartDonut");
  if (donutCtx) {
    new Chart(donutCtx, {
      type: "doughnut",
      data: {
        labels: PROFILE.donut.labels,
        datasets: [
          {
            data: PROFILE.donut.data,
            backgroundColor: [COLORS.primary, COLORS.accent, COLORS.accentSoft],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { padding: 12, font: { size: 11 } },
          },
        },
      },
    });
  }
}

function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar");
  const run = () => {
    bars.forEach((bar) => {
      const fill = bar.querySelector(".skill-bar__fill");
      const level = bar.dataset.level || "0";
      if (fill) fill.style.width = `${level}%`;
    });
  };

  const section = $("skills");
  if (!section) {
    run();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        run();
        observer.disconnect();
      }
    },
    { threshold: 0.2 }
  );
  observer.observe(section);
}

function initScrollReveal() {
  const sections = document.querySelectorAll(".reveal");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    sections.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  sections.forEach((el) => observer.observe(el));
}

function initActiveNav() {
  const headerLinks = document.querySelectorAll(".nav a, .nav-mobile a");
  const sections = [...headerLinks]
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        headerLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((s) => observer.observe(s));
}

function initMobileNav() {
  const toggle = $("navToggle");
  const mobile = $("navMobile");
  const desktopNav = document.querySelector(".nav");

  if (!toggle || !mobile || !desktopNav) return;

  mobile.innerHTML = desktopNav.innerHTML;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    mobile.hidden = open;
  });

  mobile.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      mobile.hidden = true;
    });
  });
}

function initPrint() {
  const btn = $("printBtn");
  if (btn) btn.addEventListener("click", () => window.print());
}

function initYear() {
  const yearEl = $("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  initYear();
  initMobileNav();
  initScrollReveal();
  initActiveNav();
  initPrint();
  initSkillBars();
  initCharts();
});
