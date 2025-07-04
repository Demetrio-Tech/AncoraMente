document.addEventListener("DOMContentLoaded", () => {
  const instructionText = document.getElementById("breathing-instruction");
  const counterText = document.getElementById("breathing-counter");
  const animContainer = document.querySelector(".breathing-anim");
  const btnQuadrada = document.getElementById("resp-quadrada-btn");
  const btn478 = document.getElementById("resp-478-btn");
  const allBreathingButtons = [btnQuadrada, btn478];
  const fraseDisplay = document.getElementById("frase-motivacional");

  let cycleTimer;
  let countdownTimer;

  const config = {
    quadrada: [
      { text: "Inspire", duration: 4, animClass: "expandir" },
      { text: "Segure", duration: 4, animClass: "manter" },
      { text: "Expire", duration: 4, animClass: "contrair" },
      { text: "Segure", duration: 4, animClass: "manter-vazio" },
    ],
    478: [
      { text: "Inspire", duration: 4, animClass: "expandir" },
      { text: "Segure o ar", duration: 7, animClass: "manter" },
      { text: "Expire", duration: 8, animClass: "contrair" },
    ],
  };

  const runCountdown = (seconds) => {
    clearInterval(countdownTimer);
    counterText.textContent = seconds;

    let remaining = seconds;
    countdownTimer = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        counterText.textContent = remaining;
      } else {
        clearInterval(countdownTimer);
      }
    }, 1000);
  };

  const runCycle = (type, step = 0) => {
    clearTimeout(cycleTimer);

    const currentStep = config[type][step];

    animContainer.style.setProperty(
      "--anim-duration",
      `${currentStep.duration}s`
    );
    instructionText.textContent = currentStep.text;
    animContainer.className = "breathing-anim active " + currentStep.animClass;

    runCountdown(currentStep.duration);

    const nextStep = (step + 1) % config[type].length;
    cycleTimer = setTimeout(
      () => runCycle(type, nextStep),
      currentStep.duration * 1000
    );
  };

  const startBreathing = (type, clickedButton) => {
    clearTimeout(cycleTimer);
    clearInterval(countdownTimer);

    allBreathingButtons.forEach((btn) => btn.classList.remove("active"));
    clickedButton.classList.add("active");

    animContainer.classList.add("active");
    runCycle(type);
  };

  if (btnQuadrada)
    btnQuadrada.addEventListener("click", () =>
      startBreathing("quadrada", btnQuadrada)
    );
  if (btn478)
    btn478.addEventListener("click", () => startBreathing("478", btn478));

  // CARROSSEL DE FRASES
  const frases = [
    "Acredite em si mesmo e tudo será possível.",
    "Pequenos progressos ainda são progressos.",
    "Respire fundo. Isto também vai passar.",
  ];

  let fraseIndex = 0;

  const changeQuote = () => {
    if (!fraseDisplay) return;
    fraseDisplay.style.opacity = "0";

    setTimeout(() => {
      fraseIndex = (fraseIndex + 1) % frases.length;
      fraseDisplay.textContent = frases[fraseIndex];
      fraseDisplay.style.opacity = "1";
    }, 600);
  };

  if (fraseDisplay) {
    fraseDisplay.textContent = frases[0];
    setInterval(changeQuote, 8000);
  }
});
