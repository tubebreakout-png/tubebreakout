import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Menu, X, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tools = [
    { name: 'Revenue Calculator', path: '/revenue-calculator' },
    { name: 'Thumbnail Downloader', path: '/thumbnail-downloader' },
    { name: 'Title Generator', path: '/title-generator' },
    { name: 'Tag Generator', path: '/tag-generator' },
    { name: 'Tag Extractor', path: '/tag-extractor' },
    { name: 'Monetization Checker', path: '/monetization-checker' },
    { name: 'Channel Comparator', path: '/channel-comparator' },
    { name: 'Channel ID Finder', path: '/channel-id-finder' },
    { name: 'Channel Data Viewer', path: '/channel-data-viewer' }
  ];

  return (
    <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-md transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              TubeBreakout
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}
            >
              Home
            </Link>

            <div className="relative group">
              <button className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors flex items-center`}>
                Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`absolute left-0 mt-2 w-56 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
                <div className="py-2">
                  {tools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/blog"
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}
            >
              Blog
            </Link>

            <Link
              to="/about"
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}
            >
              About
            </Link>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:opacity-80 transition-opacity`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <a
              href="https://vidiq.com/TubeBreakout"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Try VidIQ
            </a>
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-red-600 transition-colors`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div className="space-y-2">
              <div className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>
                Tools
              </div>
              {tools.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`block pl-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-red-600 transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {tool.name}
                </Link>
              ))}
            </div>

            <Link
              to="/blog"
              className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-red-600 transition-colors`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>

            <Link
              to="/about"
              className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-red-600 transition-colors`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            <a
              href="https://vidiq.com/TubeBreakout"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Try VidIQ
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
