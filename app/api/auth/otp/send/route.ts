import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';
import { generateOTP } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { phone } = await request.json();
    
    if (!phone || phone.length !== 10) {
      return NextResponse.json(
        { error: 'Valid 10-digit phone number required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    // Delete old OTPs for this phone
    await OTP.deleteMany({ phone });

    // Create new OTP
    await OTP.create({
      phone,
      code,
      expiresAt,
      verified: false,
    });

    // In production, send SMS here
    console.log(`OTP for ${phone}: ${code}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { code }),
    });
  } catch (error: any) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP', message: error.message },
      { status: 500 }
    );
  }
}

