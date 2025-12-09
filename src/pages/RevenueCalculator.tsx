import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Search } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { trackToolUsage } from '../utils/analytics';
import AdSense from '../components/AdSense';
import ToolsCTA from '../components/ToolsCTA';
import FAQ from '../components/FAQ';
import UseCases from '../components/UseCases';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { cpmData, sponsorshipRates } from '../utils/cpmData';
import { calculateRevenue } from '../utils/youtubeHelpers';
import type { Country, Niche } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueCalculatorProps {
  darkMode: boolean;
}

type TabType = 'manual' | 'channel';

export default function RevenueCalculator({ darkMode }: RevenueCalculatorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  const [views, setViews] = useState<number>(10000);
  const [country, setCountry] = useState<Country>('USA');
  const [niche, setNiche] = useState<Niche>('science-tech');
  const [isShorts, setIsShorts] = useState(false);
  const [includeSponsorship, setIncludeSponsorship] = useState(false);
  const [results, setResults] = useState<any>(null);

  const [channelUrl, setChannelUrl] = useState('');
  const [isLoadingChannel, setIsLoadingChannel] = useState(false);
  const [channelError, setChannelError] = useState('');
  const [channelData, setChannelData] = useState<any>(null);
  const [channelViews, setChannelViews] = useState<number>(0);
  const [avgViewPercentage, setAvgViewPercentage] = useState<number>(68);
  const [avgEngagementRate, setAvgEngagementRate] = useState<number>(45);
  const [customCPM, setCustomCPM] = useState<number>(3.4);

  useEffect(() => {
    if (activeTab === 'manual') {
      calculateResults();
    }
  }, [views, country, niche, isShorts, includeSponsorship, activeTab]);

  useEffect(() => {
    if (activeTab === 'channel' && channelViews > 0) {
      calculateChannelResults();
    }
  }, [channelViews, avgViewPercentage, avgEngagementRate, customCPM, niche, includeSponsorship, activeTab]);

  const calculateResults = () => {
    let baseCPM = cpmData[country][niche];

    if (isShorts) {
      baseCPM *= 0.3;
    }

    const sponsorship = sponsorshipRates[niche];
    const revenue = calculateRevenue(
      views,
      baseCPM,
      includeSponsorship,
      sponsorship.min,
      sponsorship.max
    );

    setResults(revenue);
    trackToolUsage('Revenue Calculator', 'calculated');
  };

  const calculateChannelResults = () => {
    const adjustedViews = Math.floor(channelViews * (avgViewPercentage / 100) * (avgEngagementRate / 100));
    const sponsorship = sponsorshipRates[niche];
    const revenue = calculateRevenue(
      adjustedViews,
      customCPM,
      includeSponsorship,
      sponsorship.min,
      sponsorship.max
    );

    setResults(revenue);
  };

  const fetchChannelStats = async () => {
    if (!channelUrl) {
      setChannelError('Please enter a YouTube channel URL');
      return;
    }

    setIsLoadingChannel(true);
    setChannelError('');
    setChannelData(null);
    setResults(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-channel-stats`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: channelUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch channel statistics');
      }

      setChannelData(data);
      setChannelViews(data.dailyViews);
      trackToolUsage('Revenue Calculator', 'channel-fetched');
    } catch (err) {
      console.error('Error:', err);
      setChannelError('Failed to fetch channel statistics. Make sure the URL is valid and the channel is public.');
    } finally {
      setIsLoadingChannel(false);
    }
  };

  const getProjectionData = () => {
    if (!results) return null;

    const monthlyRevenue = results.monthly;
    const labels = [];
    const data = [];

    for (let i = 1; i <= 12; i++) {
      labels.push(`Month ${i}`);
      data.push(monthlyRevenue * i);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Cumulative Revenue',
          data,
          fill: true,
          borderColor: '#ef4444',
          backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `$${context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: darkMode ? '#9ca3af' : '#4b5563',
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb'
        }
      },
      x: {
        ticks: {
          color: darkMode ? '#9ca3af' : '#4b5563'
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb'
        }
      }
    }
  };

  const yearlyViewsFromDaily = channelViews * 365;
  const monthlyViewsFromDaily = channelViews * 30;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            YouTube Revenue Calculator
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Estimate your YouTube earnings based on views, location, and content type
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-2 shadow-lg transition-colors mb-8`}>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'manual'
                  ? 'bg-red-600 text-white'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Manual Input
            </button>
            <button
              onClick={() => setActiveTab('channel')}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'channel'
                  ? 'bg-red-600 text-white'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              From Channel URL
            </button>
          </div>
        </div>

        {activeTab === 'manual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Daily Views: {views.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="1000000"
                      step="100"
                      value={views}
                      onChange={(e) => setViews(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>100</span>
                      <span>1M</span>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value as Country)}
                      className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                    >
                      <option value="USA">United States</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Norway">Norway</option>
                      <option value="Australia">Australia</option>
                      <option value="Sweden">Sweden</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Spain">Spain</option>
                      <option value="Italy">Italy</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Brazil">Brazil</option>
                      <option value="India">India</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Niche
                    </label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value as Niche)}
                      className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                    >
                      <option value="science-tech">Science & Technology (CPM: $20.8 | RPM: $11.44)</option>
                      <option value="travel">Travel & Events (CPM: $18.7 | RPM: $10.285)</option>
                      <option value="autos">Autos & Vehicles (CPM: $18 | RPM: $9.9)</option>
                      <option value="education">Education (CPM: $14.2 | RPM: $7.81)</option>
                      <option value="howto">Howto & Style (CPM: $13.3 | RPM: $7.315)</option>
                      <option value="entertainment">Entertainment (CPM: $12.5 | RPM: $6.875)</option>
                      <option value="people-blogs">People & Blogs (CPM: $10 | RPM: $5.5)</option>
                      <option value="gaming">Gaming (CPM: $9.2 | RPM: $5.06)</option>
                      <option value="news">News & Politics (CPM: $8.3 | RPM: $4.565)</option>
                      <option value="comedy">Comedy (CPM: $6.7 | RPM: $3.685)</option>
                      <option value="film">Film & Animation (CPM: $6.3 | RPM: $3.465)</option>
                      <option value="sports">Sports (CPM: $5.8 | RPM: $3.19)</option>
                      <option value="pets">Pets & Animals (CPM: $4.2 | RPM: $2.31)</option>
                      <option value="nonprofits">Nonprofits & Activism (CPM: $3.3 | RPM: $1.815)</option>
                      <option value="music">Music (CPM: $3 | RPM: $1.65)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      YouTube Shorts
                    </label>
                    <button
                      onClick={() => setIsShorts(!isShorts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isShorts ? 'bg-red-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isShorts ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Include Sponsorships
                    </label>
                    <button
                      onClick={() => setIncludeSponsorship(!includeSponsorship)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${includeSponsorship ? 'bg-red-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includeSponsorship ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-lg transition-colors mt-6`}>
                <AdSense slot="1234567891" format="auto" style={{ minHeight: '250px' }} />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {results && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Daily</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${results.daily.toFixed(2)}
                      </p>
                    </div>
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Weekly</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${results.weekly.toFixed(2)}
                      </p>
                    </div>
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Monthly</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${results.monthly.toFixed(2)}
                      </p>
                    </div>
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Yearly</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${results.yearly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {includeSponsorship && (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Estimated Sponsorship Revenue
                        </h3>
                      </div>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        Based on your daily views, you could earn from sponsorships:
                      </p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${results.sponsorshipMin.toFixed(2)} - ${results.sponsorshipMax.toFixed(2)}
                        <span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}> per day</span>
                      </p>
                    </div>
                  )}

                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      12-Month Revenue Projection
                    </h3>
                    <div className="h-64">
                      {getProjectionData() && (
                        <Line data={getProjectionData()!} options={chartOptions} />
                      )}
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-6 transition-colors`}>
                    <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                      <strong>Disclaimer:</strong> These are estimates based on industry average CPM rates. Actual earnings may vary based on factors like audience engagement, ad types, seasonality, and YouTube's algorithm. CPM rates can flucturate significantly.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    YouTube Channel URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={channelUrl}
                      onChange={(e) => setChannelUrl(e.target.value)}
                      placeholder="https://youtube.com/channel/... or https://youtube.com/@..."
                      className={`flex-1 px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                      onKeyPress={(e) => e.key === 'Enter' && fetchChannelStats()}
                    />
                    <button
                      onClick={fetchChannelStats}
                      disabled={isLoadingChannel}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingChannel ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Analyze
                        </>
                      )}
                    </button>
                  </div>
                  {channelError && (
                    <p className="text-red-600 text-sm mt-2">{channelError}</p>
                  )}
                </div>
              </div>
            </div>

            {channelData && (
              <>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors mb-6`}>
                  <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {channelData.channelName}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Subscribers</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{channelData.subscriberCount}</p>
                    </div>
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Views</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{channelData.totalViews.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Videos</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{channelData.videoCount}</p>
                    </div>
                    <div>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Joined</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{channelData.joinedDate}</p>
                    </div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-red-600' : 'bg-red-600'} rounded-xl p-6 shadow-lg transition-colors mb-6`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-white text-sm mb-2">Revenue Calculator</p>
                      <p className="text-white text-3xl font-bold">{channelData.channelName}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <div className="text-right">
                        <p className="text-white text-sm mb-1">Estimated Earnings</p>
                        <p className="text-white text-2xl font-bold">
                          {results ? `$${results.yearly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Views/Day: {channelViews.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={channelViews}
                      onChange={(e) => setChannelViews(Number(e.target.value))}
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1,000</span>
                      <span>1,000,000</span>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Average Percentage View (%): {avgViewPercentage}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={avgViewPercentage}
                      onChange={(e) => setAvgViewPercentage(Number(e.target.value))}
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Average Engagement Rate (%): {avgEngagementRate}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="100"
                      step="0.1"
                      value={avgEngagementRate}
                      onChange={(e) => setAvgEngagementRate(Number(e.target.value))}
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.1</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      CPM by Category
                    </label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value as Niche)}
                      className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                    >
                      <option value="music">Music (CPM: $3 | RPM: $1.65)</option>
                      <option value="nonprofits">Nonprofits & Activism (CPM: $3.3 | RPM: $1.815)</option>
                      <option value="pets">Pets & Animals (CPM: $4.2 | RPM: $2.31)</option>
                      <option value="sports">Sports (CPM: $5.8 | RPM: $3.19)</option>
                      <option value="film">Film & Animation (CPM: $6.3 | RPM: $3.465)</option>
                      <option value="comedy">Comedy (CPM: $6.7 | RPM: $3.685)</option>
                      <option value="news">News & Politics (CPM: $8.3 | RPM: $4.565)</option>
                      <option value="gaming">Gaming (CPM: $9.2 | RPM: $5.06)</option>
                      <option value="people-blogs">People & Blogs (CPM: $10 | RPM: $5.5)</option>
                      <option value="entertainment">Entertainment (CPM: $12.5 | RPM: $6.875)</option>
                      <option value="howto">Howto & Style (CPM: $13.3 | RPM: $7.315)</option>
                      <option value="education">Education (CPM: $14.2 | RPM: $7.81)</option>
                      <option value="autos">Autos & Vehicles (CPM: $18 | RPM: $9.9)</option>
                      <option value="travel">Travel & Events (CPM: $18.7 | RPM: $10.285)</option>
                      <option value="science-tech">Science & Technology (CPM: $20.8 | RPM: $11.44)</option>
                    </select>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors`}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Custom CPM ($): {customCPM}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.1"
                      value={customCPM}
                      onChange={(e) => setCustomCPM(Number(e.target.value))}
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>5</span>
                      <span>10</span>
                      <span>15</span>
                      <span>20</span>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors flex items-center justify-between`}>
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Include Sponsorships
                    </label>
                    <button
                      onClick={() => setIncludeSponsorship(!includeSponsorship)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${includeSponsorship ? 'bg-red-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includeSponsorship ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                {results && (
                  <>
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors mb-6`}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Daily:</p>
                          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${results.daily.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Monthly:</p>
                          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${results.monthly.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Yearly:</p>
                          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ${results.yearly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Views per year:</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                            {yearlyViewsFromDaily.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Views per month:</p>
                          <p className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                            {monthlyViewsFromDaily.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {includeSponsorship && (
                      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors mb-6`}>
                        <div className="flex items-center mb-4">
                          <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Estimated Sponsorship Revenue
                          </h3>
                        </div>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          Based on your daily views, you could earn from sponsorships:
                        </p>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${results.sponsorshipMin.toFixed(2)} - ${results.sponsorshipMax.toFixed(2)}
                          <span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}> per day</span>
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <UseCases
            darkMode={darkMode}
            cases={[
              {
                title: "Growing Gaming Channel",
                description: "A gaming creator with 50K views/month used the calculator to estimate potential revenue and adjust content strategy.",
                result: "Identified a more profitable niche (2x higher CPM), 150% revenue increase in 4 months."
              },
              {
                title: "Tech/Review Channel",
                description: "A tech channel compared revenue across different countries to optimize content strategy and geographic targeting.",
                result: "Focus on US/UK content, average CPM increased from $3 to $8."
              },
              {
                title: "Beginner Vlogger",
                description: "A new creator used the tool to set realistic revenue goals and plan monetization strategy.",
                result: "Clear goal of 100K views/month achieved, first revenues of $300/month after 6 months."
              },
              {
                title: "Educational Channel",
                description: "An educator compared YouTube revenue vs sponsorship to optimize revenue strategy.",
                result: "Optimal AdSense + sponsorship mix, revenue multiplied by 3."
              }
            ]}
          />

          <FAQ
            darkMode={darkMode}
            items={[
              {
                question: "How are CPMs calculated?",
                answer: "CPMs (Cost Per Thousand views) are based on YouTube industry averages collected from thousands of creators. They vary by country (developed countries have higher CPMs) and niche (tech/finance have higher CPMs than entertainment)."
              },
              {
                question: "Why do my actual earnings differ from estimates?",
                answer: "YouTube revenue depends on many factors: engagement rate, ad types, season, audience (age, interests), watch time, and YouTube's algorithm. Our calculator provides an average estimate, but your actual earnings can be 30-50% higher or lower."
              },
              {
                question: "What is RPM and how does it differ from CPM?",
                answer: "CPM is the cost paid by advertisers for 1000 ad views. RPM (Revenue Per Mille) is what YOU receive after YouTube's cut (45%). For example, a $10 CPM gives you an RPM of about $5.50."
              },
              {
                question: "Do YouTube Shorts generate less revenue?",
                answer: "Yes, Shorts generally have a much lower RPM (10-20x less) than long-form videos because they have fewer ads and different engagement rates. Our calculator accounts for this with the dedicated option."
              },
              {
                question: "When should I consider sponsorships?",
                answer: "Sponsorships become interesting from 10-20K subscribers. In premium niches (tech, finance, business), a sponsor can pay $50-200 per 1000 views, which is 10-20x more than AdSense. Use our calculator to compare."
              },
              {
                question: "How do I increase my CPM?",
                answer: "To increase your CPM: 1) Target audiences in developed countries (US, UK, Canada), 2) Create content in profitable niches (tech, finance, business), 3) Increase watch time, 4) Optimize your keywords to attract premium advertisers."
              }
            ]}
          />
        </div>
      </div>

      <ToolsCTA darkMode={darkMode} currentTool="/revenue-calculator" />
    </div>
  );
}
