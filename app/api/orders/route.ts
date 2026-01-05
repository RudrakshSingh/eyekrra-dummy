import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';
import { generateOrderId } from '@/lib/utils';

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const assignedStaffId = searchParams.get('assignedStaffId');
    const stage = searchParams.getAll('stage');
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: any = {};
    
    // Role-based filtering
    if (payload.role === 'customer') {
      query.customerId = payload.userId;
    } else if (assignedStaffId) {
      query.assignedStaffId = assignedStaffId;
    } else if (['eye_test_executive', 'try_on_executive', 'delivery_executive', 'runner'].includes(payload.role)) {
      query.assignedStaffId = payload.userId;
    } else if (['lab_technician', 'qc_specialist', 'lab_manager'].includes(payload.role)) {
      // Lab staff see orders in lab stages
      query.currentStage = {
        $in: ['job_received', 'lens_frame_allocation', 'cutting_fitting', 'assembly', 'qc_1', 'final_cleaning', 'qc_2', 'dispatch_ready']
      };
    }

    if (status) {
      query.status = status;
    }

    if (stage.length > 0) {
      query.currentStage = { $in: stage };
    }

    if (date) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      query.createdAt = {
        $gte: dateObj,
        $lt: nextDay,
      };
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('customerId', 'phone name')
      .populate('assignedStaffId', 'name phone')
      .populate('items.productId', 'name images price');

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to get orders', message: error.message },
      { status: 500 }
    );
  }
}

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
    const {
      bookingId,
      type,
      serviceType,
      city,
      pincode,
      address,
      items,
      payment,
    } = data;

    // Generate unique order ID
    let orderId = generateOrderId();
    while (await Order.findOne({ orderId })) {
      orderId = generateOrderId();
    }

    const order = await Order.create({
      orderId,
      customerId: payload.userId,
      type: type || 'FAST',
      serviceType,
      bookingId,
      city,
      pincode,
      address,
      startedAt: new Date(),
      targetMinutes: type === 'FAST' ? 240 : 480,
      currentStage: 'confirmed',
      timeline: [
        {
          stage: 'confirmed',
          timestamp: new Date(),
          userId: payload.userId,
          userName: payload.phone,
        },
      ],
      items: items || [],
      payment: {
        status: 'pending',
        amount: payment?.amount || 0,
        paid: 0,
        ...payment,
      },
      status: 'pending',
      notes: [],
      tags: [],
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderId: order.orderId,
        status: order.status,
        currentStage: order.currentStage,
      },
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', message: error.message },
      { status: 500 }
    );
  }
}

