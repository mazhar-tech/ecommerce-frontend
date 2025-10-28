import React from 'react'

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl px-4">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing or using our website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily use and download one copy of the materials on our website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Products and Pricing</h2>
            <p className="mb-4">
              We reserve the right to modify prices and product availability at any time. All prices are subject to change without notice. We make every effort to display product information accurately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Orders and Payment</h2>
            <p className="mb-4">
              When you place an order, you are making an offer to purchase products. We reserve the right to accept or decline your order. We accept various payment methods and all payments are processed securely.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Shipping and Delivery</h2>
            <p className="mb-4">
              We will make every effort to ship your order within the estimated time frame. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
            <p className="mb-4">
              Please review our return policy. Eligible items may be returned within 30 days of purchase. Items must be in original condition with tags attached. We reserve the right to refuse returns that do not meet our policy requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p className="mb-4">
              The content, logos, and images on this website are protected by copyright and trademark laws. You may not reproduce, distribute, or use our intellectual property without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              Our website and products are provided &quot;as is&quot; without warranties of any kind. We shall not be liable for any damages arising from the use of our website or products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with applicable laws. Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms and Conditions at any time. Your continued use of the website after changes are posted constitutes acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms and Conditions, please contact us through our contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions

