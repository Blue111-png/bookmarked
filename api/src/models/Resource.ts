import mongoose, { Document, Types } from "mongoose";

export interface IReaction {
  _id: Types.ObjectId;
  emoji: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResource extends Document {
  submittedBy: Types.ObjectId;
  title: string;
  url: string;
  description: string;
  tags: string[];
  reactions: Types.DocumentArray<IReaction>;
}

const reactionSchema = new mongoose.Schema<IReaction>(
  {
    emoji: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, _id: true }
);

const resourceSchema = new mongoose.Schema<IResource>(
  {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
      set: (tags: string[]) => tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean),
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

resourceSchema.index({ createdAt: -1 });
resourceSchema.index({ submittedBy: 1 });
resourceSchema.index({ tags: 1 });

export default mongoose.model<IResource>("Resource", resourceSchema);
