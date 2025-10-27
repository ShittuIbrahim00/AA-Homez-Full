import apiClient from "./apiClient";

class AuthServices {
  /**
   * Register a new agent
   * @param {Object} data - Registration data
   * @return {Promise<*>}
   */
  register(data) {
    return apiClient.post("/auth/agent/register", data);
  }

  /**
   * Login user
   * @param {Object} data - Login credentials
   * @return {Promise<*>}
   */
  login(data) {
    return apiClient.post("/auth/login", data);
  }
}

export default new AuthServices();