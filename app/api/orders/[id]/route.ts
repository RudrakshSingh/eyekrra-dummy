import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';

export async function GET(
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
    })
      .populate('customerId', 'phone name')
      .populate('assignedStaffId', 'name phone')
      .populate('assignedLabId', 'name')
      .populate('items.productId', 'name images price sku')
      .populate('items.variantId', 'name price sku');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check access: customer can only see their own orders
    if (payload.role === 'customer' && order.customerId.toString() !== payload.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Failed to get order', message: error.message },
      { status: 500 }
    );
  }
}

