import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import Footer from '@/pages/common/Footer/Footer';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: "What's the capital of Switzerland?",
    answer:
      "The capital of Switzerland is Bern. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: "What languages are spoken in Switzerland?",
    answer:
      "Switzerland has four official languages: German, French, Italian, and Romansh.",
  },
  {
    question: "What is the currency of Switzerland?",
    answer:
      "The currency of Switzerland is the Swiss Franc (CHF).",
  },
  {
    question: "What is Swiss cheese?",
    answer:
      "Swiss cheese is a generic term for several cheese varieties that are produced in Switzerland.",
  },
  {
    question: "What is the Swiss Alps?",
    answer:
      "The Swiss Alps are a mountain range located in Switzerland known for their stunning beauty and skiing opportunities.",
  },
];

const tabs = [
  { name: 'My Account', href: '#', current: false },
  { name: 'Company', href: '#', current: false },
  { name: 'Team Members', href: '#', current: true },
  { name: 'Billing', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const HelpSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClear = () => {
    setSearchTerm('');
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <section className="bg-primary-default py-16 m-4">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">How Can We Help You?</h2>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type keywords to find an answer"
              className="w-full px-4 py-2 rounded-full border-2 border-white text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-green-500"
              >
                <XCircle size={24} />
              </button>
            )}
          </div>
          <button className="mt-4 px-4 py-2 bg-white text-primary-default rounded-full font-semibold hover:bg-gray-100">
            All
          </button>
        </div>
      </section>

      {/* Tabs Section */}
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
                to="my-account"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-lg font-medium"
              >
                My Account
              </Link>

              <Link
                to="company"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-lg font-medium"
              >
                Company
              </Link>

              <Link
                to="team-members"
                className="border-primary-default text-primary-default text-lg font-semibold whitespace-nowrap border-b-2 py-4 px-1 font-medium"
                aria-current="page"
              >
                Team Members
              </Link>

              <Link
                to="billing"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-lg font-medium"
              >
                Billing
              </Link>
            </nav>
          </div>
        </div>
      </div>


      {/* FAQ Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-4xl font-bold leading-10 tracking-tight text-gray-900">Frequently Asked Questions</h2>
            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              {filteredFaqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                          <span className="text-base font-semibold leading-7">{faq.question}</span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            ) : (
                              <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                            )}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpSection;
