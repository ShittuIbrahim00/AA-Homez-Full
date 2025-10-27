import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PropertyContext } from "@/context/property";
import { PropertyCard, PropertyCard2, PropertyHeader } from "@/components/Custom";
import Loader from "@/layouts/Loader";
import { FaFire, FaHome } from "react-icons/fa";
import PropertyComparison from "@/components/Custom/PropertyComparison";
import MarketInsights from "@/components/Custom/MarketInsights";

const EmptyState = ({ message }: { message: string }) => (
  <div className="h-[20vh] flex items-center justify-center">
    <h2 className="font-medium text-sm text-gray-500">{message}</h2>
  </div>
);

function AgentHome() {
  const router = useRouter();

  const context = useContext(PropertyContext);
  if (!context)
    throw new Error("PropertyContext must be used within a PropertyProvider");

  const [
    hotProperties,
    setHotProperties,
    subProperty,
    setSubProperty,
    fullProperties,
    setFullProperties,
    tempProp,
    setTempProp,
  ] = context;

  const [loadingHot, setLoadingHot] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);

  const [filterType, setFilterType] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  // const [searchQuery, setSearchQuery] = useState<string>("");

  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // Increased for better grid layout
  const totalPages = Math.ceil(filteredProperties.length / pageSize);
  const paginated = filteredProperties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    // Check if router.query exists and has search property
    if (router && router.query && typeof router.query.search === "string") {
      setSearchText(router.query.search);
    }
  }, [router]);

  // Fetch properties and remove sold ones
  const fetchProperties = async () => {
    setLoadingHot(true);
    setLoadingFull(true);
    try {
      const [_getAllHotProperty, _getProperties] = await Promise.all([
        import("@/hooks/property.hooks").then((mod) =>
          mod._getAllHotProperty()
        ),
        import("@/hooks/property.hooks").then((mod) => mod._getProperties()),
      ]);
      const hotRes = await _getAllHotProperty;
      const fullRes = await _getProperties;

      // Sort full properties from latest to oldest
      const allPropsRaw = Array.isArray(fullRes)
        ? fullRes
        : fullRes?.data ?? [];

      // Sort by createdAt or any timestamp field if available, otherwise keep as is
      const sortedAllProps = [...allPropsRaw].sort((a, b) => {
        // Try multiple timestamp fields that might exist
        const timestampFields = ['createdAt', 'created_at', 'dateCreated', 'date'];
        
        for (const field of timestampFields) {
          if (a[field] && b[field]) {
            return new Date(b[field]).getTime() - new Date(a[field]).getTime();
          }
        }
        
        // If no timestamp fields found, sort by array index (newest first based on API response)
        return 0;
      });

      const hotPropsRaw = Array.isArray(hotRes) ? hotRes : hotRes?.data ?? [];

      // Remove sold properties
      const filteredAllProps = sortedAllProps.filter(
        (p) => p.listingStatus?.toLowerCase() !== "sold"
      );

      const filteredHotProps = hotPropsRaw.filter(
        (p) => p.listingStatus?.toLowerCase() !== "sold"
      );

      setHotProperties(filteredHotProps);
      setFullProperties(filteredAllProps);
      setFilteredProperties(filteredAllProps);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setHotProperties([]);
      setFullProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoadingHot(false);
      setLoadingFull(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = [...fullProperties];

    if (filterType !== "all") {
      filtered = filtered.filter(
        (p) => p.type?.toLowerCase() === filterType.toLowerCase()
      );
    }

    const keyword = searchText.trim().toLowerCase();
    if (keyword !== "") {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(keyword) ||
          p.location?.toLowerCase().includes(keyword)
      );
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [filterType, searchText, fullProperties]);

  const gotoPropertyPage = (pid: string) => {
    router.push(`/properties/${pid}`);
  };

  // Handle page change with scroll to top
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loadingHot || loadingFull) return <Loader />;

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 md:py-8 md:mt-24 text-black bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Area with Zillow-inspired Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - All Properties */}
          <div className="w-full lg:w-3/4">
            {/* FILTERS - Zillow Style */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 text-gray-800 bg-white hover:border-orange-500 transition w-full md:w-auto"
                >
                  <option value="all">All Property Types</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="land">Land</option>
                </select>

                <div className="relative flex-grow w-full">
                  <input
                    type="text"
                    placeholder="Search by city, neighborhood, or address"
                    value={searchText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchText(val);
                      if (val === "") {
                        // Remove `search` from URL when input is cleared
                        router.push("/home", undefined, { shallow: true });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (searchText.trim() === "") {
                          router.push("/home", undefined, { shallow: true });
                        } else {
                          router.push(
                            `/home?search=${encodeURIComponent(searchText.trim())}`,
                            undefined,
                            { shallow: true }
                          );
                        }
                      }
                    }}
                    className="px-4 py-3 rounded-lg border border-gray-300 w-full text-gray-800 placeholder-gray-400 bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition"
                    onClick={() => {
                      if (searchText.trim() === "") {
                        router.push("/home", undefined, { shallow: true });
                      } else {
                        router.push(
                          `/home?search=${encodeURIComponent(searchText.trim())}`,
                          undefined,
                          { shallow: true }
                        );
                      }
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* ALL PROPERTIES */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Properties for Sale</h2>
                <span className="text-gray-600">{filteredProperties.length} results</span>
              </div>
              
              {loadingFull ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <PropertyCard2 key={index} loading={true} />
                  ))}
                </div>
              ) : filteredProperties.length === 0 ? (
                <EmptyState message="No Properties Found" />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginated.map((item, index) => (
                      <PropertyCard2
                        item={item}
                        index={index}
                        key={item.pid ?? index}
                        onClick={() => gotoPropertyPage(item.pid)}
                      />
                    ))}
                  </div>

                  <div className="mt-8 flex justify-center gap-2 flex-wrap">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 rounded border transition-colors duration-200 ${
                          currentPage === i + 1
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-orange-500 border-orange-500 hover:bg-orange-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>

          {/* Sidebar - Hot Properties with Zillow-inspired Design */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <FaFire className="text-orange-500" />
                <h2 className="text-xl font-bold text-gray-900">Hottest Properties</h2>
              </div>
              
              {loadingHot ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="w-full">
                      <PropertyCard loading={true} />
                    </div>
                  ))}
                </div>
              ) : hotProperties.length === 0 ? (
                <EmptyState message="No Hottest Properties Found" />
              ) : (
                <div className="space-y-6">
                  {hotProperties
                    .filter((item) => !!item.pid)
                    .sort((a, b) => (b.hottestCount ?? 0) - (a.hottestCount ?? 0))
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={item.pid} className="w-full border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <PropertyCard
                          item={item}
                          index={index}
                          onClick={() => gotoPropertyPage(item.pid)}
                          details={false} // Simplified view for sidebar
                        />
                      </div>
                    ))}
                </div>
              )}
              
              {/* <button 
                onClick={() => router.push("/properties?hottest=true")}
                className="w-full mt-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-300"
              >
                View All Hot Properties
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentHome;