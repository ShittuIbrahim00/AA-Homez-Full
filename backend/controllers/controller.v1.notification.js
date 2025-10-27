// controllers/controller.v1.notification.js
import Async from "./../core/core.async.js";
// import { ErrorClass } from "../core/index.js";
import ModelNotification from "../models/model.notification.js";
import { ErrorClass, Utils } from "../core/index.js";

// Get all notifications for authenticated agent
export const getAgentNotifications = Async(async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { aid: req.user.aid };
    if (unreadOnly === 'true') {
      whereClause.isRead = false;
    }

    const notifications = await ModelNotification.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    const totalCount = await ModelNotification.count({ where: whereClause });
    const unreadCount = await ModelNotification.count({ 
      where: { aid: req.user.aid, isRead: false } 
    });

    res.json({ 
      status: true, 
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      unreadCount
    });
  } catch (error) {
    next(error);
  }
});

export const GetBusinessNotifications = Async(async (req, res, next) => {
  try {
    const { uid } = req.agency;
    const { page = 1, limit = 20, isRead } = req.query;
    
    const offset = (page - 1) * limit;
    
    const whereClause = { uid };
    if (isRead !== undefined) {
      whereClause.isRead = isRead === 'true';
    }
    
    const notifications = await ModelNotification.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    // const totalCount = await ModelNotification.count({ where: whereClause });
    const unreadCount = await ModelNotification.count({ 
      where: { uid: req.agency.uid, isRead: false } 
    });
    
    res.json(Utils.PrintRest("Notifications fetched successfully", true, {
      notifications: notifications.rows,
      total: notifications.count,
      page: parseInt(page),
      totalPages: Math.ceil(notifications.count / limit),
      unreadCount
    }));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});

// Mark single notification as read
export const markNotificationAsReadAgent = Async(async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    const [affectedCount] = await ModelNotification.update(
      { isRead: true },
      { where: { sid: notificationId, aid: req.user.aid } }
    );
    
    if (affectedCount === 0) {
      throw new ErrorClass("Notification not found or access denied", 404);
    }
    
    res.json({ status: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
});

export const markNotificationAsReadBusiness = Async(async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    const [affectedCount] = await ModelNotification.update(
      { isRead: true },
      { where: { sid: notificationId, uid: req.agency.uid } }
    );
    
    if (affectedCount === 0) {
      throw new ErrorClass("Notification not found or access denied", 404);
    }
    
    res.json({ status: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
export const markAllNotificationsAsReadAgent = Async(async (req, res, next) => {
  try {
    const [affectedCount] = await ModelNotification.update(
      { isRead: true },
      { where: { aid: req.user.aid, isRead: false } }
    );
    
    res.json({ 
      status: true, 
      message: `Marked ${affectedCount} notifications as read` 
    });
  } catch (error) {
    next(error);
  }
});

export const markAllNotificationsAsReadBusiness = Async(async (req, res, next) => {
  try {
    const [affectedCount] = await ModelNotification.update(
      { isRead: true },
      { where: { uid: req.agency.uid, isRead: false } }
    );
    
    res.json({ 
      status: true, 
      message: `Marked ${affectedCount} notifications as read` 
    });
  } catch (error) {
    next(error);
  }
});

// Delete a notification
export const deleteNotificationAgent = Async(async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    const affectedCount = await ModelNotification.destroy({
      where: { sid: notificationId, aid: req.user.aid }
    });
    
    if (affectedCount === 0) {
      throw new ErrorClass("Notification not found or access denied", 404);
    }
    
    res.json({ status: true, message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export const deleteNotificationBusiness = Async(async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    const affectedCount = await ModelNotification.destroy({
      where: { sid: notificationId, uid: req.agency.uid }
    });
    
    if (affectedCount === 0) {
      throw new ErrorClass("Notification not found or access denied", 404);
    }
    
    res.json({ status: true, message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get notification statistics
export const getNotificationStatsAgent = Async(async (req, res, next) => {
  try {
    const totalCount = await ModelNotification.count({ 
      where: { aid: req.user.aid } 
    });
    
    const unreadCount = await ModelNotification.count({ 
      where: { aid: req.user.aid, isRead: false } 
    });
    
    const highPriorityCount = await ModelNotification.count({
      where: { 
        aid: req.user.aid, 
        isRead: false,
        data: { priority: 'high' }
      }
    });

    res.json({
      status: true,
      data: {
        total: totalCount,
        unread: unreadCount,
        highPriority: highPriorityCount
      }
    });
  } catch (error) {
    next(error);
  }
});

export const getNotificationStatsBusiness = Async(async (req, res, next) => {
  try {
    const totalCount = await ModelNotification.count({ 
      where: { uid: req.agency.uid } 
    });
    
    const unreadCount = await ModelNotification.count({ 
      where: { uid: req.agency.uid, isRead: false } 
    });
    
    const highPriorityCount = await ModelNotification.count({
      where: { 
        uid: req.agency.uid, 
        isRead: false,
        data: { priority: 'high' }
      }
    });

    res.json({
      status: true,
      data: {
        total: totalCount,
        unread: unreadCount,
        highPriority: highPriorityCount
      }
    });
  } catch (error) {
    next(error);
  }
});