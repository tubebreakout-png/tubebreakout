interface TermsOfServiceProps {
  darkMode: boolean;
}

export default function TermsOfService({ darkMode }: TermsOfServiceProps) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 md:p-12 transition-colors`}>
          <h1 className={`text-4xl md:text-5xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Terms of Service
          </h1>

          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
            Last updated: November 2024
          </p>

          <div className="space-y-8">
            <Section darkMode={darkMode} title="1. Agreement to Terms">
              <p>
                By accessing and using TubeBreakout ("the Site"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </Section>

            <Section darkMode={darkMode} title="2. Use License">
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on TubeBreakout for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the site</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                <li>Accessing the services for purposes of building a competitive service</li>
              </ul>
            </Section>

            <Section darkMode={darkMode} title="3. Disclaimer">
              <p>
                The materials on TubeBreakout are provided "as is". TubeBreakout makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </Section>

            <Section darkMode={darkMode} title="4. Limitations">
              <p>
                In no event shall TubeBreakout or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TubeBreakout, even if TubeBreakout or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </Section>

            <Section darkMode={darkMode} title="5. Accuracy of Materials">
              <p>
                The materials appearing on TubeBreakout could include technical, typographical, or photographic errors. TubeBreakout does not warrant that any of the materials on our site are accurate, complete, or current. TubeBreakout may make changes to the materials contained on our site at any time without notice.
              </p>
            </Section>

            <Section darkMode={darkMode} title="6. Materials and Content">
              <p>
                TubeBreakout has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by TubeBreakout of the site. Use of any such linked website is at the user's own risk.
              </p>
            </Section>

            <Section darkMode={darkMode} title="7. Modifications">
              <p>
                TubeBreakout may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </Section>

            <Section darkMode={darkMode} title="8. Governing Law">
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the country where TubeBreakout is operated, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </Section>

            <Section darkMode={darkMode} title="9. User Responsibilities">
              <p>
                You agree to use TubeBreakout in a lawful manner and not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of our site</li>
                <li>Attempt to gain unauthorized access to protected areas of our site</li>
                <li>Post or transmit obscene or offensive content</li>
                <li>Use our tools to violate YouTube's Terms of Service or any other platform's policies</li>
                <li>Engage in harassment, abuse, or violent behavior toward others</li>
              </ul>
            </Section>

            <Section darkMode={darkMode} title="10. Intellectual Property Rights">
              <p>
                Unless otherwise stated, TubeBreakout and/or its licensors own the intellectual property rights for all material on the site. All intellectual property rights are reserved. You may access this for your personal use, subject to restrictions set in these terms and conditions.
              </p>
            </Section>

            <Section darkMode={darkMode} title="11. Third-Party Links and Content">
              <p>
                Our site may contain links to third-party websites, including affiliate links (such as VidIQ). We are not responsible for the content, accuracy, or practices of these external sites. When you click on affiliate links, you may earn us commissions, but this does not affect your pricing.
              </p>
            </Section>

            <Section darkMode={darkMode} title="12. Warranty Disclaimer">
              <p>
                THE MATERIALS ON TUBEBREAKOUT'S WEBSITE ARE PROVIDED ON AN "AS IS" BASIS. TUBEBREAKOUT MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, AND HEREBY DISCLAIMS AND NEGATES ALL OTHER WARRANTIES INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT OF INTELLECTUAL PROPERTY OR OTHER VIOLATION OF RIGHTS.
              </p>
            </Section>

            <Section darkMode={darkMode} title="13. Limitations of Liability">
              <p>
                IN NO EVENT SHALL TUBEBREAKOUT OR ITS SUPPLIERS BE LIABLE FOR ANY DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF DATA OR PROFIT, OR DUE TO BUSINESS INTERRUPTION) ARISING OUT OF THE USE OR INABILITY TO USE THE MATERIALS ON TUBEBREAKOUT'S WEBSITE, EVEN IF TUBEBREAKOUT OR AN AUTHORIZED REPRESENTATIVE HAS BEEN NOTIFIED ORALLY OR IN WRITING OF THE POSSIBILITY OF SUCH DAMAGE.
              </p>
            </Section>

            <Section darkMode={darkMode} title="14. Severability">
              <p>
                If any provision of these terms and conditions is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
              </p>
            </Section>

            <Section darkMode={darkMode} title="15. Contact Information">
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-3">
                <strong>Email:</strong> support@tubebreakout.com
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
