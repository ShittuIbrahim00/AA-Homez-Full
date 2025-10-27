/**
 * Slantapp code and properties {www.slantapp.io}
 */
import Async from "./../core/core.async.js";
import Mailer from "./../services/services.mail.js";
import {
  ModelAgent,
  ModelProperty,
  ModelScheduler,
  ModelSettings,
  ModelUser,
} from "../models/index.js";
import { ErrorClass, Utils } from "../core/index.js";
import {
  calculateClubReward,
  calculateReferralReward,
} from "../core/core.algo.js";

export const Update = Async(async (req, res, next) => {
  try {
    const { uid } = req.user;
    const settings = await ModelSettings.Update(req.body, uid);
    res.json(Utils.PrintRest("API Running - Ok", true, settings));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});
export const UpdateAgency = Async(async (req, res, next) => {
  try {
    const { uid } = req.user;
    const user = await ModelUser.Update(req.body, uid);
    res.json(Utils.PrintRest("Profile updated successfully", true, user));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const Schedules = Async(async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { status } = req.params;
    const { isToday } = req.query;
    const schedules = await ModelScheduler.GetByStatus(
      uid,
      status,
      undefined,
      isToday
    );
    res.json(
      Utils.PrintRest("Schedules fetched successfully", true, schedules)
    );
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const Schedule = Async(async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedules = await ModelScheduler.Get(id);
    res.json(Utils.PrintRest("Schedule fetched successfully", true, schedules));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const Reschedule = Async(async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const schedules = await ModelScheduler.Update(req.body, id, uid);
    res.json(Utils.PrintRest("Rescheduled successfully", true, schedules));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const ApproveSchedule = Async(async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const schedules = await ModelScheduler.Update(
      { status: "approved" },
      id,
      uid
    );
    res.json(Utils.PrintRest("Rescheduled successfully", true, schedules));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const SellProperty = Async(async (req, res, next) => {
  try {
    const { pid, aid, amount, sid } = req.body;
    const { uid } = req.user;
    const paid = await ModelProperty.Pay(pid, aid, uid, amount);
    res.json(Utils.PrintRest("Deposit successful", true, paid));
  } catch (e) {
    console.log(e);
    throw new ErrorClass(e.message, 500);
  }
});

export const Agency = Async(async (req, res, next) => {
  try {
    const { uid } = req.user;
    const agency = await ModelUser.findOne({
      where: { uid },
    });
    res.json(Utils.PrintRest("Agency Found", true, agency));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

export const updateAgentRequest = Async(async (req, res, next) => {
  try {
    const { status, reason, aid } = req.body;
    const request = await ModelAgent.ApproveOrDeclineRequest(
      { status, reason },
      aid
    );
    res.json(Utils.PrintRest("Success", true, request));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});
