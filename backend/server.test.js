const request = require("supertest");
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // On importe le vrai pool, mais Jest va le "trapper"

// --- 1. LE MOCK (Pour isoler le test de la vraie BDD) ---
// On intercepte les appels vers le fichier db.js pour renvoyer de fausses fonctions
jest.mock("./db", () => ({
  query: jest.fn(),
  end: jest.fn()
}));

// --- 2. TON APPLICATION EXPRESS ---
const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    // Ici, ça va appeler la fausse fonction query() gérée par Jest
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: "unreachable" });
  }
});

// --- 3. LES TESTS UNITAIRES ---
describe("Test Unitaire - GET /health (Sans BDD)", () => {
  
  // On nettoie les simulations entre chaque test pour repartir à zéro
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Cas nominal : la BDD répond, l'API doit retourner 200", async () => {
    // On force pool.query() à réussir et à renvoyer un résultat fictif
    pool.query.mockResolvedValueOnce([[{ "1": 1 }]]);

    const res = await request(app).get("/health");
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok", db: "connected" });
    // Optionnel : On vérifie que la fonction a bien été appelée avec la bonne requête SQL
    expect(pool.query).toHaveBeenCalledWith("SELECT 1");
  });

  test("Cas d'erreur : la BDD plante, l'API doit chasser l'erreur et retourner 500", async () => {
    // On force pool.query() à rejeter une erreur (simulation d'une panne réseau ou bdd éteinte)
    pool.query.mockRejectedValueOnce(new Error("Database connection timeout"));

    const res = await request(app).get("/health");
    
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ status: "error", db: "unreachable" });
  });
});