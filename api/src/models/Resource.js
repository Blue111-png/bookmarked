const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, _id: true }
);

const resourceSchema = new mongoose.Schema(
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
      set: (tags) => tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean),
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

module.exports = mongoose.model("Resource", resourceSchema);
