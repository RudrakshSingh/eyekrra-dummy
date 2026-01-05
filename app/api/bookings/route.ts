import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Slot from '@/models/Slot';
import { verifyToken } from '@/lib/auth';
import { generateOTP } from '@/lib/utils';

export async function POST(request: NextRequest) {
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

    const data = await request.json();
    const { serviceType, city, pincode, address, slotId, date, startTime, endTime } = data;

    // Validate slot availability
    const slot = await Slot.findById(slotId);
    if (!slot || !slot.isAvailable || slot.booked >= slot.capacity) {
      return NextResponse.json(
        { error: 'Slot not available' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await Booking.create({
      customerId: payload.userId,
      serviceType,
      city,
      pincode,
      address,
      slot: {
        date: new Date(date),
        startTime,
        endTime,
        slotId: slot._id,
      },
      status: 'pending',
      otp: generateOTP(),
      verified: false,
    });

    // Update slot booked count
    slot.booked += 1;
    await slot.save();

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id,
        serviceType: booking.serviceType,
        slot: booking.slot,
        status: booking.status,
        otp: booking.otp, // In production, send via SMS
      },
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', message: error.message },
      { status: 500 }
    );
  }
}

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

    const bookings = await Booking.find({ customerId: payload.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to get bookings', message: error.message },
      { status: 500 }
    );
  }
}

