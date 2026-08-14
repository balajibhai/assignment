import { Router } from "express";
import Event from "../models/Event.js";
import EventLog from "../models/EventLog.js";
import { serializeEvent, serializeLog } from "../serializers.js";

const router = Router();

const dateTime = (date, time) => (date && time ? `${date}T${time}` : "");

const sameProfiles = (a, b) =>
  a.length === b.length &&
  a.every((profile, index) => profile.id === b[index].id);

function computeModifiedKeys(existing, resolved) {
  const modifiedKeys = [];

  if (resolved.timezone !== existing.timezone) {
    modifiedKeys.push({
      key: "timezone",
      old: existing.timezone,
      new: resolved.timezone,
    });
  }
  if (
    dateTime(resolved.startDate, resolved.startTime) !==
    dateTime(existing.startDate, existing.startTime)
  ) {
    modifiedKeys.push({
      key: "start",
      old: dateTime(existing.startDate, existing.startTime),
      new: dateTime(resolved.startDate, resolved.startTime),
    });
  }
  if (
    dateTime(resolved.endDate, resolved.endTime) !==
    dateTime(existing.endDate, existing.endTime)
  ) {
    modifiedKeys.push({
      key: "end",
      old: dateTime(existing.endDate, existing.endTime),
      new: dateTime(resolved.endDate, resolved.endTime),
    });
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
    const {
      profiles = [],
      timezone = "",
      startDate = "",
      startTime = "",
      endDate = "",
      endTime = "",
    } = req.body ?? {};
    const event = await Event.create({
      profiles,
      timezone,
      startDate,
      startTime,
      endDate,
      endTime,
    });
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
      timezone: changes.timezone ?? event.timezone,
      startDate: changes.startDate ?? event.startDate,
      startTime: changes.startTime ?? event.startTime,
      endDate: changes.endDate ?? event.endDate,
      endTime: changes.endTime ?? event.endTime,
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
