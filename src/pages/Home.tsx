import { Link } from 'react-router-dom';
import { DollarSign, Download, Tag, Tags, CheckCircle, GitCompare, Search, TrendingUp, Users, Eye, Zap, BarChart3, Target, Type } from 'lucide-react';
import SocialProof from '../components/SocialProof';
import AdSense from '../components/AdSense';

interface HomeProps {
  darkMode: boolean;
}

export default function Home({ darkMode }: HomeProps) {
  const tools = [
    {
      icon: DollarSign,
      title: 'Revenue Calculator',
      description: 'Estimate your YouTube earnings based on views, country, and niche with accurate CPM data.',
      path: '/revenue-calculator',
      color: 'bg-green-500'
    },
    {
      icon: Download,
      title: 'Thumbnail Downloader',
      description: 'Download YouTube thumbnails in all available resolutions instantly and free.',
      path: '/thumbnail-downloader',
      color: 'bg-blue-500'
    },
    {
      icon: Type,
      title: 'Title Generator',
      description: 'Generate optimized video titles that boost CTR and improve SEO rankings.',
      path: '/title-generator',
      color: 'bg-red-500'
    },
    {
      icon: Tag,
      title: 'Tag Generator',
      description: 'Generate optimized tags for your videos based on your content and niche.',
      path: '/tag-generator',
      color: 'bg-purple-500'
    },
    {
      icon: Tags,
      title: 'Tag Extractor',
      description: 'Extract and analyze tags from any YouTube video to optimize your content strategy.',
      path: '/tag-extractor',
      color: 'bg-cyan-600'
    },
    {
      icon: CheckCircle,
      title: 'Monetization Checker',
      description: 'Check if your channel meets YouTube monetization requirements and track your progress.',
      path: '/monetization-checker',
      color: 'bg-orange-500'
    },
    {
      icon: GitCompare,
      title: 'Channel Comparator',
      description: 'Compare YouTube channels side-by-side to analyze performance and growth metrics.',
      path: '/channel-comparator',
      color: 'bg-indigo-500'
    },
    {
      icon: Search,
      title: 'Channel ID Finder',
      description: 'Find the unique channel ID from any YouTube channel URL or handle.',
      path: '/channel-id-finder',
      color: 'bg-gray-800'
    },
    {
      icon: BarChart3,
      title: 'Channel Data Viewer',
      description: 'View comprehensive YouTube channel statistics, monetization status, tags, and detailed information.',
      path: '/channel-data-viewer',
      color: 'bg-teal-500'
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: '100% Free Tools',
      description: 'All our tools are completely free to use with no hidden charges or limitations.'
    },
    {
      icon: Users,
      title: 'No Registration',
      description: 'Start using our tools immediately without creating an account or signing up.'
    },
    {
      icon: Eye,
      title: 'Privacy Focused',
      description: 'We respect your privacy and never store your personal data or video information.'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      <section className={`${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-red-900' : 'bg-gradient-to-br from-white via-gray-50 to-red-50'} transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Free YouTube Tools for
              <span className="text-red-600"> Smart Creators</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Grow your channel with powerful analytics, insights, and optimization tools. 100% free, no sign-up required.
            </p>

            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center justify-center gap-2">
                <Zap className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                <span className="font-medium">Boost Your Views</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                <span className="font-medium">Estimate Your Revenue</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Type className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                <span className="font-medium">Optimize Your Titles</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Target className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                <span className="font-medium">Refine Your Tags</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/monetization-checker"
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg inline-block"
              >
                Access Free Tools
              </Link>
              <Link
                to="/about"
                className={`${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-100'} px-8 py-4 rounded-lg transition-colors font-semibold text-lg inline-block border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Our Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} rounded-xl p-6 transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} group`}
              >
                <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tool.title}
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <SocialProof darkMode={darkMode} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdSense slot="1234567890" style={{ textAlign: 'center', minHeight: '250px' }} />
      </section>

      <section className={`${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Why TubeBreakout?
          </h2>
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-12 max-w-2xl mx-auto`}>
            We believe every creator deserves access to powerful tools without barriers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-red-100'} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${darkMode ? 'text-red-500' : 'text-red-600'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`${darkMode ? 'bg-gradient-to-r from-red-900 to-red-800' : 'bg-gradient-to-r from-red-600 to-red-700'} rounded-2xl p-8 md:p-12 text-center transition-colors`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Channel?
          </h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators using our tools to optimize their content and maximize their earnings
          </p>
          <Link
            to="/revenue-calculator"
            className="bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
