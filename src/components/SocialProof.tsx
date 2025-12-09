import { Star } from 'lucide-react';

interface SocialProofProps {
  darkMode: boolean;
}

export default function SocialProof({ darkMode }: SocialProofProps) {
  const stats = [
    { value: '25K+', label: 'Tools Used Today', color: 'text-blue-600' },
    { value: '150K+', label: 'Thumbnails Downloaded', color: 'text-green-600' },
    { value: '98%', label: 'Satisfaction Rate', color: 'text-purple-600' },
    { value: '100%', label: 'Free Forever', color: 'text-red-600' }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Gaming Creator - 50K Subscribers',
      text: 'The revenue calculator helped me set realistic goals. Optimized my content strategy and grew from 10K to 50K subs in 8 months. +200% views!',
      avatar: '👩',
      metric: '+200% Views'
    },
    {
      name: 'Mike T.',
      role: 'Tech Reviewer - 120K Subscribers',
      text: 'Tag generator + thumbnail analysis = perfect combo. My CTR went from 3% to 7.5%. Now getting 100K+ views per video consistently.',
      avatar: '👨',
      metric: '+150% CTR'
    },
    {
      name: 'Lisa K.',
      role: 'Cooking Channel - 85K Subscribers',
      text: 'Title generator transformed my approach. Tested different styles, found what works. Impressions up 65%, now monetized and earning $2K/month!',
      avatar: '👩‍🍳',
      metric: '+65% Impressions'
    }
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} py-12 transition-colors`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className={`text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Loved by Creators Worldwide
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            See what creators are saying about TubeBreakout
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg shadow-lg transition-colors`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {testimonial.name}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} italic mb-3`}>
                "{testimonial.text}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className={`text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {testimonial.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
