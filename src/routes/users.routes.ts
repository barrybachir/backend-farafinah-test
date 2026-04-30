/**
 * @openapi
 * /api/users/generate:
 *   get:
 *     tags:
 *       - Users
 *     summary: Générer des utilisateurs fictifs
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         required: false
 *         description: Nombre d'utilisateurs à générer (par défaut 1)
 *     responses:
 *       200:
 *         description: Liste des utilisateurs générés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/users/{username}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupérer un utilisateur par username
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès interdit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Utilisateur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/users/batch:
 *   post:
 *     tags:
 *       - Users
 *     summary: Importer une liste d'utilisateurs depuis un fichier JSON
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Résultat de l'import
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BatchImportResponse'
 *       400:
 *         description: Fichier absent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
import { Router } from "express";
import {
  generateUsers,
  batchImportUsers
} from "../controllers/users.controller";
import upload from "../middlewares/upload.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import prisma from "../utils/prisma";

const router = Router();

router.get("/generate", generateUsers);


router.get("/me", authMiddleware, async (req: any, res) => {
    const user = await prisma.user.findUnique({
      where: { email: req.user.email }
    });
  
    res.json(user);
  });

  router.get("/:username", authMiddleware, async (req: any, res) => {
    const { username } = req.params;
  
    const user = await prisma.user.findUnique({
      where: { username }
    });
  
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
  
    // règle métier
    if (req.user.role !== "admin" && req.user.username !== username) {
      return res.status(403).json({ message: "Interdit" });
    }
  
    res.json(user);
  });

  router.post(
    "/batch",
    upload.single("file"),
    batchImportUsers
  );

export default router;