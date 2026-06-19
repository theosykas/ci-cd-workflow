require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Route de base
app.get("/", (req, res) => {
  res.json({ message: "API opérationnelle ✅", version: "1.0.0" });
});

// Healthcheck (utile pour CI/CD)
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: "unreachable" });
  }
});

// GET tous les items
app.get("/api/items", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM items ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des items" });
  }
});

// GET un item par id
app.get("/api/items/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM items WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Item non trouvé" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'item" });
  }
});

// POST créer un item
app.post("/api/items", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Le champ 'name' est requis" });

  try {
    const [result] = await pool.query(
      "INSERT INTO items (name, description) VALUES (?, ?)",
      [name, description || ""]
    );
    res.status(201).json({ id: result.insertId, name, description: description || "" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création de l'item" });
  }
});

// PUT modifier un item
app.put("/api/items/:id", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Le champ 'name' est requis" });

  try {
    const [result] = await pool.query(
      "UPDATE items SET name = ?, description = ? WHERE id = ?",
      [name, description || "", req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Item non trouvé" });
    res.json({ id: parseInt(req.params.id), name, description: description || "" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la modification de l'item" });
  }
});

// DELETE supprimer un item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM items WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Item non trouvé" });
    res.json({ message: "Item supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'item" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
