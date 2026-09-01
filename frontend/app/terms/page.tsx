import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of the DECORUM HOMES & PROPERTIES marketplace.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using the DECORUM HOMES & PROPERTIES website and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.",
  },
  {
    title: "2. The Marketplace",
    body: "DECORUM provides an online marketplace where property, land, vehicles, gadgets, appliances and other items may be listed and enquiries made. Listings are provided by sellers and subject to review. While we work to keep the marketplace accurate, we do not guarantee the accuracy, completeness or reliability of any listing or the fitness of any item.",
  },
  {
    title: "3. User Conduct",
    body: "You agree not to misuse the site, submit false or misleading information, attempt to access restricted areas without authorisation, or engage in any activity that disrupts the service or infringes the rights of others.",
  },
  {
    title: "4. Listings & Transactions",
    body: "All transactions are between buyers and sellers. DECORUM facilitates enquiries and connections but does not act as a party to any sale unless expressly agreed. Buyers should conduct their own due diligence, verify documents, and inspect items before completing a purchase.",
  },
  {
    title: "5. Intellectual Property",
    body: "All content on this website, including text, graphics, logos and software, is the property of DECORUM HOMES & PROPERTIES and is protected by applicable intellectual property laws. You may not reproduce or distribute it without permission.",
  },
  {
    title: "6. Limitation of Liability",
    body: "To the maximum extent permitted by law, DECORUM shall not be liable for any indirect, incidental, special or consequential damages arising from your use of the service or any transaction facilitated through it.",
  },
  {
    title: "7. Changes to These Terms",
    body: "We may update these Terms from time to time. Continued use of the service after changes are posted constitutes acceptance of the revised Terms.",
  },
  {
    title: "8. Contact",
    body: "If you have questions about these Terms, please contact us via the Contact page.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold tracking-tight text-brand-950">Terms of Service</h1>
      <p className="mt-3 text-sm text-brand-500">Last updated: January 2025</p>
      <div className="mt-8 space-y-6">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-xl font-bold text-brand-900">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-brand-600">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}