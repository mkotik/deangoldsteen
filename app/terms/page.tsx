import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <h2 className="text-2xl font-semibold mt-6">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the Dean Goldsteen website and services, you
            agree to comply with and be bound by these Terms of Service. If you
            do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-semibold mt-6">
            2. Description of Service
          </h2>
          <p>
            Dean Goldsteen provides a platform for users to find and list open
            mic events. We do not organize, host, or manage these events
            directly.
          </p>

          <h2 className="text-2xl font-semibold mt-6">
            3. User Responsibilities
          </h2>
          <ul className="list-disc pl-6">
            <li>
              Provide accurate and up-to-date information when listing events.
            </li>
            <li>Respect the intellectual property rights of others.</li>
            <li>Do not use the service for any unlawful purposes.</li>
            <li>
              Do not attempt to gain unauthorized access to any part of the
              service.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">4. Content Ownership</h2>
          <p>
            Users retain ownership of the content they submit. By posting
            content, you grant Dean Goldsteen a non-exclusive, worldwide,
            royalty-free license to use, display, and distribute your content in
            connection with the service.
          </p>

          <h2 className="text-2xl font-semibold mt-6">
            5. Limitation of Liability
          </h2>
          <p>
            Dean Goldsteen is not responsible for the actions, content,
            information, or data of third parties. We are not liable for any
            indirect, incidental, special, consequential, or punitive damages.
          </p>

          <h2 className="text-2xl font-semibold mt-6">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time.
            We will notify users of any significant changes via email or through
            the website.
          </p>

          <h2 className="text-2xl font-semibold mt-6">7. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our service
            immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            deangoldsteen@yahoo.com.
          </p>

          <p className="mt-8 text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
