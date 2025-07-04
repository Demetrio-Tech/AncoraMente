document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS ---
  const timerDisplay = document.getElementById("pomodoro-timer");
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const resetBtn = document.getElementById("reset-btn");
  const currentModeDisplay = document.getElementById("current-mode");
  const settingsBtn = document.getElementById("settings-btn");
  const settingsPanel = document.getElementById("pomodoro-settings");
  const focusTimeInput = document.getElementById("focus-time");
  const breakTimeInput = document.getElementById("break-time");
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  // --- ESTADO DA APLICAÇÃO ---
  let timer; // Variável para o setInterval
  const state = {
    focusTime: 25,
    breakTime: 5,
    remainingSeconds: 25 * 60,
    mode: "foco", // 'foco' ou 'pausa'
    isRunning: false,
  };
  // Carrega o áudio uma vez para evitar delay
  const audioAlerta = new Audio("./assets/audio/alerta.mp3");

  // --- LÓGICA DO POMODORO ---

  // Atualiza o display do timer e o título da página
  const updateDisplay = () => {
    const minutes = Math.floor(state.remainingSeconds / 60);
    const seconds = state.remainingSeconds % 60;
    const timeString = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    timerDisplay.textContent = timeString;
    document.title = `${timeString} - ${
      state.mode === "foco" ? "Foco Total" : "Pausa"
    } | AncoraMente`;
    currentModeDisplay.textContent =
      state.mode === "foco" ? "Modo Foco" : "Hora da Pausa";
  };

  // Toca o som de alerta
  const playSound = () => {
    audioAlerta.currentTime = 0;
    audioAlerta.play().catch((e) => console.error("Erro ao tocar áudio:", e));
  };

  // Troca entre os modos 'foco' e 'pausa'
  const switchMode = () => {
    state.isRunning = false; // Pausa ao trocar de modo
    clearInterval(timer);
    playSound(); // Toca o som exatamente na troca

    state.mode = state.mode === "foco" ? "pausa" : "foco";
    state.remainingSeconds =
      (state.mode === "foco" ? state.focusTime : state.breakTime) * 60;

    updateDisplay();
  };

  // Função de contagem regressiva
  const countdown = () => {
    if (state.remainingSeconds > 0) {
      state.remainingSeconds--;
    } else {
      switchMode();
      return; // Para a execução do countdown atual
    }
    updateDisplay();
  };

  // Inicia o timer
  const startTimer = () => {
    if (state.isRunning) return;
    state.isRunning = true;
    timer = setInterval(countdown, 1000);
  };

  // Pausa o timer
  const pauseTimer = () => {
    state.isRunning = false;
    clearInterval(timer);
  };

  // Reinicia o timer para o modo de foco
  const resetTimer = () => {
    pauseTimer();
    state.mode = "foco";
    state.remainingSeconds = state.focusTime * 60;
    updateDisplay();
  };

  // Aplica as novas configurações de tempo
  const applySettings = () => {
    state.focusTime = parseInt(focusTimeInput.value, 10) || 25;
    state.breakTime = parseInt(breakTimeInput.value, 10) || 5;

    // Se o timer não estiver rodando, ajusta para o tempo do modo atual
    if (!state.isRunning) {
      state.remainingSeconds =
        (state.mode === "foco" ? state.focusTime : state.breakTime) * 60;
      updateDisplay();
    }
  };

  // Adiciona os event listeners
  if (settingsBtn)
    settingsBtn.addEventListener("click", () => {
      settingsPanel.classList.toggle("active");
      settingsBtn.classList.toggle("active");
    });
  if (focusTimeInput) focusTimeInput.addEventListener("change", applySettings);
  if (breakTimeInput) breakTimeInput.addEventListener("change", applySettings);
  if (startBtn) startBtn.addEventListener("click", startTimer);
  if (pauseBtn) pauseBtn.addEventListener("click", pauseTimer);
  if (resetBtn) resetBtn.addEventListener("click", resetTimer);

  // --- LÓGICA DO TO-DO LIST ---
  if (taskForm)
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Impede o recarregamento da página
      const taskText = taskInput.value.trim();
      if (taskText === "") return; // Não adiciona tarefa vazia

      addTask(taskText);
      taskInput.value = "";
      taskInput.focus();
    });

  const addTask = (text) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.innerHTML = `
      <div class="task-item-content">
        <input type="checkbox" aria-label="Marcar tarefa como concluída">
        <span>${text}</span>
      </div>
      <button class="delete-btn" aria-label="Apagar tarefa">×</button>
    `;
    taskList.prepend(li); // Adiciona no topo da lista
  };

  if (taskList)
    taskList.addEventListener("click", (e) => {
      const target = e.target;
      const taskItem = target.closest(".task-item");

      if (target.type === "checkbox") {
        taskItem.classList.toggle("done");
      }
      if (target.classList.contains("delete-btn")) {
        taskItem.remove();
      }
    });

  // Inicializa o display ao carregar a página
  if (timerDisplay) updateDisplay();
});
