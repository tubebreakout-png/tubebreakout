import React, { useState } from 'react';
import { ArrowLeft, Search, CheckCircle2, XCircle, PlayCircle, Users, Eye, DollarSign, Shield, Globe, Baby, List, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { extractVideoId } from '../utils/youtubeHelpers';
import AdSense from '../components/AdSense';

interface ChannelData {
  channelId: string;
  channelName: string;
  channelHandle: string;
  description: string;
  thumbnailUrl: string;
  bannerUrl: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  country: string;
  customUrl: string;
  publishedAt: string;
  isMonetized: boolean;
  tags: string[];
  category: string;
  adsEnabled: boolean;
  verificationStatus: string;
  regionalRestrictions: boolean;
  ageRestricted: boolean;
  madeForKids: boolean;
}

interface ChannelDataViewerProps {
  darkMode: boolean;
}

export default function ChannelDataViewer({ darkMode }: ChannelDataViewerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const fetchChannelData = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube channel URL');
      return;
    }

    setLoading(true);
    setError('');
    setChannelData(null);

    try {
      const videoId = extractVideoId(url);
      let channelIdentifier = url;

      if (videoId) {
        channelIdentifier = videoId;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-channel-data`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: channelIdentifier })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch channel data');
      }

      const data = await response.json();
      setChannelData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchChannelData();
    }
  };

  const toggleTag = (tag: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tag)) {
      newSelected.delete(tag);
    } else {
      newSelected.add(tag);
    }
    setSelectedTags(newSelected);
  };

  const selectAllTags = () => {
    if (channelData?.tags) {
      setSelectedTags(new Set(channelData.tags));
    }
  };

  const copySelectedTags = () => {
    const tags = Array.from(selectedTags).join(', ');
    navigator.clipboard.writeText(tags);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className={`inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} mb-8 transition-colors`}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Link>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 mb-8`}>
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              YouTube Channel <span className="text-red-600">Data</span> Viewer
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              All YouTube channel data in one place. View channel statistics, monetization status, tags, banner and profile images,
              verification status, regional restrictions, category, and comprehensive information about any YouTube channel.
            </p>
          </div>

          <div className="flex gap-4 max-w-3xl mx-auto">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://youtube.com/channel/UCVPTUrhmvqbb0rFCYcY7PpQ"
              className={`flex-1 px-6 py-4 border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900'} rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
            />
            <button
              onClick={fetchChannelData}
              disabled={loading}
              className={`px-8 py-4 ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-gray-800'} text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              <Search className="w-5 h-5" />
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}

          {channelData && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">Success!</span>
              </div>
            </div>
          )}
        </div>

        {channelData && (
          <>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden mb-8`}>
              {channelData.bannerUrl && (
                <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 relative">
                  <img
                    src={channelData.bannerUrl}
                    alt="Channel Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="bg-red-500 px-8 py-6">
                <div className="flex items-center gap-4">
                  <img
                    src={channelData.thumbnailUrl}
                    alt={channelData.channelName}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-1">{channelData.channelName}</h2>
                    <p className="text-red-100 text-sm">
                      {channelData.isMonetized ? 'Channel Monetized' : 'Channel Not Monetized'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <DollarSign className="w-6 h-6" />
                    <span className="font-medium">
                      The channel "{channelData.channelName}" is {channelData.isMonetized ? 'Monetized' : 'not Monetized'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 mb-8`}>
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-center mb-2`}>
                Channel Information
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center mb-8`}>Basic channel parameters</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ad Status</p>
                      <p className="font-semibold text-gray-900">
                        {channelData.adsEnabled ? 'Ads Enabled' : 'Ads Not Enabled'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Verification Status</p>
                      <p className="font-semibold text-gray-900">{channelData.verificationStatus}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Regional Restrictions</p>
                      <p className="font-semibold text-gray-900">
                        {channelData.regionalRestrictions ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Age Restriction</p>
                      <p className="font-semibold text-gray-900">
                        {channelData.ageRestricted ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <List className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-semibold text-gray-900">{channelData.category}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <Baby className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kids Content</p>
                      <p className="font-semibold text-gray-900">
                        {channelData.madeForKids ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <PlayCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Video Count</p>
                      <p className="font-semibold text-gray-900">{channelData.videoCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Subscribers</p>
                      <p className="font-semibold text-gray-900">{channelData.subscriberCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="font-semibold text-gray-900">{channelData.viewCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {channelData.tags && channelData.tags.length > 0 && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-center mb-2`}>
                  Channel Tags
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center mb-8`}>Tags used by this channel</p>

                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6 mb-6`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                    <span className="font-semibold">Title:</span>{' '}
                    <span className="text-red-600">{channelData.channelName}</span>
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {channelData.tags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                          selectedTags.has(tag)
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={selectAllTags}
                      className={`px-6 py-2 border-2 ${darkMode ? 'border-gray-500 text-gray-200 hover:border-gray-400' : 'border-gray-300 text-gray-700 hover:border-gray-400'} rounded-lg transition-colors flex items-center gap-2`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Select All
                    </button>
                    <button
                      onClick={copySelectedTags}
                      disabled={selectedTags.size === 0}
                      className={`px-6 py-2 ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'} text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                    >
                      <Tag className="w-4 h-4" />
                      Copy Selected Tags
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdSense slot="1234567894" style={{ textAlign: 'center', minHeight: '250px' }} />
        </div>
      </main>
    </div>
  );
}
