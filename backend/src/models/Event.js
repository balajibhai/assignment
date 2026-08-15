import mongoose from "mongoose";

const eventProfileSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false },
);

const eventSchema = new mongoose.Schema(
  {
    profiles: { type: [eventProfileSchema], default: [] },
    start: { type: String, default: "" },
    end: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
