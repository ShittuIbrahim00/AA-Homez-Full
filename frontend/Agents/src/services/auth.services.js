import { request } from "./api";

class AuthServices {
  /**
   *
   * @param {Object} data
   * @return {Promise<*>}
   */
  register(data) {
    return request("/auth/agent/register", "POST", data);
  }

  /**
   *
   * @param data
   * @return {Promise<*>}
   */
  login(data) {
    return request("/auth/agent/login", "POST", data);
  }
}

export default new AuthServices();
