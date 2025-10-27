import { useState, useEffect } from "react";


import AdminNotificationList from "../notifications/AdminNotificationList";
// import Loader from "@/layouts/Loader";

export default function AdminNotificationsPage() {
    //   const [loading, setLoading] = useState(true);

//  if (loading) {
//         return <Loader show={loading} />;
//       }

  return (
   
    
    <div className="min-h-screen bg-gray-50 py-8">
      <AdminNotificationList />
    </div>
  );
}
