import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Home, ShieldCheck, Handshake, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about DECORUM HOMES & PROPERTIES and how we make buying and selling simple.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-center font-display text-4xl font-bold tracking-tight text-brand-950">About DECORUM</h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-brand-600">
        DECORUM HOMES & PROPERTIES is a trusted marketplace and property services company making it effortless to
        buy, sell, and own.
      </p>

      <div className="mt-12 space-y-8">
        <section>
          <h2 className="font-display text-2xl font-bold text-brand-900">Our Story</h2>
          <p className="mt-3 leading-relaxed text-brand-600">
            Based in Abeokuta, Ogun State, DECORUM started with a simple belief: buying and selling should be honest,
            transparent, and simple. Today we help people find homes, land, vehicles, gadgets, appliances and more —
            and help sellers turn their assets into cash with a trusted, dedicated team by their side.
          </p>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { icon: <Home className="h-6 w-6" />, title: "A Marketplace for Everything", text: "From real estate to everyday items, explore a wide range of verified listings all in one place." },
            { icon: <ShieldCheck className="h-6 w-6" />, title: "Honest & Verified", text: "Our team reviews listings to keep the marketplace safe, accurate and trustworthy." },
            { icon: <Handshake className="h-6 w-6" />, title: "Guided Transactions", text: "We support you through enquiries, negotiations and completion every step of the way." },
            { icon: <Rocket className="h-6 w-6" />, title: "Sell With Confidence", text: "Submit your item and our network of serious buyers helps you sell quickly and fairly." },
          ].map((v) => (
            <div key={v.title} className="rounded-lg border border-brand-100 bg-white p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-brand-50 text-brand-700">{v.icon}</div>
              <h3 className="text-base font-bold text-brand-950">{v.title}</h3>
              <p className="mt-2 text-sm text-brand-500">{v.text}</p>
            </div>
          ))}
        </div>

        <section className="grid items-center gap-8 rounded-lg border border-brand-100 bg-white p-8 shadow-card sm:grid-cols-[16rem_1fr]">
          <div className="mx-auto w-full max-w-[16rem] overflow-hidden rounded-lg ring-1 ring-brand-100">
            <Image
              src="/CEO.png"
              alt="CEO of DECORUM"
              width={1024}
              height={1536}
              sizes="(min-width: 640px) 16rem, 70vw"
              className="h-auto w-full bg-gradient-to-b from-brand-50 to-brand-100"
            />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-900">Meet Our CEO</h2>
            <p className="mt-3 leading-relaxed text-brand-600">
              Leading DECORUM is a commitment to honesty, transparency and service. Our CEO drives every decision
              with the communities we serve in mind — ensuring that whether you are buying your first home or selling
              a cherished possession, you get a fair, dependable and guided experience every step of the way.
            </p>
            <p className="mt-3 text-sm font-medium text-brand-700">Founder &amp; Chief Executive Officer, DECORUM HOMES &amp; PROPERTIES</p>
          </div>
        </section>

        <section className="rounded-lg bg-brand-800 p-8 text-white">
          <h2 className="font-display text-2xl font-bold">Ready to get started?</h2>
          <p className="mt-2 max-w-2xl text-brand-200">
            Browse our listings or let us help you sell what you have. We&apos;re here to make it simple.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/listings"><Button variant="secondary">Browse Listings</Button></Link>
            <Link href="/sell-to-us"><Button variant="secondary">Sell To Us</Button></Link>
          </div>
        </section>
      </div>
    </div>
  );
}