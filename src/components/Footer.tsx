import { Link } from 'react-router-dom';
import { Youtube, Twitter } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  return (
    <footer className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                TubeBreakout
              </span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Free YouTube tools for smart creators. Grow your channel with data-driven insights.
            </p>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/revenue-calculator" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Revenue Calculator
                </Link>
              </li>
              <li>
                <Link to="/thumbnail-downloader" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Thumbnail Downloader
                </Link>
              </li>
              <li>
                <Link to="/tag-generator" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Tag Generator
                </Link>
              </li>
              <li>
                <Link to="/tag-extractor" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Tag Extractor
                </Link>
              </li>
              <li>
                <Link to="/monetization-checker" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Monetization Checker
                </Link>
              </li>
              <li>
                <Link to="/channel-comparator" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Channel Comparator
                </Link>
              </li>
              <li>
                <Link to="/channel-id-finder" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Channel ID Finder
                </Link>
              </li>
              <li>
                <Link to="/channel-data-viewer" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Channel Data Viewer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:contact@tubebreakout.com" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://x.com/tubebreakout" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © {new Date().getFullYear()} TubeBreakout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
