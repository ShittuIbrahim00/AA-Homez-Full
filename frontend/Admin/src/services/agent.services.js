import apiClient from "./apiClient";

class AgentServices {
  /**
   * Get a single agent by ID
   * @param {string} id - Agent ID
   * @returns {Promise<*>}
   */
  getAgent(id) {
    return apiClient.get(`/agency/agents/${id}`);
  }

  /**
   * Get all agents
   * @returns {Promise<*>}
   */
  getAgents() {
    return apiClient.get(`/agency/agents`);
  }
}

export default new AgentServices();