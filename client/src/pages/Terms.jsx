import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Terms & Conditions</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-8 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
              <p>By creating an account or using EduVerse, you agree to these Terms & Conditions and our Privacy Policy.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Accounts</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>You are responsible for the accuracy of the information provided.</li>
                <li>Keep your login credentials secure and do not share them.</li>
                <li>We may suspend or terminate accounts that violate these terms.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Courses and Content</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Course content is provided by instructors. EduVerse does not guarantee specific outcomes.</li>
                <li>Do not redistribute, resell, or share paid content without permission.</li>
                <li>We may remove content that violates intellectual property or community standards.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Payments</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Payments are processed securely via Razorpay. Prices are shown in INR unless stated otherwise.</li>
                <li>Taxes and fees may apply. Ensure your payment details are correct before checkout.</li>
                <li>Refunds, if any, are governed by our Refund Policy (contact support for assistance).</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. User Conduct</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Do not post harmful, illegal, or abusive content.</li>
                <li>Respect instructors, learners, and staff. Harassment is prohibited.</li>
                <li>Do not attempt to breach the security or integrity of our systems.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Intellectual Property</h2>
              <p>All trademarks, logos, and platform content are the property of their respective owners. You receive a limited license to access content for personal, non-commercial use.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Privacy</h2>
              <p>We process personal data according to our Privacy Policy. We use cookies and httpOnly tokens for security and session management.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">8. Changes to Terms</h2>
              <p>We may update these terms from time to time. Continued use of the platform constitutes acceptance of the updated terms.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">9. Contact</h2>
              <p>Questions? Contact support at <a className="text-primary-600 hover:underline" href="mailto:support@eduverse.local">support@eduverse.local</a>.</p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
