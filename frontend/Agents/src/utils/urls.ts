import { LoginSchemaType } from "./types";

export const DButils = {
  login: "/api/login",
 signup: "/api/auth/signup",


  user: "/api/profile/agent",
  verifyuser: "/api/profile/verify-agent",

  hot: "/api/property/hot",
  all: (page) => `/api/property/all?page=${page}`,
  singleProperty: (propertyId) => `/api/property/${propertyId}`,

  sub: "/api/property/sub",
  subId: (subPropertyId) => `/api/property/sub/${subPropertyId}`,

  // schedule
  getOneSchedule: (_scheduleId) => `/api/schedule/${_scheduleId}`,
  subPropertyVist: `/api/schedule/subPropertyVist`,
  propertyVist: `/api/schedule/propertyVist`,
  pendingSchedule: `/api/schedule/pending`,
  approvedSchedule: `/api/schedule/approved`,
  declinedSchedule: `/api/schedule/declined`,
};
