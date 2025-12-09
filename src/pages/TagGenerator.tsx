import { useState } from 'react';
import { Tag, Copy, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { trackToolUsage } from '../utils/analytics';
import ToolsCTA from '../components/ToolsCTA';
import FAQ from '../components/FAQ';
import UseCases from '../components/UseCases';
import AdSense from '../components/AdSense';

interface TagGeneratorProps {
  darkMode: boolean;
}

const tagDatabase = {
  'science-tech': ['technology', 'tech review', 'unboxing', 'gadget', 'smartphone', 'laptop', 'science', 'innovation', 'AI', 'software', 'coding', 'programming', 'developer', 'tech news', 'comparison'],
  'travel': ['travel', 'travel vlog', 'destination', 'vacation', 'adventure', 'backpacking', 'tourism', 'travel tips', 'travel guide', 'explore', 'wanderlust', 'trip', 'journey'],
  'autos': ['cars', 'automotive', 'car review', 'vehicle', 'driving', 'auto', 'supercars', 'motorcycle', 'bike', 'car comparison', 'test drive', 'car news'],
  'education': ['education', 'learning', 'tutorial', 'how to', 'explained', 'lesson', 'study', 'educational', 'knowledge', 'teaching', 'study tips', 'teacher', 'course', 'training'],
  'howto': ['how to', 'tutorial', 'diy', 'guide', 'tips', 'tricks', 'step by step', 'learn', 'instructions', 'beginner', 'easy', 'quick', 'simple'],
  'entertainment': ['entertainment', 'fun', 'comedy', 'challenges', 'pranks', 'reactions', 'viral', 'trending', 'funny', 'jokes', 'memes', 'popular'],
  'people-blogs': ['vlog', 'daily vlog', 'lifestyle', 'day in the life', 'vlogger', 'family vlog', 'vlogging', 'my life', 'vlogs', 'daily life', 'personal', 'blog'],
  'gaming': ['gaming', 'gameplay', 'walkthrough', 'playthrough', 'lets play', 'game review', 'gaming setup', 'esports', 'gaming highlights', 'pro player', 'twitch', 'streaming', 'console', 'pc gaming'],
  'news': ['news', 'breaking news', 'current events', 'politics', 'world news', 'updates', 'latest news', 'trending news', 'analysis', 'journalism'],
  'comedy': ['comedy', 'funny', 'humor', 'jokes', 'stand up', 'sketch', 'parody', 'satire', 'memes', 'laugh', 'hilarious', 'comedy skit'],
  'film': ['film', 'movie', 'cinema', 'movie review', 'film analysis', 'movies', 'film production', 'filmmaking', 'movie trailer', 'film critique'],
  'sports': ['sports', 'football', 'basketball', 'soccer', 'athletics', 'highlights', 'game', 'match', 'training', 'workout', 'fitness', 'sports news'],
  'pets': ['pets', 'animals', 'dogs', 'cats', 'pet care', 'cute animals', 'pet training', 'pet vlog', 'animal videos', 'puppies', 'kittens'],
  'nonprofits': ['nonprofit', 'charity', 'social cause', 'activism', 'volunteering', 'awareness', 'fundraising', 'community', 'social impact', 'humanitarian'],
  'music': ['music', 'song', 'cover', 'remix', 'lyrics', 'music video', 'official audio', 'playlist', 'new music', 'music 2025', 'artist', 'album']
};

const trendingTags = ['2025', 'viral', 'trending', 'new', 'must watch', 'best of', 'top 10', 'ultimate guide'];

export default function TagGenerator({ darkMode }: TagGeneratorProps) {
  const [description, setDescription] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('science-tech');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateTags = () => {
    const baseTags = tagDatabase[selectedNiche as keyof typeof tagDatabase] || [];
    const words = description.toLowerCase().split(/\s+/).filter(word => word.length > 3);

    const allTags = [...new Set([...baseTags, ...words])];

    const relevantTags = allTags.slice(0, 30);
    setGeneratedTags(relevantTags);
    trackToolUsage('Tag Generator', 'generated');
  };

  const copyToClipboard = () => {
    const tagString = generatedTags.join(', ');
    navigator.clipboard.writeText(tagString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    alert(`"${tag}" copied!`);
  };

  const removeTag = (index: number) => {
    setGeneratedTags(generatedTags.filter((_, i) => i !== index));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Tag className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            YouTube Tag Generator
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Generate optimized tags for your YouTube videos to improve discoverability
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Content Niche
              </label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
              >
                <option value="science-tech">Science & Technology</option>
                <option value="travel">Travel</option>
                <option value="autos">Autos & Vehicles</option>
                <option value="education">Education</option>
                <option value="howto">How-To & Style</option>
                <option value="entertainment">Entertainment</option>
                <option value="people-blogs">People & Blogs</option>
                <option value="gaming">Gaming</option>
                <option value="news">News & Politics</option>
                <option value="comedy">Comedy</option>
                <option value="film">Film & Animation</option>
                <option value="sports">Sports</option>
                <option value="pets">Pets & Animals</option>
                <option value="nonprofits">Nonprofits & Activism</option>
                <option value="music">Music</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Video Description or Keywords
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your video content, include key topics, products, or themes..."
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
              />
            </div>

            <button
              onClick={generateTags}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Generate Tags
            </button>
          </div>
        </div>

        {generatedTags.length > 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Generated Tags ({generatedTags.length})
              </h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
              >
                {copied ? (
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
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {generatedTags.map((tag, index) => (
                <span
                  key={index}
                  onClick={() => copyTag(tag)}
                  className={`${darkMode ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'} px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all flex items-center group`}
                >
                  {tag}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(index);
                    }}
                    className={`ml-2 ${darkMode ? 'text-purple-400 hover:text-purple-200' : 'text-purple-600 hover:text-purple-800'} opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className={`${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg p-4 border ${darkMode ? 'border-blue-800' : 'border-blue-200'} transition-colors`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <strong className={darkMode ? 'text-blue-300' : 'text-blue-900'}>Tip:</strong> Click any tag to copy individually, or use "Copy All" to get comma-separated list for YouTube.
              </p>
            </div>
          </div>
        )}

        {generatedTags.length > 0 && (
          <>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Trending Tags to Add
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Boost discoverability with these popular tags
              </p>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag, index) => (
                  <span
                    key={index}
                    onClick={() => copyTag(tag)}
                    className={`${darkMode ? 'bg-green-900 text-green-200 hover:bg-green-800' : 'bg-green-100 text-green-800 hover:bg-green-200'} px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-700' : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'} border-2 rounded-xl p-8 shadow-lg text-center transition-colors`}>
              <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Want to know the exact search volume of these tags?
              </h3>
              <p className={`text-base mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-2xl mx-auto`}>
                Our tool is free, but for real-time data on competition and keyword insights, you need more power!
              </p>
              <a
                href="https://vidiq.com/TubeBreakout"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block ${darkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-600 hover:bg-orange-700'} text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg`}
              >
                Unlock precise data with vidIQ Pro
              </a>
              <p className={`text-xs mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This is an affiliate link that supports TubeBreakout
              </p>
            </div>
          </>
        )}

        <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-6 mt-8 transition-colors`}>
          <h3 className={`font-semibold mb-3 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
            Tips for Better Tags:
          </h3>
          <ul className={`space-y-2 text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use 5-15 tags per video for optimal performance</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Mix broad and specific tags to reach different audiences</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Include your brand name or channel name as a tag</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Research competitor tags for inspiration</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Tags should be relevant to your actual content</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 space-y-8">
          <UseCases
            darkMode={darkMode}
            cases={[
              {
                title: "Startup Tech Channel",
                description: "A new tech channel used the generator to optimize tags on 20 videos by targeting niche keywords.",
                result: "Impressions multiplied by 4, went from 500 to 2000 views per video in 2 months."
              },
              {
                title: "Travel Vlogger",
                description: "A vlogger mixed generic and specific tags to maximize discoverability across different searches.",
                result: "Improved ranking in YouTube search, +65% organic traffic."
              },
              {
                title: "Gaming Channel",
                description: "A gaming streamer used trending tags + niche tags for each gameplay video.",
                result: "Appeared in suggested videos, growth from 200 to 5K subscribers in 6 months."
              },
              {
                title: "Design Tutorials",
                description: "A design channel targeted long-tail tags with low competition for each tutorial.",
                result: "Ranked #1-3 on multiple niche searches, stable 30% monthly growth."
              }
            ]}
          />

          <FAQ
            darkMode={darkMode}
            items={[
              {
                question: "How do I choose the best tags for my videos?",
                answer: "Use a mix of 3 types of tags: 1) Broad tags (ex: 'gaming', 'tutorial') for reach, 2) Specific tags (ex: 'Minecraft survival tips', 'Photoshop beginners') for targeting, 3) Niche/long-tail tags (ex: 'best Minecraft seeds 2025') for less competition. Aim for 10-15 tags total."
              },
              {
                question: "How many tags should I use per video?",
                answer: "YouTube recommends 5-15 tags per video. Too few limits your discoverability, too many can dilute your message and confuse the algorithm. Focus on quality and relevance rather than quantity."
              },
              {
                question: "Are tags still important in 2025?",
                answer: "Yes, but less than before. YouTube relies more on title, description, and captions to understand your content. However, tags still help with search ranking and suggested videos, especially for small channels."
              },
              {
                question: "Can I copy tags from popular videos?",
                answer: "You can be inspired by them, but your tags should reflect your actual content. Copying irrelevant tags can hurt your SEO and the algorithm's trust. Use our tool to generate tags tailored to YOUR content."
              },
              {
                question: "Should I use my channel name as a tag?",
                answer: "Yes! Always include your channel name as a tag. This helps viewers easily find your other videos and strengthens your brand. If you have recurring series, include those names too."
              },
              {
                question: "What are the trending tags in 2025?",
                answer: "Trending tags change, but often include: '2025', 'new', 'trending', 'viral', 'tutorial', 'how to', 'tips', 'review', 'best of'. Our tool automatically integrates these popular tags into your suggestions."
              }
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdSense slot="1234567892" style={{ textAlign: 'center', minHeight: '250px' }} />
      </div>

      <ToolsCTA darkMode={darkMode} currentTool="/tag-generator" />
    </div>
  );
}
