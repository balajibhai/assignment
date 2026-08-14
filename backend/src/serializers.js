export function serializeProfile(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
  };
}

export function serializeEvent(doc) {
  return {
    id: doc._id.toString(),
    profiles: (doc.profiles ?? []).map((profile) => ({ id: profile.id, name: profile.name })),
    timezone: doc.timezone,
    startDate: doc.startDate,
    startTime: doc.startTime,
    endDate: doc.endDate,
    endTime: doc.endTime,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function serializeLog(doc) {
  return {
    _id: doc._id.toString(),
    entityId: doc.entityId,
    entityType: doc.entityType,
    modifiedKeys: (doc.modifiedKeys ?? []).map((key) => ({
      key: key.key,
      old: key.old,
      new: key.new,
    })),
    timestamp: doc.timestamp,
  };
}
