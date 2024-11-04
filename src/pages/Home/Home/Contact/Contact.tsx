

const Contact = () => {
  return (
      <div className="min-h-screen ">
        
     
          {/* Hero Section */}
          <section className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 text-gray-800">Get in Touch</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  We would love to hear from you. Whether you have a question, feedback, or just want to say hello,
                  reach out to us and we'll get back to you as soon as possible.
              </p>
          </section>

          {/* Contact Form */}
          <section className="bg-white p-8 shadow-md rounded-lg max-w-2xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">Contact Us</h2>
              <form className="space-y-6">
                  {/* Name Input */}
                  <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                      <input
                          type="text"
                          id="name"
                          placeholder="Your Name"
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>

                  {/* Email Input */}
                  <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                      <input
                          type="email"
                          id="email"
                          placeholder="Your Email"
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>

                  {/* Subject Input */}
                  <div>
                      <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                      <input
                          type="text"
                          id="subject"
                          placeholder="Subject"
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                  </div>

                  {/* Message Input */}
                  <div>
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                      <textarea
                          id="message"
                          placeholder="Your Message"
                          rows={5}
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div>
                      <button
                          type="submit"
                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                      >
                          Send Message
                      </button>
                  </div>
              </form>
          </section>

          {/* Contact Information */}
          <section className="mt-12 text-center">
              <h2 className="text-3xl font-semibold mb-4 text-gray-800">Other Ways to Reach Us</h2>
              <p className="text-lg text-gray-600 mb-6">You can also contact us through the following channels:</p>
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="flex items-center justify-center bg-gray-200 p-4 rounded-lg">
                      <p className="text-gray-800">
                          <strong>Phone:</strong> +1 123-456-7890
                      </p>
                  </div>
                  <div className="flex items-center justify-center bg-gray-200 p-4 rounded-lg">
                      <p className="text-gray-800">
                          <strong>Email:</strong> support@goldenlife.com
                      </p>
                  </div>
                  <div className="flex items-center justify-center bg-gray-200 p-4 rounded-lg">
                      <p className="text-gray-800">
                          <strong>Address:</strong> 123 Golden Life Street, City, Country
                      </p>
                  </div>
              </div>
          </section>

      </div>
  )
}

export default Contact