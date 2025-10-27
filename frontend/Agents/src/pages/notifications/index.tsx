import { useState, useEffect } from "react";

import AgentNotificationList from "./AgentNotificationList";
// import Loader from "@/layouts/Loader";

export default function AgentNotificationsPage() {
  //   const [loading, setLoading] = useState(true);

  //  if (loading) {
  //         return <Loader show={loading} />;
  //       }

  return (
    <div className="min-h-screen bg-gray-50 w-full py-8">
      <AgentNotificationList />
    </div>
  );
}