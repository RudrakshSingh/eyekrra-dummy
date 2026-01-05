import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';
import User from '@/models/User';
import { generateToken, generateRefreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { phone, code } = await request.json();
    
    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Phone and code required' },
        { status: 400 }
      );
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      phone,
      code,
      expiresAt: { $gt: new Date() },
      verified: false,
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
        role: 'customer',
        isActive: true,
      });
    }

    // Generate tokens
    const token = generateToken({
      userId: user._id.toString(),
      phone: user.phone,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      phone: user.phone,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP', message: error.message },
      { status: 500 }
    );
  }
}

