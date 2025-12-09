import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Type, Copy, CheckCircle, Lightbulb, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import { trackToolUsage } from '../utils/analytics';
import ToolsCTA from '../components/ToolsCTA';
import FAQ from '../components/FAQ';
import UseCases from '../components/UseCases';
import AdSense from '../components/AdSense';

interface TitleGeneratorProps {
  darkMode: boolean;
}

interface GeneratedTitle {
  text: string;
  score: number;
}

const toneTemplates = {
  'tutorial': [
    'How to {keyword} in {year} - Complete Guide',
    '{keyword}: Step-by-Step Tutorial for Beginners',
    'Learn {keyword} - {secondary} Made Easy',
    'The Ultimate {keyword} Tutorial ({secondary})',
    '{keyword} for Beginners: Everything You Need to Know',
    'Master {keyword}: {secondary} Tutorial',
    '{keyword} Tutorial - From Zero to Pro',
    'Complete {keyword} Guide: {secondary} Explained'
  ],
  'list': [
    'Top {number} {keyword} You NEED to Know',
    '{number} Best {keyword} for {secondary}',
    '{number} {keyword} Tips That Actually Work',
    '{number} Ways to Improve Your {keyword}',
    'Best {keyword} of {year}: Top {number} Picks',
    '{number} {keyword} Mistakes to Avoid',
    '{number} Pro {keyword} Tips for {secondary}',
    'Top {number} {keyword} Every Beginner Should Know'
  ],
  'intrigue': [
    'This {keyword} Trick Changed Everything...',
    'Why Nobody Talks About {keyword} ({secondary})',
    'The {keyword} Secret They Don\'t Want You to Know',
    'I Tried {keyword} for {number} Days - Here\'s What Happened',
    'What Experts Don\'t Tell You About {keyword}',
    'The Truth About {keyword} - {secondary}',
    '{keyword} Revealed: {secondary}',
    'Why {keyword} is Better Than You Think'
  ],
  'funny': [
    '{keyword} Gone Wrong (Don\'t Try This)',
    'When {keyword} Gets Weird... {secondary}',
    'I Tried {keyword} and Regretted It',
    '{keyword} Fails and Wins Compilation',
    'The Funniest {keyword} Moments of {year}',
    '{keyword} But Make It Funny',
    '{keyword}: Expectation vs Reality',
    'Things Nobody Tells You About {keyword}'
  ]
};

