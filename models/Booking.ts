import mongoose, { Schema, Document, Model } from 'mongoose';
import { ServiceType } from '@/types';

export interface IBooking extends Document {
  customerId: mongoose.Types.ObjectId;
  serviceType: ServiceType;
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
  slot: {
    date: Date;
    startTime: string;
    endTime: string;
    slotId: mongoose.Types.ObjectId;
  };
  assignedStaffId?: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  otp?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    serviceType: {
      type: String,
      enum: ['eye_test', 'try_on', 'combo'],
      required: true,
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
    slot: {
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      slotId: { type: Schema.Types.ObjectId, ref: 'Slot' },
    },
    assignedStaffId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    otp: String,
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ customerId: 1, createdAt: -1 });
BookingSchema.index({ 'slot.date': 1, 'slot.startTime': 1 });
BookingSchema.index({ assignedStaffId: 1, status: 1 });

export default (mongoose.models.Booking as Model<IBooking>) || mongoose.model<IBooking>('Booking', BookingSchema);

