import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import RevenueCalculator from './pages/RevenueCalculator';
import ThumbnailDownloader from './pages/ThumbnailDownloader';
import TitleGenerator from './pages/TitleGenerator';
import TagGenerator from './pages/TagGenerator';
import TagExtractor from './pages/TagExtractor';
import MonetizationChecker from './pages/MonetizationChecker';
import ChannelComparator from './pages/ChannelComparator';
import ChannelIdFinder from './pages/ChannelIdFinder';
import ChannelDataViewer from './pages/ChannelDataViewer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { trackPageView } from './utils/analytics';

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    if (location?.pathname) {
      trackPageView(location.pathname);
      window.scrollTo(0, 0);
    }
  }, [location]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/about" element={<About darkMode={darkMode} />} />
        <Route path="/blog" element={<Blog darkMode={darkMode} />} />
        <Route path="/blog/:slug" element={<BlogArticle darkMode={darkMode} />} />
        <Route path="/revenue-calculator" element={<RevenueCalculator darkMode={darkMode} />} />
        <Route path="/thumbnail-downloader" element={<ThumbnailDownloader darkMode={darkMode} />} />
        <Route path="/title-generator" element={<TitleGenerator darkMode={darkMode} />} />
        <Route path="/tag-generator" element={<TagGenerator darkMode={darkMode} />} />
        <Route path="/tag-extractor" element={<TagExtractor darkMode={darkMode} />} />
        <Route path="/monetization-checker" element={<MonetizationChecker darkMode={darkMode} />} />
        <Route path="/channel-comparator" element={<ChannelComparator darkMode={darkMode} />} />
        <Route path="/channel-id-finder" element={<ChannelIdFinder darkMode={darkMode} />} />
        <Route path="/channel-data-viewer" element={<ChannelDataViewer darkMode={darkMode} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy darkMode={darkMode} />} />
        <Route path="/terms-of-service" element={<TermsOfService darkMode={darkMode} />} />
      </Routes>
      <Footer darkMode={darkMode} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
