/**
 * Slantapp code and properties {www.slantapp.io}
 */
import HttpCodes from './../core/HttpCodes.js';
import express from 'express';
import {ErrorClass, Utils} from "../core/index.js";
import {
    MiddlewareAgentApiGuard,
    MiddlewareApiGuard,
    MiddlewareAgencyApiGuard
} from './../middleware/middleware.v1.guard.js'

const router = express.Router();
//import routes belongs to v1
import UserRoute from './v1/users.js'
import AgentRoute from './v1/agents.js'
import AgencyRoute from './v1/agencies.js'
import PropertyRoute from './v1/property.js'
import OAuthRoute from './v1/oauth.js'
import AuthRoute from './v1/auth.js'
import ScheduleRoute from './v1/scheduler.js'
import SettingsRoute from './v1/settings.js'
import eventRouter from './v1/event.js';
import notificationRouter from './v1/notification.js';
import transactionRouter from './v1/transaction.js';
//version 1.0 routes
/**
 * Start routing on v1
 */
router.get('/', (req, res, next) => {
    res.json(Utils.PrintRest("Api v1.0 checked. user documentation for next route", true, null));
})
//add each v1 modules api
router.use('/user', MiddlewareApiGuard, UserRoute);
router.use('/agent', AgentRoute);
router.use('/agency', AgencyRoute);
router.use('/property', PropertyRoute);
router.use('/oauth', OAuthRoute);
router.use('/auth', AuthRoute);
router.use('/schedule', ScheduleRoute);
router.use('/settings', SettingsRoute);
router.use('/event', eventRouter);
router.use('/notifications', notificationRouter);
router.use('/transactions', transactionRouter);

//default error for user routes
router.use('*', (req, res, next) => {
    throw new ErrorClass("path '" + req.path + "' not associated with route v1.0 with " + req.method + " method, check docs and try again", HttpCodes.NotFound.code)
})
export default router
