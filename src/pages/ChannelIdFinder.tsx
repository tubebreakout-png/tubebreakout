import { useState } from 'react';
import { Search, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import AdSense from '../components/AdSense';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ChannelIdFinderProps {
  darkMode: boolean;
}

interface ChannelInfo {
  channelId: string;
  channelName: string;
  channelHandle?: string;
  channelUrl: string;
}

export default function ChannelIdFinder({ darkMode }: ChannelIdFinderProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChannelInfo | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFind = async () => {
    if (!input.trim()) {
      setError('Please enter a YouTube URL or channel ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/find-channel-id`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: input.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to find channel ID');
      }

      setResult(data);
      localStorage.setItem('toolUsedOnce', 'true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFind();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-black text-white p-4 rounded-full">
              <Search className="w-8 h-8" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            YouTube <span className="text-red-600">Channel ID</span> Finder
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Find any YouTube channel's unique ID instantly
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-8 mb-8`}>
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Paste YouTube URL or Channel ID
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g. youtube.com/@channelname or UCxxxxxx"
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              />
              <button
                onClick={handleFind}
                disabled={loading}
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 space-y-4`}>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Channel found: {result.channelName}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Channel ID
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className={`flex-1 px-3 py-2 rounded ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'} font-mono text-sm`}>
                          {result.channelId}
                        </code>
                        <button
                          onClick={() => handleCopy(result.channelId)}
                          className={`px-4 py-2 rounded ${
                            copied
                              ? 'bg-green-500 text-white'
                              : darkMode
                              ? 'bg-gray-600 text-white hover:bg-gray-500'
                              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                          } transition-colors flex items-center gap-2`}
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {result.channelHandle && (
                      <div>
                        <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Handle
                        </label>
                        <div className={`mt-1 px-3 py-2 rounded ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'} font-mono text-sm`}>
                          @{result.channelHandle}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Channel URL
                      </label>
                      <div className={`mt-1 px-3 py-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <a
                          href={result.channelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700 text-sm break-all"
                        >
                          {result.channelUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-8`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            How It Works
          </h2>
          <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>
              This tool extracts the YouTube channel ID from any YouTube channel URL.
              It works with all URL formats:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Custom handle URL: youtube.com/@channelname</li>
              <li>Channel ID URL: youtube.com/channel/UCxxxxx</li>
              <li>Custom name URL: youtube.com/c/channelname</li>
              <li>Legacy username URL: youtube.com/user/username</li>
              <li>Direct channel ID: UCxxxxx</li>
            </ul>
            <p className="pt-4">
              The tool analyzes the YouTube page to extract the unique channel ID, even if you
              only know the custom handle (@username).
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdSense slot="1234567896" style={{ textAlign: 'center', minHeight: '250px' }} />
        </div>
      </div>
    </div>
  );
}
