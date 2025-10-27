import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAgentById } from "../../../hooks/agent.hooks";
// Import React Icons
import { FaMapMarkerAlt, FaCalendarAlt, FaTag, FaMoneyBillWave } from "react-icons/fa";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("");

// Temporary placeholders for verification and rating
const isVerified = true;
const agentRating = 4.3;

// Pagination constants
const PROPERTIES_PER_PAGE = 5;

export default function AgentDetailPage() {
  const router = useRouter();
  const { aid } = router.query;
  const aidString = Array.isArray(aid) ? aid[0] : aid || "";
  const { agent, loading, error } = useAgentById(aidString);

  // Pagination states
  const [propertiesPage, setPropertiesPage] = useState(1);
  const [subPropertiesPage, setSubPropertiesPage] = useState(1);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin border-t-orange-500" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-red-600 font-semibold">{error || "Agent not found."}</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-orange-600 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 mb-6"
        >
          ← Back to Agents
        </button>
      </div>
    );
  }

  // Calculate total properties (both Property and SubProperties)
  const totalProperties = (agent.Property?.length || 0) + (agent.SubProperties?.length || 0);

  // Pagination logic for Properties
  const properties = agent.Property || [];
  const paginatedProperties = properties.slice(
    (propertiesPage - 1) * PROPERTIES_PER_PAGE,
    propertiesPage * PROPERTIES_PER_PAGE
  );
  const propertiesTotalPages = Math.ceil(properties.length / PROPERTIES_PER_PAGE);

  // Pagination logic for SubProperties
  const subProperties = agent.SubProperties || [];
  const paginatedSubProperties = subProperties.slice(
    (subPropertiesPage - 1) * PROPERTIES_PER_PAGE,
    subPropertiesPage * PROPERTIES_PER_PAGE
  );
  const subPropertiesTotalPages = Math.ceil(subProperties.length / PROPERTIES_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center mb-8 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-orange-600 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
      >
        ← Back to Agents
      </button>

      {/* Agent Profile */}
      <section className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Profile Image */}
        {agent.imgUrl ? (
          <img
            src={agent.imgUrl}
            alt={agent.fullName}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-orange-600 text-white flex items-center justify-center text-4xl font-bold border border-orange-700">
            {getInitials(agent.fullName)}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-gray-900">{agent.fullName}</h1>
             
              
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Referral Code:{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
                {agent.referralCode}
              </span>
            </p>

            <p className="text-sm text-gray-600 mt-1">
              Joined:{" "}
              <span className="font-semibold text-gray-800">
                {new Date(agent.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            {agent.email && (
              <p className="text-sm text-gray-600 mt-1">
                Email:{" "}
                <span className="font-semibold text-gray-800">
                  {agent.email}
                </span>
              </p>
            )}
            {agent.phone && (
              <p className="text-sm text-gray-600 mt-1">
                Phone:{" "}
                <span className="font-semibold text-gray-800">
                  {agent.phone}
                </span>
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center mt-6 space-x-1 text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(agentRating) ? "fill-current" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M10 15l-5.878 3.09L5.34 12.18 0 7.91l6.059-.87L10 2l3.941 5.04L20 7.91l-5.34 4.27 1.218 5.91z" />
              </svg>
            ))}
            <span className="text-gray-600 text-sm ml-2">{agentRating.toFixed(1)}/5</span>
          </div>
        </div>
      </section>

      {/* Financials and Bank Info */}
      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6 text-center">
          <h3 className="text-gray-500 font-semibold uppercase text-xs tracking-wide mb-2">
            Sales Earnings
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            ₦{Number(agent.sales_earnings).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6 text-center">
          <h3 className="text-gray-500 font-semibold uppercase text-xs tracking-wide mb-2">
            Referral Earnings
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            ₦{Number(agent.referral_earnings).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6 text-center">
          <h3 className="text-gray-500 font-semibold uppercase text-xs tracking-wide mb-2">
            Total Earnings
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            ₦{Number(agent.total_earnings).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6 text-center">
          <h3 className="text-gray-500 font-semibold uppercase text-xs tracking-wide mb-2">
            Total Sales Value
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            ₦{Number(agent.sales_portfolio).toLocaleString()}
          </p>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Information</h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>
              <span className="font-semibold">Bank Name:</span> {agent.bankName}
            </p>
            <p>
              <span className="font-semibold">Account Name:</span> {agent.accountName}
            </p>
            <p>
              <span className="font-semibold">Account Number:</span> {agent.accountNumber}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification</h3>
          <p className="text-gray-700 text-sm">
            NIN Verified:{" "}
            {agent.ninVerified ? (
              <span className="text-green-600 font-semibold">Yes ✅</span>
            ) : (
              <span className="text-red-600 font-semibold">No ❌</span>
            )}
          </p>
          <p className="text-gray-700 text-sm mt-2">
            Rank: <span className="font-semibold">{agent.rank}</span>
          </p>
          <p className="text-gray-700 text-sm mt-2">
            Referral Count: <span className="font-semibold">{agent.referral_count}</span>
          </p>
        </div>
      </section>

      {/* Properties List */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Properties & Sub-Properties ({totalProperties})
        </h2>

        {totalProperties === 0 ? (
          <p className="text-gray-500 italic bg-gray-50 border border-gray-200 rounded p-6 text-center">
            This agent has not been assigned any properties or sub-properties.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Properties */}
            {properties.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Properties ({properties.length})</h3>
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {paginatedProperties.map((prop) => (
                      <li key={prop.pid} className="hover:bg-gray-50 transition-colors">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              {prop.images && prop.images.length > 0 ? (
                                <img 
                                  src={prop.images[0]} 
                                  alt={prop.location || "Property"} 
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/default-schedule.jpg";
                                  }}
                                />
                              ) : (
                                <FaMapMarkerAlt className="text-gray-400 w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{prop.location || "Unnamed Property"}</h4>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-orange-500" />
                                {prop.location}
                              </p>
                           
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-orange-600 flex items-center gap-1">
                              <FaMoneyBillWave className="text-orange-500" />
                              {prop.price}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <FaCalendarAlt className="text-gray-400" />
                              {new Date(prop.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            {prop.soldTo && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                                Sold
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="px-4 pb-4 flex justify-end">
                          <button
                            className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm"
                            onClick={() => router.push(`/properties/${prop.pid}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Properties Pagination */}
                {propertiesTotalPages > 1 && (
                  <div className="flex justify-between items-center mt-4 px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <button
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 transition hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onClick={() => {
                        const newPage = Math.max(propertiesPage - 1, 1);
                        setPropertiesPage(newPage);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={propertiesPage === 1}
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {propertiesPage} of {propertiesTotalPages}
                    </span>
                    <button
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 transition hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onClick={() => {
                        const newPage = Math.min(propertiesPage + 1, propertiesTotalPages);
                        setPropertiesPage(newPage);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={propertiesPage === propertiesTotalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sub-Properties */}
            {subProperties.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Sub-Properties ({subProperties.length})</h3>
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {paginatedSubProperties.map((subProp) => (
                      <li key={subProp.sid} className="hover:bg-gray-50 transition-colors">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              {subProp.images && subProp.images.length > 0 ? (
                                <img 
                                  src={subProp.images[0]} 
                                  alt={subProp.location || "Sub-Property"} 
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/default-schedule.jpg";
                                  }}
                                />
                              ) : (
                                <FaMapMarkerAlt className="text-gray-400 w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{subProp.location || "Unnamed Sub-Property"}</h4>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <FaMapMarkerAlt className="text-orange-500" />
                                {subProp.location}
                              </p>
                          
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-orange-600 flex items-center gap-1">
                              <FaMoneyBillWave className="text-orange-500" />
                              {subProp.price}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <FaCalendarAlt className="text-gray-400" />
                              {new Date(subProp.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            {subProp.soldTo && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                                Sold
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="px-4 pb-4 flex justify-end">
                          <button
                            className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm"
                            onClick={() => {
                              // We need to find which property this sub-property belongs to
                              // This would require additional API call or data structure change
                              // For now, we'll navigate to a generic sub-property page
                              // You might need to adjust this based on your routing structure
                              router.push(`/properties/sub/${subProp.sid}`);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Sub-Properties Pagination */}
                {subPropertiesTotalPages > 1 && (
                  <div className="flex justify-between items-center mt-4 px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <button
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 transition hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onClick={() => {
                        const newPage = Math.max(subPropertiesPage - 1, 1);
                        setSubPropertiesPage(newPage);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={subPropertiesPage === 1}
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {subPropertiesPage} of {subPropertiesTotalPages}
                    </span>
                    <button
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 transition hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onClick={() => {
                        const newPage = Math.min(subPropertiesPage + 1, subPropertiesTotalPages);
                        setSubPropertiesPage(newPage);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={subPropertiesPage === subPropertiesTotalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}