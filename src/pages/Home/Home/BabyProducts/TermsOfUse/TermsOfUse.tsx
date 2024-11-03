import React from 'react'
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
      <div className="min-h-screen ">
          {/* Banner Section */}
          <section className="bg-primary-default py-20 m-4 relative">
              <div className="text-center text-white">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Our Terms Of Use Page</h1>
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
          {/* Header */}
          <header className="mb-12 text-center">
              <h1 className="text-5xl font-bold mb-4 text-gray-800">Terms of Use</h1>
              <p className="text-lg text-gray-600">
                  Please read these terms of use carefully before using our services.
              </p>
          </header>

          {/* Content */}
          <section className="bg-white p-8 shadow-md rounded-lg max-w-4xl mx-auto space-y-8">
              {/* Acceptance of Terms */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">1. Acceptance of Terms</h2>
                  <p className="text-gray-700">
                      By accessing or using our website and services, you agree to be bound by these terms. If you do not agree,
                      please do not use our website.
                  </p>
              </div>

              {/* Changes to Terms */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">2. Changes to Terms</h2>
                  <p className="text-gray-700">
                      We reserve the right to modify these terms at any time. It is your responsibility to review these terms
                      periodically for any changes. Continued use of the site after any changes constitutes acceptance of those changes.
                  </p>
              </div>

              {/* Use of Services */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">3. Use of Services</h2>
                  <p className="text-gray-700">
                      You agree to use our website and services only for lawful purposes. You are prohibited from violating or
                      attempting to violate the security of the site, including accessing data not intended for you or attempting to
                      interfere with service to any user.
                  </p>
              </div>

              {/* User Conduct */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">4. User Conduct</h2>
                  <p className="text-gray-700">
                      You agree not to upload, post, or otherwise distribute any content that is unlawful, defamatory, abusive,
                      or otherwise objectionable as determined by us. We reserve the right to remove any content that violates
                      these terms or is deemed inappropriate at our discretion.
                  </p>
              </div>

              {/* Intellectual Property */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">5. Intellectual Property</h2>
                  <p className="text-gray-700">
                      All content, trademarks, service marks, and logos are owned by or licensed to us. You may not use any of
                      these materials without our prior written consent.
                  </p>
              </div>

              {/* Limitation of Liability */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">6. Limitation of Liability</h2>
                  <p className="text-gray-700">
                      We are not liable for any indirect, incidental, special, or consequential damages arising out of or in
                      connection with your use of the website or services.
                  </p>
              </div>

              {/* Governing Law */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">7. Governing Law</h2>
                  <p className="text-gray-700">
                      These terms are governed by and construed in accordance with the laws of [Your Country/State], without regard
                      to its conflict of law principles.
                  </p>
              </div>

              {/* Contact Information */}
              <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800">8. Contact Information</h2>
                  <p className="text-gray-700">
                      If you have any questions or concerns regarding these terms, please contact us at:
                  </p>
                  <p className="text-gray-700 font-medium">Email: support@goldenlife.com</p>
                  <p className="text-gray-700 font-medium">Phone: +1 123-456-7890</p>
              </div>
          </section>
          
      </div>
  )
}

export default TermsOfUse