import mongoose, { Schema, Document, Model } from 'mongoose';
import { OrderStage, OrderType, PaymentStatus, PaymentMethod, TimelineEvent, ExceptionCode } from '@/types';

export interface IOrder extends Document {
  orderId: string; // EKR-XXXXX
  customerId: mongoose.Types.ObjectId;
  type: OrderType; // FAST (4hr) or STANDARD
  serviceType: 'eye_test' | 'try_on' | 'combo';
  
  // Booking details
  bookingId?: mongoose.Types.ObjectId;
  city: string;
  pincode: string;
  address: {
    full: string;
    landmark?: string;
    geo?: {
      lat: number;
      lng: number;
    };
  };
  
  // SLA tracking
  startedAt: Date;
  targetMinutes: number; // 240 for FAST, variable for STANDARD
  currentStage: OrderStage;
  timeline: TimelineEvent[];
  
  // Staff assignment
  assignedStaffId?: mongoose.Types.ObjectId;
  assignedStaffName?: string;
  assignedLabId?: mongoose.Types.ObjectId;
  assignedLabName?: string;
  
  // Eye test data
  eyeTestData?: {
    prescription?: any;
    photos?: string[];
    summary?: string;
    approvedByCustomer: boolean;
  };
  
  // Try-on data
  tryOnData?: {
    selectedFrames: Array<{
      frameId: mongoose.Types.ObjectId;
      priority: 1 | 2 | 3;
      photo?: string;
    }>;
    quote?: {
      framePrice: number;
      lensPrice: number;
      discount: number;
      total: number;
    };
  };
  
  // Products
  items: Array<{
    productId: mongoose.Types.ObjectId;
    variantId?: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  
  // Payment
  payment: {
    status: PaymentStatus;
    method?: PaymentMethod;
    amount: number;
    paid: number;
    advance?: number;
    balance?: number;
    transactionId?: string;
  };
  
  // Status
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  exceptionCode?: ExceptionCode;
  notes: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    text: string;
    createdAt: Date;
  }>;
  tags: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['FAST', 'STANDARD'],
      required: true,
    },
    serviceType: {
      type: String,
      enum: ['eye_test', 'try_on', 'combo'],
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    address: {
      full: { type: String, required: true },
      landmark: String,
      geo: {
        lat: Number,
        lng: Number,
      },
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    targetMinutes: {
      type: Number,
      required: true,
      default: 240,
    },
    currentStage: {
      type: String,
      required: true,
      default: 'confirmed',
    },
    timeline: [
      {
        stage: String,
        timestamp: { type: Date, default: Date.now },
        userId: Schema.Types.ObjectId,
        userName: String,
        geo: {
          lat: Number,
          lng: Number,
        },
        photoProof: String,
        remarks: String,
        exceptionCode: String,
      },
    ],
    assignedStaffId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedStaffName: String,
    assignedLabId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedLabName: String,
    eyeTestData: {
      prescription: Schema.Types.Mixed,
      photos: [String],
      summary: String,
      approvedByCustomer: { type: Boolean, default: false },
    },
    tryOnData: {
      selectedFrames: [
        {
          frameId: { type: Schema.Types.ObjectId, ref: 'Product' },
          priority: { type: Number, enum: [1, 2, 3] },
          photo: String,
        },
      ],
      quote: {
        framePrice: Number,
        lensPrice: Number,
        discount: Number,
        total: Number,
      },
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        variantId: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],
    payment: {
      status: {
        type: String,
        enum: ['pending', 'partial', 'completed', 'refunded'],
        default: 'pending',
      },
      method: {
        type: String,
        enum: ['upi', 'card', 'cod', 'wallet', 'pay_later'],
      },
      amount: { type: Number, default: 0 },
      paid: { type: Number, default: 0 },
      advance: Number,
      balance: Number,
      transactionId: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    exceptionCode: String,
    notes: [
      {
        userId: Schema.Types.ObjectId,
        userName: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ assignedStaffId: 1, status: 1 });
OrderSchema.index({ currentStage: 1, startedAt: 1 });
OrderSchema.index({ city: 1, pincode: 1 });

export default (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>('Order', OrderSchema);

