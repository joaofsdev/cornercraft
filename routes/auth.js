import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// Rotas de login
router.get("/login", authController.mostrarLogin);
router.post("/login", authController.processarLogin);

// Rotas de registro
router.get("/registrar", authController.mostrarRegistrar);
router.post("/registrar", authController.processarRegistrar);

// Rota de logout
router.get("/logout", authController.logout);

export default router;