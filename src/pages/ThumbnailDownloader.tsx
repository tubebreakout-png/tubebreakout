import { useState, useEffect } from 'react';
import { Download, Image as ImageIcon, AlertCircle, History, Share2 } from 'lucide-react';
import { extractVideoId, getThumbnailUrls } from '../utils/youtubeHelpers';
import { trackToolUsage } from '../utils/analytics';
import ToolsCTA from '../components/ToolsCTA';
import FAQ from '../components/FAQ';
import UseCases from '../components/UseCases';
import type { ThumbnailSize } from '../types';
import AdSense from '../components/AdSense';

interface ThumbnailDownloaderProps {
  darkMode: boolean;
}

interface HistoryItem {
  videoId: string;
  url: string;
  timestamp: number;
}

export default function ThumbnailDownloader({ darkMode }: ThumbnailDownloaderProps) {
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState<ThumbnailSize[]>([]);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('thumbnailHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (videoId: string, videoUrl: string) => {
    const newItem: HistoryItem = {
      videoId,
      url: videoUrl,
      timestamp: Date.now()
    };

    const updatedHistory = [newItem, ...history.filter(item => item.videoId !== videoId)].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('thumbnailHistory', JSON.stringify(updatedHistory));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setThumbnails([]);

    const videoId = extractVideoId(url);

    if (!videoId) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      return;
    }

    const thumbnailUrls = getThumbnailUrls(videoId);
    setThumbnails(thumbnailUrls);
    saveToHistory(videoId, url);
    trackToolUsage('Thumbnail Downloader', 'downloaded');
  };

  const loadFromHistory = (item: HistoryItem) => {
    setUrl(item.url);
    const thumbnailUrls = getThumbnailUrls(item.videoId);
    setThumbnails(thumbnailUrls);
    setError('');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Download className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            YouTube Thumbnail Downloader
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Download YouTube thumbnails in all available resolutions instantly
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  YouTube Video URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                />
              </div>

              {error && (
                <div className={`${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex items-start transition-colors`}>
                  <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'} mr-3 mt-0.5`} />
                  <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-800'}`}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Get Thumbnails
              </button>
            </div>
          </form>
        </div>

        {thumbnails.length > 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Available Thumbnails
              </h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied! Share with fellow creators.');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
              >
                <Share2 className="w-4 h-4" />
                Share Tool
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thumbnails.map((thumbnail, index) => (
                <div
                  key={index}
                  className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 hover:shadow-lg transition-all`}
                >
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={thumbnail.url}
                      alt={`Thumbnail ${thumbnail.resolution}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {thumbnail.resolution}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {thumbnail.width} × {thumbnail.height}
                      </p>
                    </div>
                  </div>
                  <a
                    href={thumbnail.url}
                    download={`thumbnail-${thumbnail.resolution}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-lg transition-colors my-8`}>
          <AdSense slot="1234567892" format="auto" style={{ minHeight: '250px' }} />
        </div>

        {history.length > 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors`}>
            <div className="flex items-center mb-6">
              <History className={`w-5 h-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Downloads
              </h2>
            </div>
            <div className="space-y-3">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => loadFromHistory(item)}
                  className={`w-full text-left px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'} transition-colors flex items-center justify-between`}
                >
                  <div className="flex-1 truncate">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                      {item.url}
                    </p>
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-4`}>
                    {formatDate(item.timestamp)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-6 mt-8 transition-colors`}>
          <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
            <strong>Supported formats:</strong> youtube.com/watch?v=, youtu.be/, youtube.com/shorts/
          </p>
          <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'} mt-2`}>
            <strong>Privacy:</strong> All processing happens in your browser. URLs are only stored locally on your device.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <UseCases
            darkMode={darkMode}
            cases={[
              {
                title: "Compilation Creator",
                description: "A compilation creator downloads thumbnails from viral videos to analyze visual trends and create similar thumbnails.",
                result: "CTR improved by 5% by following identified best practices."
              },
              {
                title: "Freelance Designer",
                description: "A designer uses the tool to show YouTuber clients high-quality thumbnail examples in their niche.",
                result: "Better client communication, +30% signed projects thanks to visual presentations."
              },
              {
                title: "Competition Analyzer",
                description: "A gaming YouTuber downloads competitor thumbnails to analyze their visual strategy (colors, text, composition).",
                result: "Complete thumbnail optimization, CTR went from 4% to 7%."
              },
              {
                title: "Personal Archive",
                description: "A creator saves all their old thumbnails to keep a portfolio of their creative evolution.",
                result: "Complete archive of 500+ thumbnails, useful for presentations and applications."
              }
            ]}
          />

          <FAQ
            darkMode={darkMode}
            items={[
              {
                question: "What thumbnail resolution should I use?",
                answer: "For the best quality, always use the maximum resolution (1280x720px). This is YouTube's standard format and offers the best clarity on all screens. Smaller resolutions are useful for quick previews or social media sharing."
              },
              {
                question: "Is it legal to download YouTube thumbnails?",
                answer: "Yes, downloading thumbnails for personal use, analysis, or inspiration is legal. However, reusing them directly on your videos without permission violates copyright and YouTube's terms. Use them only for reference and inspiration."
              },
              {
                question: "Why don't some videos have all resolutions?",
                answer: "Older videos or those uploaded in low quality may not have all resolutions. YouTube automatically generates different sizes, but some may not be available if the original video is too small."
              },
              {
                question: "Can I download thumbnails from private videos?",
                answer: "No, you can only download thumbnails from public or unlisted videos that you have the link to. Private videos are only accessible to the owner and authorized users via YouTube."
              },
              {
                question: "How do I create attractive thumbnails for my videos?",
                answer: "Best practices: 1) Use bright, contrasting colors, 2) Add short, readable text (3-5 words max), 3) Include a face with emotion if relevant, 4) Keep composition simple and clear, 5) Test on mobile (where it will be small), 6) Stay consistent with your brand."
              }
            ]}
          />
        </div>
      </div>

      <ToolsCTA darkMode={darkMode} currentTool="/thumbnail-downloader" />
    </div>
  );
}
