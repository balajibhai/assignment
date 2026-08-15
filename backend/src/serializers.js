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
    start: doc.start,
    end: doc.end,
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
