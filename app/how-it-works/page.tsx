'use client';

import { CheckCircle2, Package, Timer, User, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';

function Box({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-extrabold tracking-tight">{children}</h1>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold tracking-tight">{children}</h2>;
}

function Muted({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

function ButtonWF({
  children,
  href,
  className = '',
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 ${className}`}
    >
      {children}
    </Link>
  );
}

export default function HowItWorksPage() {
  const steps = [
    {
      icon: MapPin,
      title: 'Book Home Visit',
      description: 'Select your city, pincode, and preferred time slot. Our certified Optima will visit your home.',
    },
    {
      icon: User,
      title: 'Eye Test at Home',
      description: 'Professional eye test conducted at your convenience. Try-on frames and get measurements done.',
    },
    {
      icon: Package,
      title: 'Automated Lab Processing',
      description: 'Your order enters our automated lab queue. 20-minute workflow ensures fast processing.',
    },
    {
      icon: Timer,
      title: '4-Hour Delivery',
      description: 'Track your order in real-time. Most orders delivered within 4 hours of eye test completion.',
    },
    {
      icon: CheckCircle2,
      title: 'Prescription Valid 6 Months',
      description: 'Your prescription is stored securely. Reorder glasses anytime within 6 months with one click.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <div className="bg-gradient-to-b from-orange-50/60 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="text-center mb-12">
          <H1>How It Works</H1>
          <Muted className="mt-2">
            Service-first UX + commerce reorders + Zomato-style SLA tracking
          </Muted>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Box key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-orange-50 p-3">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-orange-600 mb-1">
                      Step {index + 1}
                    </div>
                    <h3 className="font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </Box>
            );
          })}
        </div>

        <div className="bg-orange-50 rounded-2xl p-8 text-center">
          <H2 className="mb-4">Ready to Get Started?</H2>
          <Muted className="mb-6">
            Book your home eye test today and get glasses delivered in 4 hours
          </Muted>
          <ButtonWF href="/book">Book Eye Test Now</ButtonWF>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Box>
            <div className="text-2xl font-bold text-orange-600 mb-2">80%</div>
            <div className="text-sm text-gray-600">Delivered within 4 hours</div>
          </Box>
          <Box>
            <div className="text-2xl font-bold text-orange-600 mb-2">6 months</div>
            <div className="text-sm text-gray-600">Prescription validity for reorders</div>
          </Box>
          <Box>
            <div className="text-2xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-sm text-gray-600">Automated processing</div>
          </Box>
        </div>
        </div>
      </div>
    </div>
  );
}

