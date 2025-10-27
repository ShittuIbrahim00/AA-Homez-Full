import apiClient from "./apiClient";

class ScheduleServices {
  /**
   * Create a new schedule
   * @param {Object} data - Schedule data
   * @returns {Promise<*>}
   */
  createSchedule(data) {
    return apiClient.post("/property/schedule", data);
  }

  /**
   * Create a new sub-property schedule
   * @param {Object} data - Schedule data
   * @returns {Promise<*>}
   */
  createSubSchedule(data) {
    return apiClient.post("/property/sub/schedule", data);
  }

  /**
   * Get all pending schedules
   * @returns {Promise<*>}
   */
  getAllPendingSchedules() {
    return apiClient.get("/agency/schedules/pending");
  }

  /**
   * Get all approved schedules
   * @returns {Promise<*>}
   */
  getAllApprovedSchedules() {
    return apiClient.get("/agency/schedules/approved");
  }

  /**
   * Get all declined schedules
   * @returns {Promise<*>}
   */
  getAllDeclinedSchedules() {
    return apiClient.get("/agency/schedules/declined");
  }

  /**
   * Get a single schedule by ID
   * @param {string} id - Schedule ID
   * @returns {Promise<*>}
   */
  getSchedule(id) {
    return apiClient.get(`/agency/schedule/${id}`);
  }

  /**
   * Update/reschedule a schedule
   * @param {string} id - Schedule ID
   * @returns {Promise<*>}
   */
  updateSchedule(id) {
    return apiClient.patch(`/agency/reschedule/${id}`);
  }

  /**
   * Approve a schedule
   * @param {string} id - Schedule ID
   * @returns {Promise<*>}
   */
  approveSchedule(id) {
    return apiClient.patch(`/agency/schedule/approve/${id}`);
  }
}

export default new ScheduleServices();