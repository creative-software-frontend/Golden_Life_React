import React from 'react'
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
      <div className="min-h-screen ">
          {/* Banner Section */}
          <section className="bg-primary-default py-20 m-4 relative">
              <div className="text-center text-white">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Our Privacy Policy Page</h1>
                  {/*  */}
                  <button className="mt-4 px-4 py-2 bg-white text-primary-default rounded-full font-semibold hover:bg-gray-100">
                      Explore Stories
                  </button>
              </div>
          </section>




          {/* Tabs Section */}
          {/* for small screen */}
          <div className='m-4'>
              <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                      Select a tab
                  </label>
                  <select
                      id="tabs"
                      name="tabs"
                      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      defaultValue="Team Members" // Set the default value to the current tab
                  >
                      <option value="My Account">My Account</option>
                      <option value="Company">Company</option>
                      <option value="Team Members">Team Members</option>
                      <option value="Billing">Billing</option>
                  </select>
              </div>

              <div className="hidden sm:block">
                  <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8" aria-label="Tabs">


                          <Link
                              to="/our-story"
                              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                          >
                              Our Story
                          </Link>
                          <Link
                              to='/help'
                              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                          >
                              FAQ
                          </Link>

                          <Link
                              to="/career"
                              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                          >
                              Career
                          </Link>
                          <Link
                              to="/contact"
                              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                          >
                              Contact
                          </Link>
                          <Link
                              to="/privacy-policy"
                              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                          >
                              Privacy Policy
                          </Link>
                          <Link
                              to="/terms"
                              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                          >
                              Terms of use
                          </Link>
                      </nav>
                  </div>
              </div>
          </div>
          <header className="mb-12 text-center">
              <h1 className="text-5xl font-bold mb-4 text-gray-800">Privacy Policy</h1>
              <p className="text-lg text-gray-600">
                  Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
              </p>
          </header>

          {/* Content */}
          <section className="bg-white p-8 shadow-md rounded-lg max-w-4xl mx-auto space-y-8">
              {/* Introduction */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">1. Introduction</h2>
                  <p className="text-gray-700">
                      We are committed to protecting your personal information and your right to privacy. If you have any questions
                      or concerns about this privacy policy or our practices with regard to your personal information, please contact us.
                  </p>
              </div>

              {/* Information We Collect */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">2. Information We Collect</h2>
                  <p className="text-gray-700 mb-4">
                      We collect personal information that you voluntarily provide to us when registering on the website,
                      expressing an interest in obtaining information about us or our products and services, or otherwise
                      contacting us.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>Personal information such as name, email address, and contact details.</li>
                      <li>Data collected automatically, such as IP addresses and browser details.</li>
                  </ul>
              </div>

              {/* How We Use Your Information */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">3. How We Use Your Information</h2>
                  <p className="text-gray-700">
                      We use personal information collected via our website for a variety of business purposes described below:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                      <li>To provide and maintain our services.</li>
                      <li>To contact you and respond to your inquiries.</li>
                      <li>To send marketing and promotional communications.</li>
                  </ul>
              </div>

              {/* Sharing Your Information */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">4. Sharing Your Information</h2>
                  <p className="text-gray-700">
                      We do not share your personal information with third parties without your consent, except as necessary
                      to provide you with our services or to comply with legal obligations.
                  </p>
              </div>

              {/* Security of Your Information */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">5. Security of Your Information</h2>
                  <p className="text-gray-700">
                      We use administrative, technical, and physical security measures to help protect your personal
                      information. However, no electronic transmission over the internet or information storage technology
                      can be guaranteed to be 100% secure.
                  </p>
              </div>

              {/* Your Privacy Rights */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">6. Your Privacy Rights</h2>
                  <p className="text-gray-700">
                      Depending on your location, you may have certain rights regarding your personal information,
                      such as the right to access, update, or delete your personal data.
                  </p>
              </div>

              {/* Contact Information */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">7. Contact Information</h2>
                  <p className="text-gray-700">
                      If you have questions or comments about this policy, you may contact us at:
                  </p>
                  <p className="text-gray-700 font-medium">Email: support@goldenlife.com</p>
                  <p className="text-gray-700 font-medium">Phone: +1 123-456-7890</p>
              </div>
          </section>
          
      </div>
  )
}

export default PrivacyPolicy