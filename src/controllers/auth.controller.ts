import { Request, Response } from "express";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).json({
        message: "username et password sont requis",
      });
    }

    // 1. trouver user (email OU username)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: username },
          { username: username }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // 2. vérifier password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // 3. générer token
    const token = jwt.sign(
      {
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    return res.json({
      accessToken: token
    });

  } catch (error: any) {
  
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};