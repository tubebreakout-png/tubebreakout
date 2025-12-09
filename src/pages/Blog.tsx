import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, TrendingUp } from 'lucide-react';

interface BlogProps {
  darkMode: boolean;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
}

export default function Blog({ darkMode }: BlogProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const posts: BlogPost[] = [
    {
      slug: 'how-to-read-youtube-cpm',
      title: 'How to Read and Understand Your YouTube CPM',
      excerpt: 'Discover what your CPM really means, why it varies, and how to optimize it to maximize your YouTube revenue.',
      category: 'Monetization',
      readTime: '5 min',
      image: '💰'
    },
    {
      slug: '5-steps-1000-subscribers',
      title: 'The 5 Steps to Reach 1000 Subscribers Quickly',
      excerpt: 'Complete guide to reach the YouTube monetization threshold. Proven strategies from hundreds of creators.',
      category: 'Growth',
      readTime: '8 min',
      image: '📈'
    },
    {
      slug: 'optimize-youtube-titles-ctr',
      title: 'How to Optimize Your YouTube Titles for Maximum CTR',
      excerpt: 'The secrets of high click-through rate titles. Formulas, powerful keywords, and mistakes to absolutely avoid.',
      category: 'Optimization',
      readTime: '6 min',
      image: '🎯'
    },
    {
      slug: 'youtube-tags-2025',
      title: 'Are YouTube Tags Still Important in 2025?',
      excerpt: 'The truth about the importance of tags in 2025. How to use them effectively with the new algorithm rules.',
      category: 'SEO',
      readTime: '5 min',
      image: '🏷️'
    },
    {
      slug: 'youtube-thumbnail-design',
      title: 'Create YouTube Thumbnails That Attract Clicks',
      excerpt: 'Complete thumbnail design guide: colors, text, composition. With before/after examples from successful channels.',
      category: 'Design',
      readTime: '10 min',
      image: '🎨'
    },
    {
      slug: 'youtube-monetization-requirements',
      title: 'YouTube Monetization: Everything You Need to Know',
      excerpt: 'Official criteria, approval times, tips to accelerate your progress toward the YouTube Partner Program.',
      category: 'Monetization',
      readTime: '7 min',
      image: '✅'
    }
  ];

  const categories = ['All', 'Monetization', 'Growth', 'Optimization', 'SEO', 'Design'];

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-600 p-3 rounded-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Blog & YouTube Resources
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Guides, tutorials and strategies to grow your YouTube channel
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === selectedCategory
                  ? 'bg-red-600 text-white'
                  : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={`block ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'} rounded-xl overflow-hidden transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} group`}
            >
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} h-48 flex items-center justify-center text-6xl`}>
                {post.image}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                    {post.category}
                  </span>
                  <span className={`text-sm flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-red-600 transition-colors`}>
                  {post.title}
                </h2>

                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.excerpt}
                </p>

                <div className="flex items-center text-red-600 font-semibold group-hover:gap-2 transition-all">
                  Read article
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-r from-red-900 to-red-800' : 'bg-gradient-to-r from-red-600 to-red-700'} rounded-2xl p-8 md:p-12 text-center transition-colors`}>
          <TrendingUp className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Put It Into Practice?
          </h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Use our free tools to immediately apply these strategies to your channel
          </p>
          <Link
            to="/"
            className="bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-block"
          >
            Discover Our Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
