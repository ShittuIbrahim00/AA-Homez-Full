import { useEffect, useState } from "react";
import axios from "axios";
import { Agent, AffiliatesAPIResponse } from "@/types/agent"; // ✅ import Agent type

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/agency/affiliates/all`;

const getGuardToken = () => {
  const token = localStorage.getItem("business-token");
  if (!token) throw new Error("Auth token missing. Please login again.");
  return token;
};

// ✅ Hook to fetch all agents
export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]); // ✅ typed!
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const token = getGuardToken();
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `${token}`,
          },
        });
        // console.log("✅ Fetch all agents response:", res);
        setAgents(res.data.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return { agents, loading, error };
};

// ✅ Hook to fetch a single agent by ID
export const useAgentById = (id: number | string) => {
  const [agent, setAgent] = useState<Agent | null>(null); // ✅ typed!
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAgent = async () => {
      try {
        const token = getGuardToken();
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `${token}`,
          },
        });
        // console.log(res);
        const agentData = res.data.data.find(
          (a: Agent) => a.aid === parseInt(id.toString())
        );

        if (!agentData) {
          setError("Agent not found.");
          setAgent(null);
        } else {
          setAgent(agentData);
          setError(null);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
        setAgent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  return { agent, loading, error };
};

// ✅ Get agents function (non-hook version)
export const _getAgents = async (page = 1, limit = 10) => {
  try {
    const token = getGuardToken();
    const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    // console.log("✅ Get agents response:", res.data);
    return res.data.data || [];
  } catch (err: any) {
    console.error("❌ Get agents error:", err.response?.data || err.message);
    return false;
  }
};
