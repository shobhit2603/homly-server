class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {*} data - Response payload
   */
  constructor(statusCode, message = "Success", data = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
