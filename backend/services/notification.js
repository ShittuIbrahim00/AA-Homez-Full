import ModelNotification from "../models/model.notification.js";

export const NotificationType = {
  SECURITY: 'security',
  VERIFICATION: 'verification',
  PROFILE: 'profile',
  COMMISSION: 'commission',
  REFERRAL: 'referral',
  SYSTEM: 'system',
  AFFILIATE: 'affiliate',
  DASHBOARD: 'dashboard',
  EVENT: 'event'
};

export const NotificationPriority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const createAgentNotification = async (agentId, title, body, data = {}) => {
  try {
    return await ModelNotification.create({
      aid: agentId,
      title,
      body,
      data: { 
        ...data, 
        type: data.type || NotificationType.SYSTEM, 
        priority: data.priority || NotificationPriority.MEDIUM,
        for: 'agent',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to create agent notification:', error);
  }
};

export const createBusinessNotification = async (businessId, title, body, data = {}) => {
  try {
    return await ModelNotification.create({
      uid: businessId,
      title,
      body,
      data: { 
        ...data, 
        type: data.type || NotificationType.SYSTEM, 
        priority: data.priority || NotificationPriority.MEDIUM,
        for: 'business',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to create business notification:', error);
  }
};

export const createDualNotification = async (agentId, businessId, title, body, data = {}) => {
  try {
    // Create for agent
    await createAgentNotification(agentId, title, body, data);
    
    // Create for business
    if (businessId) {
      await createBusinessNotification(businessId, title, body, {
        ...data,
        agentId: agentId
      });
    }
  } catch (error) {
    console.error('Failed to create dual notification:', error);
  }
};

export const createScheduleUpdateNotification = async (agentId, businessId, propertyTitle, scheduleId, propertyId) => {
  const title = "Schedule Updated";
  const body = `Schedule for ${propertyTitle} has been updated`;
  
  const notificationData = {
    type: NotificationType.EVENT,
    priority: NotificationPriority.MEDIUM,
    scheduleId,
    propertyId,
    action: 'update',
    timestamp: new Date().toISOString()
  };

  return createDualNotification(agentId, businessId, title, body, notificationData);
};

export const createScheduleStatusNotification = async (agentId, status, propertyTitle, scheduleId, propertyId) => {
  const title = `Schedule ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  const body = `Your schedule for ${propertyTitle} has been ${status}`;
  
  const notificationData = {
    type: NotificationType.EVENT,
    priority: status === 'approved' ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
    scheduleId,
    propertyId,
    action: status,
    timestamp: new Date().toISOString()
  };

  return createAgentNotification(agentId, title, body, notificationData);
};

export const createScheduleApproveNotification = async (agentId, propertyTitle, scheduleId, propertyId) => {
  return createScheduleStatusNotification(agentId, 'approved', propertyTitle, scheduleId, propertyId);
};

export const createScheduleDeclineNotification = async (agentId, propertyTitle, scheduleId, propertyId) => {
  return createScheduleStatusNotification(agentId, 'declined', propertyTitle, scheduleId, propertyId);
};

export const getDayName = (dayIndex) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] || 'Unknown';
};

export const createScheduleAvailabilityNotification = async (agentIds, businessName, scheduleDays, scheduleTime, businessUid) => {
  try {
    const title = "Schedule Availability Updated";
    const days = scheduleDays.map(dayIndex => getDayName(dayIndex)).join(', ');
    const times = scheduleTime.map(hour => `${hour}:00 - ${hour + 1}:00`).join(', ');
    
    const body = `${businessName} has updated their availability: ${days} at ${times}`;
    
    const notifications = [];
    
    for (const agentId of agentIds) {
      const notificationData = {
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.MEDIUM,
        businessId: businessUid,
        action: 'schedule_update',
        scheduleDays,
        scheduleTime,
        timestamp: new Date().toISOString()
      };
      
      const notification = await createAgentNotification(
        agentId,
        title,
        body,
        notificationData
      );
      
      notifications.push(notification);
    }
    
    return notifications;
  } catch (error) {
    console.error('Failed to create schedule availability notifications:', error);
  }
};