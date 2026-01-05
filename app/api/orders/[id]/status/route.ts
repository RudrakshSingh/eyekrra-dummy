import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { OrderStage } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const order = await Order.findOne({
      $or: [{ _id: params.id }, { orderId: params.id }],
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { stage, geo, photoProof, remarks, exceptionCode } = data;

    if (!stage) {
      return NextResponse.json(
        { error: 'Stage is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(payload.userId);

    // Add timeline event
    const timelineEvent = {
      stage: stage as OrderStage,
      timestamp: new Date(),
      userId: payload.userId,
      userName: user?.name || user?.phone || 'Unknown',
      geo,
      photoProof,
      remarks,
      exceptionCode,
    };

    order.timeline.push(timelineEvent);
    order.currentStage = stage as OrderStage;
    order.updatedAt = new Date();

    // Update status based on stage
    if (stage === 'delivered' || stage === 'completed') {
      order.status = 'completed';
    } else if (order.status === 'pending') {
      order.status = 'in_progress';
    }

    await order.save();

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderId: order.orderId,
        currentStage: order.currentStage,
        status: order.status,
        timeline: order.timeline,
      },
    });
  } catch (error: any) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status', message: error.message },
      { status: 500 }
    );
  }
}

