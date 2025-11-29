import { useState } from 'react';
import { CheckCircle, XCircle, TrendingUp, Clock, Search, AlertCircle } from 'lucide-react';
import { trackToolUsage } from '../utils/analytics';
import ToolsCTA from '../components/ToolsCTA';
import FAQ from '../components/FAQ';
import UseCases from '../components/UseCases';

interface MonetizationCheckerProps {
  darkMode: boolean;
}

interface MonetizationResult {
  isMonetized: boolean;
  confidence: 'high' | 'medium' | 'low';
  indicators: string[];
  channelInfo?: {
    title?: string;
    subscriberCount?: string;
  };
}

export default function MonetizationChecker({ darkMode }: MonetizationCheckerProps) {
  const [activeTab, setActiveTab] = useState<'requirements' | 'verify'>('requirements');

  const [subscribers, setSubscribers] = useState<number>(0);
  const [watchHours, setWatchHours] = useState<number>(0);
  const [monthlyGrowth, setMonthlyGrowth] = useState<number>(0);
  const [hasAdSense, setHasAdSense] = useState(false);
  const [followsGuidelines, setFollowsGuidelines] = useState(false);
  const [has2FA, setHas2FA] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const [verifyUrl, setVerifyUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<MonetizationResult | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const requirements = {
    subscribers: { required: 1000, met: subscribers >= 1000 },
    watchHours: { required: 4000, met: watchHours >= 4000 },
    adSense: { required: true, met: hasAdSense },
    guidelines: { required: true, met: followsGuidelines },
    twoFA: { required: true, met: has2FA }
  };

  const allRequirementsMet = Object.values(requirements).every(req => req.met);
  const metCount = Object.values(requirements).filter(req => req.met).length;
  const totalCount = Object.values(requirements).length;

  const handleCheck = () => {
    if (!hasChecked) {
      trackToolUsage('Monetization Checker', 'checked');
      setHasChecked(true);
    }
  };

  const handleVerify = async () => {
    if (!verifyUrl.trim()) return;

    setIsVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-monetization`;

      console.log('Calling API:', apiUrl);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: verifyUrl }),
      }).finally(() => clearTimeout(timeoutId));

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: Failed to verify monetization`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setVerifyResult(data);
      trackToolUsage('Monetization Verifier', 'verified');
    } catch (error) {
      console.error('Verification error:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        setVerifyError('Request timed out. Please try again.');
      } else {
        setVerifyError(error instanceof Error ? error.message : 'Failed to fetch. Please check your internet connection and try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const calculateEstimatedTime = (currentSubs: number, growth: number) => {
    const requiredSubs = 1000;

    if (growth <= 0) {
      return { display: 'N/A', note: 'Positive monthly growth required' };
    }

    const subsNeeded = requiredSubs - currentSubs;

    if (subsNeeded <= 0) {
      return { display: 'Goal reached!', note: 'You have 1,000+ subscribers' };
    }

    const monthsToReachGoal = Math.ceil(subsNeeded / growth);

    if (monthsToReachGoal > 24) {
      const years = Math.floor(monthsToReachGoal / 12);
      const months = monthsToReachGoal % 12;
      return {
        display: `Est: ${years} ${years === 1 ? 'year' : 'years'}${months > 0 ? ` and ${months} ${months === 1 ? 'month' : 'months'}` : ''}`,
        note: 'Based on your monthly growth rate'
      };
    }

    return {
      display: `Est: ${monthsToReachGoal} ${monthsToReachGoal === 1 ? 'month' : 'months'}`,
      note: 'Based on your monthly growth rate'
    };
  };

  const estimationResult = calculateEstimatedTime(subscribers, monthlyGrowth);

  const tips = [
    {
      title: 'Create Consistent Content',
      description: 'Upload videos on a regular schedule to build audience expectations and loyalty'
    },
    {
      title: 'Optimize Your Titles & Thumbnails',
      description: 'Eye-catching thumbnails and clear titles can significantly increase click-through rates'
    },
    {
      title: 'Engage With Your Audience',
      description: 'Respond to comments and create community posts to build stronger connections'
    },
    {
      title: 'Collaborate With Other Creators',
      description: 'Cross-promotion with similar-sized channels can help you reach new audiences'
    },
    {
      title: 'Use YouTube Analytics',
      description: 'Study your analytics to understand what content works best with your audience'
    },
    {
      title: 'Promote On Other Platforms',
      description: 'Share your videos on social media, forums, and communities related to your niche'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500 p-3 rounded-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            YouTube Monetization Checker
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Check requirements and verify actual monetization status
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className={`inline-flex rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-1 shadow-lg`}>
            <button
              onClick={() => setActiveTab('requirements')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'requirements'
                  ? 'bg-red-600 text-white'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Check Requirements
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'verify'
                  ? 'bg-red-600 text-white'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Verify by URL
            </button>
          </div>
        </div>

        {activeTab === 'requirements' && (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Channel Stats
              </h2>

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Current Subscribers: {subscribers.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="10"
                    value={subscribers}
                    onChange={(e) => {
                      setSubscribers(Number(e.target.value));
                      handleCheck();
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>5,000</span>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Monthly Subscriber Growth: {monthlyGrowth.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="5"
                    value={monthlyGrowth}
                    onChange={(e) => {
                      setMonthlyGrowth(Number(e.target.value));
                      handleCheck();
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>500</span>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Watch Hours (Last 12 months): {watchHours.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={watchHours}
                    onChange={(e) => setWatchHours(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>10,000</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      AdSense Account Linked
                    </label>
                    <button
                      onClick={() => setHasAdSense(!hasAdSense)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hasAdSense ? 'bg-red-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasAdSense ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Follow Community Guidelines
                    </label>
                    <button
                      onClick={() => setFollowsGuidelines(!followsGuidelines)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${followsGuidelines ? 'bg-red-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${followsGuidelines ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      2-Step Verification Enabled
                    </label>
                    <button
                      onClick={() => setHas2FA(!has2FA)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${has2FA ? 'bg-red-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${has2FA ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Requirements
                </h2>
                <div className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metCount} / {totalCount} Met
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className={`flex items-start p-4 rounded-lg ${requirements.subscribers.met ? (darkMode ? 'bg-green-900/30' : 'bg-green-50') : (darkMode ? 'bg-gray-700' : 'bg-gray-50')}`}>
                  {requirements.subscribers.met ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      1,000+ Subscribers
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {subscribers < 1000 ? `${1000 - subscribers} more needed` : 'Requirement met!'}
                    </p>
                    {subscribers < 1000 && (
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((subscribers / 1000) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className={`flex items-start p-4 rounded-lg ${requirements.watchHours.met ? (darkMode ? 'bg-green-900/30' : 'bg-green-50') : (darkMode ? 'bg-gray-700' : 'bg-gray-50')}`}>
                  {requirements.watchHours.met ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      4,000 Watch Hours
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {watchHours < 4000 ? `${4000 - watchHours} more hours needed` : 'Requirement met!'}
                    </p>
                    {watchHours < 4000 && (
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((watchHours / 4000) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className={`flex items-start p-4 rounded-lg ${requirements.adSense.met ? (darkMode ? 'bg-green-900/30' : 'bg-green-50') : (darkMode ? 'bg-gray-700' : 'bg-gray-50')}`}>
                  {requirements.adSense.met ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      AdSense Account Linked
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Required for payment processing
                    </p>
                  </div>
                </div>

                <div className={`flex items-start p-4 rounded-lg ${requirements.guidelines.met ? (darkMode ? 'bg-green-900/30' : 'bg-green-50') : (darkMode ? 'bg-gray-700' : 'bg-gray-50')}`}>
                  {requirements.guidelines.met ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Community Guidelines
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No active strikes or violations
                    </p>
                  </div>
                </div>

                <div className={`flex items-start p-4 rounded-lg ${requirements.twoFA.met ? (darkMode ? 'bg-green-900/30' : 'bg-green-50') : (darkMode ? 'bg-gray-700' : 'bg-gray-50')}`}>
                  {requirements.twoFA.met ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      2-Step Verification
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Enhanced account security
                    </p>
                  </div>
                </div>
              </div>

              {allRequirementsMet ? (
                <div className={`${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-green-200' : 'text-green-900'}`}>
                        Eligible for Monetization!
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        You can apply for the YouTube Partner Program
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                  <div className="flex items-center">
                    <Clock className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-3 flex-shrink-0`} />
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                        {estimationResult.display}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        {estimationResult.note}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-red-600 mr-3" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Tips to Accelerate Growth
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tip.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        </>
        )}

        {activeTab === 'verify' && (
        <div className="max-w-3xl mx-auto">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Verify Monetization Status
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Enter a YouTube video or channel URL to check if it's actually monetized (has ads running)
            </p>

            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={verifyUrl}
                onChange={(e) => setVerifyUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="https://youtube.com/watch?v=... or channel URL"
                className={`flex-1 px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              <button
                onClick={handleVerify}
                disabled={isVerifying || !verifyUrl.trim()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Verify
                  </>
                )}
              </button>
            </div>

            {verifyError && (
              <div className={`${darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex items-start gap-3`}>
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-red-200' : 'text-red-900'}`}>Error</p>
                  <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{verifyError}</p>
                </div>
              </div>
            )}

            {verifyResult && (
              <div className="space-y-4">
                <div className={`${verifyResult.isMonetized ? (darkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200') : (darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200')} border rounded-lg p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    {verifyResult.isMonetized ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-gray-500" />
                    )}
                    <div>
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {verifyResult.isMonetized ? 'Monetization Detected' : 'No Monetization Detected'}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Confidence: <span className="font-medium capitalize">{verifyResult.confidence}</span>
                      </p>
                    </div>
                  </div>

                  {verifyResult.channelInfo?.title && (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 mb-4`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Channel/Video</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{verifyResult.channelInfo.title}</p>
                      {verifyResult.channelInfo.subscriberCount && (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{verifyResult.channelInfo.subscriberCount}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Detected Indicators:</p>
                    <ul className="space-y-2">
                      {verifyResult.indicators.map((indicator: string, index: number) => (
                        <li key={index} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-start gap-2`}>
                          <span className="text-red-500 mt-1">•</span>
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    <strong>Note:</strong> This tool analyzes publicly available page data. Results may not be 100% accurate for all videos/channels. Monetization status can change based on various factors including advertiser-friendliness, content claims, and YouTube policies.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h3>
            <div className="space-y-3 text-sm">
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                This tool analyzes the public HTML of YouTube pages to detect monetization indicators such as:
              </p>
              <ul className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Direct monetization flags in page metadata</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Presence of ad slot configurations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Player ad parameters and settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Paid content overlay markers</span>
                </li>
              </ul>
              <p className={`pt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                The tool provides a confidence rating based on the strength and number of indicators found.
              </p>
            </div>
          </div>
        </div>
        )}

        <div className="mt-8 space-y-8">
          <UseCases
            darkMode={darkMode}
            cases={[
              {
                title: "New Gaming Channel",
                description: "A streamer used the tool to track his progress towards 1000 subscribers and 4000 hours. He adjusted his strategy every week.",
                result: "Goals reached in 8 months instead of the projected 12 thanks to rigorous tracking and adjustments."
              },
              {
                title: "Lifestyle Vlogger",
                description: "A vlogger had 1200 subscribers but only 2000 hours of watch time. The tool showed her she needed to focus on duration.",
                result: "Switched to longer videos (8-15min), reached 4000h in 3 months, monetization enabled."
              },
              {
                title: "Educational Channel",
                description: "An educator had 850 subscribers but 6000 hours of watch time. He concentrated his efforts on subscriber growth.",
                result: "Collaboration with other channels, reached 1000 subscribers in 6 weeks."
              },
              {
                title: "Tech Review Channel",
                description: "A tech reviewer monitored his progress daily to stay motivated and adjust content.",
                result: "Motivation maintained, goals reached in 10 months, first revenues of $400/month."
              }
            ]}
          />

          <FAQ
            darkMode={darkMode}
            items={[
              {
                question: "What are the exact requirements for YouTube monetization?",
                answer: "To enable monetization (YouTube Partner Program), you must: 1) Have at least 1000 subscribers, 2) Accumulate 4000 hours of PUBLIC watch time in the last 12 months, 3) Comply with all YouTube monetization policies, 4) Have a linked AdSense account, 5) Enable 2-step verification."
              },
              {
                question: "Do watch hours from Shorts count?",
                answer: "No, YouTube Shorts watch hours do NOT count toward the 4000 hours requirement. Only long-form videos (> 60 seconds) count. However, Shorts can help you gain subscribers who will then watch your long-form videos."
              },
              {
                question: "How long does it take to reach monetization?",
                answer: "The duration varies greatly: 6-18 months on average. Key factors: niche (gaming/tech faster), content quality, publishing frequency (ideal: 2-3 videos/week), video duration (8-15min optimal), and SEO strategy. Some reach it in 4-6 months with an aggressive strategy."
              },
              {
                question: "What happens if I lose my requirements after monetization?",
                answer: "If you fall below 1000 subscribers or 4000h watch time, YouTube gives you a grace period but may disable monetization if you stay below for several months. Always maintain steady growth to secure your revenue."
              },
              {
                question: "Can I buy subscribers/views to reach requirements faster?",
                answer: "NO! Buying subscribers or views is against YouTube's rules and will result in: 1) Monetization denial, 2) Removal of fake subscribers/views, 3) Algorithmic penalties, 4) Risk of channel suspension. YouTube easily detects fake engagement. Prioritize organic growth."
              },
              {
                question: "How do I maximize my watch hours?",
                answer: "Effective strategies: 1) Create 8-15 minute videos (sweet spot), 2) Improve audience retention (strong hooks, dynamic pacing), 3) Create playlists for autoplay, 4) Add end screens to other videos, 5) Publish regularly to maintain engagement."
              }
            ]}
          />
        </div>
      </div>

      <ToolsCTA darkMode={darkMode} currentTool="/monetization-checker" />
    </div>
  );
}
