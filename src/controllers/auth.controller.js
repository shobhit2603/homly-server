import { StatusCodes } from "http-status-codes";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import CookieHelper from "../utils/cookieHelper.js";
import { COOKIE_NAMES } from "../utils/constants.js";

class AuthController {
  /**
   * @param {import('../services/auth.service.js').default} authService
   */
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * POST /api/v1/auth/register
   * Registers a new user and returns tokens.
   */
  register = asyncHandler(async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    const { user, accessToken, refreshToken } = await this.authService.register(
      {
        name,
        email,
        password,
        role,
        phone,
      },
    );

    // Set refresh token in httpOnly cookie
    CookieHelper.setRefreshTokenCookie(res, refreshToken);

    res.status(StatusCodes.CREATED).json(
      new ApiResponse(StatusCodes.CREATED, "User registered successfully", {
        user,
        accessToken,
      }),
    );
  });

  /**
   * POST /api/v1/auth/login
   * Authenticates a user and returns tokens.
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await this.authService.login(
      email,
      password,
    );

    // Set refresh token in httpOnly cookie
    CookieHelper.setRefreshTokenCookie(res, refreshToken);

    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, "Login successful", {
        user,
        accessToken,
      }),
    );
  });

  /**
   * POST /api/v1/auth/logout
   * Clears the refresh token cookie.
   */
  logout = asyncHandler(async (_req, res) => {
    CookieHelper.clearRefreshTokenCookie(res);

    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, "Logged out successfully"));
  });

  /**
   * POST /api/v1/auth/refresh-token
   * Refreshes the access token using the refresh token from cookies.
   */
  refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshAccessToken(refreshToken);

    // Set new refresh token in cookie (token rotation)
    CookieHelper.setRefreshTokenCookie(res, newRefreshToken);

    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, "Token refreshed successfully", {
        accessToken,
      }),
    );
  });

  /**
   * GET /api/v1/auth/me
   * Returns the currently authenticated user's data.
   */
  getMe = asyncHandler(async (req, res) => {
    const user = await this.authService.getCurrentUser(req.user.id);

    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, "User profile fetched successfully", {
        user,
      }),
    );
  });

  /**
   * PATCH /api/v1/auth/change-password
   * Changes the authenticated user's password.
   */
  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    await this.authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword,
    );

    // Clear refresh token cookie (force re-login with new password)
    CookieHelper.clearRefreshTokenCookie(res);

    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          "Password changed successfully. Please log in again.",
        ),
      );
  });

  /**
   * POST /api/v1/auth/verify-email
   * Verifies the user's email address using a token.
   */
  verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const user = await this.authService.verifyEmail(token);

    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, "Email verified successfully", {
        user,
      }),
    );
  });

  /**
   * POST /api/v1/auth/forgot-password
   * Initiates password reset process
   */
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    await this.authService.forgotPassword(email);

    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, "If this email exists, a reset link has been sent."),
    );
  });

  /**
   * POST /api/v1/auth/reset-password
   * Resets password using the reset token
   */
  resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    await this.authService.resetPassword(token, newPassword);

    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, "Password has been successfully reset. You can now log in."),
    );
  });
}

export default AuthController;
