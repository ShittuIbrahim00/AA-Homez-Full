import { ModelEvent } from '../models/index.js';
import { ErrorClass } from '../core/index.js';

export const createEvent = async (req, res, next) => {
  try {
    const event = await ModelEvent.AddEvent(req.body);
    res.status(201).json({
      status: true,
      message: "Event created successfully",
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await ModelEvent.Get(req.params.eid);
    res.json({
      status: true,
      message: "Event retrieved successfully",
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const listEvents = async (req, res, next) => {
  try {
    const events = await ModelEvent.findAll({
      order: [['start', 'ASC']]
    });
    res.json({
      status: true,
      message: "Events retrieved successfully",
      data: events
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await ModelEvent.UpdateEvent(req.params.eid, req.body);
    res.json({
      status: true,
      message: "Event updated successfully",
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    await ModelEvent.DeleteEvent(req.params.eid);
    res.json({
      status: true,
      message: "Event deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};