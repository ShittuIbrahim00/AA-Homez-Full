import apiClient from "./apiClient";

class UserServices {
  /**
   * Get current user profile
   * @return {Promise<*>}
   */
  getUser() {
    return apiClient.get("/agency");
  }

  /**
   * Update user profile
   * @param {Object} payload - User profile data
   * @return {Promise<*>}
   */
  updateUser(payload) {
    return apiClient.patch("/agency", payload);
  }
}

export default new UserServices();