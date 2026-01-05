'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronRight,
  Package,
  Timer,
} from 'lucide-react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';

// Import components from wireframe
function Box({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
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
  onClick,
  variant = 'primary',
  className = '',
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  href?: string;
}) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition';
  const styles =
    variant === 'primary'
      ? 'bg-orange-600 text-white hover:bg-orange-700'
      : variant === 'secondary'
        ? 'border border-gray-200 bg-white hover:bg-gray-50'
        : 'bg-transparent hover:bg-gray-50';

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href={href} className={`${base} ${styles} ${className}`}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </motion.button>
  );
}

function InputWF({ placeholder, value, onChange }: { placeholder: string; value?: string; onChange?: any }) {
  return (
    <motion.input
      whileFocus={{ scale: 1.02 }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200 transition-all"
    />
  );
}

function PillWF({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Box className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-start gap-3"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="rounded-2xl bg-orange-50 p-2"
        >
          <Icon className="h-5 w-5 text-orange-600" />
        </motion.div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-gray-500">{desc}</div>
        </div>
      </motion.div>
    </Box>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>;
}

function ScreenHome({ goBook }: { goBook: () => void }) {
  return (
    <PageShell>
      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <H1>
              Eye Test at Home. <motion.span
                animate={{ color: ['#ea580c', '#f97316', '#ea580c'] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-orange-600"
              >
                Glasses in 4 Hours.
              </motion.span>
            </H1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Muted>
              Service-first UX (UrbanClap) + commerce reorders + Zomato-style SLA tracking. After Optima completes visit,
              everything is system-driven.
            </Muted>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonWF variant="primary" href="/book">
              Book Eye Test
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ChevronRight className="ml-2 h-4 w-4" />
              </motion.div>
            </ButtonWF>
            <ButtonWF variant="secondary" href="/how-it-works">
              How it works
              <ChevronRight className="ml-2 h-4 w-4" />
            </ButtonWF>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid gap-3 sm:grid-cols-3"
          >
            {[
              { value: '80%', label: 'Delivered ≤4 hours' },
              { value: '6 months', label: 'Rx validity for reorder' },
              { value: 'Automation', label: 'No human ops layer' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Box>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                    className="text-sm font-semibold text-orange-600"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </Box>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box>
            <H2>Quick Booking Widget</H2>
            <Muted>(Wireframe placeholder)</Muted>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 grid gap-3"
            >
              <InputWF placeholder="City" />
              <InputWF placeholder="Pincode" />
              <InputWF placeholder="Date" />
              <InputWF placeholder="Time Slot" />
              <ButtonWF variant="primary" href="/book" className="w-full">
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </ButtonWF>
            </motion.div>
          </Box>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 grid gap-4 md:grid-cols-3"
      >
        <PillWF icon={CheckCircle2} title="Certified Optima" desc="Home visit: eye test + try-on + measurements" />
        <PillWF icon={Package} title="Dark Lab QC" desc="Automated queue: processing → QC → packing" />
        <PillWF icon={Timer} title="4-Hour SLA" desc="System timestamps every stage" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10"
      >
        <H2>Collections (Preview)</H2>
        <Muted>Keep discovery light; push booking as primary CTA.</Muted>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Box>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="h-28 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200"
                />
                <div className="mt-3 text-sm font-semibold">Collection {i + 1}</div>
                <div className="text-xs text-gray-500">Try-on during visit</div>
              </Box>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageShell>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />

      <div className="bg-gradient-to-b from-orange-50/60 via-white to-white">
        <ScreenHome goBook={() => {}} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 md:hidden z-40"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ButtonWF variant="primary" href="/book" className="w-full shadow-lg text-sm">
            Book Eye Test
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronRight className="ml-2 h-4 w-4" />
            </motion.div>
          </ButtonWF>
        </motion.div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 border-t border-gray-100 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold">Eyekra</div>
              <div className="text-xs text-gray-500">Orange/White • Automation-first</div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <motion.span whileHover={{ scale: 1.1, color: '#ea580c' }} className="cursor-pointer">Support</motion.span>
              <motion.span whileHover={{ scale: 1.1, color: '#ea580c' }} className="cursor-pointer">Policies</motion.span>
              <motion.span whileHover={{ scale: 1.1, color: '#ea580c' }} className="cursor-pointer">Terms</motion.span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
