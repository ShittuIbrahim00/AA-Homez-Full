import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PropertyHeader } from "@/components/Custom";
import { getAllProperties } from "@/hooks/property.hooks";
import Loader from "@/layouts/Loader";
import PropertyCard from "@/components/Custom/PropertyCard";


import type { Property as PropertyType } from "@/types/property";

interface Property {
  pid: number;
  name?: string;
  price?: string;
  location?: string;
  images?: string[];
  listingStatus?: string;
  type?: string;
  keyInfo?: { label: string; value: string }[];
}

export default function Properties() {
  const router = useRouter();
  const { search: queryParam } = router.query;

  // States
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters and search
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "sold">("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Prefill search input from URL query parameter
  useEffect(() => {
    if (typeof queryParam === "string") {
      setSearchQuery(queryParam);
    } else {
      // Clear search when there's no query param
      setSearchQuery("");
    }
  }, [queryParam]);

  // Fetch properties once on mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await getAllProperties();
        setAllProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter and search properties
  const filteredProperties = allProperties.filter((property) => {
    const matchesSearch = searchQuery === "" || 
                          property.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          property.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
                          property.listingStatus?.toLowerCase() === filterStatus;
    
    const matchesType = filterType === "all" || 
                        property.type?.toLowerCase() === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.pid - a.pid;
      case "oldest":
        return a.pid - b.pid;
      case "price-high":
        const priceA = parseFloat(a.price?.replace(/[^0-9.-]+/g, "") || "0");
        const priceB = parseFloat(b.price?.replace(/[^0-9.-]+/g, "") || "0");
        return priceB - priceA;
      case "price-low":
        const priceC = parseFloat(a.price?.replace(/[^0-9.-]+/g, "") || "0");
        const priceD = parseFloat(b.price?.replace(/[^0-9.-]+/g, "") || "0");
        return priceC - priceD;
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = sortedProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page change with scroll to top
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search from the PropertyHeader component
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Update URL with search parameter
    if (value.trim() !== "") {
      router.push(`/properties?search=${encodeURIComponent(value.trim())}`, undefined, { shallow: true });
    } else {
      // Remove search parameter when empty
      router.push("/properties", undefined, { shallow: true });
    }
  };

  // Clear all filters and search
  const handleClearAll = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterType("all");
    setSortBy("newest");
    router.push("/properties", undefined, { shallow: true });
  };

  // Handle property card click
  const handlePropertyClick = (propertyId: number) => {
    router.push(`/properties/${propertyId}`);
  };

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  }, [searchQuery, filterStatus, filterType, sortBy]);
  return (
    <div className="p-4 sm:p-2 ">
      <PropertyHeader
        title="Properties"
        onAddNew={() => router.push("/properties/add")}
        onSearch={handleSearch}
        searchPlaceholder="Search properties by name or location..."
        searchValue={searchQuery}
      />

      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {(searchQuery || filterStatus !== "all" || filterType !== "all" || sortBy !== "newest") && (
          <div className="flex items-end">
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && <Loader />}

      {/* Properties Grid */}
      {!loading && (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {paginatedProperties.length} of {sortedProperties.length} properties
          </div>
          
          {paginatedProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {paginatedProperties.map((property) => (
                <div 
                  key={property.pid} 
                  onClick={() => handlePropertyClick(property.pid)}
                  className="cursor-pointer"
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
            
          ) : (
            /* No Properties Found */
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? `No properties match your search for "${searchQuery}". Try different keywords or clear your search.`
                  : "Try adjusting your filters to find what you're looking for."
                }
              </p>
              <button
                onClick={handleClearAll}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}