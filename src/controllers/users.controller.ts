import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import fs from "fs";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma";

export const generateUsers = (req: Request, res: Response) => {
  const count = Number(req.query.count) || 1;

  const users = [];

  for (let i = 0; i < count; i++) {
    users.push({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.birthdate(),
      city: faker.location.city(),
      country: faker.location.countryCode("alpha-2"),
      avatar: faker.image.avatar(),
      company: faker.company.name(),
      jobPosition: faker.person.jobTitle(),
      mobile: faker.phone.number(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: faker.number.int({ min: 6, max: 10 }),
      }),
      role: Math.random() > 0.5 ? "admin" : "user",
    });
  }

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=users.json"
  );

  res.json(users);
};

export const batchImportUsers = async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Aucun fichier envoyé",
        });
      }
  
      const fileContent = fs.readFileSync(req.file.path, "utf-8");
      const users = JSON.parse(fileContent);
  
      let imported = 0;
      let failed = 0;
  
      for (const user of users) {
        const existingEmail = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });
  
        const existingUsername = await prisma.user.findUnique({
          where: {
            username: user.username,
          },
        });
  
        if (existingEmail || existingUsername) {
          failed++;
          continue;
        }
  
        const hashedPassword = await bcrypt.hash(user.password, 10);
  
        await prisma.user.create({
          data: {
            ...user,
            birthDate: new Date(user.birthDate),
            password: hashedPassword,
          },
        });
  
        imported++;
      }
  
      res.json({
        total: users.length,
        imported,
        failed,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de l'import",
        error,
      });
    }
  };