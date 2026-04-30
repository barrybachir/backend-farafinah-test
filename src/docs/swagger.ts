import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Users API",
      version: "1.0.0",
      description: "API de gestion des utilisateurs avec authentification JWT",
    },
    servers: [
      {
        url: "http://localhost:9090",
        description: "Serveur local",
      },
    ],
    tags: [
      { name: "Auth", description: "Authentification et login" },
      { name: "Users", description: "Gestion des utilisateurs" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Erreur serveur" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "johndoe" },
            password: { type: "string", example: "secret123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string", example: "eyJhbGciOiJIUzI1Ni..." },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "ckx123abc" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            birthDate: { type: "string", format: "date-time" },
            city: { type: "string", example: "Paris" },
            country: { type: "string", example: "FR" },
            avatar: { type: "string", example: "https://example.com/avatar.png" },
            company: { type: "string", example: "Acme Corp" },
            jobPosition: { type: "string", example: "Backend Developer" },
            mobile: { type: "string", example: "+33600000000" },
            username: { type: "string", example: "johndoe" },
            email: { type: "string", example: "john.doe@email.com" },
            role: { type: "string", enum: ["admin", "user"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BatchImportResponse: {
          type: "object",
          properties: {
            total: { type: "integer", example: 10 },
            imported: { type: "integer", example: 8 },
            failed: { type: "integer", example: 2 },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);