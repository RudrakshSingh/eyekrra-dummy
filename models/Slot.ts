import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISlot extends Document {
  city: string;
  pincode?: string; // Optional for city-wide slots
  date: Date;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  capacity: number; // Max bookings
  booked: number; // Current bookings
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new Schema<ISlot>(
  {
    city: {
      type: String,
      required: true,
      index: true,
    },
    pincode: String,
    date: {
      type: Date,
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 1,
    },
    booked: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

SlotSchema.index({ city: 1, date: 1, startTime: 1 });
SlotSchema.index({ date: 1, isAvailable: 1 });

export default (mongoose.models.Slot as Model<ISlot>) || mongoose.model<ISlot>('Slot', SlotSchema);

