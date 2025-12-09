import { useState } from 'react';
import { Search, Copy, CheckCircle, Download } from 'lucide-react';
import { trackToolUsage } from '../utils/analytics';
import ToolsCTA from '../components/ToolsCTA';
import FAQ from '../components/FAQ';
import UseCases from '../components/UseCases';
import AdSense from '../components/AdSense';

interface TagExtractorProps {
  darkMode: boolean;
}

export default function TagExtractor({ darkMode }: TagExtractorProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedTags, setExtractedTags] = useState<string[]>([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [error, setError] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const [copiedAll, setCopiedAll] = useState(false);

  const extractTags = async () => {
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setExtractedTags([]);
    setVideoTitle('');
    setSelectedTags(new Set());

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-tags`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract tags');
      }

      setExtractedTags(data.tags || []);
      setVideoTitle(data.title || '');
      trackToolUsage('Tag Extractor', 'extracted');
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to extract tags. Make sure the URL is valid and the video is public.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTag = (index: number) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTags(newSelected);
  };

  const selectAll = () => {
    if (selectedTags.size === extractedTags.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(extractedTags.map((_, index) => index)));
    }
  };

  const copySelectedTags = () => {
    const tags = extractedTags.filter((_, index) => selectedTags.has(index));
    const tagString = tags.join(', ');
    navigator.clipboard.writeText(tagString);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyAllTags = () => {
    const tagString = extractedTags.join(', ');
    navigator.clipboard.writeText(tagString);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-600 p-3 rounded-lg">
              <Download className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            YouTube Tag Extractor
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Extract tags from any YouTube video or channel to see what keywords successful creators use
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                YouTube Video or Channel URL
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://youtube.com/channel/..."
                  className={`flex-1 px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
                  onKeyPress={(e) => e.key === 'Enter' && extractTags()}
                />
                <button
                  onClick={extractTags}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Extract
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>

            <div className={`${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong className={darkMode ? 'text-blue-300' : 'text-blue-900'}>Tip:</strong> Works with any public YouTube video or channel URL. Extract tags to learn from successful videos in your niche.
              </p>
            </div>
          </div>
        </div>

        {extractedTags.length > 0 && (
          <>
            <div className={`${darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border-2 rounded-xl p-4 mb-6 flex items-center justify-center transition-colors`}>
              <CheckCircle className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'} mr-2`} />
              <span className={`font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                Success! Extracted {extractedTags.length} tags
              </span>
            </div>

            {videoTitle && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-colors mb-6`}>
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  Title
                </h3>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {videoTitle}
                </p>
              </div>
            )}

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Extracted Tags ({extractedTags.length})
                </h2>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={selectAll}
                    className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} rounded-lg transition-colors font-medium flex items-center`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {selectedTags.size === extractedTags.length ? 'Deselect All' : 'Select All'}
                  </button>
                  {selectedTags.size > 0 ? (
                    <button
                      onClick={copySelectedTags}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                    >
                      {copiedAll ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Selected ({selectedTags.size})
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={copyAllTags}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                    >
                      {copiedAll ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy All
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {extractedTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => toggleTag(index)}
                    className={`px-4 py-2 rounded-full text-sm transition-all border-2 ${
                      selectedTags.has(index)
                        ? darkMode
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-red-600 text-white border-red-600'
                        : darkMode
                        ? 'bg-gray-700 text-gray-200 border-gray-600 hover:border-red-500'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-red-400'
                    }`}
                    onDoubleClick={() => copyTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className={`${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg p-4 border ${darkMode ? 'border-blue-800' : 'border-blue-200'} mt-6 transition-colors`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong className={darkMode ? 'text-blue-300' : 'text-blue-900'}>Tip:</strong> Click tags to select them, then copy selected. Double-click any tag to copy it individually.
                </p>
              </div>
            </div>
          </>
        )}

        <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-6 mt-8 transition-colors`}>
          <h3 className={`font-semibold mb-3 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
            How to Use Extracted Tags:
          </h3>
          <ul className={`space-y-2 text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Study tags from successful videos in your niche</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Look for patterns in tag usage by top creators</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Adapt relevant tags to your own content (don't copy blindly)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Combine insights with our Tag Generator for best results</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Always ensure tags accurately represent your content</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 space-y-8">
          <UseCases
            darkMode={darkMode}
            cases={[
              {
                title: "Tech Review Channel",
                description: "Extracted tags from top tech reviewers to understand keyword strategies.",
                result: "Discovered high-performing niche tags, improved search rankings by 40%."
              },
              {
                title: "Gaming Creator",
                description: "Analyzed tags from viral gaming videos to optimize their own content.",
                result: "Found untapped keyword opportunities, doubled impressions in 3 months."
              },
              {
                title: "Educational Content",
                description: "Studied tag patterns from educational channels with millions of views.",
                result: "Refined tagging strategy, increased CTR by 35% and watch time by 25%."
              },
              {
                title: "Lifestyle Vlogger",
                description: "Extracted tags from competitor channels to find content gaps.",
                result: "Identified unique angles, grew subscriber base from 1K to 15K in 8 months."
              }
            ]}
          />

          <FAQ
            darkMode={darkMode}
            items={[
              {
                question: "How does the tag extractor work?",
                answer: "Our tool fetches the public HTML of YouTube pages and extracts the keywords metadata that YouTube includes in every video page. This data is publicly available and doesn't require API access."
              },
              {
                question: "Can I extract tags from any YouTube video?",
                answer: "Yes, you can extract tags from any public YouTube video or channel. Private or unlisted videos cannot be accessed. Some videos may have no tags if the creator didn't add any."
              },
              {
                question: "Is it legal to see other creators' tags?",
                answer: "Yes! Tags are public metadata that YouTube includes in every video page. Many successful creators analyze competitor tags to improve their own strategy. However, you should adapt tags to your content, not copy them blindly."
              },
              {
                question: "Should I copy the exact tags I extract?",
                answer: "No, you should use extracted tags as inspiration. Tags should accurately represent YOUR content. Copying irrelevant tags can hurt your SEO and viewer trust. Use insights to inform your own unique tagging strategy."
              },
              {
                question: "Can I extract tags from channels?",
                answer: "Yes, you can input a channel URL to extract tags from the channel's main page. For more detailed tag analysis, we recommend extracting from individual videos that match your content style."
              },
              {
                question: "How often should I analyze competitor tags?",
                answer: "Check competitor tags monthly or when creating content in a new niche. Tag strategies evolve, so regular analysis helps you stay current with trending keywords and discover new opportunities."
              }
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdSense slot="1234567891" style={{ textAlign: 'center', minHeight: '250px' }} />
      </div>

      <ToolsCTA darkMode={darkMode} currentTool="/tag-extractor" />
    </div>
  );
}
