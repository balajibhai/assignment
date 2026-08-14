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
    timezone: { type: String, default: "" },
    startDate: { type: String, default: "" },
    startTime: { type: String, default: "" },
    endDate: { type: String, default: "" },
    endTime: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
