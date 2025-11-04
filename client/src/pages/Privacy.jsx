import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-8 space-y-8 text-gray-700 dark:text-gray-200">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Introduction</h2>
              <p className="mt-2">This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using the service, you agree to the collection and use of information in accordance with this policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Information We Collect</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Account data: name, email, role (student/teacher/admin).</li>
                <li>Course data: enrollments, progress, content interactions.</li>
                <li>Payment data: order identifiers and amounts (processed by payment providers).</li>
                <li>Technical data: device, browser, IP address, and usage logs.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. How We Use Information</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Provide and improve the platform and services.</li>
                <li>Process enrollments and payments.</li>
                <li>Communicate service updates, support, and relevant content.</li>
                <li>Ensure security, prevent fraud, and comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Sharing of Information</h2>
              <p className="mt-2">We do not sell personal information. We may share data with service providers (e.g., payment gateways, cloud storage) under appropriate confidentiality and security commitments, or if required by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Data Security</h2>
              <p className="mt-2">We implement reasonable technical and organizational measures to protect your data. However, no method of transmission or storage is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Your Choices</h2>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Access/update your account information in Profile.</li>
                <li>Request deletion of your account by contacting support.</li>
                <li>Control marketing communications by opting out of non-essential emails.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Childrens Privacy</h2>
              <p className="mt-2">Our services are not directed to children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete it.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">8. International Transfers</h2>
              <p className="mt-2">Your information may be transferred to and processed in countries other than your own, where data protection laws may differ.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">9. Changes to This Policy</h2>
              <p className="mt-2">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">10. Contact Us</h2>
              <p className="mt-2">If you have any questions about this Privacy Policy or your data, contact us at <a href="mailto:sridharcurious135@gmail.com" className="text-primary-600">sridharcurious135@gmail.com</a>.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
