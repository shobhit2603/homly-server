/**
 * User Repository Contract (Interface).
 * All methods must be implemented by concrete repository classes.
 */
class IUserRepository {
  async findByEmail(email) {
    throw new Error('Method "findByEmail" not implemented');
  }

  async findById(id) {
    throw new Error('Method "findById" not implemented');
  }

  async create(userData) {
    throw new Error('Method "create" not implemented');
  }

  async updatePassword(userId, hashedPassword) {
    throw new Error('Method "updatePassword" not implemented');
  }
  async updateProfile(userId, userData) {
    throw new Error('Method "updateProfile" not implemented');
  }

  async findByValidResetToken(hashedToken) {
    throw new Error('Method "findByValidResetToken" not implemented');
  }
}

export default IUserRepository;
