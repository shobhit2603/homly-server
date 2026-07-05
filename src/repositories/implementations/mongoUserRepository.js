import IUserRepository from "../contracts/IUserRepository.js";
import User from "../../models/user.model.js";

class MongoUserRepository extends IUserRepository {
  /**
   * Finds a user by their email address.
   * @param {string} email
   * @returns {Promise<Object|null>} User document or null
   */
  async findByEmail(email) {
    return User.findOne({ email });
  }

  /**
   * Finds a user by their MongoDB ObjectId.
   * @param {string} id
   * @returns {Promise<Object|null>} User document or null
   */
  async findById(id) {
    return User.findById(id).select("-password");
  }

  /**
   * Creates a new user document.
   * @param {Object} userData - User fields (name, email, password, role, etc.)
   * @returns {Promise<Object>} Created user document
   */
  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  /**
   * Updates a user's password.
   * @param {string} userId - User ObjectId
   * @param {string} hashedPassword - New bcrypt-hashed password
   * @returns {Promise<Object>} Updated user document
   */
  async updatePassword(userId, hashedPassword) {
    return User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true, runValidators: true },
    ).select("-password");
  }

  async updateProfile(userId, updatedFields) {
    return User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  /**
   * Finds a user by a valid reset password token.
   * @param {string} hashedToken
   * @returns {Promise<Object|null>} User document or null
   */
  async findByValidResetToken(hashedToken) {
    return User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }
}

export default MongoUserRepository;
