import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';

interface BlogArticleProps {
  darkMode: boolean;
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  date: string;
  content: {
    section: string;
    paragraphs: string[];
  }[];
}

export default function BlogArticle({ darkMode }: BlogArticleProps) {
  const { slug } = useParams<{ slug: string }>();

  const articles: Record<string, Article> = {
    'how-to-read-youtube-cpm': {
      slug: 'how-to-read-youtube-cpm',
      title: 'How to Read and Understand Your YouTube CPM',
      excerpt: 'Discover what your CPM really means, why it varies, and how to optimize it to maximize your YouTube revenue.',
      category: 'Monetization',
      readTime: '5 min',
      image: '💰',
      date: 'November 28, 2025',
      content: [
        {
          section: 'What is CPM?',
          paragraphs: [
            'CPM (Cost Per Mille) represents the amount advertisers pay for 1,000 ad impressions on your videos. It\'s one of the most important metrics for understanding your YouTube revenue.',
            'Your CPM varies based on several factors: your audience\'s location, their age, your content niche, the season, and advertiser demand.',
            'A "good" CPM depends on your niche. Gaming channels: $2-5. Finance/Business: $10-25. Tech: $5-15. Lifestyle/Vlogs: $3-8.'
          ]
        },
        {
          section: 'RPM vs CPM: The Critical Difference',
          paragraphs: [
            'CPM is what advertisers pay. RPM (Revenue Per Mille) is what YOU actually earn after YouTube takes its 45% cut.',
            'If your CPM is $10, your RPM will be around $5.50. RPM is the metric that truly matters for your earnings.',
            'Always focus on your RPM when calculating potential revenue, not your CPM.'
          ]
        },
        {
          section: 'How to Increase Your CPM',
          paragraphs: [
            'Target high-value niches: Finance, technology, business, and real estate content typically have higher CPMs.',
            'Create longer videos (8+ minutes) to include mid-roll ads. This can significantly boost your revenue.',
            'Optimize for valuable demographics: US, UK, Canada, Australia audiences have the highest CPMs.',
            'Upload during peak seasons: November-December (holiday season) often sees 30-50% higher CPMs.',
            'Build an engaged audience: Higher watch time and engagement = better ad placements = higher CPM.'
          ]
        }
      ]
    },
    '5-steps-1000-subscribers': {
      slug: '5-steps-1000-subscribers',
      title: 'The 5 Steps to Reach 1000 Subscribers Quickly',
      excerpt: 'Complete guide to reach the YouTube monetization threshold. Proven strategies from hundreds of creators.',
      category: 'Growth',
      readTime: '8 min',
      image: '📈',
      date: 'November 27, 2025',
      content: [
        {
          section: 'Step 1: Find Your Specific Niche',
          paragraphs: [
            'Don\'t be a generalist. Choose a specific niche where you can become an authority. "Gaming" is too broad. "Minecraft redstone tutorials" is specific.',
            'Your niche should combine: something you\'re passionate about, something you know well, and something people are searching for.',
            'Use YouTube search autocomplete and our Tag Generator to find popular topics with less competition.'
          ]
        },
        {
          section: 'Step 2: Create Compelling Thumbnails',
          paragraphs: [
            'Your thumbnail is the most important factor for getting clicks. Spend as much time on thumbnails as you do on editing.',
            'Winning thumbnail formula: Clear focal point (face or main element), High contrast colors, Large text (3-5 words max), Consistent branding.',
            'Test different thumbnail styles and analyze what works best for your audience.'
          ]
        },
        {
          section: 'Step 3: Master Your First 30 Seconds',
          paragraphs: [
            'The first 30 seconds determine if viewers stay or leave. Hook them immediately with a problem or promise.',
            'Don\'t waste time with long intros, subscribe requests, or channel updates. Get straight to the value.',
            'Pattern that works: 1) Hook (0-5s), 2) Promise what they\'ll learn (5-15s), 3) Start delivering value (15-30s).'
          ]
        },
        {
          section: 'Step 4: Optimize for YouTube Search',
          paragraphs: [
            'Use keyword-rich titles that people actually search for. Your title should be clear, not clever.',
            'Write comprehensive descriptions (300+ words) with your keywords naturally included 3-4 times.',
            'Tags still matter for small channels. Use our Tag Generator to find the best tags for your content.'
          ]
        },
        {
          section: 'Step 5: Engage With Your Community',
          paragraphs: [
            'Reply to every comment in your first hour after uploading. This signals to YouTube that your video drives engagement.',
            'Create content that encourages discussion. End videos with a question. Use polls and community posts.',
            'Be consistent. Upload on a regular schedule so subscribers know when to expect new content.',
            'Realistically, reaching 1000 subscribers takes 3-6 months of consistent effort. Don\'t get discouraged. Focus on improving each video.'
          ]
        }
      ]
    },
    'optimize-youtube-titles-ctr': {
      slug: 'optimize-youtube-titles-ctr',
      title: 'How to Optimize Your YouTube Titles for Maximum CTR',
      excerpt: 'The secrets of high click-through rate titles. Formulas, powerful keywords, and mistakes to absolutely avoid.',
      category: 'Optimization',
      readTime: '6 min',
      image: '🎯',
      date: 'November 26, 2025',
      content: [
        {
          section: 'Why Your Title Matters More Than Ever',
          paragraphs: [
            'Your title accounts for 50% of whether someone clicks your video. The thumbnail is the other 50%.',
            'A good title does 3 things: 1) Contains searchable keywords, 2) Creates curiosity or urgency, 3) Sets clear expectations.',
            'Average CTR by subscriber status: Non-subscribers: 2-4%, Subscribers: 8-12%. Your title needs to work for both groups.'
          ]
        },
        {
          section: 'Proven Title Formulas',
          paragraphs: [
            'How to [Achieve Desired Result] Without [Common Problem]: "How to Gain 1000 Subscribers Without Spending Money"',
            '[Number] Ways to [Achieve Result]: "7 Ways to Double Your YouTube Views"',
            'I Tried [Challenge] For [Time Period] - Here\'s What Happened: "I Posted Daily For 30 Days - Here\'s What Happened"',
            'Why [Popular Thing] is Actually [Unexpected Opinion]: "Why Most YouTube Advice is Actually Hurting Your Channel"',
            'The [Adjective] Guide to [Topic]: "The Complete Guide to YouTube SEO in 2025"'
          ]
        },
        {
          section: 'Power Words That Increase CTR',
          paragraphs: [
            'Trigger words: Revealed, Secret, Exposed, Truth, Reality, Confession, Shocking',
            'Value words: Complete, Ultimate, Essential, Perfect, Best, Proven, Guaranteed',
            'Time-sensitive words: Now, Today, 2025, New, Latest, Updated',
            'Emotion words: Amazing, Incredible, Unbelievable, Stunning, Brilliant',
            'Use 1-2 power words per title. More than that looks spammy and reduces trust.'
          ]
        },
        {
          section: 'Common Title Mistakes',
          paragraphs: [
            'MISTAKE #1: Clickbait that doesn\'t deliver. This kills your watch time and destroys your channel long-term.',
            'MISTAKE #2: Being too clever or vague. "The Journey Begins" tells viewers nothing. "How I Gained 10K Subscribers in 60 Days" is clear.',
            'MISTAKE #3: Keyword stuffing. "YouTube Tips YouTube Tricks YouTube Growth YouTube Algorithm" looks terrible and doesn\'t work.',
            'MISTAKE #4: Titles over 60 characters. They get cut off on mobile. Keep it under 60 characters for full visibility.',
            'MISTAKE #5: Not A/B testing. Change your title if the video isn\'t performing after 48 hours. The algorithm allows this.'
          ]
        }
      ]
    },
    'youtube-tags-2025': {
      slug: 'youtube-tags-2025',
      title: 'Are YouTube Tags Still Important in 2025?',
      excerpt: 'The truth about the importance of tags in 2025. How to use them effectively with the new algorithm rules.',
      category: 'SEO',
      readTime: '5 min',
      image: '🏷️',
      date: 'November 25, 2025',
      content: [
        {
          section: 'The Truth About Tags in 2025',
          paragraphs: [
            'Yes, tags are still important, BUT less than before. YouTube now relies more on title, description, and automatic captions to understand your content.',
            'However, tags still play a role for: 1) Correcting spelling mistakes, 2) Helping suggested videos, 3) Improving ranking for small channels.',
            'For large channels (100K+), tag impact is minimal. For small channels (< 10K), they can still make a difference.'
          ]
        },
        {
          section: 'How to Use Tags Correctly',
          paragraphs: [
            'Tag #1: Your exact keyphrase (from your title). Ex: "how to make money on youtube"',
            'Tags 2-5: Variations of your main keyword. Ex: "make money youtube", "youtube monetization", "youtube revenue"',
            'Tags 6-10: More specific niche keywords. Ex: "youtube cpm france", "youtube adsense"',
            'Tags 11-15: Broad context. Ex: "youtube", your channel name, series name if applicable',
            'Total: 10-15 tags maximum. More is NOT better - it dilutes your message.'
          ]
        },
        {
          section: 'What Really Matters in 2025',
          paragraphs: [
            'Prioritize your title: 60% of SEO impact. Keyword at the beginning, clear, attractive.',
            'Detailed description: 300-500 words with your keyword naturally repeated 3-4 times.',
            'Initial engagement: The first 30 seconds determine if YouTube pushes your video.',
            'Audience retention: The most important metric. Keep people watching until the end.',
            'Tags? A 5-10% bonus, no more. Don\'t spend 30 minutes on them - use our Tag Generator!'
          ]
        }
      ]
    },
    'youtube-thumbnail-design': {
      slug: 'youtube-thumbnail-design',
      title: 'Create YouTube Thumbnails That Attract Clicks',
      excerpt: 'Complete thumbnail design guide: colors, text, composition. With before/after examples from successful channels.',
      category: 'Design',
      readTime: '10 min',
      image: '🎨',
      date: 'November 24, 2025',
      content: [
        {
          section: 'Why Thumbnails Are 50% of Your Success',
          paragraphs: [
            'Your thumbnail is the first thing people see. A great video with a bad thumbnail will fail. An average video with an amazing thumbnail will succeed.',
            'Research shows viewers decide whether to click in less than 2 seconds. Your thumbnail must instantly communicate what your video offers.',
            'Top YouTubers spend 2-4 hours designing each thumbnail. It\'s not wasted time - it\'s the most important marketing you\'ll do.'
          ]
        },
        {
          section: 'The Anatomy of a High-CTR Thumbnail',
          paragraphs: [
            'Element #1: A Clear Focal Point. Use a human face showing strong emotion, or one dominant object. Multiple competing elements confuse the eye.',
            'Element #2: High Contrast Colors. Use complementary colors (yellow/purple, red/green, blue/orange). Avoid muddy middle tones.',
            'Element #3: Large, Bold Text. 3-5 words maximum. Font size must be readable on a phone screen. Test at thumbnail size before publishing.',
            'Element #4: Bright Lighting. Dark thumbnails perform 30-40% worse. Increase exposure and vibrance, even if it looks slightly unrealistic.',
            'Element #5: Negative Space. Don\'t fill every pixel. Leave breathing room around your main elements for visual clarity.'
          ]
        },
        {
          section: 'Color Psychology That Drives Clicks',
          paragraphs: [
            'Red: Urgency, excitement, energy. Perfect for challenges, reactions, urgent news. Most eye-catching color on YouTube.',
            'Yellow: Optimism, curiosity, attention. Great for tutorials, positive content, beginner guides. High visibility.',
            'Blue: Trust, calm, authority. Ideal for educational content, tech reviews, professional topics.',
            'Green: Growth, wealth, health. Works well for finance, fitness, environmental content.',
            'Use 2-3 colors maximum. More creates visual chaos. One dominant color, one accent, one neutral (black/white).'
          ]
        },
        {
          section: 'Text Best Practices',
          paragraphs: [
            'Keep it to 3-5 words that complement your title, not repeat it. If your title is "How to Make Money on YouTube", your thumbnail text could be "Earn $5K/Month".',
            'Use thick, bold fonts like Impact, Montserrat Black, or Futura Bold. Thin fonts disappear at small sizes.',
            'Add a stroke or shadow to make text pop against any background. 3-5px white stroke on dark text, or black stroke on light text.',
            'Test readability at 320x180px (mobile thumbnail size). If you can\'t read it easily, make the text bigger or use fewer words.',
            'Avoid: ALL CAPS (looks spammy), script fonts (unreadable), gradients on text (reduces contrast), more than 2 font colors.'
          ]
        },
        {
          section: 'Facial Expressions That Work',
          paragraphs: [
            'Shock/Surprise: Raised eyebrows, open mouth. Perfect for reaction videos, unexpected results, controversial topics.',
            'Pointing/Directing: Creates curiosity, implies there\'s something important to see. Works for tutorials and revelations.',
            'Smiling/Excited: Builds positive association, good for upbeat content, vlogs, celebrations.',
            'Serious/Intense: Establishes authority, perfect for important announcements, deep dives, serious topics.',
            'The face should be large - at least 30% of thumbnail height. Small faces have no emotional impact.'
          ]
        },
        {
          section: 'Tools and Workflow',
          paragraphs: [
            'Canva (Free): Best for beginners. Pre-made templates, easy to use, cloud-based.',
            'Photoshop: Professional standard. More control, better quality, steeper learning curve.',
            'Figma (Free): Great middle ground. Modern interface, collaborative, web-based.',
            'Mobile Apps: Thumbnail Maker, Phonto. Good for quick edits on the go.',
            'Workflow: 1) Take high-res photo (good lighting!), 2) Remove background if needed, 3) Add bold colors/effects, 4) Add text last, 5) Test at small size, 6) Export as 1280x720px.'
          ]
        },
        {
          section: 'A/B Testing Your Thumbnails',
          paragraphs: [
            'YouTube now allows you to test up to 3 thumbnails automatically. Use this feature - it can increase CTR by 20-50%.',
            'Create 3 versions with different: 1) Facial expressions, 2) Text variations, 3) Color schemes.',
            'Let them run for at least 7 days and 1,000 impressions each before declaring a winner.',
            'For older videos: If CTR is below 4%, try a new thumbnail. The algorithm allows changes, and a better thumbnail can revive an old video.'
          ]
        }
      ]
    },
    'youtube-monetization-requirements': {
      slug: 'youtube-monetization-requirements',
      title: 'YouTube Monetization: Everything You Need to Know',
      excerpt: 'Official criteria, approval times, tips to accelerate your progress toward the YouTube Partner Program.',
      category: 'Monetization',
      readTime: '7 min',
      image: '✅',
      date: 'November 23, 2025',
      content: [
        {
          section: 'The Official Requirements',
          paragraphs: [
            'To join the YouTube Partner Program (YPP) and start earning money, you need to meet these requirements:',
            '1. At least 1,000 subscribers. This proves you have an engaged audience.',
            '2. 4,000 valid watch hours in the past 12 months OR 10 million Shorts views in the past 90 days.',
            '3. Live in a country where YPP is available (120+ countries currently).',
            '4. Have no active Community Guidelines strikes on your channel.',
            '5. Have 2-step verification enabled on your Google Account.',
            '6. Have an active AdSense account linked to your channel.'
          ]
        },
        {
          section: 'What Counts as "Watch Time"',
          paragraphs: [
            'Only PUBLIC video watch time counts. Private, unlisted, deleted videos, and live streams don\'t count toward the 4,000 hours.',
            'Ads and YouTube Premium viewer time both count. The source doesn\'t matter - embedded views, suggested videos, search - all count equally.',
            'Repeated views from the same user count, but spam or artificial inflation will disqualify you.',
            'The 12-month window is rolling - it\'s not calendar year. YouTube constantly recalculates as older videos age out.'
          ]
        },
        {
          section: 'The Application Process',
          paragraphs: [
            'Step 1: Hit the requirements and apply through YouTube Studio > Monetization.',
            'Step 2: Accept the YouTube Partner Program terms.',
            'Step 3: Sign up for Google AdSense (or connect existing account).',
            'Step 4: Wait for review. YouTube checks for compliance with policies and guidelines.',
            'Review time: Typically 1-4 weeks, but can take up to 1 month during busy periods. You\'ll get an email when the decision is made.',
            'If approved: Ads start running immediately. You\'ll see earnings in YouTube Studio within 24-48 hours.',
            'If rejected: You can reapply after 30 days. YouTube will tell you the reason for rejection.'
          ]
        },
        {
          section: 'Common Rejection Reasons',
          paragraphs: [
            'Reused content: Compilations, slideshows with stock footage, commentary over others\' content without significant original value.',
            'Duplicate content: Uploading the same video multiple times, or content that appears on multiple channels.',
            'Copyright issues: Using copyrighted music, video clips, or images without permission or fair use.',
            'Low-quality content: Clickbait, misleading metadata, poor production quality, spam.',
            'Inactivity: Channels that haven\'t uploaded in 6+ months, or have very few videos despite high metrics (purchased views/subs).',
            'If rejected, fix the issues and reapply in 30 days. Most creators get approved on the second attempt.'
          ]
        },
        {
          section: 'How Much Money Can You Make',
          paragraphs: [
            'Your earnings depend on CPM (cost per 1,000 impressions), which varies wildly by niche, audience location, and season.',
            'Average CPM ranges: Gaming $2-5, Lifestyle $3-8, Tech $5-15, Finance/Business $10-30.',
            'RPM (what you actually earn) is typically 40-55% of CPM after YouTube\'s cut.',
            'Real examples: Channel with 100K views/month in tech niche: $500-1,500/month. Gaming channel with same views: $200-500/month.',
            'Don\'t rely solely on AdSense. Successful creators diversify: sponsorships, merchandise, memberships, affiliate marketing.'
          ]
        },
        {
          section: 'Alternative Monetization Options',
          paragraphs: [
            'Before hitting YPP requirements, you can still make money:',
            'Affiliate Marketing: Promote products in descriptions. Amazon Associates, tech affiliates, course platforms.',
            'Sponsorships: Brands will work with small channels (5K+ subs) if you have an engaged niche audience.',
            'Channel Memberships: Once you hit 500-1,000 subscribers (varies by country), you can offer paid memberships.',
            'Super Thanks: Viewers can tip you on videos. Available at 1,000 subscribers in eligible countries.',
            'Merchandise: Use YouTube\'s merch shelf or external platforms like Teespring once you have 10K+ subscribers.'
          ]
        },
        {
          section: 'Tips to Get Monetized Faster',
          paragraphs: [
            'Focus on watch time, not just views. Longer videos (8-15 minutes) help accumulate hours faster.',
            'Create binge-worthy playlists. End screens and cards that lead to more videos keep viewers watching.',
            'Target search-friendly topics. Evergreen content (tutorials, guides, how-tos) continues earning watch time for months.',
            'Upload consistently. 2-3 videos per week is the sweet spot for most creators. Consistency signals reliability to both viewers and the algorithm.',
            'Engage your audience. Reply to comments, create community posts, ask for video ideas. Engagement improves rankings and watch time.',
            'Use our Revenue Calculator to track your progress and estimate when you\'ll hit monetization thresholds!'
          ]
        }
      ]
    }
  };

  const article = slug ? articles[slug] : null;

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className={`inline-flex items-center gap-2 mb-8 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{article.image}</div>
          <div className="flex items-center justify-center gap-4 mb-4 text-sm">
            <span className={`px-3 py-1 rounded-full font-semibold ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
              {article.category}
            </span>
            <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Clock className="w-4 h-4" />
              {article.readTime}
            </span>
            <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Calendar className="w-4 h-4" />
              {article.date}
            </span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {article.title}
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {article.excerpt}
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 mb-8 shadow-lg transition-colors`}>
          {article.content.map((section, index) => (
            <div key={index} className="mb-8 last:mb-0">
              <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {section.section}
              </h2>
              {section.paragraphs.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed mb-4 last:mb-0`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg mb-8 transition-colors`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Share this article
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Help other creators by sharing these tips
              </p>
            </div>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-r from-red-900 to-red-800' : 'bg-gradient-to-r from-red-600 to-red-700'} rounded-2xl p-8 text-center transition-colors`}>
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Action?
          </h2>
          <p className="text-red-100 text-lg mb-6">
            Use our free tools to apply these strategies to your channel
          </p>
          <Link
            to="/"
            className="bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-block"
          >
            Explore Our Tools
          </Link>
        </div>
      </article>
    </div>
  );
}
