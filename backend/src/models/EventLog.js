import mongoose from "mongoose";

const modifiedKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    old: { type: mongoose.Schema.Types.Mixed, required: true },
    new: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const eventLogSchema = new mongoose.Schema(
  {
    entityId: { type: String, required: true, index: true },
    entityType: { type: String, required: true, default: "event" },
    modifiedKeys: { type: [modifiedKeySchema], default: [] },
    timestamp: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("EventLog", eventLogSchema);
