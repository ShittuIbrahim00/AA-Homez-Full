export const DButils = {
  register: "/api/auth/register",
  login: "/api/auth/login",

  // schedules
  createSchedule: "/api/schedule/create-schedule",
  pendingSchedule: "/api/schedule/pending-schedule",
  approvedSchedule: "/api/schedule/approved-schedule",
  declineSchedule: "/api/schedule/decline-schedule",
  createSubSchedule: "/api/schedule/sub/create",
  updateSchedule: (rescheduleId) => `/api/schedule/update/${rescheduleId}`,
  singleSchedule: (singleSchedule) => `/api/schedule/single/${singleSchedule}`,
  patchApprovedSchedule: (approveScheduleId) =>
    `/api/schedule/${approveScheduleId}`,

  // agents
  profileAgents: (page, limit) =>
    `/api/profile/agents?page=${page}&limit=${limit}`,
  profileUser: "/api/profile/user",
  profileRequest: "/api/profile/update-request",

  //property
  createProperty: "/api/property/create-property",
};
