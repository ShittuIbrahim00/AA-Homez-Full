import express from 'express';
import { MiddlewareAgencyApiGuardMine } from '../../middleware/middleware.v1.guard.js';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../../controllers/controller.v1.event.js';

const eventRouter = express.Router();


eventRouter.post('/', MiddlewareAgencyApiGuardMine, createEvent);
eventRouter.get('/:eid', getEvent);
eventRouter.get('/', listEvents);
eventRouter.put('/:eid', MiddlewareAgencyApiGuardMine, updateEvent);
eventRouter.delete('/:eid', MiddlewareAgencyApiGuardMine, deleteEvent);

export default eventRouter;