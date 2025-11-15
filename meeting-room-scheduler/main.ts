import schedule from "./input.json";
import { ScheduleItem } from "./type";

const toMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number) as [number, number];
  return h * 60 + m;
};

export const findMaxMeetings = (meetings: ScheduleItem[]) => {
  const sorted = [...meetings].sort(
    (a, b) => toMinutes(a.end) - toMinutes(b.end)
  );

  const scheduled: number[] = [];
  let lastEnd = 0;

  for (const m of sorted) {
    const start = toMinutes(m.start);
    const end = toMinutes(m.end);

    if (start >= lastEnd) {
      scheduled.push(m.id);
      lastEnd = end;
    }
  }

  return {
    scheduled,
    count: scheduled.length,
  };
};

console.log(findMaxMeetings(schedule));
