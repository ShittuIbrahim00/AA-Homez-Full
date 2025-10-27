import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { useAgents } from "../../hooks/agent.hooks";
import { format } from "date-fns";
import Spinner from "@/components/Custom/Spinner";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("");

const ITEMS_PER_PAGE = 10;

export default function AgentsPage() {
  const { agents, loading, error } = useAgents();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("properties_desc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAgents = useMemo(() => {
    let result = [...agents];

    if (searchTerm) {
      result = result.filter((agent) =>
        agent.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOption) {
      case "name_asc":
        result.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case "name_desc":
        result.sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
      case "date_newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "date_oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "properties_desc":
        // Sort by total properties (Property + SubProperties), then by referral count
        result.sort((a, b) => {
          const aTotal = (a.Property?.length || 0) + (a.SubProperties?.length || 0);
          const bTotal = (b.Property?.length || 0) + (b.SubProperties?.length || 0);
          
          // First sort by properties sold
          if (bTotal !== aTotal) {
            return bTotal - aTotal;
          }
          
          // If properties are equal, sort by referral count
          return b.referral_count - a.referral_count;
        });
        break;
      case "properties_asc":
        // Sort by total properties (Property + SubProperties), then by referral count
        result.sort((a, b) => {
          const aTotal = (a.Property?.length || 0) + (a.SubProperties?.length || 0);
          const bTotal = (b.Property?.length || 0) + (b.SubProperties?.length || 0);
          
          // First sort by properties sold
          if (aTotal !== bTotal) {
            return aTotal - bTotal;
          }
          
          // If properties are equal, sort by referral count
          return a.referral_count - b.referral_count;
        });
        break;
    }

    return result;
  }, [agents, searchTerm, sortOption]);

  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change with scroll to top
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  }, [searchTerm, sortOption]);

  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

 return (
  <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
    <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900">Agents</h1>

    {/* Filters - Improved for tablet responsiveness */}
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4 md:mb-6">
      <input
        type="text"
        placeholder="Search by name..."
        className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="name_asc">Name A–Z</option>
        <option value="name_desc">Name Z–A</option>
        <option value="date_newest">Newest</option>
        <option value="date_oldest">Oldest</option>
        <option value="properties_desc">Most Properties</option>
        <option value="properties_asc">Fewest Properties</option>
      </select>
    </div>

    {/* Table for sm and above - Improved for tablet */}
    <div className="hidden sm:block overflow-x-auto border border-gray-200 shadow rounded-lg bg-white">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Agent
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Referrals
            </th>
            {/* Removed Agent ID column */}
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Properties
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {paginatedAgents.map((agent) => {
            // Calculate total properties (Property + SubProperties)
            const totalProperties = (agent.Property?.length || 0) + (agent.SubProperties?.length || 0);
            
            return (
              <tr
                key={agent.aid}
                onClick={() => router.push(`/agents/${agent.aid}`)}
                className="hover:bg-orange-50 cursor-pointer"
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  {agent.imgUrl ? (
                    <img
                      src={agent.imgUrl}
                      alt={agent.fullName}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-300 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-sm md:text-lg border border-orange-600 flex-shrink-0">
                      {getInitials(agent.fullName)}
                    </div>
                  )}

                  <div className="text-gray-900 font-medium text-sm md:text-base">
                    <span className="group-hover:text-orange-600 transition-colors duration-200">
                      {agent.fullName}
                    </span>

                    {totalProperties >= 3 && (
                      <span className="ml-2 inline-block bg-green-100 text-green-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                        Top Agent
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-700 font-mono text-sm whitespace-nowrap">
                  {agent.referral_count}
                </td>
                <td className="px-4 py-3 text-center text-gray-700 font-semibold text-sm whitespace-nowrap">
                  {totalProperties}
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm whitespace-nowrap">
                  {format(new Date(agent.createdAt), "MMM d, yyyy")}
                </td>
              </tr>
            );
          })}
          {paginatedAgents.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500 italic">
                No agents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Cards for mobile - Improved for tablet */}
    <div className="sm:hidden space-y-3">
      {paginatedAgents.length === 0 && (
        <p className="text-center py-6 text-gray-500 italic">No agents found.</p>
      )}

      {paginatedAgents.map((agent) => {
        // Calculate total properties (Property + SubProperties)
        const totalProperties = (agent.Property?.length || 0) + (agent.SubProperties?.length || 0);
        
        return (
          <div
            key={agent.aid}
            onClick={() => router.push(`/agents/${agent.aid}`)}
            className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex items-center gap-3 hover:shadow-md transition"
          >
            {agent.imgUrl ? (
              <img
                src={agent.imgUrl}
                alt={agent.fullName}
                className="w-12 h-12 rounded-full object-cover border border-gray-300 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-lg border border-orange-600 flex-shrink-0">
                {getInitials(agent.fullName)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {agent.fullName}
              </h3>

              <div className="text-xs text-gray-600 mt-1 truncate">
                Referrals: <span className="font-mono">{agent.referral_count}</span>
              </div>

              {/* Removed Agent ID line */}

              <div className="text-xs text-gray-600 mt-1">
                Properties: <span className="font-semibold">{totalProperties}</span>
                {totalProperties >= 3 && (
                  <span className="ml-1 inline-block bg-green-100 text-green-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    Top Agent
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-600 mt-1">
                Joined: {format(new Date(agent.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Pagination - Improved for tablet */}
    {totalPages > 1 && (
      <div className="flex flex-col xs:flex-row justify-between items-center mt-4 md:mt-6 gap-3">
        <button
          className="px-3 py-1.5 text-sm border rounded disabled:opacity-50 transition hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1.5 text-sm border rounded disabled:opacity-50 transition hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    )}
  </div>
);

}