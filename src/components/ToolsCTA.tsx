import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';

interface ToolsCTAProps {
  darkMode: boolean;
  currentTool?: string;
}

export default function ToolsCTA({ darkMode, currentTool }: ToolsCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('toolsCTADismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('toolsCTADismissed', 'true');
  };

  const tools = [
    { name: 'Revenue Calculator', path: '/revenue-calculator' },
    { name: 'Thumbnail Downloader', path: '/thumbnail-downloader' },
    { name: 'Title Generator', path: '/title-generator' },
    { name: 'Tag Generator', path: '/tag-generator' },
    { name: 'Monetization Checker', path: '/monetization-checker' },
    { name: 'Channel Comparator', path: '/channel-comparator' }
  ];

  const otherTools = tools.filter(tool => tool.path !== currentTool);
  const suggestedTools = otherTools.slice(0, 3);

  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-slide-up">
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-2xl border-2 transition-colors`}>
        <div className="p-6">
          <button
            onClick={handleDismiss}
            className={`absolute top-3 right-3 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Discover our other tools
            </h3>
          </div>

          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Maximize your growth with our complete suite of free tools
          </p>

          <div className="space-y-2 mb-4">
            {suggestedTools.map(tool => (
              <Link
                key={tool.path}
                to={tool.path}
                className={`block ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} px-4 py-2 rounded-lg transition-colors text-sm font-medium`}
                onClick={handleDismiss}
              >
                {tool.name}
              </Link>
            ))}
          </div>

          <Link
            to="/"
            className="block text-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
            onClick={handleDismiss}
          >
            View all tools
          </Link>
        </div>
      </div>
    </div>
  );
}
