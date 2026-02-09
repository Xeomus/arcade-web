import "./rps-style.css";


export function initRps(root = document) {
  const scope = root;
  const gameRoot = scope.querySelector(".game");
  if (!gameRoot || gameRoot.dataset.rpsInit) {
    return;
  }
  gameRoot.dataset.rpsInit = "true";

  const computerChoiceDisplay = scope.getElementById("computer-choice");
  const userChoiceDisplay = scope.getElementById("user-choice");
  const resultDisplay = scope.getElementById("result");
  const userEmojiDisplay = scope.getElementById("user-emoji");
  const computerEmojiDisplay = scope.getElementById("computer-emoji");
  const resultEmojiDisplay = scope.getElementById("result-emoji");
  const funFactDisplay = scope.getElementById("fun-fact");
  const scoreUserDisplay = scope.getElementById("score-user");
  const scoreCpuDisplay = scope.getElementById("score-cpu");
  const confettiContainer = scope.getElementById("confetti");
  const themeToggle = scope.getElementById("theme-toggle");

  const choiceButtons = scope.querySelectorAll(".choice-btn");
  const modeButtons = scope.querySelectorAll(".mode-btn");
  const resetButton = scope.getElementById("reset");

  const choices = ["rock", "paper", "scissors"];
  const emojis = {
    rock: "\u{1FAA8}",
    paper: "\u{1F4C4}",
    scissors: "\u2702\uFE0F",
  };
  const resultEmojis = {
    win: "\u{1F389}",
    lose: "\u{1F4A5}",
    draw: "\u{1F91D}",
    match: "\u{1F3C6}",
  };

  const translations = {
    en: {
      choices: {
        rock: "Rock",
        paper: "Paper",
        scissors: "Scissors",
      },
      result: {
        draw: "It's a draw!",
        win: "You win!",
        lose: "You lose!",
        matchWin: "Match win!",
        matchLose: "Match lost!",
      },
      reset: {
        soft: (wins) => `New match! First to ${wins} wins.`,
        prompt: "Pick a move to reveal a fun fact.",
        end: "New match? Hit reset or switch modes.",
      },
      funFacts: [
        "Rock beats scissors, but scissors have sharper style.",
        "Paper is basically the superhero cape of rocks.",
        "Scissors invented rock paper fashion week.",
        "Fun fact: best of 3 is the snack-size showdown.",
        "A good paper strategy is to keep your cool.",
        "Rumor has it rocks never skip leg day.",
        "Scissors love clean lines and instant drama.",
        "Paper wins by sheer confidence and coverage.",
        "Try mixing it up with a surprise choice!",
        "The secret to victory is pure style.",
        "Rocks may be solid, but confidence makes them unstoppable.",
        "Paper once applied for a job as a rock's personal assistant.",
        "Scissors claim they were misunderstood artists.",
        "Winning is temporary. Style is forever.",
        "Every rock started as a bold little pebble.",
        "Paper cuts deeper than expected.",
        "Scissors always cut straight to the point.",
        "Legends say the first match lasted 0.3 seconds.",
        "A true champion switches it up.",
        "Rock respects paper... but never admits it.",
        "Scissors sharpen their skills daily.",
        "Paper believes in wrapping up the competition.",
        "Victory favors the unpredictable.",
        "A rematch is just destiny asking twice.",
        "Even AI struggles with rock psychology.",
        "Paper once tried to fold under pressure... it didn't.",
        "Scissors fear nothing except dull moments.",
        "Rocks are grounded. Literally.",
        "Best of 5 is for the brave.",
        "The real win is the dramatic reveal."
      ],
    },
    es: {
      choices: {
        rock: "Piedra",
        paper: "Papel",
        scissors: "Tijera",
      },
      result: {
        draw: "¡Empate!",
        win: "¡Ganaste!",
        lose: "¡Perdiste!",
        matchWin: "¡Ganaste!",
        matchLose: "¡Perdiste!",
      },
      reset: {
        soft: (wins) => `¡Nueva partida! Primero a ${wins} gana.`,
        prompt: "Elige un movimiento para revelar un dato curioso.",
        end: "¿Nueva partida? Reinicia o cambia el modo.",
      },
      funFacts: [
        "Piedra gana a tijera, pero tijera tiene mas estilo.",
        "Papel es basicamente la capa de superheroe de las piedras.",
        "Tijera invento la pasarela de piedra, papel o tijera.",
        "Dato: mejor de 3 es el duelo mas rapido.",
        "Una buena estrategia con papel es mantener la calma.",
        "Dicen que las piedras nunca se saltan el dia de pierna.",
        "Tijera ama las lineas limpias y el drama instantaneo.",
        "Papel gana por pura confianza y cobertura.",
        "¡Mezcla jugadas con una sorpresa!",
        "El secreto de la victoria es puro estilo.",
        "Las rocas son solidas, pero la confianza las hace imparables.",
        "Papel alguna vez pidio trabajo como asistente de una roca.",
        "Tijera asegura que era una artista incomprendida.",
        "Ganar es temporal. El estilo es para siempre.",
        "Cada roca empezo como un pequeno guijarro.",
        "El papel corta mas de lo esperado.",
        "Tijera siempre va directo al punto.",
        "Dicen que la primera partida duro 0.3 segundos.",
        "Un verdadero campeon cambia el ritmo.",
        "Piedra respeta al papel... pero no lo admite.",
        "Tijera afila sus habilidades a diario.",
        "Papel cree en envolver a la competencia.",
        "La victoria favorece lo impredecible.",
        "La revancha es el destino preguntando dos veces.",
        "Hasta la IA lucha con la psicologia de la piedra.",
        "Papel intento doblarse bajo presion... no lo logro.",
        "Tijera no teme nada excepto los momentos aburridos.",
        "Las rocas estan bien aterrizadas. Literal.",
        "Mejor de 5 es para valientes.",
        "La verdadera victoria es la revelacion dramatica."
      ],
    },
  };

  let userChoiceValue = "";
  let computerChoiceValue = "";
  let modeValue = 3;
  let targetWins = 2;
  let userScore = 0;
  let cpuScore = 0;
  let matchLocked = false;
  let audioContext;

  function applyTheme(isDark) {
    document.body.classList.toggle("dark", isDark);
    if (themeToggle) {
      themeToggle.checked = isDark;
    }
  }

  function setChoiceButtonsDisabled(disabled) {
    choiceButtons.forEach((button) => {
      button.disabled = disabled;
    });
  }

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq, duration, type = "sine") {
    if (!audioContext) {
      return;
    }
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    osc.stop(audioContext.currentTime + duration);
  }

  function playChoiceSound() {
    playTone(440, 0.12, "triangle");
    playTone(660, 0.12, "triangle");
  }

  function playWinSound() {
    playTone(523.25, 0.2, "square");
    playTone(659.25, 0.2, "square");
    playTone(783.99, 0.25, "square");
  }

  function playLoseSound() {
    playTone(220, 0.25, "sawtooth");
  }

  function playDrawSound() {
    playTone(330, 0.15, "sine");
    playTone(330, 0.15, "sine");
  }

  function bumpScore(el) {
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  }

  let currentLang = localStorage.getItem("lang") || "en";
  let lastResultKey = "";

  function t() {
    return translations[currentLang] || translations.en;
  }

  function updateChoiceLabels() {
    if (userChoiceValue) {
      userChoiceDisplay.textContent = t().choices[userChoiceValue];
    }
    if (computerChoiceValue) {
      computerChoiceDisplay.textContent = t().choices[computerChoiceValue];
    }
  }

  function updateResultLabel() {
    if (!lastResultKey) {
      return;
    }
    const label = t().result[lastResultKey];
    if (label) {
      resultDisplay.textContent = label;
    }
  }

  function updateFunFact() {
    const facts = t().funFacts;
    const fact = facts[Math.floor(Math.random() * facts.length)];
    funFactDisplay.textContent = fact;
  }

  function createConfetti(count = 24) {
    const colors = ["#ff6b6b", "#4cc9f0", "#ffd166", "#9b5de5", "#06d6a0", "#f77f00"];
    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement("span");
      const left = Math.random() * 100;
      const delay = Math.random() * 0.2;
      const duration = 0.9 + Math.random() * 0.6;
      piece.style.left = `${left}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = `${duration}s`;
      piece.style.animationDelay = `${delay}s`;
      piece.style.transform = `translateY(-20px) rotate(${Math.random() * 180}deg)`;
      confettiContainer.appendChild(piece);
      setTimeout(() => piece.remove(), (duration + delay) * 1000);
    }
  }

  function setMode(newMode) {
    modeValue = newMode;
    targetWins = Math.ceil(modeValue / 2);
    modeButtons.forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.mode) === modeValue);
    });
    resetMatch(true);
  }

  function resetMatch(soft = false) {
    userScore = 0;
    cpuScore = 0;
    matchLocked = false;
    setChoiceButtonsDisabled(false);
    scoreUserDisplay.textContent = "0";
    scoreCpuDisplay.textContent = "0";
    userChoiceDisplay.textContent = "";
    computerChoiceDisplay.textContent = "";
    resultDisplay.textContent = "";
    resultEmojiDisplay.textContent = "\u2728";
    userEmojiDisplay.textContent = "\u{1F9D1}\u200D\u{1F680}";
    computerEmojiDisplay.textContent = "\u{1F916}";
    funFactDisplay.textContent = soft
      ? t().reset.soft(targetWins)
      : t().reset.prompt;
    lastResultKey = "";
  }

  function generateComputerChoice() {
    const randomNumber = Math.floor(Math.random() * choices.length);
    computerChoiceValue = choices[randomNumber];
    computerChoiceDisplay.textContent = t().choices[computerChoiceValue];
    computerEmojiDisplay.textContent = emojis[computerChoiceValue];
  }

  function getResult() {
    const userIndex = choices.indexOf(userChoiceValue);
    const computerIndex = choices.indexOf(computerChoiceValue);
    const result = (userIndex - computerIndex + 3) % 3;
    if (result === 0) {
      return "draw";
    }
    if (result === 1) {
      return "win";
    }
    return "lose";
  }

  function endMatch(winner) {
    matchLocked = true;
    setChoiceButtonsDisabled(true);
    if (winner === "user") {
      resultDisplay.textContent = t().result.matchWin;
      lastResultKey = "matchWin";
      resultEmojiDisplay.textContent = resultEmojis.match;
      createConfetti(40);
      playWinSound();
    } else {
      resultDisplay.textContent = t().result.matchLose;
      lastResultKey = "matchLose";
      resultEmojiDisplay.textContent = "\u{1F4AB}";
      playLoseSound();
    }
    funFactDisplay.textContent = t().reset.end;
  }

  choiceButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (matchLocked) {
        return;
      }
      initAudio();
      const btn = e.currentTarget;
      btn.classList.remove("pop");
      void btn.offsetWidth;
      btn.classList.add("pop");
      userChoiceValue = e.currentTarget.id;
      userChoiceDisplay.textContent = t().choices[userChoiceValue];
      userEmojiDisplay.textContent = emojis[userChoiceValue];
      playChoiceSound();

      generateComputerChoice();
      const outcome = getResult();

      if (outcome === "draw") {
        resultDisplay.textContent = t().result.draw;
        lastResultKey = "draw";
        resultEmojiDisplay.textContent = resultEmojis.draw;
        playDrawSound();
      } else if (outcome === "win") {
        resultDisplay.textContent = t().result.win;
        lastResultKey = "win";
        resultEmojiDisplay.textContent = resultEmojis.win;
        userScore += 1;
        scoreUserDisplay.textContent = String(userScore);
        bumpScore(scoreUserDisplay);
        createConfetti(18);
        playWinSound();
      } else {
        resultDisplay.textContent = t().result.lose;
        lastResultKey = "lose";
        resultEmojiDisplay.textContent = resultEmojis.lose;
        cpuScore += 1;
        scoreCpuDisplay.textContent = String(cpuScore);
        bumpScore(scoreCpuDisplay);
        playLoseSound();
      }

      updateFunFact();

      if (userScore >= targetWins) {
        endMatch("user");
      } else if (cpuScore >= targetWins) {
        endMatch("cpu");
      }
    });
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = Number(button.dataset.mode);
      setMode(mode);
    });
  });

  resetButton.addEventListener("click", () => {
    resetMatch(false);
  });

  function applyLanguage(nextLang) {
    currentLang = nextLang === "es" ? "es" : "en";
    updateChoiceLabels();
    updateResultLabel();
    if (!matchLocked && !lastResultKey) {
      funFactDisplay.textContent = t().reset.prompt;
    }
  }

  window.addEventListener("languagechange", (event) => {
    const next = event?.detail?.lang || localStorage.getItem("lang") || "en";
    applyLanguage(next);
  });

  applyLanguage(currentLang);
  resetMatch(true);
}

if (document.readyState !== "loading") {
  initRps();
} else {
  document.addEventListener("DOMContentLoaded", () => initRps());
}
