const request = require("supertest");
const express = require("express");
const cors = require("cors");
const pool = require("./db");

// On réinstancie rapidement l'app Express pour le test sans lancer app.listen()
const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: "unreachable" });
  }
});

// Fermer la connexion à la base de données après les tests
afterAll(async () => {
  await pool.end();
});

describe("Test des routes de l'API", () => {
  test("GET /health devrait retourner un statut 200 et la bdd connectée", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok", db: "connected" });
  });
});