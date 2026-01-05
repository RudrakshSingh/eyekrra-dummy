# Eyekra - Full Stack Application

A comprehensive eye test booking and glasses delivery platform with 4-hour SLA tracking, built with Next.js, MongoDB, and TypeScript.

## 🚀 Features

### Public Website
- Marketing pages (Home, How it Works, Pricing, etc.)
- E-commerce (Product catalog, Cart, Checkout)
- Booking flow with slot selection
- City/Pincode serviceability check

### Customer Portal
- OTP-based authentication
- Order tracking with real-time SLA timer
- Booking management
- Profile & addresses
- Reorder functionality

### Staff Panel (PWA - Mobile-first)
- Today's jobs list
- Status tracking with geo-tagging
- Eye test module
- Try-on module
- Runner pickup/delivery

### Lab Panel
- 20-minute workflow queue
- Stage-based tracking (Job Received → QC → Dispatch)
- QC pass/fail with reasons
- SLA compliance monitoring

### Admin Panel
- Dashboard with analytics
- Order management
- Booking & slot management
- Catalog management
- Staff management
- Finance module
- CMS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + OTP
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand + TanStack Query
- **Charts**: Recharts
- **Tables**: TanStack Table
- **UI Components**: Radix UI + shadcn/ui patterns

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file:
```env
MONGODB_URI="mongodb://localhost:27017/eyekra"
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
OTP_EXPIRY_MINUTES=10
NODE_ENV="development"
```

3. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

4. **Run development server:**
```bash
npm run dev
```

5. **Open browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
eyekra/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── bookings/      # Booking endpoints
│   │   ├── orders/        # Order endpoints
│   │   ├── products/      # Product endpoints
│   │   └── slots/         # Slot endpoints
│   ├── book/              # Booking page
│   ├── track/              # Order tracking page
│   ├── shop/               # E-commerce pages
│   ├── customer/           # Customer portal
│   ├── staff/              # Staff PWA
│   ├── lab/                # Lab panel
│   ├── admin/              # Admin panel
│   └── page.tsx            # Homepage
├── components/             # Reusable components
├── lib/                    # Utilities
│   ├── mongodb.ts          # MongoDB connection
│   ├── auth.ts             # Auth utilities
│   ├── api-client.ts       # API client
│   └── utils.ts            # Helper functions
├── models/                 # Mongoose models
│   ├── User.ts
│   ├── Order.ts
│   ├── Booking.ts
│   ├── Product.ts
│   ├── Slot.ts
│   └── OTP.ts
├── types/                  # TypeScript types
└── public/                 # Static assets
```

## 🔐 Authentication

The app uses OTP-based authentication:
1. User enters phone number
2. System sends 6-digit OTP (SMS in production)
3. User verifies OTP
4. System returns JWT token
5. Token stored in localStorage and sent with API requests

## 📊 Database Models

- **User**: Customers, staff, admins with role-based access
- **Order**: Orders with timeline tracking
- **Booking**: Home visit bookings
- **Product**: Catalog items with variants
- **Slot**: Available time slots
- **OTP**: OTP verification records

## 🎯 Key Features Implementation

### SLA Tracking
- Every order stage creates a timeline event with timestamp
- Real-time SLA timer calculates elapsed/remaining time
- Status: on_track, at_risk, breached

### RBAC (Role-Based Access Control)
- Route guards based on user role
- Component-level permission checks
- Admin actions require reason + audit log

### Exception Codes
Standardized codes for delays:
- customer_not_home
- phone_off
- rx_mismatch
- inventory_unavailable
- lab_overload
- delivery_delayed
- qc_fail
- payment_issue

## 🚧 Development Status

### ✅ Completed
- MongoDB setup and models
- Authentication (OTP)
- Core API routes
- Homepage wireframe
- Booking flow

### 🚧 In Progress
- Customer portal
- Order tracking UI
- Staff PWA
- Lab panel
- Admin dashboard

### 📝 TODO
- E-commerce checkout
- Payment integration
- Analytics tracking
- PWA configuration
- Advanced dashboards

## 📝 API Endpoints

### Auth
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `GET /api/auth/me` - Get current user

### Bookings
- `GET /api/slots` - Get available slots
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings

### Orders
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `POST /api/orders/:id/status` - Update order status

### Products
- `GET /api/products` - Get products
- `GET /api/products/:slug` - Get product details

## 🔒 Security

- JWT tokens with httpOnly cookies (recommended for production)
- Route protection middleware
- Role-based access control
- Input validation with Zod
- MongoDB injection prevention (Mongoose)

## 📱 PWA Support

Staff panel is designed as a PWA:
- Offline fallback
- Service worker
- Installable on mobile devices

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

## 📄 License

Private - Eyekra Platform

## 👥 Team

Front-end development aligned with full specification document.

---

**Note**: This is a development build. For production:
- Use MongoDB Atlas or managed database
- Set secure JWT secrets
- Enable SMS service for OTP
- Configure CDN for assets
- Set up monitoring and logging
- Enable rate limiting
- Configure CORS properly
# eyekrra-dummy
