import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  displayName: string;
  passwordHash: string;
  comparePassword(candidate: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  hashPassword(plain: string): Promise<string>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(
  this: IUser,
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

export default mongoose.model<IUser, IUserModel>("User", userSchema);
