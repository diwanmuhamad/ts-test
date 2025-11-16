import { prisma } from "../../src/lib/prisma";
import { publishEvent } from "../events/publisher";

export const checkIn = async (userId: string) => {
  const now = new Date();

  // get today's date range
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // find if user already checked in today
  const existing = await prisma.attendance.findFirst({
    where: {
      userId,
      checkInTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (existing) {
    throw new Error("Already checked in today");
  }

  const record = await prisma.attendance.create({
    data: {
      userId,
      checkInTime: now,
    },
  });

  // Emit async event for report-worker
  await publishEvent("CHECK_IN", {
    userId,
    checkInTime: record.checkInTime,
  });

  return record;
};

export const checkOut = async (userId: string) => {
  const now = new Date();

  // Define today range
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Find today's attendance record
  const existing = await prisma.attendance.findFirst({
    where: {
      userId,
      checkInTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (!existing) {
    throw new Error("Cannot check-out without check-in");
  }

  if (existing.checkOutTime) {
    throw new Error("Already checked out today");
  }

  const updated = await prisma.attendance.update({
    where: { id: existing.id },
    data: {
      checkOutTime: now,
    },
  });

  // Emit async event for report-worker
  await publishEvent("CHECK_OUT", {
    userId,
    checkInTime: updated.checkInTime,
    checkOutTime: updated.checkOutTime,
  });

  return updated;
};
