import { redis } from "./redis";
import { prisma } from "./prisma";
import cron from "node-cron";
import { logger } from "../src/utils/logger";

export async function startWorker() {
  logger.info("Report Worker listening for attendance events...");

  try {
    await redis.subscribe("CHECK_IN", async (message) => {
      const event = JSON.parse(message);
      await processCheckIn(event);
    });
  } catch (error) {
    logger.error({ err: error }, "Error subscribing to CHECK_IN");
  }

  try {
    await redis.subscribe("CHECK_OUT", async (message) => {
      const event = JSON.parse(message);
      await processCheckOut(event);
    });
  } catch (error) {
    logger.error({ err: error }, "Error subscribing to CHECK_OUT");
  }

  startAbsentChecker();
}

/* -------------------
   DAILY ABSENT CHECKER
-------------------- */
function startAbsentChecker() {
  logger.info("ABSENT checker scheduled (runs daily at 00:05)...");

  cron.schedule("5 0 * * *", async () => {
    logger.info("Running ABSENT checker...");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany();

    for (const user of users) {
      const report = await prisma.dailyReport.findUnique({
        where: {
          userId_date: {
            userId: user.id,
            date: yesterday,
          },
        },
      });

      if (!report) {
        await prisma.dailyReport.create({
          data: {
            userId: user.id,
            date: yesterday,
            status: "absent",
            totalHours: 0,
          },
        });

        logger.info({ userId: user.id, date: yesterday }, "Marked ABSENT");
      }
    }
  });
}

/* -------------------
   PROCESS CHECK-IN
-------------------- */
async function processCheckIn(event: any) {
  const { userId, checkInTime } = event;
  const date = new Date(checkInTime);
  const day = new Date(date.toDateString()); // strip time

  await prisma.dailyReport.upsert({
    where: { userId_date: { userId, date: day } },
    update: {
      status: getStatusFromCheckIn(checkInTime),
    },
    create: {
      userId,
      date: day,
      status: getStatusFromCheckIn(checkInTime),
    },
  });

  logger.info({ userId }, "Processed CHECK-IN");
}

/* -------------------
   PROCESS CHECK-OUT
-------------------- */
async function processCheckOut(event: any) {
  const { userId, checkInTime, checkOutTime } = event;
  const date = new Date(checkInTime);
  const day = new Date(date.toDateString());

  const totalHours =
    (new Date(checkOutTime).getTime() - new Date(checkInTime).getTime()) /
    3600000;

  await prisma.dailyReport.update({
    where: { userId_date: { userId, date: day } },
    data: {
      totalHours,
      status: getStatusFromCheckout(checkInTime, totalHours),
    },
  });

  logger.info({ userId, totalHours }, "Processed CHECK-OUT");
}

// Check-in after 9:00 = LATE
function getStatusFromCheckIn(time: string) {
  const t = new Date(time).getHours();
  return t > 9 ? "late" : "present";
}

// Leaving early (< 8 hours) = early_leave
function getStatusFromCheckout(checkInTime: any, hours: number) {
  const t_checkin = new Date(checkInTime).getHours();

  if (t_checkin > 9) return "late";
  if (t_checkin <= 9 && hours >= 8) return "present";
  if (t_checkin <= 9 && hours < 8) return "early_leave";

  return "N/A";
}
