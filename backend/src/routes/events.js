import { Router } from "express";
import Event from "../models/Event.js";
import EventLog from "../models/EventLog.js";
import { serializeEvent, serializeLog } from "../serializers.js";

const router = Router();

const sameProfiles = (a, b) =>
  a.length === b.length &&
  a.every((profile, index) => profile.id === b[index].id);

function computeModifiedKeys(existing, resolved) {
  const modifiedKeys = [];

  if (resolved.start !== existing.start) {
    modifiedKeys.push({
      key: "start",
      old: existing.start,
      new: resolved.start,
    });
  }
  if (resolved.end !== existing.end) {
    modifiedKeys.push({ key: "end", old: existing.end, new: resolved.end });
  }
  if (!sameProfiles(resolved.profiles, existing.profiles)) {
    modifiedKeys.push({
      key: "profiles",
      old: existing.profiles.map((profile) => profile.name),
      new: resolved.profiles.map((profile) => profile.name),
    });
  }

  return modifiedKeys;
}

router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: 1 });
    res.json(events.map(serializeEvent));
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { profiles = [], start = "", end = "" } = req.body ?? {};
    const event = await Event.create({ profiles, start, end });
    res.status(201).json(serializeEvent(event));
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const changes = req.body ?? {};
    const resolved = {
      profiles: changes.profiles ?? event.profiles,
      start: changes.start ?? event.start,
      end: changes.end ?? event.end,
    };

    const modifiedKeys = computeModifiedKeys(event, resolved);

    Object.assign(event, resolved);
    const saved = await event.save();
    const updatedAt = saved.updatedAt.toISOString();

    let log = null;
    if (modifiedKeys.length > 0) {
      log = await EventLog.create({
        entityId: saved._id.toString(),
        entityType: "event",
        modifiedKeys,
        timestamp: updatedAt,
      });
    }

    res.json({
      event: serializeEvent(saved),
      log: log ? serializeLog(log) : null,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/logs", async (req, res, next) => {
  try {
    const logs = await EventLog.find({
      entityId: req.params.id,
      entityType: "event",
    }).sort({
      timestamp: 1,
    });
    res.json(logs.map(serializeLog));
  } catch (err) {
    next(err);
  }
});

export default router;
