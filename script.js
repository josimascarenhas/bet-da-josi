(function () {
  "use strict";

  const COLORS = {
    teal: "#21536d",
    tealLight: "#2d6d8f",
    sidebar: "#cad9e0",
    accent: "#2b6cb0",
    palette: ["#21536d", "#2d6d8f", "#2b6cb0", "#4a90a4", "#6ba3b8", "#cad9e0"],
  };

  const chartDefaults = {
    color: COLORS.teal,
    font: { family: "'DM Sans', system-ui, sans-serif", size: 11 },
  };

  Chart.defaults.color = "#4a5f6b";
  Chart.defaults.font.family = chartDefaults.font.family;
  Chart.defaults.plugins.legend.display = false;

  function initSkillsRadar() {
    const canvas = document.getElementById("skillsRadar");
    if (!canvas) return;

    new Chart(canvas, {
      type: "radar",
      data: {
        labels: [
          "Backend",
          "Frontend",
          "Cloud",
          "DevOps",
          "Dados",
          "Segurança",
        ],
        datasets: [
          {
            label: "Nível",
            data: [88, 82, 90, 85, 72, 78],
            backgroundColor: "rgba(33, 83, 109, 0.25)",
            borderColor: COLORS.teal,
            borderWidth: 2,
            pointBackgroundColor: COLORS.teal,
            pointRadius: 4,
            pointHoverRadius: 6,
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
            grid: { color: "rgba(33, 83, 109, 0.15)" },
            angleLines: { color: "rgba(33, 83, 109, 0.12)" },
            pointLabels: { font: { size: 10, weight: "600" } },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.r}%`,
            },
          },
        },
        animation: {
          duration: 1400,
          easing: "easeOutQuart",
        },
      },
    });
  }

  function initStackBar() {
    const canvas = document.getElementById("stackBar");
    if (!canvas) return;

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: [
          "TypeScript",
          "Python",
          "AWS",
          "Docker",
          "PostgreSQL",
          "React",
        ],
        datasets: [
          {
            label: "Proficiência",
            data: [92, 85, 88, 90, 84, 86],
            backgroundColor: COLORS.palette.map((c, i) =>
              i % 2 === 0 ? COLORS.teal : COLORS.tealLight
            ),
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 0,
            max: 100,
            grid: { color: "rgba(33, 83, 109, 0.08)" },
            ticks: { callback: (v) => v + "%" },
          },
          y: {
            grid: { display: false },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x}%`,
            },
          },
        },
        animation: {
          duration: 1200,
          delay: (ctx) => ctx.dataIndex * 80,
        },
      },
    });
  }

  function initExpertiseDonut() {
    const canvas = document.getElementById("expertiseDonut");
    const legendEl = document.getElementById("donutLegend");
    if (!canvas) return;

    const labels = [
      "Backend & APIs",
      "Frontend",
      "Infra & Cloud",
      "Dados & ML",
      "Liderança",
    ];
    const data = [32, 22, 26, 12, 8];

    new Chart(canvas, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: COLORS.palette.slice(0, 5),
            borderWidth: 2,
            borderColor: "#f4f8fa",
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "58%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
        animation: {
          animateRotate: true,
          duration: 1500,
        },
      },
    });

    if (legendEl) {
      legendEl.innerHTML = labels
        .map(
          (label, i) =>
            `<li><span class="donut-legend__swatch" style="background:${COLORS.palette[i]}"></span>${label} (${data[i]}%)</li>`
        )
        .join("");
    }
  }

  function animateCounters() {
    const counters = document.querySelectorAll(".metric-card__value[data-count]");
    const duration = 1600;

    counters.forEach((el) => {
      const target = parseInt(el.getAttribute("data-count"), 10);
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  function setupReveal() {
    const revealSelectors = [
      ".block",
      ".timeline-entry",
      ".lang",
      ".metric-card",
    ];

    const nodes = document.querySelectorAll(revealSelectors.join(", "));
    nodes.forEach((node) => node.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          if (entry.target.classList.contains("lang")) {
            entry.target.classList.add("is-visible");
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    nodes.forEach((node) => observer.observe(node));

    document.querySelectorAll(".lang").forEach((lang) => {
      const level = lang.getAttribute("data-level");
      if (level) lang.style.setProperty("--level", level);
    });
  }

  function setupFooter() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const printBtn = document.getElementById("printBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }
  }

  function init() {
    if (typeof Chart === "undefined") {
      console.warn("Chart.js não carregou. Gráficos desativados.");
      return;
    }

    initSkillsRadar();
    initStackBar();
    initExpertiseDonut();
    setupReveal();
    animateCounters();
    setupFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
