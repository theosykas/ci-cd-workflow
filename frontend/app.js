const API_URL = "http://localhost:3000";

// Vérifier que l'API est accessible
async function checkApiStatus() {
  const statusEl = document.getElementById("api-status");
  try {
    const res = await fetch(`${API_URL}/health`);
    const data = await res.json();
    if (data.status === "ok") {
      statusEl.textContent = "API connectée ✅";
    }
  } catch {
    statusEl.textContent = "API inaccessible ❌";
  }
}

// Charger et afficher les items
async function loadItems() {
  const list = document.getElementById("items-list");
  list.innerHTML = "<li>Chargement...</li>";
  try {
    const res = await fetch(`${API_URL}/api/items`);
    const items = await res.json();
    list.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${item.name}</strong> — ${item.description}`;
      list.appendChild(li);
    });
  } catch {
    list.innerHTML = "<li>Erreur lors du chargement.</li>";
  }
}

// Ajouter un item
async function addItem() {
  const name = document.getElementById("item-name").value.trim();
  const description = document.getElementById("item-desc").value.trim();
  const message = document.getElementById("form-message");

  if (!name) {
    message.style.color = "#dc2626";
    message.textContent = "Le nom est obligatoire.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (res.status === 201) {
      const item = await res.json();
      message.style.color = "#16a34a";
      message.textContent = `Item "${item.name}" ajouté avec succès !`;
      document.getElementById("item-name").value = "";
      document.getElementById("item-desc").value = "";
    } else {
      const err = await res.json();
      message.style.color = "#dc2626";
      message.textContent = err.error || "Erreur lors de l'ajout.";
    }
  } catch {
    message.style.color = "#dc2626";
    message.textContent = "Impossible de contacter l'API.";
  }
}

// Événements
document.getElementById("load-btn").addEventListener("click", loadItems);
document.getElementById("add-btn").addEventListener("click", addItem);

// Au chargement de la page
checkApiStatus();
