import "./style.css";
import homeTemplate from "./pages/home.html?raw";
import rpsTemplate from "./pages/rps.html?raw";
import { createRouter, navigate } from "./router.js";
import { initRps } from "./games/rps/rps-app.js";

const app = document.querySelector("#app");

function initThemeToggle(root = document) {
  const toggle = root.querySelector("#theme-toggle");
  if (!toggle || toggle.dataset.themeInit) {
    return;
  }
  toggle.dataset.themeInit = "true";

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialDark = savedTheme ? savedTheme === "dark" : prefersDark;
  document.body.classList.toggle("dark", initialDark);
  toggle.checked = initialDark;

  toggle.addEventListener("change", () => {
    const isDark = toggle.checked;
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

const translations = {
  en: {
    "nav.games": "Games",
    "nav.project": "Project",
    "nav.start": "Get Started",
    "toggle.lang": "Español",
    "toggle.theme": "Dark mode",
    "hero.eyebrow": "Modular mini arcade",
    "hero.title": "A vibrant lobby for your classic favorites.",
    "hero.lead": "A Vanilla JavaScript + Vite experience focused on clean architecture, reusable logic, and a UI that adapts to every screen.",
    "hero.ctaPrimary": "Enter the arcade",
    "hero.ctaSecondary": "View modular logic",
    "stats.games": "Games ready",
    "stats.responsive": "Responsive",
    "stats.build": "Fast build",
    "panel.nextTitle": "Next tournament",
    "panel.nextGame": "Rock Paper Scissors",
    "panel.nextDesc": "Streaks, confetti, and the same vibrant style.",
    "panel.tagFast": "Fast",
    "panel.tagClassic": "Classic",
    "panel.tagBest": "Best of 3",
    "panel.exploreTitle": "Exploration mode",
    "panel.exploreGame": "Memory + Breakout",
    "panel.exploreDesc": "Short levels, steady rhythm, and clean challenges.",
    "panel.progress": "Progress",
    "games.title": "Pick your game",
    "games.subtitle": "Modular classes, consistent experience, same retro energy.",
    "games.rpsDesc": "Quick duel with effects and built-in dark mode.",
    "games.playNow": "Play now",
    "games.memoryDesc": "Visual memory with short rounds and direct feedback.",
    "games.openBoard": "Open board",
    "games.breakoutDesc": "Dynamic rebounds, clean levels, steady pace.",
    "games.start": "Start",
    "games.froggerDesc": "Precise movement and classic stages.",
    "games.cross": "Cross",
    "games.connectDesc": "Fast turns and perfect tactics for duels.",
    "games.challenge": "Challenge",
    "games.spaceDesc": "Retro waves and combos that raise the energy.",
    "games.defend": "Defend",
    "cta.title": "Built to grow.",
    "cta.desc": "Scalable architecture, reusable logic, and shared styles to ship more games without losing consistency.",
    "cta.button": "Go to lobby",
    "rps.title": "Rock, Paper, Scissors",
    "rps.match": "Match",
    "rps.best3": "Best of 3",
    "rps.best5": "Best of 5",
    "rps.scoreYou": "You",
    "rps.scoreCpu": "CPU",
    "rps.computerChoice": "Computer Choice",
    "rps.yourChoice": "Your Choice",
    "rps.result": "Result",
    "rps.rock": "Rock 🪨",
    "rps.paper": "Paper 📄",
    "rps.scissors": "Scissors ✂️",
    "rps.funFact": "Pick a move to reveal a fun fact.",
    "rps.reset": "Reset Match",
    "notFound.title": "Route not found.",
    "notFound.desc": "Head back to the main lobby to keep playing.",
    "notFound.button": "Back to lobby",
  },
  es: {
    "nav.games": "Juegos",
    "nav.project": "Proyecto",
    "nav.start": "Empezar",
    "toggle.lang": "English",
    "toggle.theme": "Modo oscuro",
    "hero.eyebrow": "Mini arcade modular",
    "hero.title": "Un lobby vibrante para tus clasicos favoritos.",
    "hero.lead": "Una experiencia construida con Vanilla JavaScript y Vite, enfocada en arquitectura limpia, logica reutilizable y una interfaz que se adapta a cada pantalla.",
    "hero.ctaPrimary": "Entrar al arcade",
    "hero.ctaSecondary": "Ver logica modular",
    "stats.games": "Juegos listos",
    "stats.responsive": "Responsive",
    "stats.build": "Build rapido",
    "panel.nextTitle": "Proximo torneo",
    "panel.nextGame": "Rock Paper Scissors",
    "panel.nextDesc": "Rachas, confetti y el mismo estilo vibrante.",
    "panel.tagFast": "Rapido",
    "panel.tagClassic": "Clasico",
    "panel.tagBest": "Best of 3",
    "panel.exploreTitle": "Modo exploracion",
    "panel.exploreGame": "Memory + Breakout",
    "panel.exploreDesc": "Niveles cortos, ritmo constante y desafios limpios.",
    "panel.progress": "Progreso",
    "games.title": "Selecciona tu juego",
    "games.subtitle": "Clases modulares, experiencia consistente, misma energia retro.",
    "games.rpsDesc": "Duelo express con efectos y modo oscuro integrado.",
    "games.playNow": "Jugar ahora",
    "games.memoryDesc": "Memoria visual con tiempos cortos y feedback directo.",
    "games.openBoard": "Abrir tablero",
    "games.breakoutDesc": "Rebotes dinamicos, niveles limpios y ritmo continuo.",
    "games.start": "Empezar",
    "games.froggerDesc": "Movimiento preciso y escenarios clasicos.",
    "games.cross": "Cruzar",
    "games.connectDesc": "Turnos rapidos y tactica perfecta para duelos.",
    "games.challenge": "Desafiar",
    "games.spaceDesc": "Oleadas retro y combos que suben la energia.",
    "games.defend": "Defender",
    "cta.title": "Construido para crecer.",
    "cta.desc": "Arquitectura escalable, logica reusable y estilos compartidos para lanzar mas juegos sin perder consistencia.",
    "cta.button": "Ir al lobby",
    "rps.title": "Piedra, Papel, Tijera",
    "rps.match": "Partida",
    "rps.best3": "Mejor de 3",
    "rps.best5": "Mejor de 5",
    "rps.scoreYou": "Tu",
    "rps.scoreCpu": "CPU",
    "rps.computerChoice": "Eleccion CPU",
    "rps.yourChoice": "Tu eleccion",
    "rps.result": "Resultado",
    "rps.rock": "Piedra 🪨",
    "rps.paper": "Papel 📄",
    "rps.scissors": "Tijeras ✂️",
    "rps.funFact": "Elige un movimiento para revelar un dato curioso.",
    "rps.reset": "Reiniciar partida",
    "notFound.title": "Ruta no encontrada.",
    "notFound.desc": "Vuelve al lobby principal para seguir jugando.",
    "notFound.button": "Volver",
  },
};

function applyLanguage(root = document, lang = "en") {
  const dict = translations[lang] || translations.en;
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
  root.querySelectorAll(".lang-flag").forEach((img) => {
    if (lang === "es") {
      img.src = "/assets/icons/united-states.png";
      img.alt = "English";
    } else {
      img.src = "/assets/icons/mexico.png";
      img.alt = "Español";
    }
  });
  document.documentElement.lang = lang === "es" ? "es" : "en";
  window.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
}

function initLanguageToggle(root = document) {
  const button = root.querySelector("#language-toggle");
  if (!button || button.dataset.langInit) {
    const savedLang = localStorage.getItem("lang") || "en";
    applyLanguage(root, savedLang);
    return;
  }
  button.dataset.langInit = "true";

  const savedLang = localStorage.getItem("lang") || "en";
  applyLanguage(root, savedLang);

  button.addEventListener("click", () => {
    const current = localStorage.getItem("lang") || "en";
    const next = current === "en" ? "es" : "en";
    localStorage.setItem("lang", next);
    applyLanguage(document, next);
  });
}
function bindRouteLinks() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-route]");
    if (!target) {
      return;
    }
    event.preventDefault();
    navigate(target.dataset.route);
  });
}

function renderHome() {
  return homeTemplate;
}

function renderRps() {
  return rpsTemplate;
}

function renderNotFound() {
  return `
    <div class="page">
      <section class="cta">
        <div>
          <h2 data-i18n="notFound.title">Route not found.</h2>
          <p data-i18n="notFound.desc">Head back to the main lobby to keep playing.</p>
        </div>
        <button class="btn primary" data-route="/" type="button" data-i18n="notFound.button">Back to lobby</button>
      </section>
    </div>
  `;
}

bindRouteLinks();

createRouter({
  outlet: app,
  routes: {
    "/": {
      render: renderHome,
      onMount: () => {
        document.body.classList.remove("rps");
        initThemeToggle();
        initLanguageToggle();
      },
    },
    "/rps": {
      render: renderRps,
      onMount: () => {
        document.body.classList.add("rps");
        initThemeToggle();
        initLanguageToggle();
        initRps();
      },
      onLeave: () => {
        document.body.classList.remove("rps");
      },
    },
    "/404": {
      render: renderNotFound,
      onMount: () => {
        document.body.classList.remove("rps");
        initThemeToggle();
        initLanguageToggle();
      },
    },
  },
  onRouteChange: () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
}).start();
