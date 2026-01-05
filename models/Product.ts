import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  category: 'frame' | 'sunglasses' | 'lens' | 'package';
  brand?: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  sku: string;
  variants: Array<{
    name: string; // e.g., "Color: Black, Size: 52"
    price: number;
    sku: string;
    inventory: number;
    attributes: {
      [key: string]: string; // e.g., { color: "Black", size: "52" }
    };
  }>;
  attributes: {
    shape?: string;
    material?: string;
    size?: string;
    color?: string;
    brand?: string;
  };
  seo: {
    title?: string;
    description?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: String,
    category: {
      type: String,
      enum: ['frame', 'sunglasses', 'lens', 'package'],
      required: true,
      index: true,
    },
    brand: String,
    images: [String],
    price: {
      type: Number,
      required: true,
    },
    compareAtPrice: Number,
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    variants: [
      {
        name: String,
        price: Number,
        sku: { type: String, unique: true, sparse: true },
        inventory: { type: Number, default: 0 },
        attributes: Schema.Types.Mixed,
      },
    ],
    attributes: {
      shape: String,
      material: String,
      size: String,
      color: String,
      brand: String,
    },
    seo: {
      title: String,
      description: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ 'attributes.shape': 1 });
ProductSchema.index({ 'attributes.material': 1 });
ProductSchema.index({ 'attributes.color': 1 });

export default (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);

