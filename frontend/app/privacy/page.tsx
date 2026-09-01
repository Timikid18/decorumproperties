import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DECORUM HOMES & PROPERTIES collects, uses and protects your information.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly, such as your name, email address, phone number and the content of messages you submit. We also collect information about how you use the site, such as pages viewed and listings you interact with.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to operate and improve our marketplace, respond to your enquiries, process sell requests, send service-related communications, and personalise your experience. We do not sell your personal data.",
  },
  {
    title: "Cookies & Local Storage",
    body: "We use cookies and browser local storage to keep you signed in, remember your preferences and understand how the site is used. You can disable cookies in your browser, though some parts of the service may not work as intended.",
  },
  {
    title: "Sharing of Information",
    body: "We only share your information with parties necessary to provide the service, such as sellers you contact about a listing. We do not disclose your personal data to third parties for their own marketing purposes.",
  },
  {
    title: "Data Security",
    body: "We take reasonable measures to protect your information from unauthorised access, alteration or disclosure. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal information by contacting us. You may also update your profile details at any time from your account.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will post any changes on this page and update the effective date.",
  },
  {
    title: "Contact",
    body: "For privacy-related questions, please reach out through our Contact page.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold tracking-tight text-brand-950">Privacy Policy</h1>
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