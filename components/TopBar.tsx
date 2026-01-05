'use client';

import Link from 'next/link';
import { Home, Calendar, Timer, ShoppingBag, User, MapPin, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

function ButtonWF({
  children,
  variant = 'primary',
  className = '',
  href,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  href?: string;
}) {
  const base = 'inline-flex items-center justify-center rounded-xl md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold transition-all duration-200';
  const styles =
    variant === 'primary'
      ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg'
      : variant === 'secondary'
        ? 'border border-gray-200 bg-white hover:bg-gray-50 hover:border-orange-300'
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
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export default function TopBar() {
  const pathname = usePathname();
  const nav: { key: string; label: string; icon: any; href: string }[] = [
    { key: 'home', label: 'Home', icon: Home, href: '/' },
    { key: 'book', label: 'Book', icon: Calendar, href: '/book' },
    { key: 'track', label: 'Tracking', icon: Timer, href: '/track' },
    { key: 'shop', label: 'Shop', icon: ShoppingBag, href: '/shop' },
    { key: 'account', label: 'Account', icon: User, href: '/account' },
  ];

  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Main Header */}
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl md:rounded-2xl bg-orange-600 text-white shadow-md group-hover:shadow-lg transition-shadow"
            >
              <Menu className="h-4 w-4 md:h-5 md:w-5" />
            </motion.div>
            <div>
              <div className="text-base md:text-lg font-extrabold text-gray-900">Eyekra</div>
              <div className="text-xs text-gray-500 hidden sm:block">4-hour SLA engine</div>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 rounded-xl md:rounded-2xl border border-gray-200 px-3 py-1.5 bg-white hover:border-orange-300 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-orange-600" />
              <span className="text-xs md:text-sm font-medium text-gray-700">City</span>
              <span className="text-xs md:text-sm text-gray-400">•</span>
              <span className="text-xs md:text-sm text-gray-500">Pincode</span>
            </motion.div>
            <ButtonWF variant="primary" href="/book">
              Book Eye Test
            </ButtonWF>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <ButtonWF variant="secondary" href="/book" className="text-xs px-2.5 py-1.5">
              Book
            </ButtonWF>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="border-t border-gray-100">
          <div className="px-3 md:px-4 py-2">
            <div className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide -mx-3 md:-mx-4 px-3 md:px-4">
              {nav.map((n) => {
                const isActive = pathname === n.href || (n.href !== '/' && pathname?.startsWith(n.href));
                return (
                  <motion.div
                    key={n.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: nav.indexOf(n) * 0.05 }}
                  >
                    <Link
                      href={n.href}
                      className={`flex items-center gap-1.5 md:gap-2 rounded-xl md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-300'
                      }`}
                    >
                      <n.icon className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      <span>{n.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
