/* eslint-disable */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-sm text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-semibold mt-6">1. Introduction</h2>
          <p>
            Dean Goldsteen ("we", "us", or "our") operates the Dean Goldsteen
            Directory website (the "Service"). This page informs you of our
            policies regarding the collection, use, and disclosure of personal
            data when you use our Service and the choices you have associated
            with that data.
          </p>

          <h2 className="text-2xl font-semibold mt-6">
            2. Information Collection and Use
          </h2>
          <p>
            We collect several different types of information for various
            purposes to provide and improve our Service to you.
          </p>

          <h3 className="text-xl font-semibold mt-4">
            Types of Data Collected
          </h3>
          <h4 className="text-lg font-semibold mt-2">Personal Data</h4>
          <p>
            While using our Service, we may ask you to provide us with certain
            personally identifiable information that can be used to contact or
            identify you ("Personal Data"). Personally identifiable information
            may include, but is not limited to:
          </p>
          <ul className="list-disc pl-6">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Cookies and Usage Data</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">3. Use of Data</h2>
          <p>Dean Goldsteen uses the collected data for various purposes:</p>
          <ul className="list-disc pl-6">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>
              To allow you to participate in interactive features of our Service
              when you choose to do so
            </li>
            <li>To provide customer support</li>
            <li>
              To gather analysis or valuable information so that we can improve
              our Service
            </li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">4. Transfer of Data</h2>
          <p>
            Your information, including Personal Data, may be transferred to —
            and maintained on — computers located outside of your state,
            province, country or other governmental jurisdiction where the data
            protection laws may differ from those of your jurisdiction.
          </p>

          <h2 className="text-2xl font-semibold mt-6">5. Disclosure of Data</h2>
          <p>
            Dean Goldsteen may disclose your Personal Data in the good faith
            belief that such action is necessary to:
          </p>
          <ul className="list-disc pl-6">
            <li>To comply with a legal obligation</li>
            <li>
              To protect and defend the rights or property of Dean Goldsteen
            </li>
            <li>
              To prevent or investigate possible wrongdoing in connection with
              the Service
            </li>
            <li>
              To protect the personal safety of users of the Service or the
              public
            </li>
            <li>To protect against legal liability</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">6. Security of Data</h2>
          <p>
            The security of your data is important to us but remember that no
            method of transmission over the Internet or method of electronic
            storage is 100% secure. While we strive to use commercially
            acceptable means to protect your Personal Data, we cannot guarantee
            its absolute security.
          </p>

          <h2 className="text-2xl font-semibold mt-6">7. Your Rights</h2>
          <p>
            Dean Goldsteen aims to take reasonable steps to allow you to
            correct, amend, delete, or limit the use of your Personal Data. If
            you wish to be informed about what Personal Data we hold about you
            and if you want it to be removed from our systems, please contact
            us.
          </p>

          <h2 className="text-2xl font-semibold mt-6">
            8. Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
            We will let you know via email and/or a prominent notice on our
            Service, prior to the change becoming effective and update the
            "effective date" at the top of this Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-6">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us:
          </p>
          <ul className="list-disc pl-6">
            <li>By email: deangoldsteen@yahoo.com</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
