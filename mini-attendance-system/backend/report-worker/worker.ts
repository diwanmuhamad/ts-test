import { redis } from "./redis";
import { prisma } from "./prisma";
import cron from "node-cron";

export async function startWorker() {
  console.log("Report Worker listening for attendance events...");

  try {
    await redis.subscribe("CHECK_IN", async (message) => {
      const event = JSON.parse(message);
      await processCheckIn(event);
    });
  } catch (error) {
    console.error("Error processing check-in:", error);
  }

  try {
    await redis.subscribe("CHECK_OUT", async (message) => {
      const event = JSON.parse(message);
      await processCheckOut(event);
    });
  } catch (error) {
    console.error("Error processing check-out:", error);
  }

  startAbsentChecker();
}

/* -------------------
   DAILY ABSENT CHECKER
-------------------- */
function startAbsentChecker() {
  console.log("ABSENT checker scheduled (runs daily at 00:05)...");

  cron.schedule("5 0 * * *", async () => {
    console.log("Running ABSENT checker...");

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

        console.log(
          `Marked ABSENT for user ${user.id} (date: ${yesterday
            .toISOString()
            .slice(0, 10)})`
        );
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

  console.log(`Processed CHECK-IN for user ${userId}`);
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
      status: getStatusFromCheckout(totalHours),
    },
  });

  console.log(`Processed CHECK-OUT for user ${userId}`);
}

// Check-in after 9:00 = LATE
function getStatusFromCheckIn(time: string) {
  const t = new Date(time).getHours();
  return t > 9 ? "late" : "present";
}

// Leaving early (< 8 hours) = early_leave
function getStatusFromCheckout(hours: number) {
  return hours < 8 ? "early_leave" : "present";
}
