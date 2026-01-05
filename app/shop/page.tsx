'use client';

import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TopBar from '@/components/TopBar';

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

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <div className="bg-gradient-to-b from-orange-50/60 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6"
          >
            <div>
              <H2>Shop</H2>
              <Muted>Catalog + reorder. Gate by Rx validity (6 months).</Muted>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2 bg-white"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Search className="h-4 w-4 text-gray-500" />
              </motion.div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1"
                placeholder="Search products…"
              />
            </motion.div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-3"
            >
              <Box>
                <div className="text-sm font-semibold mb-2">Filters</div>
                <Muted>(wireframe placeholders)</Muted>
                <div className="mt-3 grid gap-2">
                  {['Price Range', 'Shape', 'Material', 'Size', 'Color', 'Brand'].map((filter, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                      className="h-10 rounded-2xl bg-gray-100 flex items-center px-3 cursor-pointer"
                    >
                      <span className="text-xs text-gray-600">{filter}</span>
                    </motion.div>
                  ))}
                </div>
              </Box>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-9"
            >
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Box>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="h-28 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200"
                      />
                      <div className="mt-3 text-sm font-semibold">Frame {i + 1}</div>
                      <div className="text-xs text-gray-500">From ₹799 • Add lens</div>
                      <div className="mt-3 flex gap-2">
                        <ButtonWF variant="secondary" className="flex-1">View</ButtonWF>
                        <ButtonWF variant="primary" className="flex-1">Add</ButtonWF>
                      </div>
                    </Box>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
