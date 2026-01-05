import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserRole } from '@/types';

export interface IUser extends Document {
  phone: string;
  email?: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  city?: string;
  pincode?: string;
  addresses?: Array<{
    type: 'home' | 'work' | 'other';
    address: string;
    landmark?: string;
    pincode: string;
    city: string;
    isDefault: boolean;
    geo?: {
      lat: number;
      lng: number;
    };
  }>;
  deviceId?: string; // For staff PWA
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: String,
    name: String,
    role: {
      type: String,
      enum: [
        'super_admin',
        'admin_ops',
        'admin_finance',
        'admin_catalog',
        'admin_hr',
        'regional_manager',
        'eye_test_executive',
        'try_on_executive',
        'delivery_executive',
        'runner',
        'lab_technician',
        'qc_specialist',
        'lab_manager',
        'customer',
      ],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    city: String,
    pincode: String,
    addresses: [
      {
        type: { type: String, enum: ['home', 'work', 'other'] },
        address: String,
        landmark: String,
        pincode: String,
        city: String,
        isDefault: Boolean,
        geo: {
          lat: Number,
          lng: Number,
        },
      },
    ],
    deviceId: String,
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

