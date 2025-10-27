import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BackHeader from "@/components/Custom/BackHeader";
import { useResponsiveToast } from "@/hooks/useResponsiveToast";
import { PropertyInfo, ClientInfoForm, DateTimeSelection, SubmitButton, Confirmation } from "@/components/schedule/visit";

interface AgencySettings {
  images: string[];
  scheduleDays: number[];
  scheduleTime: number[];
  sid: number;
  uid: number;
  name: string;
  description: string;
  location: string;
  type: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface FormState {
  aid: string;
  pid: string;
  sid: string;
  title: string;
  date: Date | null;
  time: string;
  clientName: string;
  clientPhone: string;
}

interface RouterQuery {
  aid: string;
  pid?: string;
  sid?: string;
  propertyname?: string;
  propertylocation?: string;
  subpropertyname?: string;
  subpropertylocation?: string;
}

const ScheduleVisitPage = () => {
  const router = useRouter();
  const { toastSuccess, toastError, toastWarning, toastInfo } = useResponsiveToast();
  const { aid, pid, sid, propertyname, propertylocation, subpropertyname, subpropertylocation } = router.query;
  
  const [agencySettings, setAgencySettings] = useState<AgencySettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState<string | null>(null);
  
  const initialFormState: FormState = {
    aid: aid && typeof aid === 'string' ? aid : "",
    pid: pid && typeof pid === 'string' ? pid : "",
    sid: sid && typeof sid === 'string' ? sid : "",
    title: "Property Visitation",
    date: new Date(),
    time: "",
    clientName: "",
    clientPhone: "",
  };

  const [form, setForm] = useState<FormState>(initialFormState);

  useEffect(() => {
    // Update form when query params are available
    if (aid || pid || sid) {
      setForm(prev => ({
        ...prev,
        aid: aid && typeof aid === 'string' ? aid : prev.aid,
        pid: pid && typeof pid === 'string' ? pid : prev.pid,
        sid: sid && typeof sid === 'string' ? sid : prev.sid
      }));
    }
    
    // Fetch agency settings if aid is provided
    if (aid && typeof aid === 'string') {
      fetchSettings(aid);
    }
  }, [aid, pid, sid]);

  const fetchSettings = async (agentId: string) => {
    if (!agentId || typeof agentId !== 'string') {
      console.warn("Invalid agentId provided for fetching settings");
      return;
    }
    
    try {
      const res = await axios.get(
        `https://aa-homez.onrender.com/api/v1/settings/user/${agentId}`
      );
      if (res.data.status && res.data.data) {
        setAgencySettings(res.data.data);
      } else {
        console.warn("Agency settings fetch returned no data or status false");
        toastWarning("No agency settings found.");
      }
    } catch (error: any) {
      console.error("Failed to fetch agency settings:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      
      const errorMessage = error.response?.data?.message || "Failed to load agency settings. Please try again.";
      toastError(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setForm({ ...form, date });
    }
  };

  const resetForm = () => {
    setForm({
      aid: aid && typeof aid === 'string' ? aid : "",
      pid: pid && typeof pid === 'string' ? pid : "",
      sid: sid && typeof sid === 'string' ? sid : "",
      title: "Property Visitation",
      date: new Date(),
      time: "",
      clientName: "",
      clientPhone: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (loading) {
      return;
    }

    const { date, time, clientName, clientPhone, pid, sid, title } = form;

    const storedAid = localStorage.getItem("$agent_id");
    if (!storedAid) {
      toastError("Agent ID not found in localStorage.");
      return;
    }

    if (!date || !time || !clientName || !clientPhone) {
      toastError("All fields are required");
      return;
    }

    let validDate: Date;
    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        toastError("Invalid date selected");
        return;
      }
      validDate = date;
    } else {
      validDate = new Date(date);
      if (isNaN(validDate.getTime())) {
        toastError("Invalid date selected");
        return;
      }
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      toastError("Invalid time format");
      return;
    }

    const formattedDate = `${validDate.getFullYear()}-${(validDate.getMonth() + 1).toString().padStart(2, '0')}-${validDate.getDate().toString().padStart(2, '0')}`;

    const payload: any = {
      aid: Number(storedAid),
      title: title || "Property Visitation",
      date: formattedDate,
      time: time,
      clientName: clientName,
      clientPhone: clientPhone,
    };

    if (pid) {
      payload.pid = Number(pid);
    }

    if (sid) {
      payload.sid = Number(sid);
    }

    // Validate payload
    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === 'string' && value === "Invalid Date") {
        console.error(`Field ${key} contains 'Invalid Date':`, value);
        toastError(`Error in field ${key} - contains invalid date`);
        return;
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("$token_key");

      if (!token) {
        toastError("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "https://aa-homez.onrender.com/api/v1/schedule/agent",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        toastSuccess("Schedule created successfully!");
        setShowConfirmation(true);
        setScheduleInfo(`Your visit has been scheduled for ${validDate.toDateString()} at ${time}`);
        resetForm();
      } else {
        toastError(response.data.message || "Failed to create schedule");
      }
    } catch (error: any) {
      console.error("Schedule creation error:", error);
      toastError(error.response?.data?.message || "Failed to create schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const minutesToTime = (minutes: number) => {
    if (typeof minutes !== 'number') return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const dayNumberToName = (dayNumber: number) => {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber] || '';
  };

  const isDateAvailable = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return true;
    }
    
    if (!agencySettings || !Array.isArray(agencySettings.scheduleDays)) return true;
    const day = date.getDay();
    const dayIndex = day === 0 ? 7 : day;
    return agencySettings.scheduleDays.includes(dayIndex);
  };

  // If confirmation is shown, display success message
  if (showConfirmation) {
    return (
      <Confirmation
        scheduleInfo={scheduleInfo}
        onBackToSchedule={() => router.push("/schedule")}
        onClose={() => {
          setScheduleInfo(null);
          setShowConfirmation(false);
          router.push("/schedule");
        }}
      />
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 md:py-8 md:mt-24 text-black bg-gray-50 min-h-screen">
      <div className="">
        <BackHeader text="Back" />
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-6">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-orange-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Schedule a Property Visit
            </h1>
            <p className="text-gray-600 mt-2">
              Select a date and time for your property visit
            </p>
          </div>
          
          {/* Property/Sub-property Information */}
          <PropertyInfo
            propertyname={propertyname}
            propertylocation={propertylocation}
            subpropertyname={subpropertyname}
            subpropertylocation={subpropertylocation}
            agencySettings={agencySettings}
            dayNumberToName={dayNumberToName}
          />
          
          {!agencySettings && (
            <div className="mb-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600 text-center">Loading agency information...</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <ClientInfoForm
              clientName={form.clientName}
              clientPhone={form.clientPhone}
              loading={loading}
              onChange={handleChange}
            />

            {/* Date and Time Selection */}
            <DateTimeSelection
              date={form.date}
              time={form.time}
              loading={loading}
              agencySettings={agencySettings}
              isDateAvailable={isDateAvailable}
              onDateChange={handleDateChange}
              onTimeChange={handleChange}
              minutesToTime={minutesToTime}
            />

            {/* Submit Button */}
            <SubmitButton
              loading={loading}
              agencySettings={agencySettings}
              onSubmit={handleSubmit}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleVisitPage;