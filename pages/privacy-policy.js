import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to our e-commerce website. We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <div className="mb-4">
              <p className="mb-2">We may collect information about you in a variety of ways:</p>
              <ul className="list-disc ml-6 mb-4">
                <li><strong>Personal Information:</strong> Name, email address, shipping address, billing address, phone number, and payment information.</li>
                <li><strong>Account Information:</strong> Username, password, and profile information.</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
                <li><strong>Usage Information:</strong> Pages visited, time spent on site, products viewed, and shopping behavior.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <div className="mb-4">
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc ml-6 mb-4">
                <li>Process and fulfill your orders</li>
                <li>Send you order confirmations and updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and user experience</li>
                <li>Detect and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential. We may also disclose information when required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can set your browser to refuse cookies, but some features of our site may not function properly without them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Payment Security</h2>
            <p className="mb-4">
              All payment transactions are processed through secure payment gateways. We do not store your full credit card information on our servers. Your payment information is encrypted using industry-standard security measures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Your Privacy Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Third-Party Links</h2>
            <p className="mb-4">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us through our contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy

