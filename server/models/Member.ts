import mongoose, { Schema, Document } from "mongoose";

export interface IMember extends Document {
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  category: string;
  photoUrl: string;
  paymentAmount: string;
  paymentStatus: string;
  address: string;
}

const MemberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    category: { type: String, required: true },
    photoUrl: { type: String, required: true },
    paymentAmount: { type: String, required: true },
    paymentStatus: { type: String, required: true, default: "pending" },
    address: { type: String }
  },
  { timestamps: true }
);

export const Member = mongoose.model<IMember>("Member", MemberSchema);
