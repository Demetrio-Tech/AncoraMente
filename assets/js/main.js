document.addEventListener("DOMContentLoaded", () => {
  // Menu Hamburger
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.querySelector(".main-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuBtn.classList.toggle("active");
    });
  }

  // Lógica para o efeito de fade nos cards da Home
  const interactiveCards = document.querySelectorAll(".card-interactive");
  interactiveCards.forEach((card) => {
    const header = card.querySelector(".card-header");

    if (header) {
      header.addEventListener("click", () => {
        const wasActive = card.classList.contains("active");

        // Remove a classe 'active' de todos os outros cards para fechar os abertos
        interactiveCards.forEach((c) => {
          if (c !== card) {
            c.classList.remove("active");
          }
        });

        // Alterna a classe 'active' no card clicado
        card.classList.toggle("active");
      });
    }
  });

  // Animação de entrada para os cards da Home
  const cardsContainer = document.querySelector(".cards-container");
  if (cardsContainer) {
    // Adiciona a classe 'loaded' para iniciar a animação
    cardsContainer.classList.add("loaded");
  }
});
