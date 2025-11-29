document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // THEME MANAGEMENT (STATE)
  // =========================
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme);
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme =
      document.body.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";

    document.body.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
  });

  // =========================
  // USERNAME (STATE)
  // =========================
  const nameInput = document.getElementById("name-input");
  const greeting = document.getElementById("greeting");
  const savedName = localStorage.getItem("username");

  if (savedName) {
    greeting.textContent = `Welcome back, ${savedName}!`;
  }

  nameInput.addEventListener("change", () => {
    const name = nameInput.value.trim();
    if (!name) return;
    localStorage.setItem("username", name);
    greeting.textContent = `Hello, ${name}!`;
  });

  // =========================
  // GITHUB API + PROJECTS
  // =========================
  let repos = [];

  async function loadRepos() {
    try {
      // TODO: change "octocat" to your GitHub username if you want
      const response = await fetch(
        "https://api.github.com/users/ZahraMahdi32/repos?sort=created&per_page=20"
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      repos = await response.json();
      renderProjects(repos);
    } catch (error) {
      const errorEl = document.getElementById("projects-error");
      errorEl.textContent = "Failed to load repositories. Please try again.";
      errorEl.classList.remove("hidden");
      console.error(error);
    }
  }

  loadRepos();

  function renderProjects(list) {
    const container = document.getElementById("projects-list");
    container.innerHTML = "";

    list.forEach((repo) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || ""}</p>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      `;

      container.appendChild(card);
    });
  }

  // =========================
  // SORTING (LOGIC)
  // =========================
  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (event) => {
    const value = event.target.value;

    const sorted = [...repos].sort((a, b) => {
      if (value === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        // oldest
        return new Date(a.created_at) - new Date(b.created_at);
      }
    });

    renderProjects(sorted);
  });

  // =========================
  // FILTERING (UI prepared)
  // (You can extend this by adding tags in your repos or mapping.)
  // =========================
  const filterButtons = document.querySelectorAll("[data-filter]");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      if (filter === "all") {
        renderProjects(repos);
      } else {
        // Example logic (you can customize based on repo name or topics)
        const filtered = repos.filter((repo) =>
          repo.name.toLowerCase().includes(filter.toLowerCase())
        );
        renderProjects(filtered);
      }
    });
  });

  // =========================
  // CONTACT FORM VALIDATION
  // =========================
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const form = document.getElementById("contact-form");

  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;

    // Simple email check
    if (!email.value || !email.value.includes("@")) {
      emailError.textContent = "Please enter a valid email.";
      valid = false;
    } else {
      emailError.textContent = "";
    }

    // Message length check
    if (!message.value || message.value.trim().length < 3) {
      messageError.textContent = "Message must be at least 3 characters.";
      valid = false;
    } else {
      messageError.textContent = "";
    }

    if (valid) {
      alert("Message sent!");
      form.reset();
    }
  });
});
