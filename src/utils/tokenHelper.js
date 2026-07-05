import jwt from "jsonwebtoken";
import envConfig from "../config/env.config.js";

class TokenHelper {
  /**
   * Generates a short-lived access token.
   * @param {Object} payload - Data to encode (userId, email, role)
   * @returns {string} Signed JWT access token
   */
  static generateAccessToken(payload) {
    return jwt.sign(payload, envConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  /**
   * Generates a long-lived refresh token.
   * @param {Object} payload - Data to encode (userId)
   * @returns {string} Signed JWT refresh token
   */
  static generateRefreshToken(payload) {
    return jwt.sign(payload, envConfig.REFRESH_TOKEN_SECRET, {
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  /**
   * Verifies and decodes an access token.
   * @param {string} token - JWT access token
   * @returns {Object} Decoded payload
   * @throws {JsonWebTokenError|TokenExpiredError}
   */
  static verifyAccessToken(token) {
    return jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET);
  }

  /**
   * Verifies and decodes a refresh token.
   * @param {string} token - JWT refresh token
   * @returns {Object} Decoded payload
   * @throws {JsonWebTokenError|TokenExpiredError}
   */
  static verifyRefreshToken(token) {
    return jwt.verify(token, envConfig.REFRESH_TOKEN_SECRET);
  }

  static generateTokenPair(user) {
    const accessToken = TokenHelper.generateAccessToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = TokenHelper.generateRefreshToken({
      userId: user._id,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Generates an email verification token.
   * @param {Object} payload - Data to encode (userId)
   * @returns {string} Signed JWT verification token
   */
  static generateEmailVerificationToken(payload) {
    return jwt.sign(payload, envConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: "24h",
    });
  }

  /**
   * Verifies an email verification token.
   * @param {string} token - JWT verification token
   * @returns {Object} Decoded payload
   * @throws {JsonWebTokenError|TokenExpiredError}
   */
  static verifyEmailVerificationToken(token) {
    return jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET);
  }
}

export default TokenHelper;
