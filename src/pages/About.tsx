import { Mail, Heart, Target, Users } from 'lucide-react';

interface AboutProps {
  darkMode: boolean;
}

export default function About({ darkMode }: AboutProps) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          About TubeBreakout
        </h1>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 mb-8 shadow-lg transition-colors`}>
          <div className="flex items-center mb-4">
            <Target className="w-8 h-8 text-red-600 mr-3" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Our Mission</h2>
          </div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg leading-relaxed mb-4`}>
            TubeBreakout was created with a simple mission: to democratize access to powerful YouTube analytics and optimization tools. We believe that every creator, regardless of their size or budget, deserves the tools to succeed.
          </p>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg leading-relaxed`}>
            Our platform provides free, easy-to-use tools that help you understand your channel's performance, optimize your content, and grow your audience effectively.
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 mb-8 shadow-lg transition-colors`}>
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-red-600 mr-3" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>What We Believe</h2>
          </div>
          <ul className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
            <li className="flex items-start">
              <span className="text-red-600 mr-3 mt-1">•</span>
              <span>Quality tools should be accessible to everyone, not just those who can afford expensive subscriptions</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-3 mt-1">•</span>
              <span>Privacy matters - we don't store your personal data or video information</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-3 mt-1">•</span>
              <span>Simplicity wins - our tools are designed to be intuitive and easy to use</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 mr-3 mt-1">•</span>
              <span>Data-driven decisions lead to better results for content creators</span>
            </li>
          </ul>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 mb-8 shadow-lg transition-colors`}>
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-red-600 mr-3" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Our Community</h2>
          </div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg leading-relaxed mb-4`}>
            TubeBreakout was born from a passion for content creation and a desire to make YouTube analytics tools accessible to everyone.
          </p>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg leading-relaxed mb-4`}>
            Today we serve over 25,000 creators daily worldwide, from beginners to established channels looking to optimize their content strategy.
          </p>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg leading-relaxed`}>
            Every tool we create is designed with a simple goal: save you time and help you make better decisions for your channel. Your success is our success.
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-r from-red-900 to-red-800' : 'bg-gradient-to-r from-red-600 to-red-700'} rounded-xl p-8 shadow-lg transition-colors`}>
          <div className="flex items-center mb-4">
            <Mail className="w-8 h-8 text-white mr-3" />
            <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
          </div>
          <p className="text-red-100 text-lg mb-6">
            Have questions, suggestions, or feedback? We'd love to hear from you!
          </p>
          <a
            href="mailto:contact@tubebreakout.com"
            className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