export default function TitleGenerator({ darkMode }: TitleGeneratorProps) {
  const [mainKeyword, setMainKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [tone, setTone] = useState('tutorial');
  const [generatedTitles, setGeneratedTitles] = useState<GeneratedTitle[]>([]);

  const generateTitles = () => {
    if (!mainKeyword.trim()) {
      alert('Please enter a main keyword');
      return;
    }

    const templates = toneTemplates[tone as keyof typeof toneTemplates];
    const secondary = secondaryKeywords.trim() || 'Tips and Tricks';
    const year = new Date().getFullYear().toString();
    const numbers = ['5', '7', '10', '15'];

    const titles = templates.map(template => {
      let title = template
        .replace('{keyword}', mainKeyword)
        .replace('{secondary}', secondary)
        .replace('{year}', year)
        .replace('{number}', numbers[Math.floor(Math.random() * numbers.length)]);

      const charCount = title.length;
      let score = 5;

      if (charCount <= 70) score = 5;
      else if (charCount <= 80) score = 4;
      else if (charCount <= 90) score = 3;
      else score = 2;

      if (title.includes('Ultimate') || title.includes('Complete') || title.includes('Best')) score = Math.min(5, score + 1);
      if (title.includes(year)) score = Math.min(5, score + 1);

      return { text: title, score };
    });

    const variations = [];
    for (let i = 0; i < 3; i++) {
      variations.push(...titles.map(t => ({
        text: t.text,
        score: t.score
      })));
    }

    const shuffled = variations.sort(() => Math.random() - 0.5);
    setGeneratedTitles(shuffled.slice(0, 15));
    trackToolUsage('Title Generator', 'generated');
  };

  const copyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
  };

  const getScoreColor = (score: number) => {
    if (score >= 5) return darkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 4) return darkMode ? 'text-blue-400' : 'text-blue-600';
    if (score >= 3) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-orange-400' : 'text-orange-600';
  };

  const getScoreBars = (score: number) => {
    return Array(5).fill(0).map((_, i) => (
      <div
        key={i}
        className={`h-2 w-2 rounded-full ${i < score ? (darkMode ? 'bg-green-400' : 'bg-green-600') : (darkMode ? 'bg-gray-600' : 'bg-gray-300')}`}
      />
    ));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-600 p-3 rounded-lg">
              <Type className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Free YouTube Title Generator
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Find powerful titles for maximum clicks (CTR) and better ranking (SEO)
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Main Topic / Keyword <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={mainKeyword}
                onChange={(e) => setMainKeyword(e.target.value)}
                placeholder="Ex: YouTube SEO, Vlog Setup, Gaming Tips..."
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Secondary Keywords / Focus (optional)
              </label>
              <input
                type="text"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                placeholder="Ex: Beginners, 2025, Tips..."
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tone / Style
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent`}
              >
                <option value="tutorial">Tutorial / How-to</option>
                <option value="list">List (Top X)</option>
                <option value="intrigue">Intrigue / Question</option>
                <option value="funny">Funny / Offbeat</option>
              </select>
            </div>

            <button
              onClick={generateTitles}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Generate Titles
            </button>
          </div>
        </div>

        {generatedTitles.length > 0 && (
          <>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors mb-8`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Suggestions de Titres ({generatedTitles.length})
              </h2>

              <div className="space-y-3">
                {generatedTitles.map((title, index) => {
                  const charCount = title.text.length;
                  const isLong = charCount > 70;

                  return (
                    <div
                      key={index}
                      className={`${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg p-4 transition-colors group`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className={`text-base mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {title.text}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`flex items-center gap-1 ${isLong ? (darkMode ? 'text-orange-400' : 'text-orange-600') : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                              {isLong && <AlertCircle className="w-4 h-4" />}
                              {charCount} caractères
                            </span>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Score:
                              </span>
                              <div className="flex gap-1">
                                {getScoreBars(title.score)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => copyTitle(title.text)}
                          className={`px-4 py-2 ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg transition-colors font-medium flex items-center opacity-0 group-hover:opacity-100`}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copier
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg p-4 border ${darkMode ? 'border-blue-800' : 'border-blue-200'} transition-colors mt-6`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong className={darkMode ? 'text-blue-300' : 'text-blue-900'}>Astuce:</strong> Les titres de moins de 70 caractères sont optimaux pour l'affichage sur tous les appareils. Les scores prennent en compte la longueur et les mots-clés puissants.
                </p>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-700' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'} border-2 rounded-xl p-8 shadow-lg text-center transition-colors mb-8`}>
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className={`w-6 h-6 mr-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Titre trouvé ? Passez à l'étape suivante !
                </h3>
              </div>
              <p className={`text-base mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-2xl mx-auto`}>
                Optimisez vos Tags pour le référencement et maximisez votre visibilité
              </p>
              <Link
                to="/tag-generator"
                className={`inline-flex items-center ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg`}
              >
                Générer mes Tags YouTube
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </>
        )}

        <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-6 transition-colors`}>
          <h3 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
            <Lightbulb className="w-5 h-5 mr-2" />
            Tips for Optimized Titles:
          </h3>
          <ul className={`space-y-2 text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Ideal Length:</strong> 60-70 characters for optimal display on mobile and desktop</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Keywords:</strong> Place your main keywords at the beginning of the title</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Numbers:</strong> Lists (Top 5, 10 Tips) generate more clicks</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Emotions:</strong> Use words that spark curiosity or urgency</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Timeliness:</strong> Add the current year to show content is recent</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Clarity:</strong> The title should clearly indicate what the video contains</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>A/B Testing:</strong> Test different title styles for your audience</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 space-y-8">
          <UseCases
            darkMode={darkMode}
            cases={[
              {
                title: "Photo Tutorial Channel",
                description: "Changed from vague titles ('My new photo technique') to optimized titles ('How to Master Natural Light Portraits - 2025 Guide').",
                result: "CTR went from 3% to 8%, doubling organic views in 3 months."
              },
              {
                title: "Cooking Channel",
                description: "Using titles with numbers and power words ('5 Quick Recipes in 10 Minutes - Zero Waste').",
                result: "+120% clicks from YouTube search, growth from 2K to 15K subscribers."
              },
              {
                title: "Gaming Let's Play",
                description: "Optimized titles with game, episode and hook ('Minecraft Hardcore #12 - I ALMOST Lost Everything...').",
                result: "40% increase in retention rate, series became the channel's most popular."
              },
              {
                title: "Business Entrepreneur",
                description: "A/B tested question vs statement titles ('How to Earn $1000/month?' vs 'I Earned $1000/month - Here's How').",
                result: "Question format generated +35% more clicks, systematic adoption of the format."
              }
            ]}
          />

          <FAQ
            darkMode={darkMode}
            items={[
              {
                question: "What's the ideal length for a YouTube title?",
                answer: "The optimal length is 60-70 characters. Beyond 70, the title will be truncated on mobile and desktop. Always place your keywords and main hook in the first 50 characters to guarantee visibility."
              },
              {
                question: "Should I include emojis in my titles?",
                answer: "Emojis can increase CTR by 10-15% by catching the eye, but use them in moderation (1-2 max). Make sure they're relevant to your content and niche. Too many emojis can look spammy and reduce credibility."
              },
              {
                question: "Do clickbait titles still work?",
                answer: "Pure clickbait (false promises) hurts your channel: poor retention, unhappy algorithm, lost trust. Instead, use 'curiosity-driven' titles that promise what the video actually delivers. Intrigue, yes; lying, no."
              },
              {
                question: "Can I change the title after publishing?",
                answer: "Yes! Changing the title in the first 48h can boost a video that's performing poorly. After that, be careful: a radical change can disrupt the algorithm. Test minor variations and track the impact on your analytics."
              },
              {
                question: "How do I write a title that ranks well in SEO?",
                answer: "For YouTube SEO: 1) Place your main keyword at the beginning, 2) Include secondary keywords naturally, 3) Add the year if relevant (2025), 4) Use words people actually search for. Our generator automatically optimizes for SEO."
              },
              {
                question: "Which words increase CTR the most?",
                answer: "Powerful words that increase CTR: numbers (5, 10, 100), temporal (2025, new, now), superlatives (best, ultimate, secret), emotional (shocking, incredible), action (discover, learn), and negation (never, stop, avoid)."
              }
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdSense slot="1234567893" style={{ textAlign: 'center', minHeight: '250px' }} />
      </div>

      <ToolsCTA darkMode={darkMode} currentTool="/title-generator" />
    </div>
  );
}
