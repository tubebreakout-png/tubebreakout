interface PrivacyPolicyProps {
  darkMode: boolean;
}

export default function PrivacyPolicy({ darkMode }: PrivacyPolicyProps) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 md:p-12 transition-colors`}>
          <h1 className={`text-4xl md:text-5xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Privacy Policy
          </h1>

          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
            Last updated: November 2024
          </p>

          <div className="space-y-8">
            <Section darkMode={darkMode} title="1. Introduction">
              <p>
                TubeBreakout ("we," "our," or "us") operates as a free online toolset for YouTube creators. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our site.
              </p>
            </Section>

            <Section darkMode={darkMode} title="2. Information We Collect">
              <p className="font-semibold mb-3">We collect information in the following ways:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Local Storage Data:</strong> Email addresses for newsletter signup, tool usage history, and preferences (dark mode settings)</li>
                <li><strong>Analytics Data:</strong> Page views, tool usage events, and user interactions through Google Analytics</li>
                <li><strong>Technical Information:</strong> Browser type, IP address, and device information (collected via analytics)</li>
                <li><strong>User Input:</strong> Information you voluntarily enter when using our tools (YouTube URLs, channel data, etc.)</li>
              </ul>
            </Section>

            <Section darkMode={darkMode} title="3. How We Use Your Information">
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>To provide and improve our tools and services</li>
                <li>To send marketing communications (if you opted in to our newsletter)</li>
                <li>To analyze usage patterns and optimize user experience</li>
                <li>To comply with legal obligations</li>
                <li>To prevent fraud and ensure website security</li>
              </ul>
            </Section>

            <Section darkMode={darkMode} title="4. Local Storage and Cookies">
              <p>
                Our website uses browser Local Storage to save your preferences and usage data. This data is stored entirely on your device and is not transmitted to our servers. You can clear this data anytime by clearing your browser's Local Storage.
              </p>
              <p className="mt-3">
                We do not use traditional tracking cookies. However, Google Analytics may set cookies to track your usage patterns across our site.
              </p>
            </Section>

            <Section darkMode={darkMode} title="5. Third-Party Services">
              <p>
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Google Analytics:</strong> To track user interactions and site performance</li>
                <li><strong>VidIQ Affiliate Links:</strong> We may earn commissions through VidIQ affiliate partnerships</li>
                <li><strong>YouTube API:</strong> To fetch publicly available YouTube channel data when you use our tools</li>
              </ul>
              <p className="mt-3">
                These third parties have their own privacy policies governing their data practices. We are not responsible for their policies.
              </p>
            </Section>

            <Section darkMode={darkMode} title="6. Data Security">
              <p>
                We implement appropriate security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </Section>

            <Section darkMode={darkMode} title="7. Email Communications">
              <p>
                If you subscribe to our newsletter, we will send you periodic emails with YouTube growth tips and tool updates. You can unsubscribe at any time by clicking the unsubscribe link in our emails or by clearing your Local Storage data.
              </p>
              <p className="mt-3">
                We will never share your email address with third parties without your consent.
              </p>
            </Section>

            <Section darkMode={darkMode} title="8. Children's Privacy">
              <p>
                Our site is not directed to children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
              </p>
            </Section>

            <Section darkMode={darkMode} title="9. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date above. Your continued use of our site following the posting of revised Privacy Policy means that you accept and agree to the changes.
              </p>
            </Section>

            <Section darkMode={darkMode} title="10. Contact Us">
              <p>
                If you have questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-3">
                <strong>Email:</strong> privacy@tubebreakout.com
              </p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ darkMode, title, children }: { darkMode: boolean; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
        {children}
      </div>
    </div>
  );
}
