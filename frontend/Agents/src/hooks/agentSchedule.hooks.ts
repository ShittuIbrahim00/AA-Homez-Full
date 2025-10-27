import scheduleServices from "@/services/schedule.services";

export const fetchAgentSchedules = async () => {
  try {
    console.log("Fetching agent schedules...");
    
    // Fetch schedules for all statuses using agent-specific endpoints
    const [pendingRes, approvedRes, declinedRes] = await Promise.all([
      scheduleServices.getAllPendingSchedules().catch(err => {
        console.error("Error fetching pending schedules:", err);
        return [];
      }),
      scheduleServices.getAllApprovedSchedules().catch(err => {
        console.error("Error fetching approved schedules:", err);
        return [];
      }),
      scheduleServices.getAllDeclinedSchedules().catch(err => {
        console.error("Error fetching declined schedules:", err);
        return [];
      })
    ]);

    console.log("Pending schedules response:", pendingRes);
    console.log("Approved schedules response:", approvedRes);
    console.log("Declined schedules response:", declinedRes);

    let allSchedules: any[] = [];
    
    // Handle the response structure from schedule services
    const addSchedules = (res: any, type: string) => {
      if (res && res.data) {
        console.log(`Adding ${type} schedules:`, res.data);
        if (Array.isArray(res.data)) {
          allSchedules = [...allSchedules, ...res.data];
        } else {
          console.warn(`${type} schedules data is not an array:`, res.data);
        }
      } else if (Array.isArray(res)) {
        console.log(`Adding ${type} schedules (array):`, res);
        allSchedules = [...allSchedules, ...res];
      } else if (res && typeof res === 'object' && res.status === false) {
        console.warn(`${type} schedules fetch failed:`, res.message);
      } else {
        console.warn(`${type} schedules response is not valid:`, res);
      }
    };
    
    addSchedules(pendingRes, "pending");
    addSchedules(approvedRes, "approved");
    addSchedules(declinedRes, "declined");

    console.log("Total schedules fetched:", allSchedules.length);
    return allSchedules;
  } catch (error) {
    console.error("Error fetching agent schedules:", error);
    // Return empty array instead of throwing to prevent UI crash
    return [];
  }
};