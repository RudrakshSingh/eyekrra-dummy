import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Analytics event model (optional - for storing events in DB)
const AnalyticsEventSchema = new mongoose.Schema({
  event: String,
  data: mongoose.Schema.Types.Mixed,
  userId: String,
  sessionId: String,
  timestamp: Date,
  userAgent: String,
  ip: String,
}, { timestamps: true });

const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', AnalyticsEventSchema);

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { event, data } = await request.json();
    const userId = request.headers.get('x-user-id'); // Set from auth middleware
    const userAgent = request.headers.get('user-agent');
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Store event in database
    await AnalyticsEvent.create({
      event,
      data,
      userId,
      timestamp: new Date(),
      userAgent,
      ip,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics track error:', error);
    // Don't fail the request if analytics fails
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

