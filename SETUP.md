# Eyekra Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally, then:
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Use it in `.env.local`

### 3. Configure Environment Variables

Create `.env.local` file in root:
```env
MONGODB_URI="mongodb://localhost:27017/eyekra"
# OR for Atlas:
# MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/eyekra"

JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
OTP_EXPIRY_MINUTES=10
NODE_ENV="development"
```

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Testing the Application

### 1. Test OTP Authentication
- Go to any page that requires login
- Enter phone number (10 digits)
- In development, OTP is logged to console
- Enter OTP to login

### 2. Test Booking Flow
- Navigate to `/book`
- Fill in booking form
- Select city, date, and time slot
- Complete booking

### 3. Test Order Tracking
- After creating a booking/order
- Navigate to `/track?id=ORDER_ID`
- View SLA timer and timeline

## Database Seeding (Optional)

You can create initial data by running:

```javascript
// Create sample slots
// Create sample products
// Create admin user
```

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env.local`
- Verify network/firewall settings for Atlas

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

## Next Steps

1. **Set up SMS service** for OTP (Twilio, AWS SNS, etc.)
2. **Configure payment gateway** (Razorpay, Stripe, etc.)
3. **Set up file storage** for images (AWS S3, Cloudinary)
4. **Configure analytics** (Google Analytics, Mixpanel)
5. **Set up monitoring** (Sentry, LogRocket)

## Production Deployment

1. Set secure environment variables
2. Use MongoDB Atlas or managed database
3. Enable HTTPS
4. Configure CDN
5. Set up CI/CD pipeline
6. Enable rate limiting
7. Configure CORS properly
8. Set up backup strategy

