import { Router } from "express";
import AuthController from "../../controllers/auth.controller.js";
import AuthService from "../../services/auth.service.js";
import MongoUserRepository from "../../repositories/implementations/mongoUserRepository.js";
import AuthMiddleware from "../../middlewares/auth.middleware.js";
import AuthValidator from "../../middlewares/validators/auth.validator.js";

// ─── Dependency Injection ────────────────────────────────
const userRepository = new MongoUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// ─── Router ──────────────────────────────────────────────
const router = Router();

// Public routes
router.post(
  "/register",
  AuthValidator.register(),
  AuthValidator.validate,
  authController.register,
);

router.post(
  "/login",
  AuthValidator.login(),
  AuthValidator.validate,
  authController.login,
);

router.post("/refresh-token", authController.refreshToken);

router.post("/verify-email", authController.verifyEmail);

router.post(
  "/forgot-password",
  AuthValidator.forgotPassword(),
  AuthValidator.validate,
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  AuthValidator.resetPassword(),
  AuthValidator.validate,
  authController.resetPassword,
);

// Protected routes (require authentication)
router.post("/logout", AuthMiddleware.authenticate, authController.logout);

router.get("/me", AuthMiddleware.authenticate, authController.getMe);

router.patch(
  "/change-password",
  AuthMiddleware.authenticate,
  AuthValidator.changePassword(),
  AuthValidator.validate,
  authController.changePassword,
);

export default router;
