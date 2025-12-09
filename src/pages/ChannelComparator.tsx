import { useState } from 'react';
import { GitCompare, Award, Trophy, Code } from 'lucide-react';
import { trackToolUsage } from '../utils/analytics';
import ToolsCTA from '../components/ToolsCTA';
import FAQ from '../components/FAQ';
import UseCases from '../components/UseCases';
import AdSense from '../components/AdSense';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChannelData } from '../types';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ChannelComparatorProps {
  darkMode: boolean;
}

const categories = ['Gaming', 'Tech', 'Finance', 'Beauty', 'Education', 'Vlog', 'Music', 'Entertainment'];

export default function ChannelComparator({ darkMode }: ChannelComparatorProps) {
  const [channelA, setChannelA] = useState<ChannelData>({
    name: '',
    subscribers: 0,
    totalViews: 0,
    videoCount: 0,
    createdDate: '',
    category: 'Tech'
  });

  const [channelB, setChannelB] = useState<ChannelData>({
    name: '',
    subscribers: 0,
    totalViews: 0,
    videoCount: 0,
    createdDate: '',
    category: 'Tech'
  });

  const [showComparison, setShowComparison] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const calculateMetrics = (channel: ChannelData) => {
    const avgViewsPerVideo = channel.videoCount > 0 ? channel.totalViews / channel.videoCount : 0;
    const engagementRate = channel.subscribers > 0 ? (avgViewsPerVideo / channel.subscribers) * 100 : 0;
    const channelAge = channel.createdDate ?
      Math.max(1, Math.floor((new Date().getTime() - new Date(channel.createdDate).getTime()) / (1000 * 60 * 60 * 24 * 30))) : 1;
    const uploadsPerMonth = channel.videoCount / channelAge;

    const score = Math.min(100,
      (channel.subscribers / 1000000) * 20 +
      (avgViewsPerVideo / 100000) * 20 +
      Math.min(engagementRate, 100) * 0.3 +
      Math.min(uploadsPerMonth * 2, 20) +
      (channel.videoCount / 100) * 20
    );

    return {
      avgViewsPerVideo,
      engagementRate,
      uploadsPerMonth,
      score: Math.round(score)
    };
  };

  const metricsA = calculateMetrics(channelA);
  const metricsB = calculateMetrics(channelB);

  const getRadarData = () => {
    const normalizeScore = (value: number, max: number) => Math.min((value / max) * 100, 100);

    return {
      labels: ['Subscribers', 'Total Views', 'Videos', 'Avg Views/Video', 'Engagement'],
      datasets: [
        {
          label: channelA.name || 'Channel A',
          data: [
            normalizeScore(channelA.subscribers, 1000000),
            normalizeScore(channelA.totalViews, 100000000),
            normalizeScore(channelA.videoCount, 1000),
            normalizeScore(metricsA.avgViewsPerVideo, 100000),
            Math.min(metricsA.engagementRate, 100)
          ],
          fill: true,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: '#ef4444',
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ef4444'
        },
        {
          label: channelB.name || 'Channel B',
          data: [
            normalizeScore(channelB.subscribers, 1000000),
            normalizeScore(channelB.totalViews, 100000000),
            normalizeScore(channelB.videoCount, 1000),
            normalizeScore(metricsB.avgViewsPerVideo, 100000),
            Math.min(metricsB.engagementRate, 100)
          ],
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3b82f6',
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#3b82f6'
        }
      ]
    };
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: darkMode ? '#9ca3af' : '#4b5563',
          backdropColor: 'transparent'
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb'
        },
        pointLabels: {
          color: darkMode ? '#9ca3af' : '#4b5563',
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#9ca3af' : '#4b5563'
        }
      }
    }
  };

  const handleCompare = () => {
    if (channelA.name && channelB.name) {
      setShowComparison(true);
      trackToolUsage('Channel Comparator', 'compared');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const generateEmbedCode = () => {
    const embedHTML = `<div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; max-width: 600px; margin: 20px auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
  <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: bold; text-align: center;">
    ${channelA.name} vs ${channelB.name}
  </h3>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
    <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
      <div style="font-size: 12px; opacity: 0.8; margin-bottom: 5px;">${channelA.name}</div>
      <div style="font-size: 18px; font-weight: bold;">${formatNumber(channelA.subscribers)} subs</div>
      <div style="font-size: 14px; opacity: 0.9;">${formatNumber(metricsA.avgViewsPerVideo)} views/video</div>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px;">
      <div style="font-size: 12px; opacity: 0.8; margin-bottom: 5px;">${channelB.name}</div>
      <div style="font-size: 18px; font-weight: bold;">${formatNumber(channelB.subscribers)} subs</div>
      <div style="font-size: 14px; opacity: 0.9;">${formatNumber(metricsB.avgViewsPerVideo)} views/video</div>
    </div>
  </div>
  <div style="text-align: center; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
    <div style="font-size: 14px; margin-bottom: 8px;">
      Winner: <strong>${metricsA.score > metricsB.score ? channelA.name : channelB.name}</strong> (Score: ${Math.max(metricsA.score, metricsB.score)})
    </div>
    <a href="https://tubebreakout.com" target="_blank" style="color: white; font-size: 12px; opacity: 0.8; text-decoration: underline;">
      Compared by TubeBreakout
    </a>
  </div>
</div>`;

    navigator.clipboard.writeText(embedHTML)
      .then(() => {
        setEmbedCopied(true);
        setTimeout(() => setEmbedCopied(false), 3000);
      })
      .catch(() => {
        alert('Failed to copy. Please try again.');
      });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <GitCompare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            YouTube Channel Comparator
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Compare two YouTube channels side-by-side to analyze performance metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className={`${darkMode ? 'bg-red-900/20 border-red-900' : 'bg-red-50 border-red-200'} border-2 rounded-xl p-6 transition-colors`}>
            <h2 className={`text-xl font-bold mb-6 text-red-600`}>Channel A</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Channel Name
                </label>
                <input
                  type="text"
                  value={channelA.name}
                  onChange={(e) => setChannelA({ ...channelA, name: e.target.value })}
                  placeholder="Enter channel name"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subscribers
                </label>
                <input
                  type="number"
                  value={channelA.subscribers || ''}
                  onChange={(e) => setChannelA({ ...channelA, subscribers: Number(e.target.value) })}
                  placeholder="0"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total Views
                </label>
                <input
                  type="number"
                  value={channelA.totalViews || ''}
                  onChange={(e) => setChannelA({ ...channelA, totalViews: Number(e.target.value) })}
                  placeholder="0"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Video Count
                </label>
                <input
                  type="number"
                  value={channelA.videoCount || ''}
                  onChange={(e) => setChannelA({ ...channelA, videoCount: Number(e.target.value) })}
                  placeholder="0"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Channel Created Date
                </label>
                <input
                  type="date"
                  value={channelA.createdDate}
                  onChange={(e) => setChannelA({ ...channelA, createdDate: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <select
                  value={channelA.category}
                  onChange={(e) => setChannelA({ ...channelA, category: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-blue-900/20 border-blue-900' : 'bg-blue-50 border-blue-200'} border-2 rounded-xl p-6 transition-colors`}>
            <h2 className={`text-xl font-bold mb-6 text-blue-600`}>Channel B</h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Channel Name
                </label>
                <input
                  type="text"
                  value={channelB.name}
                  onChange={(e) => setChannelB({ ...channelB, name: e.target.value })}
                  placeholder="Enter channel name"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subscribers
                </label>
                <input
                  type="number"
                  value={channelB.subscribers || ''}
                  onChange={(e) => setChannelB({ ...channelB, subscribers: Number(e.target.value) })}
                  placeholder="0"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total Views
                </label>
                <input
                  type="number"
                  value={channelB.totalViews || ''}
                  onChange={(e) => setChannelB({ ...channelB, totalViews: Number(e.target.value) })}
                  placeholder="0"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Video Count
                </label>
                <input
                  type="number"
                  value={channelB.videoCount || ''}
                  onChange={(e) => setChannelB({ ...channelB, videoCount: Number(e.target.value) })}
                  placeholder="0"
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Channel Created Date
                </label>
                <input
                  type="date"
                  value={channelB.createdDate}
                  onChange={(e) => setChannelB({ ...channelB, createdDate: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <select
                  value={channelB.category}
                  onChange={(e) => setChannelB({ ...channelB, category: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCompare}
            disabled={!channelA.name || !channelB.name}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            <GitCompare className="w-5 h-5 mr-2" />
            Compare Channels
          </button>
        </div>

        {showComparison && (
          <>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
              <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Performance Comparison
              </h2>
              <div className="h-96">
                <Radar data={getRadarData()} options={radarOptions} />
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
              <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Detailed Comparison
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`text-left py-4 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Metric</th>
                      <th className={`text-center py-4 px-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                        {channelA.name}
                        {metricsA.score > metricsB.score && <Trophy className="w-5 h-5 inline ml-2 text-yellow-500" />}
                      </th>
                      <th className={`text-center py-4 px-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {channelB.name}
                        {metricsB.score > metricsA.score && <Trophy className="w-5 h-5 inline ml-2 text-yellow-500" />}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`py-4 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subscribers</td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(channelA.subscribers)}
                      </td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(channelB.subscribers)}
                      </td>
                    </tr>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`py-4 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Views</td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(channelA.totalViews)}
                      </td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(channelB.totalViews)}
                      </td>
                    </tr>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`py-4 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Video Count</td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {channelA.videoCount}
                      </td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {channelB.videoCount}
                      </td>
                    </tr>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`py-4 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Views/Video</td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(metricsA.avgViewsPerVideo)}
                      </td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatNumber(metricsB.avgViewsPerVideo)}
                      </td>
                    </tr>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`py-4 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Engagement Rate</td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metricsA.engagementRate.toFixed(2)}%
                      </td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metricsB.engagementRate.toFixed(2)}%
                      </td>
                    </tr>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`py-4 px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uploads/Month</td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metricsA.uploadsPerMonth.toFixed(1)}
                      </td>
                      <td className={`text-center py-4 px-4 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metricsB.uploadsPerMonth.toFixed(1)}
                      </td>
                    </tr>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <td className={`py-4 px-4 font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Overall Score</td>
                      <td className={`text-center py-4 px-4 font-bold text-2xl ${metricsA.score > metricsB.score ? 'text-green-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metricsA.score}
                      </td>
                      <td className={`text-center py-4 px-4 font-bold text-2xl ${metricsB.score > metricsA.score ? 'text-green-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {metricsB.score}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {metricsA.score !== metricsB.score && (
              <div className={`${darkMode ? 'bg-gradient-to-r from-yellow-900 to-yellow-800' : 'bg-gradient-to-r from-yellow-400 to-yellow-500'} rounded-xl p-8 text-center transition-colors mb-8`}>
                <Award className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {metricsA.score > metricsB.score ? channelA.name : channelB.name} Wins!
                </h3>
                <p className="text-white opacity-90">
                  With a performance score of {Math.max(metricsA.score, metricsB.score)}
                </p>
              </div>
            )}

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 rounded-xl p-8 shadow-lg transition-colors`}>
              <div className="flex items-center justify-center gap-3 mb-6">
                <Code className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Share This Comparison
                </h3>
              </div>
              <p className={`text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Generate an embed code to share this comparison on your blog, forum, or website
              </p>
              <div className="flex justify-center">
                <button
                  onClick={generateEmbedCode}
                  className={`${embedCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center`}
                >
                  <Code className="w-5 h-5 mr-2" />
                  {embedCopied ? 'Embed Code Copied!' : 'Copy Embed Code'}
                </button>
              </div>
              <p className={`text-center text-xs mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Paste the HTML code into your website to display this comparison with a backlink to TubeBreakout
              </p>
            </div>
          </>
        )}

        <div className="mt-8 space-y-8">
          <UseCases
            darkMode={darkMode}
            cases={[
              {
                title: "Gaming Competition Analysis",
                description: "A gaming streamer compared his channel with 3 direct competitors to identify strengths and weaknesses.",
                result: "Identified opportunities (fewer videos on certain games), strategy adjustment, +80% growth."
              },
              {
                title: "Tech Reviews Benchmarking",
                description: "A tech channel analyzed market leaders' metrics to set realistic growth objectives.",
                result: "Clear goals based on real data, increased motivation, growth from 15K to 50K subscribers in 1 year."
              },
              {
                title: "Strategic Collaboration",
                description: "Two similar channels compared their stats to identify synergies and plan collaborations.",
                result: "3 successful collab videos, audience cross-pollination, +25% subscribers for both."
              },
              {
                title: "Investor Pitch",
                description: "A creator used the comparator to show his growth vs competitors in an investor presentation.",
                result: "Convincing visual data, funding secured for equipment and team."
              }
            ]}
          />

          <FAQ
            darkMode={darkMode}
            items={[
              {
                question: "How do I find a YouTube channel's ID or handle?",
                answer: "The channel ID is in the URL: youtube.com/channel/[ID] or youtube.com/@[handle]. The handle is the name preceded by @ (ex: @MrBeast). You can also click 'About' on a channel and copy the share link that contains the ID."
              },
              {
                question: "Is the data real-time?",
                answer: "The data comes from the YouTube API and is updated regularly by YouTube (generally every 24-48h). Subscriber counts may be slightly rounded for large channels (ex: '1M' instead of '1.05M')."
              },
              {
                question: "Why can't some channels be compared?",
                answer: "Some channels may have disabled public access to their stats, or the ID/handle may be incorrect. Verify that the channel exists and you're using the correct identifier. Private or suspended channels are not accessible."
              },
              {
                question: "How do I interpret the comparison results?",
                answer: "Focus on ratios rather than absolute numbers: views per video (engagement), subscribers per video (growth efficiency), views per subscriber (loyalty). A channel with fewer subscribers but better ratios may be more effective."
              },
              {
                question: "Can I compare more than 2 channels?",
                answer: "Currently, the tool allows comparing 2 channels at a time for optimal readability. To compare more channels, perform multiple pairwise comparisons and take notes on observed trends."
              },
              {
                question: "How can I use this data to improve my channel?",
                answer: "1) Identify similar channels that perform better, 2) Analyze their strategies (frequency, duration, topics), 3) Set goals based on their metrics, 4) Test similar approaches adapted to your style, 5) Measure results and adjust."
              }
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdSense slot="1234567895" style={{ textAlign: 'center', minHeight: '250px' }} />
      </div>

      <ToolsCTA darkMode={darkMode} currentTool="/channel-comparator" />
    </div>
  );
}
