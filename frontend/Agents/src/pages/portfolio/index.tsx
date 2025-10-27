// pages/portfolio/index.tsx
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import {
  PropertyCard2,
  PropertyHeader,
  ReferralCard,
} from "@/components/Custom";
import { EarningsCard, PortfolioCard, PropertiesSoldList } from "@/components/portfolio";
import SubPropertiesSoldList from "@/components/portfolio/SubPropertiesSoldList"; // Add this import
import { useRouter } from "next/router";
import { UserContext } from "@/context/user";
import { _getUser } from "@/hooks/user.hooks";
import { _getReferrals } from "@/hooks/referral.hooks";
import Loader from "@/layouts/Loader";
import type { Referral, SubPropertySold } from "@/types/user"; // Add SubPropertySold import
import { FaChartLine, FaHome, FaUsers, FaTrophy, FaMedal, FaUser, FaShareAlt, FaCopy, FaWhatsapp, FaFacebook, FaTwitter, FaEnvelope, FaCircle } from "react-icons/fa";

const Portfolio: React.FC = () => {
  // @ts-ignore
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralsLoading, setReferralsLoading] = useState(true);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  const gotoReferral = (userId: string) => {
    router.push({ pathname: "/referral", query: { aid: userId } }, undefined, {
      shallow: true,
    });
  };

  const gotoEarnings = (value: string) => {
    console.log("Clicked:", value);
  };

  const loadData = async () => {
    setLoading(true);
    setReferralsLoading(true);
    try {
      const [userData, referralList] = await Promise.all([
        _getUser(),
        _getReferrals(),
      ]);

      if (userData) {
        // Log the properties sold data
        console.log("Properties sold data in portfolio page:", userData.propertiesSold);
        // Log the sub-properties sold data
        console.log("Sub-properties sold data in portfolio page:", userData.subPropertiesSold);
        setUser(userData);
      }
      setReferrals(referralList);
    } catch (err) {
      console.error("Failed to load portfolio data", err);
    } finally {
      setLoading(false);
      setReferralsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-6 bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-xl font-semibold bg-gray-50">
        Unable to load user data.
      </div>
    );
  }

  const handleCopyReferralLink = () => {
    const referralLink = user?.agent?.referralCode 
      ? `https://aa-homes-copy.vercel.app/auth/signup?code=${user.agent.referralCode}` 
      : 'Referral link not available';
    
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const shareOnWhatsApp = () => {
    const referralLink = user?.agent?.referralCode 
      ? `https://aa-homes-copy.vercel.app/auth/signup?code=${user.agent.referralCode}` 
      : 'Referral link not available';
    const message = `Join me on AA Homes and let's earn together! ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const referralLink = user?.agent?.referralCode 
      ? `https://aa-homes-copy.vercel.app/auth/signup?code=${user.agent.referralCode}` 
      : 'Referral link not available';
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const referralLink = user?.agent?.referralCode 
      ? `https://aa-homes-copy.vercel.app/auth/signup?code=${user.agent.referralCode}` 
      : 'Referral link not available';
    const message = `Join me on AA Homes and let's earn together! ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaEmail = () => {
    const referralLink = user?.agent?.referralCode 
      ? `https://aa-homes-copy.vercel.app/auth/signup?code=${user.agent.referralCode}` 
      : 'Referral link not available';
    const subject = "Join me on AA Homes";
    const body = `Hi there,

I'm inviting you to join AA Homes, a great platform for real estate agents.

Sign up using my referral link: ${referralLink}

Best regards`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  // Calculate statistics
  const totalEarnings = parseFloat(user?.agent?.total_earnings || "0");
  const verifiedReferrals = referrals.filter(ref => ref.verified).length;
  const propertiesSold = user?.propertiesSold?.length || 0;
  // Add sub-properties sold count
  const subPropertiesSold = user?.subPropertiesSold?.length || 0;
  const totalPropertiesSold = propertiesSold + subPropertiesSold;
  const agentRank = user?.agent?.rank || "Unranked";
  const agentName = user?.agent?.fullName || "Agent";
  const agentImage = user?.agent?.imgUrl || null;
  const referralLink = user?.agent?.referralCode 
    ? `https://aa-homes-copy.vercel.app/auth/signup?code=${user.agent.referralCode}` 
    : 'Referral link not available';

  return (
  <div className="w-full px-4 sm:px-6 md:px-8 md:py-8 md:mt-24 text-black bg-gray-50 min-h-screen">
 
      <div className="w-full mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-4 sm:px-6">
          <div className="max-w-full min-w-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 truncate">Portfolio Dashboard</h1>
            <p className="text-gray-600 mt-2 truncate text-sm sm:text-base">Track your earnings, referrals, and property sales</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <button 
              onClick={() => setShowReferralModal(true)}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap text-sm sm:text-base font-semibold"
            >
              <FaShareAlt /> <span className="hidden xs:inline">Refer Someone</span>
            </button>
          </div>
        </div>
        
   
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl mx-4 sm:mx-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-shrink-0">
              {agentImage ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image 
                    src={agentImage} 
                    alt={agentName} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                  <FaUser className="text-3xl" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-extrabold ">Welcome back, {agentName}!</h2>
              <p className="text-white/90  text-base sm:text-lg mt-1">Here's what's happening with your portfolio today</p>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <p className="text-sm text-white/80">Current Rank</p>
                  <p className="font-bold text-lg">{agentRank}</p>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <p className="text-sm text-white/80">Total Properties</p>
                  <p className="font-bold text-lg">{totalPropertiesSold}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mb-8 px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center hover:shadow-xl transition-all duration-300 min-w-0 border border-gray-100 hover:border-orange-200">
            <div className="rounded-full bg-gradient-to-r from-green-400 to-green-600 p-4 mr-5 flex-shrink-0">
              <FaChartLine className="text-white text-2xl" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-sm font-medium truncate">Total Earnings</p>
              <p className="text-lg font-extrabold text-gray-900 truncate">₦{totalEarnings.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-semibold flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                  +12.5% this month
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center hover:shadow-xl transition-all duration-300 min-w-0 border border-gray-100 hover:border-orange-200">
            <div className="rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-4 mr-5 flex-shrink-0">
              <FaHome className="text-white text-2xl" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-sm font-medium truncate">Properties Sold</p>
              <p className="text-2xl font-extrabold text-gray-900 truncate">{totalPropertiesSold}</p>
              <p className="text-xs text-gray-500 mt-1">
                {propertiesSold} properties, {subPropertiesSold} sub-properties
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center hover:shadow-xl transition-all duration-300 min-w-0 border border-gray-100 hover:border-orange-200">
            <div className="rounded-full bg-gradient-to-r from-purple-400 to-purple-600 p-4 mr-5 flex-shrink-0">
              <FaUsers className="text-white text-2xl" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-sm font-medium truncate">Verified Referrals</p>
              <p className="text-2xl font-extrabold text-gray-900 truncate">{verifiedReferrals}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-600 text-xs font-semibold flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                  +8.2% this month
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center hover:shadow-xl transition-all duration-300 min-w-0 border border-gray-100 hover:border-orange-200">
            <div className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 mr-5 flex-shrink-0">
              <FaTrophy className="text-white text-2xl" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-sm font-medium truncate">Current Rank</p>
              <p className="text-2xl font-extrabold text-gray-900 truncate">{agentRank}</p>
              <p className="text-xs text-gray-500 mt-1">Top 15% of agents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col  gap-6 sm:gap-8 w-full px-4 sm:px-6">
        {/* Main content */}
        <main className="flex-1 flex flex-col gap-6 sm:gap-8  ">
          {/* Earnings and Portfolio cards */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="min-w-0">
              <EarningsCard
                gotoEarnings={gotoEarnings}
                styles="shadow-lg rounded-xl min-w-0 w-full"
                loading={loading}
              />
            </div>
            <div className="min-w-0">
              <PortfolioCard styles="shadow-lg rounded-xl min-w-0 w-full" loading={loading} />
            </div>
          </section>

          {/* Sold Properties as List */}
          <section className="bg-white rounded-xl shadow p-4 sm:p-6 min-w-0 w-full">
            <PropertyHeader
              text="Properties Sold"
              onClick={() => console.log("Properties clicked")}
              data={user?.propertiesSold}
              className="mb-4"
              loading={loading}
            />
            <div className="min-w-full w-full">
              <PropertiesSoldList 
                properties={user?.propertiesSold || []} 
                onPropertyClick={(property) => console.log("Property clicked:", property)}
                loading={loading}
              />
            </div>
          </section>

          {/* Sold Sub-Properties as List - New Section */}
          <section className="bg-white rounded-xl shadow p-4 sm:p-6 min-w-0 w-full">
            <PropertyHeader
              text="Sub-Properties Sold"
              onClick={() => console.log("Sub-properties clicked")}
              data={user?.subPropertiesSold}
              className="mb-4"
              loading={loading}
            />
            <div className="min-w-full w-full">
              <SubPropertiesSoldList 
                properties={user?.subPropertiesSold || []} 
                onPropertyClick={(property) => console.log("Sub-property clicked:", property)}
                loading={loading}
              />
            </div>
          </section>

        </main>

        {/* Referrals Sidebar */}
        <aside className="lg:w-96 flex flex-col gap-6 sm:gap-6 w-full min-w-0">
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Referrals</h2>
              <FaUsers className="text-gray-400" />
            </div>
            
            {referralsLoading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, index) => (
                  <ReferralCard 
                    key={index} 
                    item={{} as Referral} 
                    onClick={() => {}} 
                    loading={true} 
                  />
                ))}
              </div>
            ) : referrals.filter(ref => ref.verified).length > 0 ? (
              <>
                <p className="text-sm text-gray-600 font-semibold mb-4">
                  Total Verified Referrals: {referrals.filter(ref => ref.verified).length}
                </p>
                <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {referrals
                    .filter(ref => ref.verified)
                    .map((referral) => (
                      <ReferralCard
                        key={referral.aid}
                        item={referral}
                        onClick={() => gotoReferral(String(referral.aid))}
                      />
                    ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-500 italic text-center text-sm mb-4">
                  You have not referred anyone yet.
                </p>
                <button 
                  onClick={() => setShowReferralModal(true)}
                  className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Refer Someone Now
                </button>
              </div>
            )}
          </div>
          
          {/* Top Performers Section */}
          {referrals.filter(ref => ref.verified).length > 0 && (
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Top Referrals</h2>
                <FaMedal className="text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {referrals
                  .filter(ref => ref.verified)
                  .sort((a, b) => {
                    // Sort by referral earnings if available
                    const aEarnings = parseFloat(a.referral_earnings || "0");
                    const bEarnings = parseFloat(b.referral_earnings || "0");
                    return bEarnings - aEarnings;
                  })
                  .slice(0, 3)
                  .map((referral, index) => (
                    <div key={referral.aid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-w-0">
                      <div className="flex items-center min-w-0">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-orange-600 font-bold text-sm">#{index + 1}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{referral.fullName || "Unnamed"}</p>
                          <p className="text-xs text-gray-500 truncate">{referral.rank || "Unranked"}</p>
                        </div>
                      </div>
                      {referral.referral_earnings && (
                        <p className="text-sm font-semibold text-green-600 truncate">
                          ₦{parseFloat(referral.referral_earnings).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </aside>

      </div>

      {/* Referral Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6 my-4 sm:my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Refer a Friend</h3>
              <button 
                onClick={() => setShowReferralModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">
              Share your referral link with friends and earn commissions when they join.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Referral Link
              </label>
              {/* Responsive copy link section for mobile */}
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-0 text-sm"
                />
                <button
                  onClick={handleCopyReferralLink}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm"
                >
                  <FaCopy /> {copySuccess ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share via Social Media
              </label>
              <div className="flex justify-center gap-3 flex-wrap">
                <button 
                  onClick={shareOnWhatsApp}
                  className="bg-green-500 text-white p-2 sm:p-3 rounded-full hover:bg-green-600 transition-colors"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp className="text-lg sm:text-xl" />
                </button>
                <button 
                  onClick={shareOnFacebook}
                  className="bg-blue-600 text-white p-2 sm:p-3 rounded-full hover:bg-blue-700 transition-colors"
                  title="Share on Facebook"
                >
                  <FaFacebook className="text-lg sm:text-xl" />
                </button>
                <button 
                  onClick={shareOnTwitter}
                  className="bg-blue-400 text-white p-2 sm:p-3 rounded-full hover:bg-blue-500 transition-colors"
                  title="Share on Twitter"
                >
                  <FaTwitter className="text-lg sm:text-xl" />
                </button>
                <button 
                  onClick={shareViaEmail}
                  className="bg-gray-600 text-white p-2 sm:p-3 rounded-full hover:bg-gray-700 transition-colors"
                  title="Share via Email"
                >
                  <FaEnvelope className="text-lg sm:text-xl" />
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowReferralModal(false)}
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;