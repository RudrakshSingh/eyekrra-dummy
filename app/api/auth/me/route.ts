import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await User.findById(payload.userId).select('-__v');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user._id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
      pincode: user.pincode,
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    return NextResponse.json(
      { error: 'Failed to get user', message: error.message },
      { status: 500 }
    );
  }
}

