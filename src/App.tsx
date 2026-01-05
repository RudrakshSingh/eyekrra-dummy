import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Timer,
  User,
} from "lucide-react";

/**
 * EYEKRA JSX WIREFRAME (LOW-FIDELITY)
 * - Pure JSX/React wireframe (no backend)
 * - Suitable for quick stakeholder review + dev handoff
 * - Orange/White theme, but intentionally minimal visual detail
 *
 * How to use:
 * - Treat each "Screen" component as a Next.js page (app router)
 * - Replace mock state with real API calls + router navigation
 */

// ---------- UI Primitives (wireframe-only) ----------

function Box({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm " +
        className
      }
    >
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
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition";
  const styles =
    variant === "primary"
      ? "bg-orange-600 text-white hover:bg-orange-700"
      : variant === "secondary"
        ? "border border-gray-200 bg-white hover:bg-gray-50"
        : "bg-transparent hover:bg-gray-50";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

function InputWF({ placeholder, value, onChange }: { placeholder: string; value?: string; onChange?: any }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
    />
  );
}

function PillWF({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Box className="p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-orange-50 p-2">
          <Icon className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-gray-500">{desc}</div>
        </div>
      </div>
    </Box>
  );
}

// ---------- Layout ----------

type RouteKey = "home" | "book" | "track" | "shop" | "account";

