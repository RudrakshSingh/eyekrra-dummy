import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Slot from '@/models/Slot';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const date = searchParams.get('date');

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter required' },
        { status: 400 }
      );
    }

    const query: any = {
      city,
      isAvailable: true,
    };

    if (date) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: dateObj,
        $lt: nextDay,
      };
    } else {
      // Default to today and future dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $gte: today };
    }

    const slots = await Slot.find(query)
      .sort({ date: 1, startTime: 1 })
      .limit(100);

    // Filter slots with available capacity
    const availableSlots = slots.filter(
      (slot) => slot.booked < slot.capacity
    );

    return NextResponse.json(availableSlots);
  } catch (error: any) {
    console.error('Get slots error:', error);
    return NextResponse.json(
      { error: 'Failed to get slots', message: error.message },
      { status: 500 }
    );
  }
}

