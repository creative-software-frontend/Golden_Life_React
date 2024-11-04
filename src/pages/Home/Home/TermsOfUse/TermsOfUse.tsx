

const TermsOfUse = () => {
  return (
      <div className="min-h-screen ">

          
      
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