function TopBar({ route, setRoute }: { route: RouteKey; setRoute: (r: RouteKey) => void }) {
  const nav: { key: RouteKey; label: string; icon: any }[] = [
    { key: "home", label: "Home", icon: Home },
    { key: "book", label: "Book", icon: Calendar },
    { key: "track", label: "Tracking", icon: Timer },
    { key: "shop", label: "Shop", icon: ShoppingBag },
    { key: "account", label: "Account", icon: User },
  ];

  return (
    <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-600 text-white">
            <Menu className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold">Eyekra</div>
            <div className="text-xs text-gray-500">Wireframe • 4-hour SLA engine</div>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2">
            <MapPin className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">City</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500">Pincode</span>
          </div>
          <ButtonWF variant="primary" onClick={() => setRoute("book")}>Book Eye Test</ButtonWF>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ButtonWF variant="secondary" onClick={() => setRoute("book")}>Book</ButtonWF>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto">
          {nav.map((n) => {
            const active = route === n.key;
            return (
              <button
                key={n.key}
                onClick={() => setRoute(n.key)}
                className={
                  "flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition " +
                  (active
                    ? "bg-orange-600 text-white"
                    : "border border-gray-200 bg-white text-gray-800 hover:bg-orange-50")
                }
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>;
}

// ---------- Screens (Treat as Next.js pages) ----------

function ScreenHome({ goBook }: { goBook: () => void }) {
  return (
    <PageShell>
      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <H1>
            Eye Test at Home. <span className="text-orange-600">Glasses in 4 Hours.</span>
          </H1>
          <Muted>
            Service-first UX (UrbanClap) + commerce reorders + Zomato-style SLA tracking. After Optima completes visit,
            everything is system-driven.
          </Muted>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <ButtonWF variant="primary" onClick={goBook}>
              Book Eye Test
              <ChevronRight className="ml-2 h-4 w-4" />
            </ButtonWF>
            <ButtonWF variant="secondary">
              How it works
              <ChevronRight className="ml-2 h-4 w-4" />
            </ButtonWF>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Box>
              <div className="text-sm font-semibold text-orange-600">80%</div>
              <div className="text-xs text-gray-500">Delivered ≤4 hours</div>
            </Box>
            <Box>
              <div className="text-sm font-semibold text-orange-600">6 months</div>
              <div className="text-xs text-gray-500">Rx validity for reorder</div>
            </Box>
            <Box>
              <div className="text-sm font-semibold text-orange-600">Automation</div>
              <div className="text-xs text-gray-500">No human ops layer</div>
            </Box>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
          <Box>
            <H2>Quick Booking Widget</H2>
            <Muted>(Wireframe placeholder)</Muted>
            <div className="mt-4 grid gap-3">
              <InputWF placeholder="City" />
              <InputWF placeholder="Pincode" />
              <InputWF placeholder="Date" />
              <InputWF placeholder="Time Slot" />
              <ButtonWF variant="primary" onClick={goBook} className="w-full">
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </ButtonWF>
            </div>
          </Box>
        </motion.div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <PillWF icon={CheckCircle2} title="Certified Optima" desc="Home visit: eye test + try-on + measurements" />
        <PillWF icon={Package} title="Dark Lab QC" desc="Automated queue: processing → QC → packing" />
        <PillWF icon={Timer} title="4-Hour SLA" desc="System timestamps every stage" />
      </div>

      <div className="mt-10">
        <H2>Collections (Preview)</H2>
        <Muted>Keep discovery light; push booking as primary CTA.</Muted>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i}>
              <div className="h-28 rounded-2xl bg-gray-100" />
              <div className="mt-3 text-sm font-semibold">Collection {i + 1}</div>
              <div className="text-xs text-gray-500">Try-on during visit</div>
            </Box>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function ScreenBook({ goTrack }: { goTrack: () => void }) {
  const steps = ["Location", "Slot", "Address", "Payment", "Confirm"] as const;
  const [idx, setIdx] = useState(0);

  return (
    <PageShell>
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <Box>
            <div className="flex items-center justify-between">
              <H2>Book Eye Test</H2>
              <div className="text-xs text-gray-500">Step {idx + 1} / {steps.length}</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {steps.map((s, i) => (
                <span
                  key={s}
                  className={
                    "rounded-full px-3 py-1 text-xs font-semibold " +
                    (i === idx
                      ? "bg-orange-600 text-white"
                      : i < idx
                        ? "bg-orange-50 text-orange-700"
                        : "bg-gray-100 text-gray-700")
                  }
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-3">
              {idx === 0 && (
                <>
                  <InputWF placeholder="City" />
                  <InputWF placeholder="Pincode" />
                  <Box className="bg-orange-50">
                    <div className="text-sm font-semibold text-orange-700">SLA Capacity Gate</div>
                    <div className="text-xs text-orange-700/80">Slots shown only if 4-hour capacity is safe.</div>
                  </Box>
                </>
              )}
              {idx === 1 && (
                <>
                  <InputWF placeholder="Select Date" />
                  <InputWF placeholder="Select Slot" />
                </>
              )}
              {idx === 2 && (
                <>
                  <InputWF placeholder="Full Address" />
                  <InputWF placeholder="Landmark" />
                  <InputWF placeholder="Contact Number" />
                  <Box className="bg-gray-50">
                    <div className="text-sm font-semibold">GPS Location (Optional MVP)</div>
                    <div className="text-xs text-gray-500">Button: "Share my current location" (browser geolocation).</div>
                  </Box>
                </>
              )}
              {idx === 3 && (
                <>
                  <Box>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Visit Fee</div>
                      <div className="text-sm font-semibold">₹0</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">(Wireframe) payment method selection</div>
                  </Box>
                  <InputWF placeholder="UPI / Card / Pay Later" />
                </>
              )}
              {idx === 4 && (
                <>
                  <Box className="bg-orange-50">
                    <div className="text-sm font-semibold text-orange-700">Booking Confirmed</div>
                    <div className="text-xs text-orange-700/80">Optima is auto-assigned. SLA timer starts at Order Confirmed.</div>
                  </Box>
                  <ButtonWF variant="primary" onClick={goTrack} className="w-full">
                    Go to Order Tracking
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </ButtonWF>
                </>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <ButtonWF variant="secondary" onClick={() => setIdx((v) => Math.max(0, v - 1))}>
                Back
              </ButtonWF>
              <ButtonWF
                variant="primary"
                onClick={() => setIdx((v) => Math.min(steps.length - 1, v + 1))}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </ButtonWF>
            </div>
          </Box>
        </div>

        <div className="md:col-span-4">
          <Box>
            <H2>What happens next</H2>
            <Muted>Only home visit is human. Everything else is automated.</Muted>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-orange-600" /> Optima home visit</div>
              <div className="flex items-center gap-2 text-sm"><Package className="h-4 w-4 text-orange-600" /> Automated lab queue</div>
              <div className="flex items-center gap-2 text-sm"><Timer className="h-4 w-4 text-orange-600" /> SLA tracking</div>
              <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-orange-600" /> Prescription valid 6 months</div>
            </div>
          </Box>
        </div>
      </div>
    </PageShell>
  );
}

function ScreenTrack() {
  // Mock order state
  const order = useMemo(
    () => ({
      id: "EKR-10241",
      type: "FAST",
      startedAt: new Date(Date.now() - 58 * 60 * 1000),
      targetMinutes: 240,
      stages: [
        { name: "Confirmed", done: true, time: "12:05" },
        { name: "Optima Assigned", done: true, time: "12:07" },
        { name: "Eye Test Done", done: true, time: "12:55" },
        { name: "In Lab", done: true, time: "13:20" },
        { name: "Processing", done: true, time: "13:35" },
        { name: "QC", done: false, time: "—" },
        { name: "Packed", done: false, time: "—" },
        { name: "Out for Delivery", done: false, time: "—" },
        { name: "Delivered", done: false, time: "—" },
      ],
    }),
    []
  );

  const elapsedMin = Math.max(0, Math.floor((Date.now() - order.startedAt.getTime()) / 60000));
  const remaining = Math.max(0, order.targetMinutes - elapsedMin);

  return (
    <PageShell>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <H2>Order Tracking</H2>
          <Muted>Wireframe for Zomato-style tracking + SLA clock</Muted>
          <div className="mt-2 text-sm font-semibold">Order #{order.id} • {order.type} (≤4 hours)</div>
        </div>
        <div className="flex items-center gap-2">
          <ButtonWF variant="secondary"><Bell className="mr-2 h-4 w-4" /> Updates</ButtonWF>
          <ButtonWF variant="secondary"><Settings className="mr-2 h-4 w-4" /> Help</ButtonWF>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <Box>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Timer className="h-4 w-4 text-orange-600" /> 4-Hour SLA Timer
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">Live</span>
            </div>
            <div className="mt-4 grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Elapsed</span>
                <span className="font-semibold">{elapsedMin} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Remaining</span>
                <span className="font-semibold">{remaining} min</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-orange-600"
                  style={{ width: `${Math.min(100, (elapsedMin / order.targetMinutes) * 100)}%` }}
                />
              </div>
              <Muted>Stages update via system events (no manual ops).</Muted>
            </div>
          </Box>

          <Box className="mt-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-orange-600" /> Map (Optional MVP)
            </div>
            <Muted>Placeholder. MVP can be stage-only. Later: Mappls / Google maps.</Muted>
            <div className="mt-3 h-40 rounded-2xl bg-gray-100" />
          </Box>
        </div>

        <div className="md:col-span-8">
          <Box>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Package className="h-4 w-4 text-orange-600" /> Timeline
            </div>
            <div className="mt-4 grid gap-2">
              {order.stages.map((s) => (
                <div key={s.name} className="flex items-center justify-between rounded-2xl border border-gray-200 p-3">
                  <div className="flex items-center gap-3">
                    <div className={"flex h-9 w-9 items-center justify-center rounded-2xl " + (s.done ? "bg-orange-50" : "bg-gray-100")}>
                      {s.done ? (
                        <CheckCircle2 className="h-5 w-5 text-orange-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{s.name}</div>
                      <div className="text-xs text-gray-500">System timestamp</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{s.time}</div>
                </div>
              ))}
            </div>
          </Box>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Box>
              <div className="text-sm font-semibold">Optima</div>
              <Muted>Name + certification (masked contact)</Muted>
              <div className="mt-3 h-10 rounded-2xl bg-gray-100" />
            </Box>
            <Box>
              <div className="text-sm font-semibold">Delivery</div>
              <Muted>OTP + GPS + Photo proof (wireframe)</Muted>
              <div className="mt-3 h-10 rounded-2xl bg-gray-100" />
            </Box>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function ScreenShop() {
  return (
    <PageShell>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <H2>Shop</H2>
          <Muted>Catalog + reorder. Gate by Rx validity (6 months).</Muted>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2">
          <Search className="h-4 w-4 text-gray-500" />
          <input className="bg-transparent text-sm outline-none" placeholder="Search products…" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-12">
        <div className="md:col-span-3">
          <Box>
            <div className="text-sm font-semibold">Filters</div>
            <Muted>(wireframe placeholders)</Muted>
            <div className="mt-3 grid gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded-2xl bg-gray-100" />
              ))}
            </div>
          </Box>
        </div>
        <div className="md:col-span-9">
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Box key={i}>
                <div className="h-28 rounded-2xl bg-gray-100" />
                <div className="mt-3 text-sm font-semibold">Frame {i + 1}</div>
                <div className="text-xs text-gray-500">From ₹799 • Add lens</div>
                <div className="mt-3 flex gap-2">
                  <ButtonWF variant="secondary" className="flex-1">View</ButtonWF>
                  <ButtonWF variant="primary" className="flex-1">Add</ButtonWF>
                </div>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function ScreenAccount() {
  return (
    <PageShell>
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <Box>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4 text-orange-600" /> My Account
            </div>
            <Muted>Wireframe navigation</Muted>
            <div className="mt-4 grid gap-2">
              {["Orders", "Prescriptions", "Warranty", "Subscription", "Referrals", "Wallet", "Support"].map((t) => (
                <button key={t} className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-orange-50">
                  {t}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </Box>
        </div>

        <div className="md:col-span-8">
          <Box>
            <H2>Dashboard</H2>
            <Muted>Stats tiles (wireframe)</Muted>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                { label: "Rx valid till", value: "June 30" },
                { label: "Wallet", value: "₹250" },
                { label: "Subscription", value: "Active" },
              ].map((t) => (
                <div key={t.label} className="rounded-2xl border border-gray-200 p-4">
                  <div className="text-xs text-gray-500">{t.label}</div>
                  <div className="mt-1 text-sm font-semibold">{t.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Box>
                <div className="text-sm font-semibold">Active Order</div>
                <Muted>#EKR-10241 • QC in progress</Muted>
                <div className="mt-3 h-10 rounded-2xl bg-gray-100" />
              </Box>
              <Box>
                <div className="text-sm font-semibold">Reorder</div>
                <Muted>One-click reorder within 6 months</Muted>
                <div className="mt-3 h-10 rounded-2xl bg-gray-100" />
              </Box>
            </div>
          </Box>
        </div>
      </div>
    </PageShell>
  );
}

// ---------- Main Wireframe App ----------

export default function EyekraJSXWireframe() {
  const [route, setRoute] = useState<RouteKey>("home");

  return (
    <div className="min-h-screen bg-white">
      <TopBar route={route} setRoute={setRoute} />

      <div className="bg-gradient-to-b from-orange-50/60 via-white to-white">
        {route === "home" && <ScreenHome goBook={() => setRoute("book")} />}
        {route === "book" && <ScreenBook goTrack={() => setRoute("track")} />}
        {route === "track" && <ScreenTrack />}
        {route === "shop" && <ScreenShop />}
        {route === "account" && <ScreenAccount />}
      </div>

      <div className="fixed bottom-4 left-1/2 w-[92%] max-w-md -translate-x-1/2 md:hidden">
        <ButtonWF variant="primary" onClick={() => setRoute("book")} className="w-full shadow">
          Book Eye Test
          <ChevronRight className="ml-2 h-4 w-4" />
        </ButtonWF>
      </div>

      <footer className="mt-10 border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold">Eyekra</div>
              <div className="text-xs text-gray-500">Wireframe • Orange/White • Automation-first</div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>Support</span>
              <span>Policies</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

