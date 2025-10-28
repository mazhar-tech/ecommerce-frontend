import React from 'react'

const Contact = () => {
  return (
    <div className="container mx-auto py-8 max-w-7xl px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-4">
            We&apos;d love to hear from you! If you have any questions, concerns, or feedback, please don&apos;t hesitate to contact us.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-600">info@yourstore.com</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Address</h3>
            <p className="text-gray-600">123 Shopping Street</p>
            <p className="text-gray-600">City, State 12345</p>
            <p className="text-gray-600">Country</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Business Hours</h3>
            <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
            <p className="text-gray-600">Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

